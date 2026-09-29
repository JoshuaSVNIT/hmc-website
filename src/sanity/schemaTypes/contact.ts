import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'contact',
    title: 'Contact',
    type: 'document',
    fields: [
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: { list: ['Emergency', 'Supervisor', 'HMC Member'] },
            validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'label', title: 'Label / Name', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({
            name: 'title',
            title: 'Title / Role (optional)',
            description: 'Short role label shown above the name, e.g. "Website Admin" or "Night Duty". Leave blank for most contacts.',
            type: 'string',
        }),
        defineField({ name: 'phone', title: 'Phone', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'order', title: 'Sort Order', type: 'number', initialValue: 0 }),
        defineField({
            name: 'photo',
            title: 'Photo',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'icon',
            title: 'Fallback Icon (emoji) — shown when Photo is empty or fails to load',
            description: 'An emoji character used as a placeholder when no photo is uploaded or the photo cannot be displayed.',
            type: 'string',
        }),
    ],
})