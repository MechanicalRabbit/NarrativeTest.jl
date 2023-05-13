#!/usr/bin/env julia

using NarrativeTest

# Workaround for https://github.com/JuliaLang/julia/pull/43787.
if VERSION < v"1.8-"
    function Base.Multimedia.display(d::TextDisplay, M::MIME"text/plain", @nospecialize x)
        show(d.io, M, x)
        println(d.io)
    end
end

# Handle filesystem paths under Windows.
subs = NarrativeTest.common_subs()
if Sys.iswindows()
    drive = splitdrive(pwd())[1]
    pushfirst!(subs, r" /?…/" => SubstitutionString(" $drive\\\\…\\\\"))
end

NarrativeTest.runtests(subs=subs)
