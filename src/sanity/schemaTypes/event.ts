import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'description', title: 'Description', type: 'text' }),
        defineField({ name: 'date', title: 'Date', type: 'datetime' }),
        defineField({ name: 'googleFormUrl', title: 'Google Form URL', type: 'url' }),
    ],
})