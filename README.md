# NarrativeTest

*A test framework for Julia in which a test suite is given as a Markdown file
that combines the narrative with the test code and expected output.*

[![Linux/OSX Build Status][travis-img]][travis-url]
[![Windows Build Status][appveyor-img]][appveyor-url]
[![Code Coverage Status][codecov-img]][codecov-url]
[![Latest Documentation][doc-latest-img]][doc-latest-url]
[![Open Issues][issues-img]][issues-url]
[![MIT License][license-img]][license-url]


## Quick Start

This package is not (yet) officially registered with the Julia package manager,
but you can install it from the GitHub repository with `Pkg.clone()`.

```julia
julia> Pkg.clone("https://github.com/xitology/NarrativeTest.jl")
```

To use NarrativeTest with your package, add the file `test/runtests.jl`:

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

Place your test suite as a Markdown file to the `test` directory.  Use code
blocks for test code, comments `#-> …` and `#=> … =#` for expected output.  For
example, add a file `test/test_sample.md` with the following content:

```markdown
# Sample test suite

Verify that an expression evaluates to the expected value:

    (3+4)*6         #-> 42

Check if some code produces the expected output:

    print("Hello ")
    print("World!")
    #-> Hello World!

Use ellipsis to match an arbitrary sequence of characters:

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

```julia
julia> Pkg.test("YourPackage")
```

You can also run:

```console
$ julia ./test/runtests.jl
```


## Support

For more information, see the [**Usage Guide**][doc-latest-url].

If you encounter any problems, please submit a [bug report][issues-url].


## Copyright

Copyright (c) 2017: Kyrylo Simonov.

The NarrativeTest package is licensed under the [MIT License][license-url].


[travis-img]: https://travis-ci.org/xitology/NarrativeTest.jl.svg?branch=master
[travis-url]: https://travis-ci.org/xitology/NarrativeTest.jl
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/xitology/NarrativeTest.jl?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/xitology/narrativetest-jl/branch/master
[codecov-img]: https://codecov.io/gh/xitology/NarrativeTest.jl/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/xitology/NarrativeTest.jl
[doc-latest-img]: https://img.shields.io/badge/doc-latest-blue.svg
[doc-latest-url]: https://xitology.github.io/NarrativeTest.jl/latest/
[issues-img]: https://img.shields.io/github/issues/xitology/NarrativeTest.jl.svg
[issues-url]: https://github.com/xitology/NarrativeTest.jl/issues
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/xitology/NarrativeTest.jl/master/LICENSE.md
