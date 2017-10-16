# NarrativeTest.jl Documentation

NarrativeTest is a Julia library for functional testing, which lets you write
the test suite in the narrative form.  It permits you to describe the behavior
of software components in the Markdown format, and then extract, execute, and
validate any embedded test code.

NarrativeTest can be compared to the
[Doctest](https://docs.python.org/3/library/doctest.html) module (see also
[Documenter.jl](https://juliadocs.github.io/Documenter.jl/stable/man/doctests/)).
It differs from Doctest in its approach to syntax: instead of presenting the
test suite as a part of an interactive session, NarrativeTest uses plain code
blocks with expected output in comments.  It also focuses less on docstrings
and documentation examples, and more on validating the ergonomics of API with
"literate testing".


## Contents

```@contents
Pages = [
    "guide.md",
    "reference.md",
    "test.md",
]
```


## Index

```@index
```
