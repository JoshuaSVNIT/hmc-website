import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'commonRoom',
    title: 'Common Room',
    type: 'document',
    fields: [
        defineField({
            name: 'wing',
            title: 'Wing',
            type: 'string',
            options: {
                list: [
                    { title: 'Wing A', value: 'A' },
                    { title: 'Wing B', value: 'B' },
                    { title: 'Wing C', value: 'C' },
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'floor',
            title: 'Floor',
            type: 'number',
            description: 'Floor number (2 through 8)',
            validation: (Rule) => Rule.required().min(2).max(8).integer(),
        }),
        defineField({
            name: 'label',
            title: 'Room Purpose / Title',
            description: 'The room purpose or name, e.g. "Study Room", "TV Lounge", "Table Tennis Room".',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'icon',
            title: 'Fallback Icon (emoji)',
            description: 'Fallback shown when image is empty or fails to load',
            type: 'string',
        }),
        defineField({
            name: 'contactName',
            title: 'Contact Person Name (optional)',
            type: 'string',
        }),
        defineField({
            name: 'contactPhone',
            title: 'Contact Phone Number (optional)',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'label',
            wing: 'wing',
            floor: 'floor',
            media: 'image',
        },
        prepare({ title, wing, floor, media }) {
            return {
                title: title || `Floor ${floor} · Wing ${wing}`,
                subtitle: `Wing ${wing} · Floor ${floor}`,
                media,
            }
        },
    },
})
