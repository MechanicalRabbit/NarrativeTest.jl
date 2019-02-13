#
# Doctest-like library for functional testing.
#

module NarrativeTest

export
    runtests

# Position in a file.

struct Location
    file::String
    line::Int
end

Location(file::String) = Location(file, 0)

Base.convert(::Type{Location}, file::String) = Location(file, 0)

function Base.print(io::IO, loc::Location)
    print(io, loc.file)
    if loc.line > 0
        print(io, ", line $(loc.line)")
    end
end

Base.show(io::IO, ::MIME"text/plain", loc::Location) = print(io, loc)

Base.:+(loc::Location, n::Int) =
    Location(loc.file, loc.line+n)

# Test case.

abstract type AbstractTest end

struct Test <: AbstractTest
    loc::Location
    code::String
    expect::String
end

location(test::Test) = test.loc

function Base.show(io::IO, mime::MIME"text/plain", test::Test)
    print(io, "Test case at ")
    show(io, mime, test.loc)
    println(io, ":")
    println(io, indented(test.code))
    println(io, "Expected output:")
    println(io, indented(test.expect))
end

# Test case that failed to parse.

struct BrokenTest <: AbstractTest
    loc::Location
    msg::String
end

BrokenTest(loc, exc::Exception) =
    BrokenTest(loc, sprint(showerror, exc))

location(err::BrokenTest) = err.loc

function Base.show(io::IO, mime::MIME"text/plain", err::BrokenTest)
    print(io, "Error at ")
    show(io, mime, err.loc)
    println(io, ":")
    println(io, indented(err.msg))
end

# Test result types.

abstract type AbstractResult end

# Passed test.

struct Pass <: AbstractResult
    test::Test
    output::String
end

function Base.show(io::IO, mime::MIME"text/plain", pass::Pass)
    print(io, "Test passed at ")
    show(io, mime, pass.test.loc)
    println(io, ":")
    println(io, indented(pass.test.code))
    println(io, "Expected output:")
    println(io, indented(pass.test.expect))
    println(io, "Actual output:")
    println(io, indented(pass.output))
end

# Failed test.

struct Fail <: AbstractResult
    test::Test
    output::String
    trace::StackTraces.StackTrace
end

function Base.show(io::IO, mime::MIME"text/plain", fail::Fail)
    print(io, "Test failed at ")
    show(io, mime, fail.test.loc)
    println(io, ":")
    println(io, indented(fail.test.code))
    println(io, "Expected output:")
    println(io, indented(fail.test.expect))
    println(io, "Actual output:")
    println(io, indented(fail.output))
    if !isempty(fail.trace)
        println(io, indented(lstrip(sprint(Base.show_backtrace, fail.trace))))
    end
end

# Summary of the testing results.

struct Summary
    passed::Int
    failed::Int
    errors::Int
end

function Base.show(io::IO, mime::MIME"text/plain", sum::Summary)
    if sum.passed > 0
        println(io, "Tests passed: ", sum.passed)
    end
    if sum.failed > 0
        println(io, "Tests failed: ", sum.failed)
    end
    if sum.errors > 0
        println(io, "Errors: ", sum.errors)
    end
end

# Output formatting.

struct Esc
    val::String
end

Esc(name::Symbol) = Esc(Base.text_colors[name])

Base.show(io::IO, esc::Esc) = nothing
Base.show(io::Base.TTY, esc::Esc) = print(io, esc.val)

const GOOD = Esc(:green)
const INFO = Esc(:cyan)
const WARN = Esc(:light_red)
const BOLD = Esc(:bold)
const NORM = Esc(:normal)
const CLRL = Esc("\r\e[K")

struct Msg
    args::Tuple
end

Msg(args...) = Msg(args)

Base.show(io::IO, msg::Msg) = print(io, msg.args...)

indicator(loc) =
    Msg(CLRL, BOLD, INFO, Esc("Testing " * string(loc)), NORM)
const MORE =
    Msg(BOLD, INFO, Esc("."), NORM)
const SUCCESS =
    Msg(BOLD, GOOD, "TESTING SUCCESSFUL!", NORM)
const FAILURE =
    Msg(BOLD, WARN, "TESTING UNSUCCESSFUL!", NORM)

const SEPARATOR = "~"^72 * "\n"

const INDENT = " "^4

function indented(str::AbstractString)
    inp = IOBuffer(str)
    out = IOBuffer()
    first = true
    for line in eachline(inp)
        if !first
            println(out)
        end
        first = false
        if !isempty(line)
            print(out, INDENT, line)
        end
    end
    return String(take!(out))
end

# Implementation of `test/runtests.jl`.

"""
    runtests(files) :: Bool

Loads the specified Markdown files to extract and run the embedded test cases.
When a directory is passed, loads all `*.md` files in the directory.
Returns `true` if the testing is successful, `false` otherwise.

    runtests()

In this form, test files are specified as command-line parameters.  When
invoked without parameters, loads all `*.md` files in the program directory.
Exits with code `0` if the testing is successful, `1` otherwise.  Use this form
in `test/runtests.jl`:

    using NarrativeTest
    runtests()
"""
function runtests()
    args = !isempty(ARGS) ? ARGS : [relpath(dirname(abspath(PROGRAM_FILE)))]
    exit(!runtests(args))
