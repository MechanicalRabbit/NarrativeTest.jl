
using Pkg
haskey(Pkg.installed(), "Coverage") || Pkg.add("Coverage")

Codecov.submit(Codecov.process_folder())
