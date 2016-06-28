# stringify-entities [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

<!--lint disable list-item-spacing heading-increment-->

Encode HTML character references and character entities.

*   [x] Very fast;
*   [x] Just the encoding part;
*   [x] Reliable: ``"`"`` characters are escaped to ensure no scripts
    run in IE6-8.  Additionally, only named entities recognized by HTML4
    are encoded, meaning the infamous `&apos;` (which people think is a
    [virus](http://www.telegraph.co.uk/technology/advice/10516839/Why-do-some-apostrophes-get-replaced-with-andapos.html))
    won’t show up.

## Installation

[npm][]:

```bash
npm install stringify-entities
```

**stringify-entities** is also available as an AMD, CommonJS, and globals
module, [uncompressed and compressed][releases].

## Usage

```js
var stringify = require('stringify-entities');

stringify.encode('alpha © bravo ≠ charlie 𝌆 delta');
```

Yields:

```html
alpha &#xA9; bravo &#x2260; charlie &#x1D306; delta
```

…and with `useNamedReferences: true`.

```js
stringify.encode('alpha © bravo ≠ charlie 𝌆 delta', { useNamedReferences: true });
```

Yields:

```html
alpha &copy; bravo &ne; charlie &#x1D306; delta
```

## API

### `stringifyEntities(value[, options])`

Encode special characters in `value`.

##### `options`

###### `options.escapeOnly`

Whether to only escape possibly dangerous characters (`boolean`,
default: `false`).  Those characters are `"`, `'`, `<`, `>` `&`, and
`` ` ``.

###### `options.subset`

Whether to only escape the given subset of characters (`Array.<string>`).

###### `options.useNamedReferences`

Whether to use entities where possible (`boolean?`, default: `false`).

###### `options.omitOptionalSemicolons`

Whether to use omit semi-colons when possible. **This creates parse
errors: don’t do this unless when building a minifier** (`boolean?`,
default: `false`).

Omitting semi-colons is possible for [certain][dangerous] [legacy][]
named references, and numeric entities, in some cases.

###### `options.attribute`

Only needed when operating dangerously with `omitOptionalSemicolons: true`.
Create entities which don’t fail in attributes (`boolean?`, default:
`false`).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/stringify-entities.svg

[build-status]: https://travis-ci.org/wooorm/stringify-entities

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/stringify-entities.svg

[coverage-status]: https://codecov.io/github/wooorm/stringify-entities

[releases]: https://github.com/wooorm/stringify-entities/releases

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[dangerous]: lib/dangerous.json

[legacy]: https://github.com/wooorm/character-entities-legacy
