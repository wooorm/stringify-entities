import test from 'tape'
import {stringifyEntities, stringifyEntitiesLight} from './index.js'

test('stringifyEntities(value[, options])', function (t) {
  t.equal(
    stringifyEntities('foo\u00A9bar\uD834\uDF06baz\u2603qux'),
    'foo&#xA9;bar&#x1D306;baz&#x2603;qux',
    'should encode non-ASCII characters by default'
  )

  t.equal(
    stringifyEntities('foo\u00A9bar\uD834\uDF06baz\u2603qux', {
      useNamedReferences: true
    }),
    'foo&copy;bar&#x1D306;baz&#x2603;qux',
    'should encode w/ named character references if possible w/ `useNamedReferences`'
  )

  t.equal(
    stringifyEntities('alpha © bravo ≠ charlie 𝌆 delta " echo', {
      useShortestReferences: true
    }),
    'alpha &#xA9; bravo &ne; charlie &#x1D306; delta &#34; echo',
    'should encode w/ shortest character references if `useShortestReferences`'
  )

  t.equal(
    stringifyEntities('" "0 "a "z µ µ0 µa µz', {
      useShortestReferences: true,
      omitOptionalSemicolons: true
    }),
    '&#34 &#34;0 &#34a &#34z &#xB5 &#xB5;0 &#181a &#xB5z',
    'should encode w/ shortest numeric reference based on `next` w/ `omitOptionalSemicolons`'
  )

  t.equal(
    stringifyEntities('\'"<>&'),
    '&#x27;&#x22;&#x3C;&#x3E;&#x26;',
    'should encode dangerous characters as hexadecimal character references by default'
  )

  t.equal(
    stringifyEntities('\'"<>&', {subset: ['&']}),
    '\'"<>&#x26;',
    'should encode a `subset`'
  )

  t.equal(
    stringifyEntities('a[b]c', {subset: ['[', ']']}),
    'a&#x5B;b&#x5D;c',
    'should encode special regex characters in `subset`'
  )

  t.equal(
    stringifyEntities('\'"<>&', {subset: ['&'], useNamedReferences: true}),
    '\'"<>&amp;',
    'should encode a `subset` w/ `useNamedReferences`'
  )

  t.equal(
    stringifyEntities('&such', {omitOptionalSemicolons: true}),
    '&#x26such',
    'should omit semicolons w/ `omitOptionalSemicolons`'
  )

  t.equal(
    stringifyEntities('&such', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&ampsuch',
    'should omit semicolons w/ `omitOptionalSemicolons` and `useNamedReferences`'
  )

  t.equal(
    stringifyEntities('&bada55', {omitOptionalSemicolons: true}),
    '&#x26;bada55',
    'should not omit semicolons when numeric and the next is hexadecimal'
  )

  t.equal(
    stringifyEntities('& such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp such',
    'should omit semicolons (named in attribute)'
  )

  t.equal(
    stringifyEntities('&such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp;such',
    'should not omit semicolons when named in attribute and the next character is alphanumeric'
  )

  t.equal(
    stringifyEntities('&=such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp;=such',
    'should not omit semicolons when named in attribute and the next character is `=`'
  )

  t.equal(
    stringifyEntities('¬it;', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&not;it;',
    'should not omit semicolons when conflicting'
  )

  t.equal(
    stringifyEntities('&amp', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&ampamp',
    'should omit semicolons when named, not in an attribute, and the next character is alphanumeric'
  )

  t.equal(
    stringifyEntities('&=', {
      useNamedReferences: true,
      omitOptionalSemicolons: true
    }),
    '&amp=',
    'should omit semicolons when named, not in an attribute, and the next character is `=`'
  )

  t.equal(
    stringifyEntities('foo\uD800bar'),
    'foo&#xD800;bar',
    'should support a lone high surrogate (lowest)'
  )

  t.equal(
    stringifyEntities('foo\uDBFFbar'),
    'foo&#xDBFF;bar',
    'should support a lone high surrogate (highest)'
  )

  t.equal(
    stringifyEntities('\uD800bar'),
    '&#xD800;bar',
    'should support a lone high surrogate at the start of a string (lowest)'
  )

  t.equal(
    stringifyEntities('\uDBFFbar'),
    '&#xDBFF;bar',
    'should support a lone high surrogate at the start of a string (highest)'
  )

  t.equal(
    stringifyEntities('foo\uD800'),
    'foo&#xD800;',
    'should support a lone high surrogate at the end of a string (lowest)'
  )

  t.equal(
    stringifyEntities('foo\uDBFF'),
    'foo&#xDBFF;',
    'should support a lone high surrogate at the end of a string (highest)'
  )

  t.equal(
    stringifyEntities('foo\uDC00bar'),
    'foo&#xDC00;bar',
    'should support a lone low surrogate (lowest)'
  )

  t.equal(
    stringifyEntities('foo\uDFFFbar'),
    'foo&#xDFFF;bar',
    'should support a lone low surrogate (highest)'
  )

  t.equal(
    stringifyEntities('\uDC00bar'),
    '&#xDC00;bar',
    'should support a lone low surrogate at the start of a string (lowest)'
  )

  t.equal(
    stringifyEntities('\uDFFFbar'),
    '&#xDFFF;bar',
    'should support a lone low surrogate at the start of a string (highest)'
  )

  t.equal(
    stringifyEntities('foo\uDC00'),
    'foo&#xDC00;',
    'should support a lone low surrogate at the end of a string (lowest)'
  )

  t.equal(
    stringifyEntities(
      '\0\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\u000B\u000E\u000F\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\u001C\u001D\u001E\u001F\u007F\u0080\u0081\u0082\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008A\u008B\u008C\u008D\u008E\u008F\u0090\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009A\u009B\u009C\u009D\u009E\u009F\uFDD0\uFDD1\uFDD2\uFDD3\uFDD4\uFDD5\uFDD6\uFDD7\uFDD8\uFDD9\uFDDA\uFDDB\uFDDC\uFDDD\uFDDE\uFDDF\uFDE0\uFDE1\uFDE2\uFDE3\uFDE4\uFDE5\uFDE6\uFDE7\uFDE8\uFDE9\uFDEA\uFDEB\uFDEC\uFDED\uFDEE\uFDEF\uFFFE\uFFFF\uD83F\uDFFE\uD83F\uDFFF\uD87F\uDFFE\uD87F\uDFFF\uD8BF\uDFFE\uD8BF\uDFFF\uD8FF\uDFFE\uD8FF\uDFFF\uD93F\uDFFE\uD93F\uDFFF\uD97F\uDFFE\uD97F\uDFFF\uD9BF\uDFFE\uD9BF\uDFFF\uD9FF\uDFFE\uD9FF\uDFFF\uDA3F\uDFFE\uDA3F\uDFFF\uDA7F\uDFFE\uDA7F\uDFFF\uDABF\uDFFE\uDABF\uDFFF\uDAFF\uDFFE\uDAFF\uDFFF\uDB3F\uDFFE\uDB3F\uDFFF\uDB7F\uDFFE\uDB7F\uDFFF\uDBBF\uDFFE\uDBBF\uDFFF\uDBFF\uDFFE\uDBFF\uDFFF'
    ),
    '\0&#x1;&#x2;&#x3;&#x4;&#x5;&#x6;&#x7;&#x8;&#xB;&#xE;&#xF;&#x10;&#x11;&#x12;&#x13;&#x14;&#x15;&#x16;&#x17;&#x18;&#x19;&#x1A;&#x1B;&#x1C;&#x1D;&#x1E;&#x1F;&#x7F;\u0080&#x81;\u0082\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008A\u008B\u008C&#x8D;\u008E&#x8F;&#x90;\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009A\u009B\u009C&#x9D;\u009E\u009F&#xFDD0;&#xFDD1;&#xFDD2;&#xFDD3;&#xFDD4;&#xFDD5;&#xFDD6;&#xFDD7;&#xFDD8;&#xFDD9;&#xFDDA;&#xFDDB;&#xFDDC;&#xFDDD;&#xFDDE;&#xFDDF;&#xFDE0;&#xFDE1;&#xFDE2;&#xFDE3;&#xFDE4;&#xFDE5;&#xFDE6;&#xFDE7;&#xFDE8;&#xFDE9;&#xFDEA;&#xFDEB;&#xFDEC;&#xFDED;&#xFDEE;&#xFDEF;&#xFFFE;&#xFFFF;&#x1FFFE;&#x1FFFF;&#x2FFFE;&#x2FFFF;&#x3FFFE;&#x3FFFF;&#x4FFFE;&#x4FFFF;&#x5FFFE;&#x5FFFF;&#x6FFFE;&#x6FFFF;&#x7FFFE;&#x7FFFF;&#x8FFFE;&#x8FFFF;&#x9FFFE;&#x9FFFF;&#xAFFFE;&#xAFFFF;&#xBFFFE;&#xBFFFF;&#xCFFFE;&#xCFFFF;&#xDFFFE;&#xDFFFF;&#xEFFFE;&#xEFFFF;&#xFFFFE;&#xFFFFF;&#x10FFFE;&#x10FFFF;',
    'should encodes disallowed code points in input, except those whose character references would refer to another code point'
  )

  t.equal(
    stringifyEntities('\0\u0089'),
    '\0\u0089',
    'should not encode invalid code points whose character references would refer to another code point'
  )

  t.end()
})

test('stringifyEntitiesLight(value[, options])', function (t) {
  t.equal(
    stringifyEntitiesLight('foo\u00A9bar\uD834\uDF06baz\u2603qux'),
    'foo&#xA9;bar&#x1D306;baz&#x2603;qux',
    'should encode in light mode'
  )

  t.equal(
    stringifyEntitiesLight('\'"<>&', {subset: ['&']}),
    '\'"<>&#x26;',
    'should support a `subset`'
  )

  t.end()
})
