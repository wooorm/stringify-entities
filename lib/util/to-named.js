import {characterEntitiesLegacy} from 'character-entities-legacy'
import {characters} from '../constant/characters.js'
import {dangerous} from '../constant/dangerous.js'

const own = {}.hasOwnProperty

/**
 * Transform `code` into a named character reference.
 *
 * @param {number} code
 * @param {number} next
 * @param {boolean} omit
 * @param {boolean} attribute
 * @returns {string}
 */
export function toNamed(code, next, omit, attribute) {
  const character = String.fromCharCode(code)
  /** @type {string} */
  let name
  /** @type {string} */
  let value

  if (own.call(characters, character)) {
    name = characters[character]
    value = '&' + name

    if (
      omit &&
      own.call(characterEntitiesLegacy, name) &&
      !dangerous.includes(name) &&
      (!attribute ||
        (next &&
          next !== 61 /* `=` */ &&
          /[^\da-z]/i.test(String.fromCharCode(next))))
    ) {
      return value
    }

    return value + ';'
  }

  return ''
}
