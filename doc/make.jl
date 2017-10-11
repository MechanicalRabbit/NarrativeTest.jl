#!/usr/bin/env julia

if Pkg.installed("Documenter") == nothing
    Pkg.add("Documenter")
end

using Documenter
using NarrativeTest

# Highlight indented code blocks as Julia code.
Base.Markdown.Code(code) = Base.Markdown.Code("julia", code)

makedocs(
    format = :html,
    sitename = "NarrativeTest.jl",
    modules = [NarrativeTest])

deploydocs(
    repo = "github.com/xitology/NarrativeTest.jl.git",
    julia = "0.6",
    osname = "linux",
    target = "build",
    deps = nothing,
    make = nothing)
