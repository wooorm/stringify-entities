/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module stringify-entities
 * @fileoverview Encode HTML character references and character entities.
 */

'use strict';

/* eslint-env commonjs */

/* Dependencies. */
var entities = require('character-entities-html4');
var legacy = require('character-entities-legacy');
var dangerous = require('./lib/dangerous.json');
var EXPRESSION_NAMED = require('./lib/expression.js');

/* Methods. */
var has = {}.hasOwnProperty;

/* List of enforced escapes. */
var escapes = ['"', '\'', '<', '>', '&', '`'];

/* Map of characters to names. */
var characters = {};

(function () {
  var name;

  for (name in entities) {
    characters[entities[name]] = name;
  }
})();

/* Regular expressions. */
var EXPRESSION_ESCAPE = toExpression(escapes);
var EXPRESSION_SURROGATE_PAIR = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var EXPRESSION_BMP = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

/**
 * Get the first character in `char`.
 *
 * @param {string} char - Value.
 * @return {string} - First character.
 */
function charCode(char) {
  return char.charCodeAt(0);
}

/**
 * Check whether `char` is an alphanumeric.
 *
 * @param {string} char - Value.
 * @return {boolean} - Whether `char` is an
 *   alphanumeric.
 */
function isAlphanumeric(char) {
  var code = charCode(char);

  return (code >= 48 /* 0 */ && code <= 57 /* 9 */) ||
    (code >= 65 /* A */ && code <= 90 /* Z */) ||
    (code >= 97 /* a */ && code <= 122 /* z */);
}

/**
 * Check whether `char` is a hexadecimal.
 *
 * @param {string} char - Value.
 * @return {boolean} - Whether `char` is a
 *   hexadecimal.
 */
function isHexadecimal(char) {
  var code = charCode(char);

  return (code >= 48 /* 0 */ && code <= 57 /* 9 */) ||
    (code >= 65 /* A */ && code <= 70 /* F */) ||
    (code >= 97 /* a */ && code <= 102 /* f */);
}

/**
 * Transform `code` into a hexadecimal character reference.
 *
 * @param {number} code - Number to encode.
 * @param {boolean?} [omit] - Omit optional semi-colons.
 * @param {string?} [next] - Next character.
 * @return {string} - `code` encoded as hexadecimal.
 */
function toHexadecimalReference(code, omit, next) {
  var value = '&#x' + code.toString(16).toUpperCase();

  return omit && next && !isHexadecimal(next) ? value : value + ';';
}

/**
 * Transform `code` into an entity.
 *
 * @param {string} name - Name to wrap.
 * @param {boolean?} [attribute] - Stringify as attribute.
 * @param {boolean?} [omit] - Omit optional semi-colons.
 * @param {string?} [next] - Next character.
 * @return {string} - `name` encoded as hexadecimal.
 */
function toNamedEntity(name, attribute, omit, next) {
  var value = '&' + name;

  if (
    omit &&
    has.call(legacy, name) &&
    dangerous.indexOf(name) === -1 &&
    (
      !attribute ||
      (next && next !== '=' && !isAlphanumeric(next))
    )
  ) {
    return value;
  }

  return value + ';';
}

/**
 * Transform `code` into an entity.
 *
 * @param {string} char - Character to encode.
 * @param {boolean?} [attribute] - Stringify as attribute.
 * @param {boolean?} [omit] - Omit optional semi-colons.
 * @param {string?} [next] - Next character.
 * @return {string} - `name` encoded as hexadecimal.
 */
function characterToNamedEntity(char, omit) {
  return toNamedEntity(characters[char], omit);
}

/**
 * Create an expression for `characters`.
 *
 * @param {Array.<string>} characters - Characters.
 * @return {RegExp} - Expression.
 */
function toExpression(characters) {
  return new RegExp('[' + characters.join('') + ']', 'g');
}

/**
 * Encode special characters in `value`.
 *
 * @param {string} value - Value to encode.
 * @param {Object?} [options] - Configuration.
 * @param {boolean?} [options.escapeOnly=false]
 *   - Whether to only escape required characters.
 * @param {Array.<string>} [options.subset=[]]
 *   - Subset of characters to encode.
 * @param {boolean?} [options.useNamedReferences=false]
 *   - Whether to use entities where possible.
 * @param {boolean?} [options.omitOptionalSemicolons=false]
 *   - Whether to omit optional semi-colons.
 * @param {boolean?} [options.attribute=false]
 *   - Whether to stringifying and attribute.
 * @return {string} - Encoded `value`.
 */
function encode(value, options) {
  var settings = options || {};
  var escapeOnly = settings.escapeOnly;
  var named = settings.useNamedReferences;
  var omit = settings.omitOptionalSemicolons;
  var attribute = settings.attribute;
  var subset = settings.subset;
  var map = named ? characters : null;
  var set = subset ? toExpression(subset) : EXPRESSION_ESCAPE;

  value = value.replace(set, function (char, pos) {
    var next = value.charAt(pos + 1);

    return map && has.call(map, char) ?
      toNamedEntity(map[char], attribute, omit, next) :
      toHexadecimalReference(charCode(char), omit, next);
  });

  if (subset || escapeOnly) {
    return value;
  }

  if (named) {
    value = value.replace(EXPRESSION_NAMED, function (char, pos) {
      var next = value.charAt(pos + 1);
      return characterToNamedEntity(char, attribute, omit, next);
    });
  }

  return value
    .replace(EXPRESSION_SURROGATE_PAIR, function (pair, pos, val) {
      return toHexadecimalReference(
        ((pair.charCodeAt(0) - 0xD800) * 0x400) +
        pair.charCodeAt(1) - 0xDC00 + 0x10000,
        omit,
        val.charAt(pos + 1)
      );
    })
    .replace(EXPRESSION_BMP, function (char, pos, val) {
      var next = val.charAt(pos + 1);
      return toHexadecimalReference(charCode(char), omit, next);
    });
}

/**
 * Shortcut to escape special characters in HTML.
 *
 * @param {string} value - Value to encode.
 * @return {string} - Encoded `value`.
 */
function escape(value) {
  return encode(value, {
    escapeOnly: true,
    useNamedReferences: true
  });
}

encode.escape = escape;

/* Expose. */
module.exports = encode;
