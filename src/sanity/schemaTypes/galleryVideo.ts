import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'galleryVideo',
  title: 'Gallery Video',
  type: 'object',
  fields: [
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'Full YouTube video URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    select: {
      url: 'videoUrl',
    },
    prepare({ url }) {
      return {
        title: url || 'Untitled Video',
        subtitle: 'YouTube Video',
      }
    },
  },
})
