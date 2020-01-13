import stringify = require('stringify-entities')

stringify('alpha © bravo ≠ charlie 𝌆 delta')
stringify('alpha © bravo ≠ charlie 𝌆 delta', {escapeOnly: true})
stringify('alpha © bravo ≠ charlie 𝌆 delta', {subset: ['<']})
stringify('alpha © bravo ≠ charlie 𝌆 delta', {useNamedReferences: true})
stringify('alpha © bravo ≠ charlie 𝌆 delta', {omitOptionalSemicolons: true})
stringify('alpha © bravo ≠ charlie 𝌆 delta', {attribute: true})
