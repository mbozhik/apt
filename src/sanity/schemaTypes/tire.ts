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
      name: 'token',
      title: 'Токен',
      type: 'slug',
      options: {
        source: 'naming',
        slugify: (input: string): string => {
          return input
            .split(' ')
            .filter((word: string) => word.length > 0)
            .map((word: string) => word.charAt(0))
            .join('')
            .toUpperCase()
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      description: 'Максимальная длина: 200 символов',
      type: 'text',
      rows: 4,
      validation: (rule) =>
        rule.required().custom((text) => {
          if (!text) return true

          const charCount = text.length

          if (charCount > 200) {
            return `Превышен лимит символов (${charCount}/200)`
          }

          return true
        }),
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
      name: 'decoding',
      title: 'Расшифровка',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
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
      token: 'token',
      image: 'image',
    },

    prepare({naming, token, image}) {
      return {
        title: naming,
        subtitle: `${token.current}`,
        media: image,
      }
    },
  },
})
