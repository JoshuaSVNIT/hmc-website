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
        defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
            validation: (Rule) => Rule.required(),
            description: 'Manual display order on /gallery. Highest number shows first (e.g. 10, 9, 8...).',
            initialValue: 1,
        }),
    ],
    orderings: [
        {
            title: 'Sort Order (highest first)',
            name: 'sortOrderDesc',
            by: [{ field: 'sortOrder', direction: 'desc' }],
        },
        {
            title: 'Date (Newest first)',
            name: 'dateDesc',
            by: [{ field: 'date', direction: 'desc' }],
        },
    ],
})