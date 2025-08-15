import { isEscaped, removeEscapes } from './escaped'

function findNextKey(str, index, delimiters) {
  const positions = delimiters.map((c) => [c, str.indexOf(c, index)])

  let result = positions.reduce((acc, [c, index]) => {
    if (index === -1) {
      return acc
    }

    if (isEscaped(str, index)) {
      return acc
    }

    if (acc === null) {
      return [c, index]
    } else {
      const [, currentIndex] = acc

      if (currentIndex < index) {
        return acc
      } else {
        return [c, index]
      }
    }
  }, null)

  if (result === null) {
    return str.length
  }

  const [, indexFound] = result

  return indexFound
}

const ESCAPED_CHARS = ['.', '[', '\\']

export function parseFieldPath(fieldPath) {
  let length = fieldPath.length

  if (length === 0) {
    return []
  }
  let index = 0

  if (fieldPath[0] === '.') {
    index = 1
  }

  const chunks = []

  while (index < length) {
    if (fieldPath[index] === '[') {
      const closingBracketIndex = fieldPath.indexOf(']', index)

      if (closingBracketIndex === -1) {
        throw new Error(`Missing closing bracket at ${index + 1}`)
      }

      const indexChunk = fieldPath.slice(index + 1, closingBracketIndex)

      if (indexChunk.length === 0) {
        throw new Error(`Empty numerical index at ${index + 1}`)
      }

      let indexNumber

      try {
        indexNumber = parseInt(indexChunk)
      } catch (err) {
        throw new Error(
          `Invalid numerical index at ${index + 1} (${JSON.stringify(indexChunk)}): ${err}`
        )
      }

      if (Number.isNaN(indexNumber)) {
        throw new Error(
          `Invalid numerical index at ${index + 1} (${JSON.stringify(indexChunk)}): parsed NaN`
        )
      }

      chunks.push(indexNumber)

      index = closingBracketIndex + 1
    } else {
      const nextIndex = findNextKey(fieldPath, index, ['.', '['])

      const section = fieldPath.slice(index, nextIndex)
      const key = removeEscapes(section, ESCAPED_CHARS)

      try {
        chunks.push(key)
      } catch (err) {
        throw new Error(
          `Invalid key at ${index + 1}:${nextIndex} (${JSON.stringify(key)}): ${err}`
        )
      }

      if (fieldPath[nextIndex] === '.') {
        index = nextIndex + 1
      } else {
        index = nextIndex
      }
    }
  }

  return chunks
}
