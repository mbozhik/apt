import {CopyIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const collection = defineType({
  name: 'collection',
  title: 'Коллекция',
  type: 'document',
  icon: CopyIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tires',
      title: 'Шины',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {type: 'tire'},
          options: {
            disableNew: true,
          },
        },
      ],
      validation: (Rule) => Rule.unique().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tires: 'tires',
    },

    prepare({title, tires}) {
      return {
        title,
        subtitle: `Шины — ${tires.length}`,
      }
    },
  },
})
