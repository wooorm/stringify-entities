import {stringifyEntities} from './stringify-entities.js'
import {formatSmart} from './util/format-smart.js'

// Shortcut to escape special characters in HTML.
export function escape(value) {
  return stringifyEntities(value, {
    escapeOnly: true,
    useNamedReferences: true,
    format: formatSmart
  })
}
