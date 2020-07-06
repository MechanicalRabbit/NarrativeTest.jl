#!/usr/bin/env julia

using NarrativeTest

# Handle filesystem paths under Windows.
subs = NarrativeTest.common_subs()
if Sys.iswindows()
    pushfirst!(subs, r"/…/" => s"C:\\…\\\\")
end

runtests(subs=subs)
