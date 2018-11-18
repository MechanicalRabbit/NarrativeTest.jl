#!/usr/bin/env julia

using Pkg
haskey(Pkg.installed(), "Documenter") || Pkg.add("Documenter")

using Documenter
using NarrativeTest

# Highlight indented code blocks as Julia code.
using Markdown
Markdown.Code(code) = Markdown.Code("julia", code)

makedocs(
    sitename = "NarrativeTest.jl",
    pages = [
        "Home" => "index.md",
        "guide.md",
        "reference.md",
        "test.md",
    ],
    modules = [NarrativeTest])

deploydocs(
    repo = "github.com/rbt-lang/NarrativeTest.jl.git",
)
