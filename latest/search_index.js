var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Usage Guide",
    "title": "Usage Guide",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#Usage-Guide-1",
    "page": "Usage Guide",
    "title": "Usage Guide",
    "category": "section",
    "text": "Documentation for NarrativeTest.jl"
},

{
    "location": "test.html#",
    "page": "Test Suite",
    "title": "Test Suite",
    "category": "page",
    "text": ""
},

{
    "location": "test.html#Test-Suite-1",
    "page": "Test Suite",
    "title": "Test Suite",
    "category": "section",
    "text": "This is the test suite for NarrativeTest.jl.  We start it with loading the module to import its public API.using NarrativeTest"
},

{
    "location": "test.html#Running-the-tests-1",
    "page": "Test Suite",
    "title": "Running the tests",
    "category": "section",
    "text": "The main entry point of NarrativeTest is the function runtests().  It accepts a list of Markdown files.  Each file is parsed to extract and run the embedded test suite.ans = runtests([\"sample_good.md_\"]);\n#=>\nTests passed: 3\nTESTING SUCCESSFUL!\n=#If all tests passed, runtests() returns true.ans\n#-> trueIf any of the tests fail or an ill-formed test case is detected, runtests() reports the problem and returns false.ans = runtests([\"sample_bad.md_\"]);\n#=>\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTest failed at sample_bad.md_, line 9:\n    2+2\nExpected output:\n    5\nActual output:\n    4\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTest failed at sample_bad.md_, line 13:\n    sqrt(-1)\nExpected output:\n    0.0 + 1.0im\nActual output:\n    ERROR: DomainError …\n    sqrt will only return a complex result if called with a complex argument. …\n    Stacktrace:\n     ⋮\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nError at sample_bad.md_, line 17:\n    missing test code\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nTests passed: 1\nTests failed: 2\nErrors: 1\nTESTING UNSUCCESSFUL!\n=#\n\nans\n#-> falseTo implement the runtests.jl script, invoke runtests() without arguments. In this form, runtests() runs the tests specified as command-line parameters and exits with an appropriate exit code.julia = Base.julia_cmd()\n\nrun(`$julia -e 'using NarrativeTest; runtests()' sample_good.md_`)\n#=>\n⋮\nTESTING SUCCESSFUL!\n=#\n\nrun(`$julia -e 'using NarrativeTest; runtests()' sample_bad.md_`)\n#=>\n⋮\nTESTING UNSUCCESSFUL!\nERROR: failed process: Process(` … `, ProcessExited(1)) [1]\n=#"
},

{
    "location": "test.html#Extracting-test-cases-1",
    "page": "Test Suite",
    "title": "Extracting test cases",
    "category": "section",
    "text": "We can extract individual test cases from Markdown and Julia files.  Let us import the respective API.using NarrativeTest:\n    parsejl,\n    parsemdFunction parsemd() loads a Markdown file and returns an array of the embedded test cases.suite = parsemd(\"sample_bad.md_\")\ndisplay(suite)\n#=>\n4-element Array{NarrativeTest.AbstractTest,1}:\n NarrativeTest.Test(NarrativeTest.Location(\"sample_bad.md_\", 5), \"(3+4)*6\\n\", \"42\\n\")\n NarrativeTest.Test(NarrativeTest.Location(\"sample_bad.md_\", 9), \"2+2\\n\", \"5\\n\")\n NarrativeTest.Test(NarrativeTest.Location(\"sample_bad.md_\", 13), \"sqrt(-1)\\n\", \"0.0 + 1.0im\\n\")\n NarrativeTest.BrokenTest(NarrativeTest.Location(\"sample_bad.md_\", 17), \"missing test code\")\n=#\n\nsuite = parsemd(\"sample_missing.md_\")\ndisplay(suite)\n#=>\n1-element Array{NarrativeTest.AbstractTest,1}:\n NarrativeTest.BrokenTest(NarrativeTest.Location(\"sample_missing.md_\", 0), \"SystemError: … \")\n=#Function parsemd() recognizes two types of Markdown code blocks: indented and fenced.suite = parsemd(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        These test cases are embedded in an indented code block.\n\n            (3+4)*6\n            $(\"#->\") 42\n\n            2+2\n            $(\"#->\") 5\n\n        The following test cases are embedded in a fenced code block.\n        ```\n        print(2^16)\n        $(\"#->\") 65526\n\n        sqrt(-1)\n        $(\"#->\") 0.0 + 1.0im\n        ```\n        \"\"\"))\nforeach(display, suite)\n#=>\nTest case at <input>, line 3:\n    (3+4)*6\nExpected output:\n    42\nTest case at <input>, line 6:\n    2+2\nExpected output:\n    5\nTest case at <input>, line 11:\n    print(2^16)\nExpected output:\n    65526\nTest case at <input>, line 14:\n    sqrt(-1)\nExpected output:\n    0.0 + 1.0im\n=#It is an error if a fenced code block is not closed.suite = parsemd(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        Incomplete fenced code block is an error.\n        ```\n        (3+4)*6\n        $(\"#->\") 42\n        \"\"\"))\nforeach(display, suite)\n#=>\nError at <input>, line 5:\n    incomplete fenced code block\n=#Function parsejl() extracts embedded test cases from Julia code.  It recognizes the comment #-> … as single-line expected output and the comment #=> … =# as multi-line expected output.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        2+2     $(\"#->\") 4\n\n        print(2^16)\n        $(\"#->\") 65526\n\n        display(collect('A':'Z'))\n        $(\"#=>\")\n        26-element Array{Char,1}:\n         'A'\n         'B'\n         ⋮\n         'Z'\n        =#\n        \"\"\"))\nforeach(display, suite)\n#=>\nTest case at <input>, line 1:\n    2+2\nExpected output:\n    4\nTest case at <input>, line 3:\n    print(2^16)\nExpected output:\n    65526\nTest case at <input>, line 6:\n    display(collect('A':'Z'))\nExpected output:\n    26-element Array{Char,1}:\n     'A'\n     'B'\n     ⋮\n     'Z'\n=#A test case may have no expected output.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        x = pi/6\n        y = sin(x)\n\n        @assert y ≈ 0.5\n        \"\"\"))\nforeach(display, suite)\n#=>\nTest case at <input>, line 1:\n    x = pi/6\n    y = sin(x)\n\n    @assert y ≈ 0.5\nExpected output:\n=#However, it is an error to have expected output block without test code.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        $(\"#->\") 42\n        \"\"\"))\nforeach(display, suite)\n#=>\nError at <input>, line 1:\n    missing test code\n=#It is also an error if a multi-line output block is not closed.suite = parsejl(\n    \"<input>\",\n    IOBuffer(\"\"\"\n        display(collect('A':'Z'))\n        $(\"#=>\")\n        26-element Array{Char,1}:\n         'A'\n         'B'\n         ⋮\n         'Z'\n        \"\"\"))\nforeach(display, suite)\n#=>\nError at <input>, line 8:\n    incomplete multiline comment block\n=#"
},

