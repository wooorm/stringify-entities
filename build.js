/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module stringify-entities:script
 * @fileoverview Generate a list of entities which might
 *   conflict when used without semi-colon.
 *   For example, we can’t minify `&not;in;` to `&notin;`,
 *   as that would render another entity.
 */

'use strict';

/* eslint-env node */

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var legacy = Object.keys(require('character-entities-legacy'));
var entities = Object.keys(require('character-entities'));

/* Escape-codes. */
var conflict = [];

/* Generate the list. */
var length = legacy.length;
var count = entities.length;
var index = -1;
var offset;
var left;
var right;

/* Generate. */
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

/* Write. */
fs.writeFileSync(
  path.join('lib', 'dangerous.json'),
  JSON.stringify(conflict, null, 2) + '\n'
);
