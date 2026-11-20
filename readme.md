# stringify-entities

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

Serialize (encode) HTML character references.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`stringifyEntities(value[, options])`](#stringifyentitiesvalue-options)
* [Algorithm](#algorithm)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This is a small and powerful encoder of HTML character references (often called
entities).
This one has either all the options you need for a minifier/formatter, or a
tiny size when using `stringifyEntitiesLight`.

## When should I use this?

You can use this for spec-compliant encoding of character references.
It’s small and fast enough to do that well.
You can also use this when making an HTML formatter or minifier, because there
are different ways to produce pretty or tiny output.
This package is reliable: ``'`'`` characters are encoded to ensure no scripts
run in Internet Explorer 6 to 8.
Additionally, only named references recognized by HTML 4 are encoded,
meaning the infamous `&apos;`
(which people think is a [virus][telegraph-apos])
won’t show up.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 14.14+, 16.0+), install with [npm][npmjs-install]:

```sh
npm install stringify-entities
```

In Deno with [`esm.sh`][esmsh]:

```js
import {stringifyEntities} from 'https://esm.sh/stringify-entities@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {stringifyEntities} from 'https://esm.sh/stringify-entities@4?bundle'
</script>
```

## Use

```js
import {stringifyEntities} from 'stringify-entities'

stringifyEntities('alpha © bravo ≠ charlie 𝌆 delta')
// => 'alpha &#xA9; bravo &#x2260; charlie &#x1D306; delta'

stringifyEntities('alpha © bravo ≠ charlie 𝌆 delta', {useNamedReferences: true})
// => 'alpha &copy; bravo &ne; charlie &#x1D306; delta'
```

## API

This package exports the identifiers `stringifyEntities` and
`stringifyEntitiesLight`.
There is no default export.

### `stringifyEntities(value[, options])`

Encode special characters in `value`.

##### Core options

###### `options.escapeOnly`

Whether to only escape possibly dangerous characters (`boolean`, default:
`false`).
Those characters are `"`, `&`, `'`, `<`, `>`, and `` ` ``.

###### `options.subset`

Whether to only escape the given subset of characters (`Array<string>`).
Note that only BMP characters are supported here (so no emoji).

##### Formatting options

If you do not care about the following options, use `stringifyEntitiesLight`,
which always outputs hexadecimal character references.

###### `options.useNamedReferences`

Prefer named character references (`&amp;`) where possible (`boolean?`, default:
`false`).

###### `options.useShortestReferences`

Prefer the shortest possible reference, if that results in less bytes
(`boolean?`, default: `false`).

> ⚠️ **Note**: `useNamedReferences` can be omitted when using
> `useShortestReferences`.

###### `options.omitOptionalSemicolons`

Whether to omit semicolons when possible (`boolean?`, default: `false`).

> ⚠️ **Note**: This creates what HTML calls “parse errors” but is otherwise
> still valid HTML — don’t use this except when building a minifier.
> Omitting semicolons is possible for certain named and numeric references in
> some cases.

###### `options.attribute`

Create character references which don’t fail in attributes (`boolean?`, default:
`false`).

> ⚠️ **Note**: `attribute` only applies when operating dangerously with
> `omitOptionalSemicolons: true`.

#### Returns

Encoded value (`string`).

## Algorithm

By default, all dangerous, non-ASCII, and non-printable ASCII characters are
encoded.
A [`subset`][api-options-subset] of characters can be given to encode just
those characters.
Alternatively,
pass [`escapeOnly`][api-options-escape-only] to escape just the dangerous
characters (`"`, `'`, `<`, `>`, `&`, `` ` ``).
By default, hexadecimal character references are used.
Pass [`useNamedReferences`][api-options-use-named-references] to use named
character references when possible,
or [`useShortestReferences`][api-options-use-shortest-references] to use
whichever is shortest:
decimal, hexadecimal, or named.
There is also a `stringifyEntitiesLight` export, which works just like
`stringifyEntities` but without the formatting options: it’s much smaller but
always outputs hexadecimal character references.

## Types

This package is fully typed with [TypeScript][].
It exports the additional types `Options` and `LightOptions` types.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Related

* [`parse-entities`][github-parse-entities]
  — parse (decode) HTML character references
* [`wooorm/character-entities`][github-character-entities]
  — info on character references
* [`wooorm/character-entities-html4`][github-character-entities-html4]
  — info on HTML 4 character references
* [`wooorm/character-entities-legacy`][github-character-entities-legacy]
  — info on legacy character references
* [`wooorm/character-reference-invalid`][github-character-reference-invalid]
  — info on invalid numeric character references

## Contribute

Yes please!
See [How to Contribute to Open Source][opensource-guide-contribute].

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[api-options-escape-only]: #optionsescapeonly

[api-options-subset]: #optionssubset

[api-options-use-named-references]: #optionsusenamedreferences

[api-options-use-shortest-references]: #optionsuseshortestreferences

[badge-build-image]: https://github.com/wooorm/stringify-entities/workflows/main/badge.svg

[badge-build-url]: https://github.com/wooorm/stringify-entities/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/wooorm/stringify-entities.svg

[badge-coverage-url]: https://codecov.io/github/wooorm/stringify-entities

[badge-downloads-image]: https://img.shields.io/npm/dm/stringify-entities.svg

[badge-downloads-url]: https://www.npmjs.com/package/stringify-entities

[badge-size-image]: https://img.shields.io/bundlejs/size/stringify-entities

[badge-size-url]: https://bundlejs.com/?q=stringify-entities

[esmsh]: https://esm.sh

[file-license]: license

[github-character-entities]: https://github.com/wooorm/character-entities

[github-character-entities-html4]: https://github.com/wooorm/character-entities-html4

[github-character-entities-legacy]: https://github.com/wooorm/character-entities-legacy

[github-character-reference-invalid]: https://github.com/wooorm/character-reference-invalid

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-parse-entities]: https://github.com/wooorm/parse-entities

[npmjs-install]: https://docs.npmjs.com/cli/install

[opensource-guide-contribute]: https://opensource.guide/how-to-contribute/

[telegraph-apos]: https://www.telegraph.co.uk/technology/advice/10516839/Why-do-some-apostrophes-get-replaced-with-andapos.html

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com
