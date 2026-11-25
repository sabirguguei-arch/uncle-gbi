'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { article } from './sanity/schemaTypes/article'

export default defineConfig({
  name: 'gbi-sanity-cms',
  title: 'Green Belt Initiative',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: [article],
  },
})
