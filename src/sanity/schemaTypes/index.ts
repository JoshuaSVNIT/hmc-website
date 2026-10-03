import { type SchemaTypeDefinition } from 'sanity'

import notice from './notice'
import galleryItem from './galleryItem'
import galleryVideo from './galleryVideo'
import event from './event'
import messMenu from './messMenu'
import contact from './contact'
import teamMember from './teamMember'
import commonRoom from './commonRoom'
import reform from './reform'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [notice, galleryItem, galleryVideo, event, messMenu, contact, teamMember, commonRoom, reform],
}