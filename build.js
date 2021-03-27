import fs from 'fs'
import path from 'path'
import {characterEntitiesLegacy} from 'character-entities-legacy'
import {characterEntities} from 'character-entities'

var legacy = Object.keys(characterEntitiesLegacy)
var entities = Object.keys(characterEntities)

var conflict = []
var length = legacy.length
var count = entities.length
var index = -1
var offset
var left
var right

while (++index < length) {
  left = legacy[index]
  offset = -1

  while (++offset < count) {
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
