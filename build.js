'use strict';

var fs = require('fs');
var path = require('path');
var legacy = Object.keys(require('character-entities-legacy'));
var entities = Object.keys(require('character-entities'));

var conflict = [];
var length = legacy.length;
var count = entities.length;
var index = -1;
var offset;
var left;
var right;

while (++index < length) {
  left = legacy[index];
  offset = -1;

  while (++offset < count) {
    right = entities[offset];

    if (left !== right && right.slice(0, left.length) === left) {
      conflict.push(left);
      break;
    }
  }
}

fs.writeFileSync(path.join('dangerous.json'), JSON.stringify(conflict, null, 2) + '\n');
