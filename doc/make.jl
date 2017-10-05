using Documenter
using NarrativeTest

makedocs(
    modules = [NarrativeTest],
    doctest = true)

deploydocs(
    deps = Deps.pip("mkdocs", "python-markdown-math"),
    repo = "github.com/xitology/NarrativeTest.jl.git",
    julia = "0.6",
    osname = "linux")
