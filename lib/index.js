/**
 * @import {LightOptions} from './core.js'
 * @import {FormatSmartOptions} from './util/format-smart.js'
 */



/**
 * @typedef {LightOptions & FormatSmartOptions} Options
 */

import {core} from './core.js'
import {formatSmart} from './util/format-smart.js'
import {formatBasic} from './util/format-basic.js'

/**
 * Encode special characters in `value`.
 *
 * @param {string} value
 *   Value to encode.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Encoded value.
 */
export function stringifyEntities(value, options) {
  return core(value, Object.assign({format: formatSmart}, options))
}

/**
 * Encode special characters in `value` as hexadecimals.
 *
 * @param {string} value
 *   Value to encode.
 * @param {LightOptions | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Encoded value.
 */
export function stringifyEntitiesLight(value, options) {
  return core(value, Object.assign({format: formatBasic}, options))
}
