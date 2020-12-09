# Release Notes


## v0.6.1

- Support test files with CRLF line ending.


## v0.6.0

- Added `-h/--help`, `-q/--quiet` and `--` options.


## v0.5.0

- Now that `@__DIR__` is provided, do not `cd()` into the test directory.
- Added an option to run tests in the context of a specific module.
- Added an option to suppress any output except for error reports.
- Generate valid names for test modules.


## v0.4.1

- Fixed `@Pkg.Artifacts.artifact_str` not finding `Artifacts.toml`.


## v0.4.0

- Support for precondition syntax: `#? <expr>`.
- Make default arguments and substitutions customizable.


## v0.3.0

- Provide `include()` and `eval()` functions.


## v0.2.0

- When a directory name is passed as a parameter, test all `*.md` files in the
  directory.


## v0.1.1

- Fixed packaging issues.


## v0.1.0

- Initial release.
