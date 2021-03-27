'use strict'

var core = require('./core')
var smart = require('./util/format-smart')

module.exports = encode

// Encode special characters in `value`.
function encode(value, options) {
  // Note: Switch to `Object.assign` next major.
  return core(value, Object.assign({}, options, {format: smart}))
}
