import { describe, expect, test } from 'vitest'

import { parseFieldPath } from '../parseFieldPath'

const TEST_CASES = [
  ['abc', ['abc']],
  ['', []],
  ['a.b.c', ['a', 'b', 'c']],
  ['a[0]', ['a', 0]],
  ['a[1]', ['a', 1]],
  ['a[123456]', ['a', 123456]],

  ['a\\.b', ['a.b']],
  ['a\\[0]', ['a[0]']],
  ['a\\.b\\.c', ['a.b.c']],
  ['\\[0]', ['[0]']],
  ['a\\\\b', ['a\\b']],
  ['a\\\\\\.b', ['a\\.b']],
]

TEST_CASES.forEach(([fieldValue, expectValue]) => {
  test(`parses '${fieldValue}'`, () => {
    expect(parseFieldPath(fieldValue)).toEqual(expectValue)
  })
})

describe('failures', () => {
  test('throws an error if missing a closing bracket', () => {
    expect(() => parseFieldPath('a[')).toThrowErrorMatchingInlineSnapshot(
      `[Error: Missing closing bracket at 2]`
    )
  })

  test('throws an error if a numeric index is empty', () => {
    expect(() => parseFieldPath('a[]')).toThrowErrorMatchingInlineSnapshot(
      `[Error: Empty numerical index at 2]`
    )
  })

  test('throws an error if a numeric index is invalid', () => {
    expect(() => parseFieldPath('a[abc]')).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid numerical index at 2 ("abc"): parsed NaN]`
    )
  })

  test('throws an error if a numeric index is NaN', () => {
    expect(() => parseFieldPath('a[NaN]')).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid numerical index at 2 ("NaN"): parsed NaN]`
    )
  })
})
