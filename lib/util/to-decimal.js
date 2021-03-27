// Transform `code` into a decimal character reference.
export function toDecimal(code, next, omit) {
  var value = '&#' + String(code)
  return omit && next && !/\d/.test(String.fromCharCode(next))
    ? value
    : value + ';'
}
