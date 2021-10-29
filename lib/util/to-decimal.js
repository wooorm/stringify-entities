/**
 * Transform `code` into a decimal character reference.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean|undefined} omit
 * @returns {string}
 */
export function toDecimal(code, next, omit) {
  const value = '&#' + String(code)
  return omit && next && !/\d/.test(String.fromCharCode(next))
    ? value
    : value + ';'
}
