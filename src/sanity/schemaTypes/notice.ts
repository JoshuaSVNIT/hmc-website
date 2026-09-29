import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'notice',
    title: 'Notice',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'date', title: 'Date', type: 'datetime', validation: (Rule) => Rule.required() }),
        defineField({ name: 'pinned', title: 'Pinned', type: 'boolean', initialValue: false }),
    ],
})