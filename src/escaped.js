export function isEscaped(fieldPath, index) {
  let result = false

  while (index !== 0) {
    index -= 1
    if (fieldPath[index] === '\\') {
      result = !result
    } else {
      return result
    }
  }

  return result
}

function findNextChar(str, index, chars) {
  const indexes = chars.map((c) => str.indexOf(c, index))

  const result = indexes.reduce((acc, index) => {
    if (index === -1) {
      return acc
    }
    if (acc === null) {
      return index
    }
    if (index < acc) {
      return index
    }
    return acc
  }, null)

  return result
}

export function removeEscapes(str, chars) {
  if (typeof chars === 'string') {
    chars = chars.split('')
  }
  if (!chars) {
    chars = []
  }

  if (chars.length === 0) {
    return str
  }

  const removeIndexes = []

  let index = findNextChar(str, 0, chars)

  while (index != null && index < str.length) {
    if (isEscaped(str, index)) {
      removeIndexes.push(index - 1)
    }
    index = findNextChar(str, index + 1, chars)
  }

  if (removeIndexes.length === 0) {
    return str
  }

  removeIndexes.reverse()

  removeIndexes.forEach((i) => {
    str = str.slice(0, i) + str.slice(i + 1)
  })

  return str
}
