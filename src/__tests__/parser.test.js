import { describe, expect, test, beforeEach } from 'vitest'

import { parseData } from '../parser'

let debugFn
let debugOutput

beforeEach(() => {
  debugOutput = ''
  debugFn = (line) => {
    debugOutput += line + '\n'
  }
})

describe('JSON files', () => {
  test('parses basic JSON object', () => {
    const content = '{"name": "test", "value": 123}'
    const result = parseData('config.json', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses JSON array', () => {
    const content = '[1, 2, 3, "test"]'
    const result = parseData('data.json', content, debugFn)
    expect(result).toEqual([1, 2, 3, 'test'])
  })

  test('parses nested JSON structure', () => {
    const content =
      '{"user": {"name": "John", "age": 30}, "settings": {"theme": "dark"}}'
    const result = parseData('user.json', content, debugFn)
    expect(result).toEqual({
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' },
    })
  })

  test('parses JSON with various data types', () => {
    const content =
      '{"string": "hello", "number": 42, "boolean": true, "null": null, "array": [1, 2], "object": {"key": "value"}}'
    const result = parseData('types.json', content, debugFn)
    expect(result).toEqual({
      string: 'hello',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 2],
      object: { key: 'value' },
    })
  })
})

describe('JSON5 files', () => {
  test('parses JSON5 with comments', () => {
    const content = `{
        // This is a comment
        name: "test", // inline comment
        value: 123
      }`
    const result = parseData('config.json5', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses JSON5 with trailing commas', () => {
    const content = `{
        "name": "test",
        "value": 123,
      }`
    const result = parseData('data.json5', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses JSON5 with unquoted keys', () => {
    const content = `{
        name: "test",
        value: 123,
        nested: {
          key: "value"
        }
      }`
    const result = parseData('config.json5', content, debugFn)
    expect(result).toEqual({
      name: 'test',
      value: 123,
      nested: { key: 'value' },
    })
  })

  test('parses JSON5 with single quotes', () => {
    const content = `{
        'name': 'test',
        'value': 123
      }`
    const result = parseData('data.json5', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })
})

describe('JSONC files', () => {
  test('parses JSONC with comments', () => {
    const content = `{
        // This is a comment
        "name": "test", // inline comment
        "value": 123
      }`
    const result = parseData('config.jsonc', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses JSONC with block comments', () => {
    const content = `{
        /* This is a block comment */
        "name": "test",
        /* Another block comment */
        "value": 123
      }`
    const result = parseData('data.jsonc', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses JSONC with trailing commas', () => {
    const content = `{
        "name": "test",
        "value": 123,
      }`
    const result = parseData('config.jsonc', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses JSONC with mixed comment styles', () => {
    const content = `{
        // Line comment
        "name": "test",
        /* Block comment */
        "value": 123, // Trailing comment
      }`
    const result = parseData('data.jsonc', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })
})

describe('TOML files', () => {
  test('parses basic TOML structure', () => {
    const content = `name = "test"
value = 123`
    const result = parseData('config.toml', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses TOML with nested tables', () => {
    const content = `[user]
name = "John"
age = 30

[settings]
theme = "dark"`
    const result = parseData('config.toml', content, debugFn)
    expect(result).toEqual({
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' },
    })
  })

  test('parses TOML with arrays', () => {
    const content = `colors = ["red", "green", "blue"]
numbers = [1, 2, 3]`
    const result = parseData('data.toml', content, debugFn)
    expect(result).toEqual({
      colors: ['red', 'green', 'blue'],
      numbers: [1, 2, 3],
    })
  })

  test('parses TOML with various data types', () => {
    const content = `string = "hello"
number = 42
boolean = true
date = 1979-05-27T07:32:00Z`
    const result = parseData('types.toml', content, debugFn)
    expect(result).toEqual({
      string: 'hello',
      number: 42,
      boolean: true,
      date: expect.any(Date), // TOML parser returns a TomlDate object
    })
    expect(result.date).toBeDefined()
  })

  test('parses TOML with inline tables', () => {
    const content = `user = { name = "John", age = 30 }
settings = { theme = "dark", notifications = true }`
    const result = parseData('config.toml', content, debugFn)
    expect(result).toEqual({
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark', notifications: true },
    })
  })
})

describe('YAML files', () => {
  test('parses basic YAML structure', () => {
    const content = `name: test
value: 123`
    const result = parseData('config.yml', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('parses YAML with nested objects', () => {
    const content = `user:
  name: John
  age: 30
settings:
  theme: dark`
    const result = parseData('config.yml', content, debugFn)
    expect(result).toEqual({
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' },
    })
  })

  test('parses YAML with arrays', () => {
    const content = `colors:
  - red
  - green
  - blue
numbers: [1, 2, 3]`
    const result = parseData('data.yml', content, debugFn)
    expect(result).toEqual({
      colors: ['red', 'green', 'blue'],
      numbers: [1, 2, 3],
    })
  })

  test('parses YAML with various data types', () => {
    const content = `string: hello
number: 42
boolean: true
null_value: null
date: 2023-01-01`
    const result = parseData('types.yml', content, debugFn)
    expect(result).toEqual({
      string: 'hello',
      number: 42,
      boolean: true,
      null_value: null,
      date: '2023-01-01',
    })
  })

  test('parses YAML with anchors and aliases', () => {
    const content = `defaults: &defaults
  theme: dark
  notifications: true

user_settings:
  <<: *defaults
  name: John`
    const result = parseData('config.yml', content, debugFn)
    expect(result).toEqual({
      defaults: { theme: 'dark', notifications: true },
      user_settings: {
        '<<': { theme: 'dark', notifications: true },
        name: 'John',
      },
    })
  })

  test('parses YAML with .yaml extension', () => {
    const content = `name: test
value: 123`
    const result = parseData('config.yaml', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })
})

describe('fallback parsing', () => {
  test('falls back to JSON when file extension is not recognized', () => {
    const content = '{"name": "test", "value": 123}'
    const result = parseData('config.unknown', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('falls back to JSON5 when JSON fails', () => {
    const content = `{
        name: "test", // comment
        value: 123
      }`
    const result = parseData('config.unknown', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('falls back to TOML when JSON and JSON5 fail', () => {
    const content = `name = "test"
value = 123`
    const result = parseData('config.unknown', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  test('falls back to YAML when other parsers fail', () => {
    const content = `name: test
value: 123`
    const result = parseData('config.unknown', content, debugFn)
    expect(result).toEqual({ name: 'test', value: 123 })
  })
})

const INVALID_COTENT = `
runs:
    using: 'node24'
  main: 'dist/index.js'
  `

test('errors when no parser can read the content', () => {
  expect(() => parseData('config.unknown', INVALID_COTENT, debugFn))
    .toThrowErrorMatchingInlineSnapshot(`
      [Error: no parser were able read the content:
       |> json failed with: SyntaxError: Unexpected token 'r', "
      runs:
          "... is not valid JSON

       |> json5 failed with: SyntaxError: JSON5: invalid character 'r' at 2:1

       |> jsonc failed with: SyntaxError: Unexpected token r

       |> toml failed with: Error: Invalid TOML document: incomplete key-value: cannot find end of key

      2:  runs:
          ^
      3:      using: 'node24'


       |> yaml failed with: YAMLParseError: All mapping items must start at the same column at line 4, column 1:

          using: 'node24'
        main: 'dist/index.js'
      ^
      ]
    `)
})

test('generates debug output when no parser can read the content', () => {
  expect(() => parseData('config.unknown', INVALID_COTENT, debugFn)).toThrow()

  expect(debugOutput).toMatchInlineSnapshot(`
    "attempting to parse content with json parser...
    failed to parse content with json: SyntaxError: Unexpected token 'r', "
    runs:
        "... is not valid JSON
    attempting to parse content with json5 parser...
    failed to parse content with json5: SyntaxError: JSON5: invalid character 'r' at 2:1
    attempting to parse content with jsonc parser...
    failed to parse content with jsonc: SyntaxError: Unexpected token r
    attempting to parse content with toml parser...
    failed to parse content with toml: Error: Invalid TOML document: incomplete key-value: cannot find end of key

    2:  runs:
        ^
    3:      using: 'node24'

    attempting to parse content with yaml parser...
    failed to parse content with yaml: YAMLParseError: All mapping items must start at the same column at line 4, column 1:

        using: 'node24'
      main: 'dist/index.js'
    ^

    "
  `)
})
