import {stringifyEntities} from './stringify-entities.js'
import {formatBasic} from './util/format-basic.js'

// Encode special characters in `value` as hexadecimals.
export function encodeHexadecimal(value, options) {
  return stringifyEntities(value, Object.assign({format: formatBasic}, options))
}
