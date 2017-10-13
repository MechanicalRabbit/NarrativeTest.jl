# NarrativeTest.jl

*NarrativeTest.jl is a Julia library for functional testing, which lets you
write the test suite in the narrative form.  It permits you to describe the
behavior of a software component in the Markdown format, and then extract,
execute and validate any embedded test code.*

[![Linux/OSX Build Status][travis-img]][travis-url]
[![Windows Build Status][appveyor-img]][appveyor-url]
[![Code Coverage Status][codecov-img]][codecov-url]
[![Open Issues][issues-img]][issues-url]
[![Latest Documentation][doc-latest-img]][doc-latest-url]
[![MIT License][license-img]][license-url]


## Quick Start

This package is not (yet) officially registered with the Julia package manager,
but you can install it from the GitHub repository with `Pkg.clone()`.

```julia
julia> Pkg.clone("https://github.com/rbt-lang/NarrativeTest.jl")
```

If you want to use NarrativeTest for testing your package, add
`test/runtests.jl`:

```julia
using NarrativeTest
runtests()
```

Once NarrativeTest is registered with the Julia package manager, you can
declare it as a dependency in `test/REQUIRE`:

```
NarrativeTest 0.1
```

You can write your test suite in Markdown and store it in the `test` directory.
Place your test code in Markdown code blocks, and use comments `#-> …` and
`#=> … =#` to indicate the expected output.  For example:

```markdown
# Sample test suite

Verify that this expression evaluates to the expected value:

    6(3+4)          #-> 42

Check if some code produces the expected output:

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

For more information, see the [**Documentation**][doc-latest-url].

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
[doc-latest-img]: https://img.shields.io/badge/doc-latest-blue.svg
[doc-latest-url]: https://rbt-lang.github.io/NarrativeTest.jl/latest/
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/rbt-lang/NarrativeTest.jl/master/LICENSE.md
