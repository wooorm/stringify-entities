import fs from 'node:fs'
import path from 'node:path'
import {characterEntitiesLegacy} from 'character-entities-legacy'
import {characterEntities} from 'character-entities'

const entities = Object.keys(characterEntities)

/** @type {string[]} */
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
  'export const dangerous = ' + JSON.stringify(conflict, null, 2) + '\n'
)
