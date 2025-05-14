import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const tire = defineType({
  name: 'tire',
  title: 'Шина',
  type: 'document',
  icon: ColorWheelIcon,
  fields: [
    defineField({
      name: 'naming',
      title: 'Наименование',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'naming',
      },
    }),
    defineField({
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'descriptors',
      title: 'Характеристики',
      type: 'array',
      of: [
        {
          title: 'Характеристика',
          type: 'text',
          rows: 3,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'naming',
      subtitle: 'slug.current',
      media: 'image',
    },
  },
})
