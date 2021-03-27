// Transform `code` into a hexadecimal character reference.
export function toHexadecimal(code, next, omit) {
  var value = '&#x' + code.toString(16).toUpperCase()
  return omit && next && !/[\dA-Fa-f]/.test(String.fromCharCode(next))
    ? value
    : value + ';'
}
