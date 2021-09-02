# Release Notes


## v0.7.2

* Fixed the problem when `show` defined in a test case is not applied to
  display the output of this test case.  Thanks to vtjnash.


## v0.7.1

- Use relative paths in Test Summary.


## v0.7.0

- Compatibility with the standard `Test` library.


## v0.6.0

- Added `-h/--help`, `-q/--quiet` and `--` options.
- Support test files with CRLF line endings.


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
