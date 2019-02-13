var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "#NarrativeTest.jl-Documentation-1",
    "page": "Home",
    "title": "NarrativeTest.jl Documentation",
    "category": "section",
    "text": "NarrativeTest is a Julia library for functional testing, which lets you write the test suite in the narrative form.  It permits you to describe the behavior of software components in the Markdown format, and then extract, execute, and validate any embedded test code.NarrativeTest can be compared to the Doctest module (see also Documenter.jl). It differs from Doctest in its approach to syntax: instead of presenting the test suite as a part of an interactive session, NarrativeTest uses plain code blocks with expected output in comments.  It also focuses less on docstrings and documentation examples, and more on validating the ergonomics of API with \"literate testing\"."
},

{
    "location": "#Contents-1",
    "page": "Home",
    "title": "Contents",
    "category": "section",
    "text": "Pages = [\n    \"guide.md\",\n    \"reference.md\",\n    \"test.md\",\n]"
},

{
    "location": "#Index-1",
    "page": "Home",
    "title": "Index",
    "category": "section",
    "text": ""
},

{
    "location": "guide/#",
    "page": "Usage Guide",
    "title": "Usage Guide",
    "category": "page",
    "text": ""
},

{
    "location": "guide/#Usage-Guide-1",
    "page": "Usage Guide",
    "title": "Usage Guide",
    "category": "section",
    "text": ""
},

{
    "location": "guide/#Installation-1",
    "page": "Usage Guide",
    "title": "Installation",
    "category": "section",
    "text": "You can install NarrativeTest using the Julia package manager:julia> using Pkg\njulia> Pkg.add(\"NarrativeTest\")Alternatively, you can install it from the GitHub repository using Pkg.clone():julia> Pkg.clone(\"https://github.com/rbt-lang/NarrativeTest.jl\")To use NarrativeTest for testing your package, add it as a test-specific dependency and create the following test/runtests.jl script in the package directory:#!/usr/bin/env julia\n\nusing NarrativeTest\nruntests()"
},

{
    "location": "guide/#Creating-tests-1",
    "page": "Usage Guide",
    "title": "Creating tests",
    "category": "section",
    "text": "Write the test suite as a Markdown document and save it in the test directory.  Place the test cases in Markdown code blocks, and use comments #-> … and #=> … =# to indicate the expected output.  For example:# Sample test suite\n\nVerify that the expression evaluates to the expected value:\n\n    6(3+4)          #-> 42\n\nCheck if the code produces the expected output:\n\n    print(\"Hello \")\n    print(\"World!\")\n    #-> Hello World!\n\nAbbreviate the output with ellipsis:\n\n    collect(\'a\':\'z\')\n    #-> [\'a\', \'b\', …, \'z\']\n\n    display(collect(\'a\':\'z\'))\n    #=>\n    26-element Array{Char,1}:\n     \'a\'\n     \'b\'\n     ⋮\n     \'z\'\n    =#To suppress the printing of the value produced by the test case, end it with ;.In the output block, you can use the symbol … (\\dots) to match an arbitrary sequence of characters in the line, and ⋮ (\\vdots) to match any number of lines."
},

{
    "location": "guide/#Running-the-tests-1",
    "page": "Usage Guide",
    "title": "Running the tests",
    "category": "section",
    "text": "To run all test suites in the test directory, start:$ julia ./test/runtests.jl\nTests passed: 3\nTESTING SUCCESSFUL!You can also run individual test suites by listing them as command-line parameters:$ julia ./test/runtests.jl path/to/test.mdAlternatively, you can run any test suite from Julia:julia> using NarrativeTest\njulia> success = runtests([\"path/to/test.md\"]);\nTests passed: 3\nTESTING SUCCESSFUL!\njulia> success\ntrue"
},

{
    "location": "reference/#",
    "page": "API Reference",
    "title": "API Reference",
    "category": "page",
    "text": ""
},

