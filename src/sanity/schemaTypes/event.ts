import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'Formatted event description, rules, schedules, and details.',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'datetime',
        }),
        defineField({
            name: 'image',
            title: 'Event Cover Image',
            description: 'Cover photo or poster for the event.',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'icon',
            title: 'Fallback Icon (emoji) — shown when image is empty or fails to load',
            description: 'An emoji character used as a placeholder when no image is uploaded.',
            type: 'string',
        }),
        defineField({
            name: 'googleFormUrl',
            title: 'Google Form URL',
            type: 'url',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'date',
            media: 'image',
        },
    },
})