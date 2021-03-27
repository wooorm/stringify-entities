import {stringifyEntities} from './stringify-entities.js'
import {formatSmart} from './util/format-smart.js'

// Encode special characters in `value`.
export function encode(value, options) {
  return stringifyEntities(
    value,
    Object.assign({}, options, {format: formatSmart})
  )
}