{
    "location": "reference/#NarrativeTest.runtests",
    "page": "API Reference",
    "title": "NarrativeTest.runtests",
    "category": "function",
    "text": "runtests(files) :: Bool\n\nLoads the specified Markdown files to extract and run the embedded test cases. When a directory is passed, loads all *.md files in the directory. Returns true if the testing is successful, false otherwise.\n\nruntests()\n\nIn this form, test files are specified as command-line parameters.  When invoked without parameters, loads all *.md files in the program directory. Exits with code 0 if the testing is successful, 1 otherwise.  Use this form in test/runtests.jl:\n\nusing NarrativeTest\nruntests()\n\n\n\n\n\n"
},

{
    "location": "reference/#NarrativeTest.runtest",
    "page": "API Reference",
    "title": "NarrativeTest.runtest",
    "category": "function",
    "text": "runtest(test::Test) :: AbstractResult\nruntest(loc, code, expect) :: AbstractResult\n\nRuns the given test case, returns the result.\n\n\n\n\n\n"
},

{
    "location": "reference/#NarrativeTest.parsemd",
    "page": "API Reference",
    "title": "NarrativeTest.parsemd",
    "category": "function",
    "text": "parsemd(file) :: Vector{AbstractTest}\nparsemd(name, io) :: Vector{AbstractTest}\n\nParses the specified Markdown file to extract the embedded test suite.  Returns a list of test cases.\n\n\n\n\n\n"
},

{
    "location": "reference/#NarrativeTest.parsejl",
    "page": "API Reference",
    "title": "NarrativeTest.parsejl",
    "category": "function",
    "text": "parsejl(file) :: Vector{AbstractTest}\nparsejl(name, io) :: Vector{AbstractTest}\n\nLoads the specified Julia source file and extracts the embedded test suite. Returns a list of test cases.\n\n\n\n\n\n"
},

{
    "location": "reference/#API-Reference-1",
    "page": "API Reference",
    "title": "API Reference",
    "category": "section",
    "text": "NarrativeTest.runtests\nNarrativeTest.runtest\nNarrativeTest.parsemd\nNarrativeTest.parsejl"
},

{
    "location": "test/#",
    "page": "Test Suite",
    "title": "Test Suite",
    "category": "page",
    "text": ""
},

{
    "location": "test/#Test-Suite-1",
    "page": "Test Suite",
    "title": "Test Suite",
    "category": "section",
    "text": "This is the test suite for NarrativeTest.jl.  We start with importing its public API.using NarrativeTest"
},

{
    "location": "test/#Running-the-tests-1",
    "page": "Test Suite",
    "title": "Running the tests",
    "category": "section",
    "text": "The main entry point of NarrativeTest is the function runtests(), which takes a list of Markdown files.  Each file is parsed to extract and run the embedded test suite.ans = runtests([\"sample_good.md_\"]);\n#=>\nTests passed: 3\nTESTING SUCCESSFUL!\n=#If all tests pass, runtests() returns true.ans\n#-> trueIf any of the tests fail or an ill-formed test case is detected, runtests() reports the problem and returns false.ans = runtests([\"sample_bad.md_\"]);\n#=>\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTest failed at sample_bad.md_, line 9:\n    2+2\nExpected output:\n    5\nActual output:\n    4\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTest failed at sample_bad.md_, line 13:\n    sqrt(-1)\nExpected output:\n    0.0 + 1.0im\nActual output:\n    ERROR: DomainError …\n    sqrt will only return a complex result if called with a complex argument. …\n    Stacktrace:\n     ⋮\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nError at sample_bad.md_, line 17:\n    missing test code\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTests passed: 1\nTests failed: 2\nErrors: 1\nTESTING UNSUCCESSFUL!\n=#\n\nans\n#-> falseTo implement the runtests.jl script, invoke runtests() without arguments. In this form, runtests() gets the list of files from command-line parameters and, after testing is done, terminates the process with an appropriate exit code.julia = Base.julia_cmd()\n\nrun(`$julia -e \'using NarrativeTest; runtests()\' sample_good.md_`);\n#=>\n⋮\nTESTING SUCCESSFUL!\n=#\n\nrun(`$julia -e \'using NarrativeTest; runtests()\' sample_bad.md_`);\n#=>\n⋮\nTESTING UNSUCCESSFUL!\nERROR: failed process: Process(` … `, ProcessExited(1)) [1]\n=#"
},

