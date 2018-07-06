# Test Suite

This is the test suite for NarrativeTest.jl.  We start with importing its
public API.

    using NarrativeTest


## Running the tests

The main entry point of `NarrativeTest` is the function `runtests()`, which
takes a list of Markdown files.  Each file is parsed to extract and run the
embedded test suite.

    ans = runtests(["sample_good.md_"]);
    #=>
    Tests passed: 3
    TESTING SUCCESSFUL!
    =#

If all tests pass, `runtests()` returns `true`.

    ans
    #-> true

If any of the tests fail or an ill-formed test case is detected, `runtests()`
reports the problem and returns `false`.

    ans = runtests(["sample_bad.md_"]);
    #=>
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Test failed at sample_bad.md_, line 9:
        2+2
    Expected output:
        5
    Actual output:
        4
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Test failed at sample_bad.md_, line 13:
        sqrt(-1)
    Expected output:
        0.0 + 1.0im
    Actual output:
        ERROR: DomainError …
        sqrt will only return a complex result if called with a complex argument. …
        Stacktrace:
         ⋮
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error at sample_bad.md_, line 17:
        missing test code
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Tests passed: 1
    Tests failed: 2
    Errors: 1
    TESTING UNSUCCESSFUL!
    =#

    ans
    #-> false

To implement the `runtests.jl` script, invoke `runtests()` without arguments.
In this form, `runtests()` gets the list of files from command-line parameters
and, after testing is done, terminates the process with an appropriate exit
code.

    julia = Base.julia_cmd()

    run(`$julia -e 'using NarrativeTest; runtests()' sample_good.md_`);
    #=>
    ⋮
    TESTING SUCCESSFUL!
    =#

    run(`$julia -e 'using NarrativeTest; runtests()' sample_bad.md_`);
    #=>
    ⋮
    TESTING UNSUCCESSFUL!
    ERROR: failed process: Process(` … `, ProcessExited(1)) [1]
    =#


## Extracting test cases

We can extract individual test cases from Markdown and Julia files.  Let us
import the respective API.

    using NarrativeTest:
        parsejl,
        parsemd

Function `parsemd()` parses the given Markdown file and returns an array of the
extracted test cases.

    suite = parsemd("sample_bad.md_")
    display(suite)
    #=>
    4-element Array{NarrativeTest.AbstractTest,1}:
     NarrativeTest.Test(NarrativeTest.Location("sample_bad.md_", 5), "(3+4)*6\n", "42\n")
     NarrativeTest.Test(NarrativeTest.Location("sample_bad.md_", 9), "2+2\n", "5\n")
     NarrativeTest.Test(NarrativeTest.Location("sample_bad.md_", 13), "sqrt(-1)\n", "0.0 + 1.0im\n")
     NarrativeTest.BrokenTest(NarrativeTest.Location("sample_bad.md_", 17), "missing test code")
    =#

    suite = parsemd("sample_missing.md_")
    display(suite)
    #=>
    1-element Array{NarrativeTest.AbstractTest,1}:
     NarrativeTest.BrokenTest(NarrativeTest.Location("sample_missing.md_", 0), "SystemError: … ")
    =#

Function `parsemd()` recognizes two types of Markdown code blocks: indented and
fenced.

    suite = parsemd(
        "<input>",
        IOBuffer("""
            These test cases are embedded in an indented code block.

                (3+4)*6
                $("#->") 42

                2+2
                $("#->") 5

            The following test cases are embedded in a fenced code block.
            ```
            print(2^16)
            $("#->") 65526

            sqrt(-1)
            $("#->") 0.0 + 1.0im
            ```
            """))
    foreach(display, suite)
    #=>
    Test case at <input>, line 3:
        (3+4)*6
    Expected output:
        42
    Test case at <input>, line 6:
        2+2
    Expected output:
        5
    Test case at <input>, line 11:
        print(2^16)
    Expected output:
        65526
    Test case at <input>, line 14:
        sqrt(-1)
    Expected output:
        0.0 + 1.0im
    =#

A fenced code block with an explicit language indicator is ignored.

    parsemd(
        "<input>",
        IOBuffer("""
            The following code will not be tested.
            ```julia
            2 + 2   $("#->") 5
            ```
            """))
    #-> NarrativeTest.AbstractTest[]

It is an error if a fenced code block is not closed.

    suite = parsemd(
        "<input>",
        IOBuffer("""
            Incomplete fenced code block is an error.
            ```
            (3+4)*6
            $("#->") 42
            """))
    foreach(display, suite)
    #=>
    Error at <input>, line 5:
        incomplete fenced code block
    =#

