import { type SchemaTypeDefinition } from 'sanity'

import notice from './notice'
import galleryItem from './galleryItem'
import event from './event'
import messMenu from './messMenu'
import contact from './contact'
import teamMember from './teamMember'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [notice, galleryItem, event, messMenu, contact, teamMember],
}