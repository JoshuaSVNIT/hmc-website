import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'wingRep',
  title: 'Wing Representative',
  type: 'document',
  fields: [
    defineField({
      name: 'floor',
      title: 'Floor',
      type: 'string',
      options: {
        list: [
          { title: 'Ground Floor', value: 'Ground' },
          { title: '1st Floor', value: '1' },
          { title: '2nd Floor', value: '2' },
          { title: '3rd Floor', value: '3' },
          { title: '4th Floor', value: '4' },
          { title: '5th Floor', value: '5' },
          { title: '6th Floor', value: '6' },
          { title: '7th Floor', value: '7' },
          { title: '8th Floor', value: '8' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'wing',
      title: 'Wing',
      type: 'string',
      options: {
        list: ['Square', 'A', 'B', 'C'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'roomNo',
      title: 'Room Number',
      description: 'e.g. A208 or Sq-065',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      description: '10 digits, no spaces',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{10}$/, {
            name: '10-digit phone number',
            invert: false,
          })
          .error('Phone number must be exactly 10 digits without spaces'),
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      description: 'Sorts rows within the same floor',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      floor: 'floor',
      wing: 'wing',
      roomNo: 'roomNo',
    },
    prepare({ title, floor, wing, roomNo }) {
      return {
        title,
        subtitle: `Floor ${floor} · Wing ${wing} · Room ${roomNo}`,
      }
    },
  },
})

