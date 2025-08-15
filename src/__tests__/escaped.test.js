import { describe, expect, test } from 'vitest'

import { isEscaped, removeEscapes } from '../escaped'

describe('isEscaped', () => {
  const NOT_ESCAPED_TEST_CASES = [
    ['abc', 0],
    ['abc', 1],
    ['abc', 2],
    ['\\\\abc', 2],
    ['a\\\\bc', 3],
    ['ab\\\\c', 4],
  ]

  const ESCAPED_TEST_CASES = [
    ['\\abc', 1],
    ['a\\bc', 2],
    ['ab\\c', 3],
  ]

  describe('escape cases', () => {
    ESCAPED_TEST_CASES.forEach(([value, index]) => {
      test(`considers '${value}' as escaped at index ${index}`, () => {
        expect(isEscaped(value, index)).toBe(true)
      })
    })
  })

  describe('not escape cases', () => {
    NOT_ESCAPED_TEST_CASES.forEach(([value, index]) => {
      test(`considers '${value}' as not escaped at index ${index}`, () => {
        expect(isEscaped(value, index)).toBe(false)
      })
    })
  })
})

describe('removeEscapes', () => {
  const TEST_CASES = [
    ['abc', 'abc'],
    ['\\', '\\'],
    ['\\[0]', '[0]'],
    ['a\\.b', 'a.b'],
    ['a\\[0]', 'a[0]'],
    ['a\\\\\\.b', 'a\\.b'],
  ]

  const CHARS = ['.', '[', '\\']

  TEST_CASES.forEach(([value, expectValue]) => {
    test(`removes escapes from '${value}'`, () => {
      expect(removeEscapes(value, CHARS)).toBe(expectValue)
    })
  })
})
