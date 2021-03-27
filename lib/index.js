import {core} from './core.js'
import {formatSmart} from './util/format-smart.js'
import {formatBasic} from './util/format-basic.js'

// Encode special characters in `value`.
export function stringifyEntities(value, options) {
  return core(value, Object.assign({format: formatSmart}, options))
}

// Encode special characters in `value` as hexadecimals.
export function stringifyEntitiesLight(value, options) {
  return core(value, Object.assign({format: formatBasic}, options))
}