Function `parsejl()` parses a Julia file and returns an array of the extracted
test cases.  It recognizes comments `#-> …` and `#=> ⋮ =#` as single-line and
multi-line expected output.

    suite = parsejl(
        "<input>",
        IOBuffer("""
            2+2     $("#->") 4

            print(2^16)
            $("#->") 65526

            display(collect('A':'Z'))
            $("#=>")
            26-element Array{Char,1}:
             'A'
             'B'
             ⋮
             'Z'
            =#
            """))
    foreach(display, suite)
    #=>
    Test case at <input>, line 1:
        2+2
    Expected output:
        4
    Test case at <input>, line 3:
        print(2^16)
    Expected output:
        65526
    Test case at <input>, line 6:
        display(collect('A':'Z'))
    Expected output:
        26-element Array{Char,1}:
         'A'
         'B'
         ⋮
         'Z'
    =#

A test case may have no expected output.

    suite = parsejl(
        "<input>",
        IOBuffer("""
            x = pi/6
            y = sin(x)

            @assert y ≈ 0.5
            """))
    foreach(display, suite)
    #=>
    Test case at <input>, line 1:
        x = pi/6
        y = sin(x)

        @assert y ≈ 0.5
    Expected output:
    =#

However, it is an error to have an expected output block without any test code.

    suite = parsejl(
        "<input>",
        IOBuffer("""
            $("#->") 42
            """))
    foreach(display, suite)
    #=>
    Error at <input>, line 1:
        missing test code
    =#

It is also an error if a multi-line output block is not closed.

    suite = parsejl(
        "<input>",
        IOBuffer("""
            display(collect('A':'Z'))
            $("#=>")
            26-element Array{Char,1}:
             'A'
             'B'
             ⋮
             'Z'
            """))
    foreach(display, suite)
    #=>
    Error at <input>, line 8:
        incomplete multiline comment block
    =#


## Running one test

We can run individual tests using the function `runtest()`.

    using NarrativeTest:
        runtest

Function `runtest()` takes a test case object and returns the test result.

    suite = parsemd("sample_bad.md_")
    suite = filter(t -> t isa NarrativeTest.Test, suite)
    results = map(runtest, suite)
    display(results)
    #=>
    3-element Array{NarrativeTest.AbstractResult,1}:
     NarrativeTest.Pass(NarrativeTest.Test( … , "(3+4)*6\n", "42\n"), "42")
     NarrativeTest.Fail(NarrativeTest.Test( … , "2+2\n", "5\n"), "4", …StackFrame[])
     NarrativeTest.Fail(NarrativeTest.Test( … , "sqrt(-1)\n", "0.0 + 1.0im\n"), "ERROR: DomainError …\n …", …StackFrame[ … ])
    =#

`runtest()` captures the content of the standard output and error streams and
matches it against the expected test result.

    result = runtest("<input>", """println("Hello World!")\n""", "Hello World!\n")
    display(result)
    #=>
    Test passed at <input>:
        println("Hello World!")
    Expected output:
        Hello World!
    Actual output:
        Hello World!
    =#

`runtest()` shows the value produced by the last statement of the test code.

    result = runtest("<input>", "(3+4)*6\n", "42\n")
    display(result)
    #=>
    Test passed at <input>:
        (3+4)*6
    Expected output:
        42
    Actual output:
        42
    =#

    result = runtest("<input>", "2+2\n", "5\n")
    display(result)
    #=>
    Test failed at <input>:
        2+2
    Expected output:
        5
    Actual output:
        4
    =#

However, if this value is equal to `nothing`, it is not displayed.

    result = runtest("<input>", "nothing\n", "\n")
    display(result)
    #=>
    Test passed at <input>:
        ⋮
    =#

This value is also concealed if the test code ends with `;` of if the test case
has no expected output.

    result = runtest("<input>", "(3+4)*6;\n", "\n")
    display(result)
    #=>
    Test passed at <input>:
        ⋮
    =#

    result = runtest("<input>", "(3+4)*6\n", "")
    display(result)
    #=>
    Test passed at <input>:
        ⋮
    =#

When the test raises an exception, the error message (but not the stack trace)
is included with the output.

    result = runtest("<input>", "sqrt(-1)\n", "ERROR: DomainError …\n …")
    display(result)
    #=>
    Test passed at <input>:
        sqrt(-1)
    Expected output:
        ERROR: DomainError …
         …
    Actual output:
        ERROR: DomainError …
        sqrt will only return a complex result if called with a complex argument. …
    =#

In the expected output, we can use symbol `…` to match any number of characters
in a line, and symbol `⋮` to match any number of lines.

    result = runtest("<input>", "print(collect('A':'Z'))\n", "['A', 'B', …, 'Z']\n")
    display(result)
    #=>
    Test passed at <input>:
        print(collect('A':'Z'))
    Expected output:
        ['A', 'B', …, 'Z']
    Actual output:
        ['A', 'B', 'C', …, 'Y', 'Z']
    =#

    result = runtest("<input>", "display(collect('A':'Z'))\n", "26-element Array{Char,1}:\n ⋮\n")
    display(result)
    #=>
    Test passed at <input>:
        display(collect('A':'Z'))
    Expected output:
        26-element Array{Char,1}:
         ⋮
    Actual output:
        26-element Array{Char,1}:
         'A'
         'B'
         ⋮
         'Z'
    =#

