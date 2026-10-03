import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'galleryItem',
    title: 'Gallery Item',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'videos',
            title: 'Videos',
            type: 'array',
            of: [{ type: 'galleryVideo' }],
        }),
        defineField({ name: 'eventName', title: 'Event Name', type: 'string' }),
        defineField({ name: 'date', title: 'Date', type: 'date' }),
    ],
})