{
    "location": "test/#Extracting-test-cases-1",
    "page": "Test Suite",
    "title": "Extracting test cases",
    "category": "section",
    "text": "We can extract individual test cases from Markdown and Julia files.  Let us import the respective API.using NarrativeTest:\n    parsejl,\n    parsemdFunction parsemd() parses the given Markdown file and returns an array of the extracted test cases.suite = parsemd(\"sample_bad.md_\")\ndisplay(suite)\n#=>\n4-element Array{NarrativeTest.AbstractTest,1}:\n NarrativeTest.Test(NarrativeTest.Location(\"sample_bad.md_\", 5), \"(3+4)*6\\n\", \"42\\n\")\n NarrativeTest.Test(NarrativeTest.Location(\"sample_bad.md_\", 9), \"2+2\\n\", \"5\\n\")\n NarrativeTest.Test(NarrativeTest.Location(\"sample_bad.md_\", 13), \"sqrt(-1)\\n\", \"0.0 + 1.0im\\n\")\n NarrativeTest.BrokenTest(NarrativeTest.Location(\"sample_bad.md_\", 17), \"missing test code\")\n=#\n\nsuite = parsemd(\"sample_missing.md_\")\ndisplay(suite)\n#=>\n1-element Array{NarrativeTest.AbstractTest,1}:\n NarrativeTest.BrokenTest(NarrativeTest.Location(\"sample_missing.md_\", 0), \"SystemError: … \")\n=#Function parsemd() recognizes two types of Markdown code blocks: indented and fenced.suite = parsemd(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        These test cases are embedded in an indented code block.\n\n            (3+4)*6\n            $(\"#->\") 42\n\n            2+2\n            $(\"#->\") 5\n\n        The following test cases are embedded in a fenced code block.\n        ```\n        print(2^16)\n        $(\"#->\") 65526\n\n        sqrt(-1)\n        $(\"#->\") 0.0 + 1.0im\n        ```\n        \"\"\"))\nforeach(display, suite)\n#=>\nTest case at <input>, line 3:\n    (3+4)*6\nExpected output:\n    42\nTest case at <input>, line 6:\n    2+2\nExpected output:\n    5\nTest case at <input>, line 11:\n    print(2^16)\nExpected output:\n    65526\nTest case at <input>, line 14:\n    sqrt(-1)\nExpected output:\n    0.0 + 1.0im\n=#A fenced code block with an explicit language indicator is ignored.parsemd(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        The following code will not be tested.\n        ```julia\n        2 + 2   $(\"#->\") 5\n        ```\n        \"\"\"))\n#-> NarrativeTest.AbstractTest[]It is an error if a fenced code block is not closed.suite = parsemd(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        Incomplete fenced code block is an error.\n        ```\n        (3+4)*6\n        $(\"#->\") 42\n        \"\"\"))\nforeach(display, suite)\n#=>\nError at <input>, line 5:\n    incomplete fenced code block\n=#Function parsejl() parses a Julia file and returns an array of the extracted test cases.  It recognizes comments #-> … and #=> ⋮ =# as single-line and multi-line expected output.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        2+2     $(\"#->\") 4\n\n        print(2^16)\n        $(\"#->\") 65526\n\n        display(collect(\'A\':\'Z\'))\n        $(\"#=>\")\n        26-element Array{Char,1}:\n         \'A\'\n         \'B\'\n         ⋮\n         \'Z\'\n        =#\n        \"\"\"))\nforeach(display, suite)\n#=>\nTest case at <input>, line 1:\n    2+2\nExpected output:\n    4\nTest case at <input>, line 3:\n    print(2^16)\nExpected output:\n    65526\nTest case at <input>, line 6:\n    display(collect(\'A\':\'Z\'))\nExpected output:\n    26-element Array{Char,1}:\n     \'A\'\n     \'B\'\n     ⋮\n     \'Z\'\n=#A test case may have no expected output.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        x = pi/6\n        y = sin(x)\n\n        @assert y ≈ 0.5\n        \"\"\"))\nforeach(display, suite)\n#=>\nTest case at <input>, line 1:\n    x = pi/6\n    y = sin(x)\n\n    @assert y ≈ 0.5\nExpected output:\n=#However, it is an error to have an expected output block without any test code.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        $(\"#->\") 42\n        \"\"\"))\nforeach(display, suite)\n#=>\nError at <input>, line 1:\n    missing test code\n=#It is also an error if a multi-line output block is not closed.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        display(collect(\'A\':\'Z\'))\n        $(\"#=>\")\n        26-element Array{Char,1}:\n         \'A\'\n         \'B\'\n         ⋮\n         \'Z\'\n        \"\"\"))\nforeach(display, suite)\n#=>\nError at <input>, line 8:\n    incomplete multiline comment block\n=#"
},

