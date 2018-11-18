# NarrativeTest.jl

*NarrativeTest is a Julia library for functional testing, which lets you write
the test suite in the narrative form.  It permits you to describe the behavior
of software components in the Markdown format, and then extract, execute, and
validate any embedded test code.*

[![Linux/OSX Build Status][travis-img]][travis-url]
[![Windows Build Status][appveyor-img]][appveyor-url]
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
dependency](https://docs.julialang.org/en/v1/stdlib/Pkg/index.html#Test-specific-dependencies-1).
Then create the following `test/runtests.jl`:

```julia
using NarrativeTest
runtests()
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


## Support

For more information, see the [**Documentation**][doc-dev-url].

If you encounter any problems, please submit a [bug report][issues-url].


## Copyright

Copyright (c) 2017: Prometheus Research, LLC.

The NarrativeTest package is licensed under the [MIT License][license-url].


[travis-img]: https://travis-ci.org/rbt-lang/NarrativeTest.jl.svg?branch=master
[travis-url]: https://travis-ci.org/rbt-lang/NarrativeTest.jl
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/rbt-lang/NarrativeTest.jl?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/rbt-lang/narrativetest-jl/branch/master
[codecov-img]: https://codecov.io/gh/rbt-lang/NarrativeTest.jl/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/rbt-lang/NarrativeTest.jl
[issues-img]: https://img.shields.io/github/issues/rbt-lang/NarrativeTest.jl.svg
[issues-url]: https://github.com/rbt-lang/NarrativeTest.jl/issues
[doc-dev-img]: https://img.shields.io/badge/doc-dev-blue.svg
[doc-dev-url]: https://rbt-lang.github.io/NarrativeTest.jl/dev/
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/rbt-lang/NarrativeTest.jl/master/LICENSE.md
