import fs from 'fs/promises'

import { parseFieldPath } from './parseFieldPath'
import { parseData } from './parser'

function readPath(keys, data) {
  let value = data

  for (const key of keys) {
    let nextValue
    try {
      nextValue = value[key]
    } catch (err) {
      throw new Error(
        `unable to read key ${JSON.stringify(key)} on object ${JSON.stringify(value)}: ${err}`
      )
    }

    value = nextValue
  }

  return value
}

export async function execute(filePath, field, debug) {
  let keys

  try {
    keys = parseFieldPath(field)
    debug(`successfully parsed field into keys: ${JSON.stringify(keys)}`)
  } catch (err) {
    return {
      error: `unable to parse field ${JSON.stringify(field)}: ${err}`,
    }
  }

  let fileContent

  try {
    const buffer = await fs.readFile(filePath)
    debug(`successfully read file at ${JSON.stringify(filePath)} into a buffer`)

    fileContent = buffer.toString()
  } catch (err) {
    return {
      error: `unable to read file at ${JSON.stringify(filePath)} into a string: ${err}`,
    }
  }

  let data

  try {
    data = parseData(filePath, fileContent, debug)
  } catch (err) {
    return {
      error: `unable to parse data for ${JSON.stringify(filePath)}: ${err}`,
    }
  }

  debug(`successfully parsed data for ${JSON.stringify(filePath)}`)

  let output
  try {
    output = readPath(keys, data)
  } catch (err) {
    return { error: `unable to extract field from data: ${err}` }
  }

  return { output }
}