end

function runtests(files)
    files = vcat(findmd.(files)...)
    passed = 0
    failed = 0
    errors = 0
    for file in files
        suite = parsemd(file)
        cd(dirname(abspath(file))) do
            for test in suite
                print(stderr, indicator(location(test)))
                if test isa BrokenTest
                    print(stderr, CLRL)
                    print(SEPARATOR)
                    display(test)
                    errors += 1
                elseif test isa Test
                    res = runtest(test)
                    if res isa Pass
                        passed += 1
                    elseif res isa Fail
                        print(stderr, CLRL)
                        print(SEPARATOR)
                        display(res)
                        failed += 1
                    end
                end
            end
        end
        print(stderr, CLRL)
    end
    summary = Summary(passed, failed, errors)
    success = failed == 0 && errors == 0
    if !success
        print(SEPARATOR)
    end
    display(summary)
    println(stderr, success ? SUCCESS : FAILURE)
    return success
end

# Find `*.md` files in the given directory.

function findmd(base)
    isdir(base) || return [base]
    mdfiles = String[]
    for (root, dirs, files) in walkdir(base, follow_symlinks=true)
        for file in files
            if splitext(file)[2] == ".md"
                push!(mdfiles, joinpath(root, file))
            end
        end
    end
    sort!(mdfiles)
    return mdfiles
end

# Load a file and extract the embedded tests.

"""
    parsemd(file) :: Vector{AbstractTest}
    parsemd(name, io) :: Vector{AbstractTest}

Parses the specified Markdown file to extract the embedded test suite.  Returns
a list of test cases.
"""
parsemd(args...) =
    loadfile(parsemd, args...)

"""
    parsejl(file) :: Vector{AbstractTest}
    parsejl(name, io) :: Vector{AbstractTest}

Loads the specified Julia source file and extracts the embedded test suite.
Returns a list of test cases.
"""
parsejl(args...) =
    loadfile(parsejl, args...)

loadfile(parsefile::Function, file::String) =
    loadfile(parsefile, file, file)

function loadfile(parsefile::Function, name::String, file::Union{String,IO})
    loc = Location(name)
    lines =
        try
            readlines(file, keep=true)
        catch exc
            return AbstractTest[BrokenTest(loc, exc)]
        end
    if !isempty(lines)
        push!(lines, "")
        return parsefile(loc+1, lines)
    end
end

# Extract the test suite from Markdown source.

function parsemd(lineloc::Location, lines::Vector{String})
    # Accumulated test cases.
    suite = AbstractTest[]
    # Accumulated lines of the next code snippet.
    blk = String[]
    # Where the snippet started.
    loc = lineloc
    # Are we inside a fenced code block?
    fenced = false
    # Language of the fenced block.
    lang = ""
    # Do we need to process the accumulated code snippet?
    launch = false
    # Here, we extract code snippets, either indented or fenced, and pass them to `parsejl()`.
    for line in lines
        isend = isempty(line)
        isblank = isempty(strip(line))
        isindent = startswith(line, " "^4)
        isfence = startswith(line, "```") || startswith(line, "~~~")
        if !fenced
            # Not in a fenced block.
            if isend
                # End of file: we need to process the accumulated snippet.
                launch = true
            elseif isfence
                # Beginning of a fenced block; process the accumulated snippet.
                lang = rstrip(line)[4:end]
                launch = true
                fenced = true
            elseif isindent && !isblank
                # Must be an indented code.
                if isempty(blk)
                    # Remember where the snippet starts.
                    loc = lineloc
                end
                push!(blk, line[5:end])
            elseif isblank && !isempty(blk)
                # An empty line in an indented code block.
                push!(blk, "\n")
            else
                # Must be a regular text; process the accumulated snippet.
                launch = true
            end
        elseif fenced
            # In a fenced block.
            if isend
                # Unexpected end of file.
                push!(suite, BrokenTest(lineloc, "incomplete fenced code block"))
            elseif isfence
                # End of a fenced block: process the accumulated snippet.
                launch = true
                fenced = false
            elseif !isblank && isempty(blk) && lang == ""
                # The first line of code.
                loc = lineloc
                push!(blk, line)
            elseif !isempty(blk)
                # Line of code.
                push!(blk, line)
            end
        end
        # Process the accumulated snippet of Julia code.
        if launch && !isempty(blk)
            push!(blk, "")
            append!(suite, parsejl(loc, blk))
            empty!(blk)
        end
        launch = false
        lineloc += 1
    end
    return suite
end

# Extract the test suite from Julia source.

