#!/usr/bin/env julia

using NarrativeTest

# Handle filesystem paths under Windows.
subs = NarrativeTest.common_subs()
if Sys.iswindows()
    drive = splitdrive(pwd())[1]
    pushfirst!(subs, r"/…/" => SubstitutionString("$drive\\\\…\\\\"))
end

NarrativeTest.runtests(subs=subs)
