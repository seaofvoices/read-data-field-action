import { parse as parseToml } from 'smol-toml'
import JSON5 from 'json5'
import { parse as parseYaml } from 'yaml'
import { parse as parseJsonc } from 'comment-json'

const PARSERS = [
  ['json', (data) => JSON.parse(data)],
  ['json5', (data) => JSON5.parse(data)],
  ['jsonc', (data) => parseJsonc(data)],
  ['toml', (data) => parseToml(data)],
  ['yaml', (data) => parseYaml(data)],
]
const PARSER_MAP = Object.fromEntries(PARSERS)

const GUESS_PARSERS = [
  ['.json', ['json', 'jsonc', 'json5']],
  ['.json5', ['json5']],
  ['.toml', ['toml']],
  ['.yml', ['yaml']],
  ['.yaml', ['yaml']],
]

export function parseData(filePath, content, debug) {
  const triedParsers = new Set()
  const firstParsers = GUESS_PARSERS.find(([name]) => filePath.endsWith(name))

  const errors = []

  if (firstParsers) {
    for (const parserName of firstParsers[1]) {
      triedParsers.add(parserName)

      const parseFn = PARSER_MAP[parserName]

      try {
        debug(`attempting to parse content with ${parserName} parser...`)
        return parseFn(content)
      } catch (err) {
        debug(`failed to parse content with ${parserName}: ${err}`)
        errors.push([parserName, err])
      }
    }
  }

  for (const [name, parseFn] of PARSERS) {
    if (!triedParsers.has(name)) {
      try {
        debug(`attempting to parse content with ${name} parser...`)
        return parseFn(content)
      } catch (err) {
        debug(`failed to parse content with ${name}: ${err}`)
        errors.push([name, err])
      }
    }
  }

  throw new Error(
    'no parser were able read the content:\n' +
      errors
        .map(([name, err]) => ` |> ${name} failed with: ${err}`)
        .join('\n\n')
  )
}
