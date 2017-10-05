# Testing NarrativeTest

## Running the test suite

We start with loading the module and importing its public API.

    using NarrativeTest

The main entry point of `NarrativeTest` is the function `runtests()`.  It
accepts a list of Markdown files.  Each file is parsed to extract and run the
embedded test suite.

    ans = runtests(["sample_good.md_"]);
    #=>
    Tests passed: 3
    TESTING SUCCESSFUL!
    =#

If all tests passed, `runtests()` returns `true`.

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
In this form, `runtests()` runs the tests specified as command-line parameters
and exits with an appropriate exit code.

    run(`julia -e 'using NarrativeTest; runtests()' sample_good.md_`)
    #=>
    ⋮
    TESTING SUCCESSFUL!
    =#

    run(`julia -e 'using NarrativeTest; runtests()' sample_bad.md_`)
    #=>
    ⋮
    TESTING UNSUCCESSFUL!
    ERROR: failed process: Process(` … `, ProcessExited(1)) [1]
    =#

# Extracting embedded test cases

We can extract individual test cases from Markdown and Julia files.  Let us
import the respective API.

    using NarrativeTest:
        parsejl,
        parsemd

Function `parsemd()` loads a Markdown file and returns an array of the embedded
test cases.

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

Function `parsejl()` extracts embedded test cases from Julia code.  It
recognizes the comment `#-> …` as single-line expected output and the comment
`#=> … =#` as multi-line expected output.

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

However, it is an error to have expected output block without test code.

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

# Running individual tests

We can run individual tests using the function `runtest()`.

    using NarrativeTest:
        runtest

Function `runtest()` accepts a test case object and returns the test result.

    suite = parsemd("sample_bad.md_")
    results = map(runtest, filter(t -> t isa NarrativeTest.Test, suite))
    display(results)
    #=>
    3-element Array{NarrativeTest.AbstractResult,1}:
     NarrativeTest.Pass(NarrativeTest.Test( … , "(3+4)*6\n", "42\n"), "42")
     NarrativeTest.Fail(NarrativeTest.Test( … , "2+2\n", "5\n"), "4", StackFrame[])
     NarrativeTest.Fail(NarrativeTest.Test( … , "sqrt(-1)\n", "0.0 + 1.0im\n"), "ERROR: DomainError …\n …", StackFrame[ … ])
    =#

`runtest()` captures the content of the standard output and error streams and
compares it with the expected test result.
    
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

`runtest()` also shows the value produced by the last statement of the test
code.

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

However, if the produced value is equal to `nothing`, it is not displayed.

    result = runtest("<input>", "nothing\n", "\n")
    display(result)
    #=>
    Test passed at <input>:
        ⋮
    =#

You can also suppress displaying the value by ending the test code with `;`, or
by not providing the expected output.

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

In the expected output, we can use symbol `…` to replace any number of
characters in a line, and symbol `⋮` to replace any number of lines.

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

