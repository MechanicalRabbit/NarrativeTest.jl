# NarrativeTest.jl

*NarrativeTest is a Julia library for functional testing, which lets you write
the test suite in the narrative form.  It permits you to describe the behavior
of software components in the Markdown format, and then extract, execute, and
validate any embedded test code.*

[![Build Status][ci-img]][ci-url]
[![Code Coverage Status][codecov-img]][codecov-url]
[![Open Issues][issues-img]][issues-url]
[![Documentation][doc-dev-img]][doc-dev-url]
[![MIT License][license-img]][license-url]


## Quick Start

Install the package using the Julia package manager:

```julia
julia> using Pkg
julia> Pkg.add("NarrativeTest")
```

Add NarrativeTest to your package as [a test-specific
dependency](https://julialang.github.io/Pkg.jl/v1/creating-packages/#Adding-tests-to-the-package-1).
Then create the following `test/runtests.jl`:

```julia
using NarrativeTest
NarrativeTest.runtests()
```

If you are already relying on the standard `Test` library, you can add
NarrativeTest as a nested test set:

```julia
using Test, NarrativeTest

@testset "MyPackage" begin
    …
    NarrativeTest.testset()
    …
end
```

Write the test suite in Markdown and save it in the `test` directory.  Place
the test code in Markdown code blocks, and use comments `#-> …` and `#=> … =#`
to indicate the expected output.  For example:

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

To test your package, run:

```console
$ julia ./test/runtests.jl
```

For more information, see the [**Documentation**][doc-dev-url].


[ci-img]: https://github.com/MechanicalRabbit/NarrativeTest.jl/workflows/CI/badge.svg
[ci-url]: https://github.com/MechanicalRabbit/NarrativeTest.jl/actions?query=workflow%3ACI+branch%3Amaster
[codecov-img]: https://codecov.io/gh/MechanicalRabbit/NarrativeTest.jl/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/MechanicalRabbit/NarrativeTest.jl
[issues-img]: https://img.shields.io/github/issues/MechanicalRabbit/NarrativeTest.jl.svg
[issues-url]: https://github.com/MechanicalRabbit/NarrativeTest.jl/issues
[doc-dev-img]: https://img.shields.io/badge/doc-dev-blue.svg
[doc-dev-url]: https://mechanicalrabbit.github.io/NarrativeTest.jl/dev/
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/MechanicalRabbit/NarrativeTest.jl/master/LICENSE.md
