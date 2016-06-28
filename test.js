/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module stringify-entities
 * @fileoverview Test suite for `stringify-entities`.
 */

'use strict';

/* eslint-env node */
/* jscs:disable maximumLineLength */

/*
 * Dependencies.
 */

var test = require('tape');
var stringify = require('./');

var named = {
    'useNamedReferences': true
};

/*
 * Tests.
 */

test('stringifyEntities.escape(value)', function (t) {
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
    );

    t.end();
});

test('stringifyEntities(value[, options])', function (t) {
    t.equal(
        stringify('foo\xA9bar\uD834\uDF06baz\u2603qux'),
        'foo&#xA9;bar&#x1D306;baz&#x2603;qux',
        'Other non-ASCII symbols are represented through hexadecimal escapes'
    );

    t.equal(
        stringify('foo\xA9bar\uD834\uDF06baz\u2603qux', named),
        'foo&copy;bar&#x1D306;baz&#x2603;qux',
        'Other non-ASCII symbols are represented through hexadecimal escapes'
    );

    t.equal(
        stringify('\'"<>&'),
        '&#x27;&#x22;&#x3C;&#x3E;&#x26;',
        'Encode `escape`’s characters without using named references'
    );

    t.equal(
        stringify('\'"<>&', {
            'subset': ['&']
        }),
        '\'"<>&#x26;',
        'Encode support a `subset`'
    );

    t.equal(
        stringify('\'"<>&', {
            'subset': ['&'],
            'useNamedReferences': true
        }),
        '\'"<>&amp;',
        'Encode support a `subset` with `useNamedReferences`'
    );

    t.equal(
        stringify('foo\uD800bar'),
        'foo&#xD800;bar',
        'Lone high surrogate (lowest)'
    );

    t.equal(
        stringify('foo\uDBFFbar'),
        'foo&#xDBFF;bar',
        'Lone high surrogate (highest)'
    );

    t.equal(
        stringify('\uD800bar'),
        '&#xD800;bar',
        'Lone high surrogate at the start of a string (lowest)'
    );

    t.equal(
        stringify('\uDBFFbar'),
        '&#xDBFF;bar',
        'Lone high surrogate at the start of a string (highest)'
    );

    t.equal(
        stringify('foo\uD800'),
        'foo&#xD800;',
        'Lone high surrogate at the end of a string (lowest)'
    );

    t.equal(
        stringify('foo\uDBFF'),
        'foo&#xDBFF;',
        'Lone high surrogate at the end of a string (highest)'
    );

    t.equal(
        stringify('foo\uDC00bar'),
        'foo&#xDC00;bar',
        'Lone low surrogate (lowest)'
    );

    t.equal(
        stringify('foo\uDFFFbar'),
        'foo&#xDFFF;bar',
        'Lone low surrogate (highest)'
    );

    t.equal(
        stringify('\uDC00bar'),
        '&#xDC00;bar',
        'Lone low surrogate at the start of a string (lowest)'
    );

    t.equal(
        stringify('\uDFFFbar'),
        '&#xDFFF;bar',
        'Lone low surrogate at the start of a string (highest)'
    );

    t.equal(
        stringify('foo\uDC00'),
        'foo&#xDC00;',
        'Lone low surrogate at the end of a string (lowest)'
    );

    t.equal(
        stringify('\0\x01\x02\x03\x04\x05\x06\x07\b\x0B\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\x7F\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\uFDD0\uFDD1\uFDD2\uFDD3\uFDD4\uFDD5\uFDD6\uFDD7\uFDD8\uFDD9\uFDDA\uFDDB\uFDDC\uFDDD\uFDDE\uFDDF\uFDE0\uFDE1\uFDE2\uFDE3\uFDE4\uFDE5\uFDE6\uFDE7\uFDE8\uFDE9\uFDEA\uFDEB\uFDEC\uFDED\uFDEE\uFDEF\uFFFE\uFFFF\uD83F\uDFFE\uD83F\uDFFF\uD87F\uDFFE\uD87F\uDFFF\uD8BF\uDFFE\uD8BF\uDFFF\uD8FF\uDFFE\uD8FF\uDFFF\uD93F\uDFFE\uD93F\uDFFF\uD97F\uDFFE\uD97F\uDFFF\uD9BF\uDFFE\uD9BF\uDFFF\uD9FF\uDFFE\uD9FF\uDFFF\uDA3F\uDFFE\uDA3F\uDFFF\uDA7F\uDFFE\uDA7F\uDFFF\uDABF\uDFFE\uDABF\uDFFF\uDAFF\uDFFE\uDAFF\uDFFF\uDB3F\uDFFE\uDB3F\uDFFF\uDB7F\uDFFE\uDB7F\uDFFF\uDBBF\uDFFE\uDBBF\uDFFF\uDBFF\uDFFE\uDBFF\uDFFF'),
        '\0&#x1;&#x2;&#x3;&#x4;&#x5;&#x6;&#x7;&#x8;&#xB;&#xE;&#xF;&#x10;&#x11;&#x12;&#x13;&#x14;&#x15;&#x16;&#x17;&#x18;&#x19;&#x1A;&#x1B;&#x1C;&#x1D;&#x1E;&#x1F;&#x7F;\x80&#x81;\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C&#x8D;\x8E&#x8F;&#x90;\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C&#x9D;\x9E\x9F&#xFDD0;&#xFDD1;&#xFDD2;&#xFDD3;&#xFDD4;&#xFDD5;&#xFDD6;&#xFDD7;&#xFDD8;&#xFDD9;&#xFDDA;&#xFDDB;&#xFDDC;&#xFDDD;&#xFDDE;&#xFDDF;&#xFDE0;&#xFDE1;&#xFDE2;&#xFDE3;&#xFDE4;&#xFDE5;&#xFDE6;&#xFDE7;&#xFDE8;&#xFDE9;&#xFDEA;&#xFDEB;&#xFDEC;&#xFDED;&#xFDEE;&#xFDEF;&#xFFFE;&#xFFFF;&#x1FFFE;&#x1FFFF;&#x2FFFE;&#x2FFFF;&#x3FFFE;&#x3FFFF;&#x4FFFE;&#x4FFFF;&#x5FFFE;&#x5FFFF;&#x6FFFE;&#x6FFFF;&#x7FFFE;&#x7FFFF;&#x8FFFE;&#x8FFFF;&#x9FFFE;&#x9FFFF;&#xAFFFE;&#xAFFFF;&#xBFFFE;&#xBFFFF;&#xCFFFE;&#xCFFFF;&#xDFFFE;&#xDFFFF;&#xEFFFE;&#xEFFFF;&#xFFFFE;&#xFFFFF;&#x10FFFE;&#x10FFFF;',
        'Encodes disallowed code points in input, except those whose character references would refer to another code point'
    );

    t.equal(
        stringify('\0\x89'),
        '\0\x89',
        'Does not encode invalid code points whose character references would refer to another code point'
    );

    t.end();
});
