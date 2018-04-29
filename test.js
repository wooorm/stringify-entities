'use strict'

var test = require('tape')
var stringify = require('.')

test('stringifyEntities.escape(value)', function(t) {
  t.equal(
    stringify.escape(
      '<img src=\'x\' onerror="prompt(1)">' +
        '<script>alert(1)</script>' +
        '<img src="x` `' +
        '<script>alert(1)</script>"` `>'
    ),
    '&lt;img src=&#x27;x&#x27; onerror=&quot;prompt(1)&quot;&gt;' +
      '&lt;script&gt;alert(1)&lt;/script&gt;' +
      '&lt;img src=&quot;x&#x60; &#x60;' +
      '&lt;script&gt;alert(1)&lt;/script&gt;&quot;&#x60; &#x60;&gt;',
    'XML/HTML-escape'
  )

  t.end()
})

test('stringifyEntities(value[, options])', function(t) {
  t.equal(
    stringify('foo\u00A9bar\uD834\uDF06baz\u2603qux'),
    'foo&#xA9;bar&#x1D306;baz&#x2603;qux',
    'Other non-ASCII symbols are represented through hexadecimal escapes'
  )

  t.equal(
    stringify('foo\u00A9bar\uD834\uDF06baz\u2603qux', {
      useNamedReferences: true
    }),
    'foo&copy;bar&#x1D306;baz&#x2603;qux',
    'Should use named entities if `useNamedReferences` and possible'
  )

  t.equal(
    stringify('alpha © bravo ≠ charlie 𝌆 delta', {
      useShortestReferences: true
    }),
    'alpha &#xA9; bravo &ne; charlie &#x1D306; delta',
    'Should use shortest entities if `useShortestReferences`'
  )

  t.equal(
    stringify('\'"<>&'),
    '&#x27;&#x22;&#x3C;&#x3E;&#x26;',
    'Encode `escape`’s characters without using named references'
  )

  t.equal(
    stringify('\'"<>&', {
      subset: ['&']
    }),
    '\'"<>&#x26;',
    'Encode support a `subset`'
  )

  t.equal(
    stringify('\'"<>&', {
      subset: ['&'],
      useNamedReferences: true
    }),
    '\'"<>&amp;',
    'Encode support a `subset` with `useNamedReferences`'
  )

  t.equal(
    stringify('&such', {
      omitOptionalSemicolons: true
    }),
    '&#x26such',
    'Omit semi-colons'
  )

  t.equal(
    stringify('&such', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&ampsuch',
    'Omit semi-colons (named)'
  )

  t.equal(
    stringify('&bada55', {
      omitOptionalSemicolons: true
    }),
    '&#x26;bada55',
    'Should not omit semi-colons, when numeric, and the next ' +
      'is hexadecimal'
  )

  t.equal(
    stringify('& such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp such',
    'Omit semi-colons (named in attribute)'
  )

  t.equal(
    stringify('&such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp;such',
    'Should not omit semi-colons when named in attribute and the ' +
      'next character is alphanumeric'
  )

  t.equal(
    stringify('&=such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp;=such',
    'Should not omit semi-colons when named in attribute and the ' +
      'next character is `=`'
  )

  t.equal(
    stringify('¬it;', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&not;it;',
    'Should not omit semi-colons when conflicting'
  )

  t.equal(
    stringify('&amp', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&ampamp',
    'Should omit semi-colons when named, not in an attribute, and ' +
      'the next character is alphanumeric'
  )

  t.equal(
    stringify('&=', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp=',
    'Should omit semi-colons when named, not in an attribute, and ' +
      'the next character is `=`'
  )

  t.equal(
    stringify('foo\uD800bar'),
    'foo&#xD800;bar',
    'Lone high surrogate (lowest)'
  )

  t.equal(
    stringify('foo\uDBFFbar'),
    'foo&#xDBFF;bar',
    'Lone high surrogate (highest)'
  )

  t.equal(
    stringify('\uD800bar'),
    '&#xD800;bar',
    'Lone high surrogate at the start of a string (lowest)'
  )

  t.equal(
    stringify('\uDBFFbar'),
    '&#xDBFF;bar',
    'Lone high surrogate at the start of a string (highest)'
  )

  t.equal(
    stringify('foo\uD800'),
    'foo&#xD800;',
    'Lone high surrogate at the end of a string (lowest)'
  )

  t.equal(
    stringify('foo\uDBFF'),
    'foo&#xDBFF;',
    'Lone high surrogate at the end of a string (highest)'
  )

  t.equal(
    stringify('foo\uDC00bar'),
    'foo&#xDC00;bar',
    'Lone low surrogate (lowest)'
  )

  t.equal(
    stringify('foo\uDFFFbar'),
    'foo&#xDFFF;bar',
    'Lone low surrogate (highest)'
  )

  t.equal(
    stringify('\uDC00bar'),
    '&#xDC00;bar',
    'Lone low surrogate at the start of a string (lowest)'
  )

  t.equal(
    stringify('\uDFFFbar'),
    '&#xDFFF;bar',
    'Lone low surrogate at the start of a string (highest)'
  )

  t.equal(
    stringify('foo\uDC00'),
    'foo&#xDC00;',
    'Lone low surrogate at the end of a string (lowest)'
  )

  t.equal(
    stringify(
      '\0\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\u000B\u000E\u000F\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\u001C\u001D\u001E\u001F\u007F\u0080\u0081\u0082\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008A\u008B\u008C\u008D\u008E\u008F\u0090\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009A\u009B\u009C\u009D\u009E\u009F\uFDD0\uFDD1\uFDD2\uFDD3\uFDD4\uFDD5\uFDD6\uFDD7\uFDD8\uFDD9\uFDDA\uFDDB\uFDDC\uFDDD\uFDDE\uFDDF\uFDE0\uFDE1\uFDE2\uFDE3\uFDE4\uFDE5\uFDE6\uFDE7\uFDE8\uFDE9\uFDEA\uFDEB\uFDEC\uFDED\uFDEE\uFDEF\uFFFE\uFFFF\uD83F\uDFFE\uD83F\uDFFF\uD87F\uDFFE\uD87F\uDFFF\uD8BF\uDFFE\uD8BF\uDFFF\uD8FF\uDFFE\uD8FF\uDFFF\uD93F\uDFFE\uD93F\uDFFF\uD97F\uDFFE\uD97F\uDFFF\uD9BF\uDFFE\uD9BF\uDFFF\uD9FF\uDFFE\uD9FF\uDFFF\uDA3F\uDFFE\uDA3F\uDFFF\uDA7F\uDFFE\uDA7F\uDFFF\uDABF\uDFFE\uDABF\uDFFF\uDAFF\uDFFE\uDAFF\uDFFF\uDB3F\uDFFE\uDB3F\uDFFF\uDB7F\uDFFE\uDB7F\uDFFF\uDBBF\uDFFE\uDBBF\uDFFF\uDBFF\uDFFE\uDBFF\uDFFF'
    ),
    '\0&#x1;&#x2;&#x3;&#x4;&#x5;&#x6;&#x7;&#x8;&#xB;&#xE;&#xF;&#x10;&#x11;&#x12;&#x13;&#x14;&#x15;&#x16;&#x17;&#x18;&#x19;&#x1A;&#x1B;&#x1C;&#x1D;&#x1E;&#x1F;&#x7F;\u0080&#x81;\u0082\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008A\u008B\u008C&#x8D;\u008E&#x8F;&#x90;\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009A\u009B\u009C&#x9D;\u009E\u009F&#xFDD0;&#xFDD1;&#xFDD2;&#xFDD3;&#xFDD4;&#xFDD5;&#xFDD6;&#xFDD7;&#xFDD8;&#xFDD9;&#xFDDA;&#xFDDB;&#xFDDC;&#xFDDD;&#xFDDE;&#xFDDF;&#xFDE0;&#xFDE1;&#xFDE2;&#xFDE3;&#xFDE4;&#xFDE5;&#xFDE6;&#xFDE7;&#xFDE8;&#xFDE9;&#xFDEA;&#xFDEB;&#xFDEC;&#xFDED;&#xFDEE;&#xFDEF;&#xFFFE;&#xFFFF;&#x1FFFE;&#x1FFFF;&#x2FFFE;&#x2FFFF;&#x3FFFE;&#x3FFFF;&#x4FFFE;&#x4FFFF;&#x5FFFE;&#x5FFFF;&#x6FFFE;&#x6FFFF;&#x7FFFE;&#x7FFFF;&#x8FFFE;&#x8FFFF;&#x9FFFE;&#x9FFFF;&#xAFFFE;&#xAFFFF;&#xBFFFE;&#xBFFFF;&#xCFFFE;&#xCFFFF;&#xDFFFE;&#xDFFFF;&#xEFFFE;&#xEFFFF;&#xFFFFE;&#xFFFFF;&#x10FFFE;&#x10FFFF;',
    'Encodes disallowed code points in input, except those whose character references would refer to another code point'
  )

  t.equal(
    stringify('\0\u0089'),
    '\0\u0089',
    'Does not encode invalid code points whose character references would refer to another code point'
  )

  t.end()
})