function parsejl(lineloc::Location, lines::Vector{String})
    # Accumulated test cases.
    suite = AbstractTest[]
    # Accumulated lines of the test code.
    blk = String[]
    # Accumulated lines of the expected output.
    exblk = String[]
    # Where the test case started.
    loc = lineloc
    # Are we inside a multiline comment block?
    commented = false
    # Do we need to process the accumulated test case?
    launch = false
    # Split the source code and comments into the test code and expected output.
    for line in lines
        isend = isempty(line)
        isblank = isempty(strip(line))
        if commented && isend
            # End of file while parsing a multiline output block.
            push!(suite, BrokenTest(lineloc, "incomplete multiline comment block"))
        elseif isend
            # End of file; process the accumulated test case.
            launch = true
        elseif !commented && occursin(r"^#=>\s+$", line)
            # Beginning of a multiline output block.
            commented = true
        elseif commented && occursin(r"^=#\s+$", line)
            # End of the multiline output block.
            commented = false
            launch = true
        elseif commented
            # In a multiline output block.
            push!(exblk, rstrip(line)*"\n")
        elseif occursin(r"^\s*#->\s+", line)
            # Standalone output line.
            m = match(r"^\s*#->\s+(.*)$", line)
            push!(exblk, rstrip(m[1])*"\n")
            launch = true
        elseif occursin(r"\s#->\s+", line)
            # Code and output on the same line.
            m = match(r"^(.+)\s#->\s+(.*)$", line)
            if isempty(blk)
                loc = lineloc
            end
            push!(blk, rstrip(m[1])*"\n")
            push!(exblk, rstrip(m[2])*"\n")
            launch = true
        elseif isempty(blk) && !isblank
            # First line of code.
            loc = lineloc
            push!(blk, line)
        elseif !isempty(blk)
            # Code block continues.
            push!(blk, line)
        end
        # Process the test case.
        if launch && isempty(blk) && !isempty(exblk)
            push!(suite, BrokenTest(loc, "missing test code"))
            empty!(exblk)
        elseif launch && !isempty(blk)
            code = rstrip(join(blk)) * "\n"
            expect = join(exblk)
            test = Test(loc, code, expect)
            push!(suite, test)
            empty!(blk)
            empty!(exblk)
        end
        launch = false
        lineloc += 1
    end
    return suite
end

# Run a single test case.

const MODCACHE = Dict{String,Module}()

"""
    runtest(test::Test) :: AbstractResult
    runtest(loc, code, expect) :: AbstractResult

Runs the given test case, returns the result.
"""
function runtest(test::Test)
    # Suppress printing of the output value?
    no_output = endswith(test.code, ";\n") || isempty(test.expect)
    # Generate a module object for running the test code.
    mod = get!(MODCACHE, test.loc.file) do
        Module(Symbol(basename(test.loc.file)))
    end
    # Replace the standard output/error with a pipe.
    orig_have_color = Base.have_color
    Core.eval(Base, :(have_color = false))
    orig_stdout = stdout
    orig_stderr = stderr
    pipe = Pipe()
    Base.link_pipe!(pipe; reader_supports_async=true, writer_supports_async=false)
    io = IOContext(pipe.in, :limit=>true, :module=>mod)
    redirect_stdout(pipe.in)
    redirect_stderr(pipe.in)
    pushdisplay(TextDisplay(io))
    trace = StackTraces.StackTrace()
    output = ""
    @sync begin
        @async begin
            # Run the test code and print the result.
            stacktop = length(stacktrace())
            try
                try
                    body = Base.parse_input_line("\n" ^ max(0, test.loc.line-1) * test.code,
                                                 filename=basename(test.loc.file))
                    ans = Core.eval(mod, body)
                    if ans !== nothing && !no_output
                        show(io, ans)
                    end
                catch exc
                    trace = stacktrace(catch_backtrace())[1:end-stacktop]
                    print(stderr, "ERROR: ")
                    showerror(stderr, exc, trace; backtrace=false)
                end
                println(io)
            finally
                # Restore the standard output/error.
                popdisplay()
                redirect_stderr(orig_stderr)
                redirect_stdout(orig_stdout)
                Core.eval(Base, :(have_color = $orig_have_color))
                close(pipe.in)
            end
        end
        @async begin
            # Read the output of the test.
            output = read(pipe.out, String)
            close(pipe.out)
        end
    end
    # Compare the actual output with the expected output and generate the result.
    expect = rstrip(test.expect)
    actual = rstrip(join(map(rstrip, eachline(IOBuffer(output))), "\n"))
    return expect == actual || occursin(expect2regex(expect), actual) ?
        Pass(test, actual) :
        Fail(test, actual, trace)
end

runtest(loc, code, expect) = runtest(Test(loc, code, expect))

# Convert expected output block to a regex.

const EXPECTMAP = [
        r"[^0-9A-Za-z…⋮\r\n\t ]" => s"\\\0",
        r"[\t ]*…[\t ]*" => s".+",
        r"[\t ]*⋮[\t ]*\r?\n?" => s"(.*(\\n|$))+",
        r"\A" => s"\\A",
        r"\z" => s"\\z",
]

function expect2regex(pattern, expectmap=EXPECTMAP)
    for (regex, repl) in expectmap
        pattern = replace(pattern, regex => repl)
    end
    return Regex(pattern)
end

end
