import { isDate, isPlainObject, extend, deepMerge } from '../../src/helpers/utils'

describe('helpers:util', () => {
  describe('isXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }
      extend(a, b)
      expect(a.foo).toBe(123)
    })

    test('should extend properties', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)
      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }
      const d = deepMerge(a, b, c)

      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })

    test('should deepMerge properties', () => {
      const a = { foo: 123 }
      const b = { bar: 456 }
      const c = { foo: 789 }
      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })
  })
})
