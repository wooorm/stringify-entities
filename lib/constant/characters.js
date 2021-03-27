import {characterEntitiesHtml4} from 'character-entities-html4'

export var characters = {}

var own = {}.hasOwnProperty
var key

for (key in characterEntitiesHtml4) {
  if (own.call(characterEntitiesHtml4, key)) {
    characters[characterEntitiesHtml4[key]] = key
  }
}
