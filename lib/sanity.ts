import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { createClient } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "htshbun1";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: true,
  perspective: "published",
});

export const approvedArticleFilter = `
  !(_id in path("drafts.**")) &&
  editorialStatus == "verified" &&
  isVerified == true &&
  isTestArticle == false &&
  defined(title) && title != "" &&
  defined(slug.current) && slug.current != "" &&
  category in ["news", "updates", "successStory"] &&
  defined(summary) && summary != "" &&
  defined(body) && count(body[_type == "block"]) > 0 &&
  count(body[_type in ["image", "bodyImage"] && (!defined(alt) || alt == "")]) == 0 &&
  defined(author) && author != "" &&
  defined(publishedAt) && publishedAt <= now() &&
  (!defined(featuredImage) ||
    (defined(featuredImage.asset) && defined(featuredImage.alt) && featuredImage.alt != ""))
`;

const publicImageProjection = `
  "asset": asset { _ref, _type },
  "alt": alt,
  defined(caption) => { "caption": caption }
`;

const publicBodyImageProjection = `{
  _type,
  _key,
  ${publicImageProjection},
  defined(hotspot) => { "hotspot": hotspot { x, y, height, width } },
  defined(crop) => { "crop": crop { top, bottom, left, right } }
}`;

const publicBodyBlockProjection = `{
  _type,
  _key,
  style,
  defined(listItem) => { listItem },
  defined(level) => { level },
  "markDefs": markDefs[] { _key, _type },
  "children": children[] { _type, _key, text, marks }
}`;

const articleListProjection = `{
  "id": _id,
  title,
  "slug": slug.current,
  category,
  summary,
  publishedAt,
  defined(featuredImage) => { "featuredImage": featuredImage { ${publicImageProjection} } }
}`;

const articleDetailProjection = `{
  "id": _id,
  title,
  "slug": slug.current,
  category,
  summary,
  author,
  publishedAt,
  defined(featuredImage) => { "featuredImage": featuredImage { ${publicImageProjection} } },
  body[] {
    _type == "block" => ${publicBodyBlockProjection},
    _type in ["image", "bodyImage"] => ${publicBodyImageProjection}
  }
}`;

export const approvedArticlesQuery = `*[_type == "article" && ${approvedArticleFilter}]
  | order(publishedAt desc) ${articleListProjection}`;

export const approvedArticleQuery = `*[_type == "article" && ${approvedArticleFilter} && slug.current == $slug]
  [0] ${articleDetailProjection}`;

export const approvedArticleSlugsQuery = `*[_type == "article" && ${approvedArticleFilter}]
  | order(publishedAt desc) { "slug": slug.current }`;

export type SanityImage = {
  asset?: { _ref?: string };
  alt: string;
  caption?: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  category: "news" | "updates" | "successStory";
  summary: string;
  author: string;
  publishedAt: string;
  featuredImage?: SanityImage;
  body: Array<PortableTextBlock | SanityBodyImage>;
};

export type NewsArticleCard = Pick<NewsArticle, "id" | "title" | "slug" | "category" | "summary" | "publishedAt" | "featuredImage">;

export type SanityBodyImage = SanityImage & {
  _key?: string;
  _type: "image" | "bodyImage";
};

type ArticleSlug = { slug: string };

const safeArticleSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSafeArticleSlug(slug: string): boolean {
  return slug.length <= 96 && safeArticleSlugPattern.test(slug);
}

const fetchOptions = {
  next: { revalidate: 60, tags: ["sanity:articles"] },
};

export async function getApprovedArticles(): Promise<NewsArticleCard[]> {
  try {
    const articles = await sanityClient.fetch<NewsArticleCard[]>(approvedArticlesQuery, {}, fetchOptions);
    return articles.filter((article) => isSafeArticleSlug(article.slug));
  } catch {
    return [];
  }
}

export async function getApprovedArticleBySlug(slug: string): Promise<NewsArticle | null> {
  if (!isSafeArticleSlug(slug)) return null;

  try {
    return await sanityClient.fetch<NewsArticle | null>(approvedArticleQuery, { slug }, fetchOptions);
  } catch {
    return null;
  }
}

export async function getApprovedArticleSlugs(): Promise<string[]> {
  try {
    const articles = await sanityClient.fetch<ArticleSlug[]>(approvedArticleSlugsQuery, {}, fetchOptions);
    return articles.map((article) => article.slug).filter((slug): slug is string => Boolean(slug) && isSafeArticleSlug(slug));
  } catch {
    return [];
  }
}

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function sanityImageUrl(image?: SanityImage, width = 1600): string | null {
  if (!image?.asset?._ref) return null;
  return imageBuilder.image(image as unknown as SanityImageSource).width(width).auto("format").url();
}

export function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function articleCategoryLabel(category: NewsArticle["category"]): string {
  return category === "successStory" ? "Success story" : category === "updates" ? "Update" : "News";
}
