import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'reform',
  title: 'Our Reforms',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Title of the completed work, upgrade, or initiative',
    }),
    defineField({
      name: 'body',
      title: 'Body / Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Formatted rich text description of the reform and its impact',
    }),
    defineField({
      name: 'coverPhoto',
      title: 'Cover Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      description: 'Main feature photo for this timeline entry',
    }),
    defineField({
      name: 'icon',
      title: 'Fallback Icon (emoji)',
      type: 'string',
      description: 'Fallback emoji character shown if coverPhoto is missing or fails to load',
    }),
    defineField({
      name: 'galleryLink',
      title: 'Related Gallery Album',
      type: 'reference',
      to: [{ type: 'galleryItem' }],
      description: 'Optional reference to an existing gallery item/album for this reform',
    }),
    defineField({
      name: 'photos',
      title: 'Additional Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Photos specific to this timeline entry when there is no gallery album or in addition to it',
    }),
    defineField({
      name: 'date',
      title: 'Date Completed / Implemented',
      type: 'date',
      validation: (Rule) => Rule.required(),
      description: 'Date the initiative was completed or launched',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      validation: (Rule) => Rule.required(),
      description: 'Explicit timeline sequence number (e.g. 1, 2, 3...) independent of date',
      initialValue: 1,
    }),
  ],
  orderings: [
    {
      title: 'Sort Order (1, 2, 3...)',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Date (Newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'coverPhoto',
      sortOrder: 'sortOrder',
    },
    prepare({ title, subtitle, media, sortOrder }) {
      return {
        title: sortOrder !== undefined ? `${sortOrder}. ${title}` : title,
        subtitle: subtitle,
        media,
      };
    },
  },
})
