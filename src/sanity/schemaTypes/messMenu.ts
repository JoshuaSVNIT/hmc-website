import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'messMenu',
    title: 'Mess Menu',
    type: 'document',
    fields: [
        defineField({
            name: 'day',
            title: 'Day',
            type: 'string',
            options: { list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
            validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'breakfast', title: 'Breakfast', type: 'text' }),
        defineField({ name: 'lunch', title: 'Lunch', type: 'text' }),
        defineField({ name: 'dinner', title: 'Dinner', type: 'text' }),
    ],
})