import fs from 'node:fs'
import path from 'node:path'
import {characterEntitiesLegacy} from 'character-entities-legacy'
import {characterEntities} from 'character-entities'

const entities = Object.keys(characterEntities)

/** @type {Array<string>} */
const conflict = []
let index = -1

while (++index < characterEntitiesLegacy.length) {
  const left = characterEntitiesLegacy[index]
  let offset = -1

  while (++offset < entities.length) {
    const right = entities[offset]

    if (left !== right && right.slice(0, left.length) === left) {
      conflict.push(left)
      break
    }
  }
}

fs.writeFileSync(
  path.join('lib', 'constant', 'dangerous.js'),
  [
    '/**',
    ' * List of legacy (that don’t need a trailing `;`) named references which could,',
    ' * depending on what follows them, turn into a different meaning',
    ' *',
    ' * @type {Array<string>}',
    ' */',
    'export const dangerous = ' + JSON.stringify(conflict, null, 2),
    ''
  ].join('\n')
)
