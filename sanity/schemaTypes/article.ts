import {
  defineArrayMember,
  defineField,
  defineType,
} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'News, Updates & Success Stories',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Updates', value: 'updates' },
          { title: 'Success Stories', value: 'successStory' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'A concise, verified summary for article previews.',
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        }),
        defineArrayMember({
          name: 'bodyImage',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'editorialStatus',
      title: 'Editorial status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In review', value: 'inReview' },
          { title: 'Verified', value: 'verified' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified for publication',
      type: 'boolean',
      description: 'Only enable after the article has passed GBI editorial review.',
      initialValue: false,
    }),
    defineField({
      name: 'isTestArticle',
      title: 'CMS test article',
      type: 'boolean',
      description: 'Keep enabled for test content so it can never be published publicly.',
      initialValue: false,
    }),
    defineField({
      name: 'verifiedBy',
      title: 'Verified by',
      type: 'string',
      description: 'Name or role of the GBI reviewer who verified this article.',
    }),
    defineField({
      name: 'verifiedAt',
      title: 'Verification date',
      type: 'datetime',
    }),
    defineField({
      name: 'verificationNotes',
      title: 'Verification notes',
      type: 'text',
      rows: 3,
      description: 'Internal editorial notes; do not include confidential information.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      editorialStatus: 'editorialStatus',
    },
    prepare({ title, category, publishedAt, editorialStatus }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-GB')
        : 'No publication date'

      return {
        title,
        subtitle: `${category ?? 'Uncategorised'} · ${editorialStatus ?? 'draft'} · ${date}`,
      }
    },
  },
})
