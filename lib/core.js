/**
 * @typedef CoreOptions
 * @property {Array<string>} [subset=[]]
 *   Whether to only escape the given subset of characters.
 * @property {boolean} [escapeOnly=false]
 *   Whether to only escape possibly dangerous characters.
 *   Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``.
 *
 * @typedef FormatOptions
 * @property {(code: number, next: number, options: CoreWithFormatOptions) => string} format
 *   Format strategy.
 *
 * @typedef {CoreOptions & FormatOptions & import('./util/format-smart.js').FormatSmartOptions} CoreWithFormatOptions
 */

const defaultSubsetRegex = /["&'<>`]/g
const surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
// eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
const controlCharactersRegex = /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
const regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g

/** @type {WeakMap<string[], RegExp>} */
const subsetToRegexCache = new WeakMap()

/**
 * Encode certain characters in `value`.
 *
 * @param {string} value
 * @param {CoreWithFormatOptions} options
 * @returns {string}
 */
export function core(value, options) {
  value = value.replace(
    options.subset
      ? charactersToExpression(options.subset)
      : defaultSubsetRegex,
    basic
  )

  if (options.subset || options.escapeOnly) {
    return value
  }

  return (
    value
      // Surrogate pairs.
      .replace(surrogatePairsRegex, surrogate)
      // BMP control characters (C0 except for LF, CR, SP; DEL; and some more
      // non-ASCII ones).
      .replace(controlCharactersRegex, basic)
  )

  /**
   * @param {string} pair
   * @param {number} index
   * @param {string} all
   */
  function surrogate(pair, index, all) {
    return options.format(
      (pair.charCodeAt(0) - 0xd800) * 0x400 +
        pair.charCodeAt(1) -
        0xdc00 +
        0x10000,
      all.charCodeAt(index + 2),
      options
    )
  }

  /**
   * @param {string} character
   * @param {number} index
   * @param {string} all
   */
  function basic(character, index, all) {
    return options.format(
      character.charCodeAt(0),
      all.charCodeAt(index + 1),
      options
    )
  }
}

/**
 * @param {Array<string>} subset
 * @returns {RegExp}
 */
function charactersToExpression(subset) {
  const cached = subsetToRegexCache.get(subset)
  if (cached) return cached

  /** @type {Array<string>} */
  const groups = []
  let index = -1

  while (++index < subset.length) {
    groups.push(subset[index].replace(regexEscapeRegex, '\\$&'))
  }

  const regex = new RegExp('(?:' + groups.join('|') + ')', 'g')
  subsetToRegexCache.set(subset, regex)
  return regex
}
