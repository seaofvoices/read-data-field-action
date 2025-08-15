<div align="center">

[![checks](https://github.com/seaofvoices/read-data-field-action/actions/workflows/test.yml/badge.svg)](https://github.com/seaofvoices/read-data-field-action/actions/workflows/test.yml)
![version](https://img.shields.io/github/package-json/v/seaofvoices/read-data-field-action)
[![GitHub top language](https://img.shields.io/github/languages/top/seaofvoices/read-data-field-action)](https://github.com/luau-lang/luau)
![license](https://img.shields.io/github/license/seaofvoices/read-data-field-action)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/seaofvoices)

</div>

# Read Data Field Action

GitHub Action to extract content from data files. How it works:

- Provide a file path to some data (supports `JSON`, `JSON5`, `JSONC`, `YAML` and `TOML`)
- Provide a [field](#field-syntax) to index the data, like `version`, `author.name` or `keywords[0]`
- Read the output with `${{ steps.<step-id>.outputs.result }}`

Jump to:

- [inputs](#inputs)
- [field syntax](#field-syntax)
- [outputs](#outputs)
- [examples](#examples-1)

## Installation

Add this action to your workflow by referencing it in your `.github/workflows/*.yml` file:

```yaml
- uses: seaofvoices/read-data-field-action@v1
  id: <enter-an-id-to-refer-to>
  with:
    file: package.json
    field: version
```

## Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `file` | Path to the data file to read | Yes |
| `field` | Dot-separated field path to extract (e.g., `scripts.build`, `database.host`) | Yes |

### Field Syntax

The field input uses dot-notation syntax to traverse nested data structures. You can access object properties, array elements.

- use `.` to index by a property name
- use `[<integer>]` to index an array. Replace `<integer>` with a valid 0-based array index, e.g. `[0]` to index the first element.

#### Field Examples

Here are a few examples of field paths that can be used. Note that the examples are using JSON data, but these are valid for any supported data format.

| Field Path | Data | Result |
| - | - | - |
| `version` | `{"version": "1.0.0"}` | `"1.0.0"` |
| `author.name` | `{"author": {"name": "John"}}` | `"John"` |
| `scripts.build` | `{"scripts": {"build": "rollup"}}` | `"rollup"` |
| `keywords[0]` | `{"keywords": ["json", "parser"]}` | `"json"` |
| `keywords[1]` | `{"keywords": ["json", "parser"]}` | `"parser"` |
| `authors[0].name` | `{"authors": [{"name": "Alice"}, {"name": "Bob"}]}` | `"Alice"` |
| `config.servers[1].host` | `{"config": {"servers": [{"host": "dev"}, {"host": "prod"}]}}` | `"prod"` |

#### Escaping Special Characters

Escape special characters using backslashes `\`.

| character | usage | data example | field example | result |
| - | - | - | - | - |
| `.` | Index a property that contains a `.` | `{ "luau-lsp.platform.type": "roblox" }` | `luau-lsp\.platform\.type` | `roblox` |
| `\` | Index a property that contains a `\` | `{ "a\b": false }` | `a\\b` | `false` |
| `[` | Index a property that contains a `[` | `{ "[dev]": "localhost" }` | `\[dev]` | `localhost` |

## Outputs

The action produces 2 output values. Look at the [examples](#examples) to see how to read them.

| Output | Description |
|--------|-------------|
| `result` | The extracted data in its original type |
| `result_json` | The extracted data encoded as JSON string |

## Examples

### Extract version from package.json

```yaml
- name: Read package version
  id: package-info
  uses: seaofvoices/read-data-field-action@v1
  with:
    file: package.json
    field: version

- name: Use the version
  run: echo "Package version is ${{ steps.package-info.outputs.result }}"
```

### Extract nested configuration values

```yaml
- name: Read build script
  id: build-script
  uses: seaofvoices/read-data-field-action@v1
  with:
    file: package.json
    field: scripts.build

- name: Read nested YAML configuration
  id: config
  uses: seaofvoices/read-data-field-action@v1
  with:
    file: config.yaml
    field: database.host
```

### Working with TOML files

```yaml
- name: Read Cargo package name
  id: cargo-info
  uses: seaofvoices/read-data-field-action@v1
  with:
    file: Cargo.toml
    field: package.name
```

## Supported File Formats

The action supports multiple data formats and uses intelligent parsing:

- **JSON** (`.json`) - Standard JSON format
- **JSON5** (`.json5`) - JSON5 with comments and trailing commas
- **JSONC** (`.json`) - JSON with comments (falls back if standard JSON parsing fails)
- **YAML** (`.yml`, `.yaml`) - YAML format
- **TOML** (`.toml`) - TOML format

The parser automatically detects the format based on file extension and tries all available parsers.

## License

This project is available under the MIT license. See [LICENSE.txt](LICENSE.txt) for details.