{
    "location": "test.html#Running-one-test-1",
    "page": "Test Suite",
    "title": "Running one test",
    "category": "section",
    "text": "We can run individual tests using the function runtest().using NarrativeTest:\n    runtestFunction runtest() accepts a test case object and returns the test result.suite = parsemd(\"sample_bad.md_\")\nresults = map(runtest, filter(t -> t isa NarrativeTest.Test, suite))\ndisplay(results)\n#=>\n3-element Array{NarrativeTest.AbstractResult,1}:\n NarrativeTest.Pass(NarrativeTest.Test( … , \"(3+4)*6\\n\", \"42\\n\"), \"42\")\n NarrativeTest.Fail(NarrativeTest.Test( … , \"2+2\\n\", \"5\\n\"), \"4\", StackFrame[])\n NarrativeTest.Fail(NarrativeTest.Test( … , \"sqrt(-1)\\n\", \"0.0 + 1.0im\\n\"), \"ERROR: DomainError …\\n …\", StackFrame[ … ])\n=#runtest() captures the content of the standard output and error streams and compares it with the expected test result.result = runtest(\"<input>\", \"\"\"println(\"Hello World!\")\\n\"\"\", \"Hello World!\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    println(\"Hello World!\")\nExpected output:\n    Hello World!\nActual output:\n    Hello World!\n=#runtest() also shows the value produced by the last statement of the test code.result = runtest(\"<input>\", \"(3+4)*6\\n\", \"42\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    (3+4)*6\nExpected output:\n    42\nActual output:\n    42\n=#\n\nresult = runtest(\"<input>\", \"2+2\\n\", \"5\\n\")\ndisplay(result)\n#=>\nTest failed at <input>:\n    2+2\nExpected output:\n    5\nActual output:\n    4\n=#However, if the produced value is equal to nothing, it is not displayed.result = runtest(\"<input>\", \"nothing\\n\", \"\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    ⋮\n=#You can also suppress displaying the value by ending the test code with ;, or by not providing the expected output.result = runtest(\"<input>\", \"(3+4)*6;\\n\", \"\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    ⋮\n=#\n\nresult = runtest(\"<input>\", \"(3+4)*6\\n\", \"\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    ⋮\n=#When the test raises an exception, the error message (but not the stack trace) is included with the output.result = runtest(\"<input>\", \"sqrt(-1)\\n\", \"ERROR: DomainError …\\n …\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    sqrt(-1)\nExpected output:\n    ERROR: DomainError …\n     …\nActual output:\n    ERROR: DomainError …\n    sqrt will only return a complex result if called with a complex argument. …\n=#In the expected output, we can use symbol … to replace any number of characters in a line, and symbol ⋮ to replace any number of lines.result = runtest(\"<input>\", \"print(collect('A':'Z'))\\n\", \"['A', 'B', …, 'Z']\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    print(collect('A':'Z'))\nExpected output:\n    ['A', 'B', …, 'Z']\nActual output:\n    ['A', 'B', 'C', …, 'Y', 'Z']\n=#\n\nresult = runtest(\"<input>\", \"display(collect('A':'Z'))\\n\", \"26-element Array{Char,1}:\\n ⋮\\n\")\ndisplay(result)\n#=>\nTest passed at <input>:\n    display(collect('A':'Z'))\nExpected output:\n    26-element Array{Char,1}:\n     ⋮\nActual output:\n    26-element Array{Char,1}:\n     'A'\n     'B'\n     ⋮\n     'Z'\n=#"
},

]}
