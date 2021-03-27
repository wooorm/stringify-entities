import fs from 'fs'
import path from 'path'
import {characterEntitiesLegacy} from 'character-entities-legacy'
import {characterEntities} from 'character-entities'

var legacy = Object.keys(characterEntitiesLegacy)
var entities = Object.keys(characterEntities)

/** @type {string[]} */
var conflict = []
var index = -1
/** @type {number} */
var offset
/** @type {string} */
var left
/** @type {string} */
var right

while (++index < legacy.length) {
  left = legacy[index]
  offset = -1

  while (++offset < entities.length) {
    right = entities[offset]

    if (left !== right && right.slice(0, left.length) === left) {
      conflict.push(left)
      break
    }
  }
}

fs.writeFileSync(
  path.join('lib', 'constant', 'dangerous.js'),
  'export var dangerous = ' + JSON.stringify(conflict, null, 2) + '\n'
)
