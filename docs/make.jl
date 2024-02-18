#!/usr/bin/env julia

using Documenter
using NarrativeTest

# Highlight indented code blocks as Julia code.
using Documenter: Expanders, Selectors, MarkdownAST, iscode
abstract type DefaultLanguage <: Expanders.ExpanderPipeline end
Selectors.order(::Type{DefaultLanguage}) = 99.0
Selectors.matcher(::Type{DefaultLanguage}, node, page, doc) =
    iscode(node, "")
Selectors.runner(::Type{DefaultLanguage}, node, page, doc) =
    node.element = MarkdownAST.CodeBlock("julia", node.element.code)

makedocs(
    sitename = "NarrativeTest.jl",
    format = Documenter.HTML(prettyurls=(get(ENV, "CI", nothing) == "true")),
    pages = [
        "Home" => "index.md",
        "guide.md",
        "reference.md",
        "test.md",
    ],
    modules = [NarrativeTest],
    doctest = false,
    repo = Remotes.GitHub("MechanicalRabbit", "NarrativeTest.jl"),
)

deploydocs(
    repo = "github.com/MechanicalRabbit/NarrativeTest.jl.git",
)
