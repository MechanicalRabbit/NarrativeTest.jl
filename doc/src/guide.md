# Usage Guide


## Installation

NarrativeTest is not yet registered with the Julia package manager, but you can
install it from the
[GitHub repository](https://github.com/rbt-lang/NarrativeTest.jl) using
`Pkg.clone()`:

```julia
julia> Pkg.clone("https://github.com/rbt-lang/NarrativeTest.jl")
```

To use NarrativeTest for testing your package, create the following
`test/runtests.jl` script in the package directory:

```julia
#!/usr/bin/env julia

using NarrativeTest
runtests()
```

Once NarrativeTest is registered with the Julia package manager, you can
declare it as a dependency in `test/REQUIRE`:

```
NarrativeTest 0.1
```


## Creating tests

Write the test suite as a Markdown document and save it in the `test`
directory.  Place the test cases in Markdown code blocks, and use comments
`#-> …` and `#=> … =#` to indicate the expected output.  For example:

```markdown
# Sample test suite

Verify that the expression evaluates to the expected value:

    6(3+4)          #-> 42

Check if the code produces the expected output:

    print("Hello ")
    print("World!")
    #-> Hello World!

Abbreviate the output with ellipsis:

    collect('a':'z')
    #-> ['a', 'b', …, 'z']

    display(collect('a':'z'))
    #=>
    26-element Array{Char,1}:
     'a'
     'b'
     ⋮
     'z'
    =#
```

To suppress the printing of the value produced by the test case, end it with
`;`.

In the output block, you can use the symbol `…` (`\dots`) to match an arbitrary
sequence of characters in the line, and `⋮` (`\vdots`) to match any number of
lines.


## Running the tests

To run all test suites in the `test` directory, start:

```console
$ julia ./test/runtests.jl
Tests passed: 3
TESTING SUCCESSFUL!
```

You can also run individual test suites by listing them as command-line
parameters:

```console
$ julia ./test/runtests.jl path/to/test.md
```

Alternatively, you can run any test suite from Julia:

```julia
julia> using NarrativeTest
julia> success = runtests(["path/to/test.md"]);
Tests passed: 3
TESTING SUCCESSFUL!
julia> success
true
```
