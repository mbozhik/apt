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
      title: 'URL',
      type: 'slug',
      options: {
        source: 'naming',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'id',
      title: 'ID',
      type: 'number',
      validation: (Rule) => Rule.required(),
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
      name: 'params',
      title: 'Параметры',
      type: 'object',
      fields: [
        {
          name: 'sh',
          title: 'SH',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'qh',
          title: 'QH',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
      ],
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
      naming: 'naming',
      id: 'id',
      image: 'image',
    },

    prepare({naming, id, image}) {
      return {
        title: naming,
        subtitle: id,
        media: image,
      }
    },
  },
})