{
    "location": "test/#Running-one-test-1",
    "page": "Test Suite",
    "title": "Running one test",
    "category": "section",
    "text": "We can run individual tests using the function runtest().using NarrativeTest:\n    runtestFunction runtest() takes a test case object and returns the test result.suite = parsemd(\"sample_bad.md_\")\nsuite = filter(t -> t isa NarrativeTest.Test, suite)\nresults = map(runtest, suite)\ndisplay(results)\n#=>\n3-element Array{NarrativeTest.AbstractResult,1}:\n NarrativeTest.Pass(NarrativeTest.Test( … , \"(3+4)*6\\n\", \"42\\n\"), \"42\")\n NarrativeTest.Fail(NarrativeTest.Test( … , \"2+2\\n\", \"5\\n\"), \"4\", …StackFrame[])\n NarrativeTest.Fail(NarrativeTest.Test( … , \"sqrt(-1)\\n\", \"0.0 + 1.0im\\n\"), \"ERROR: DomainError …\\n …\", …StackFrame[ … ])\n=#runtest() captures the content of the standard output and error streams and matches it against the expected test result.result = runtest(\"<input>\", \"\"\"println(\"Hello World!\")\\n\"\"\", \"Hello World!\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    println(\"Hello World!\")\nExpected output:\n    Hello World!\nActual output:\n    Hello World!\n=#runtest() shows the value produced by the last statement of the test code.result = runtest(\"<input>\", \"(3+4)*6\\n\", \"42\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    (3+4)*6\nExpected output:\n    42\nActual output:\n    42\n=#\n\nresult = runtest(\"<input>\", \"2+2\\n\", \"5\\n\")\ndisplay(result)\n#=>\nTest failed at <input>:\n    2+2\nExpected output:\n    5\nActual output:\n    4\n=#However, if this value is equal to nothing, it is not displayed.result = runtest(\"<input>\", \"nothing\\n\", \"\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    ⋮\n=#This value is also concealed if the test code ends with ; of if the test case has no expected output.result = runtest(\"<input>\", \"(3+4)*6;\\n\", \"\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    ⋮\n=#\n\nresult = runtest(\"<input>\", \"(3+4)*6\\n\", \"\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    ⋮\n=#When the test raises an exception, the error message (but not the stack trace) is included with the output.result = runtest(\"<input>\", \"sqrt(-1)\\n\", \"ERROR: DomainError …\\n …\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    sqrt(-1)\nExpected output:\n    ERROR: DomainError …\n     …\nActual output:\n    ERROR: DomainError …\n    sqrt will only return a complex result if called with a complex argument. …\n=#In the expected output, we can use symbol … to match any number of characters in a line, and symbol ⋮ to match any number of lines.result = runtest(\"<input>\", \"print(collect(\'A\':\'Z\'))\\n\", \"[\'A\', \'B\', …, \'Z\']\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    print(collect(\'A\':\'Z\'))\nExpected output:\n    [\'A\', \'B\', …, \'Z\']\nActual output:\n    [\'A\', \'B\', \'C\', …, \'Y\', \'Z\']\n=#\n\nresult = runtest(\"<input>\", \"display(collect(\'A\':\'Z\'))\\n\", \"26-element Array{Char,1}:\\n ⋮\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    display(collect(\'A\':\'Z\'))\nExpected output:\n    26-element Array{Char,1}:\n     ⋮\nActual output:\n    26-element Array{Char,1}:\n     \'A\'\n     \'B\'\n     ⋮\n     \'Z\'\n=#"
},

]}
