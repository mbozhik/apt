import {type SchemaTypeDefinition} from 'sanity'

import {tire} from './tire'
import {collection} from './collection'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [tire, collection],
}
