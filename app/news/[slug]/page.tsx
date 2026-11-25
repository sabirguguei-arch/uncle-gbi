import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/hero/PageHero";
import { createMetadata } from "@/lib/seo";
import {
  articleCategoryLabel,
  formatArticleDate,
  getApprovedArticleBySlug,
  getApprovedArticleSlugs,
  sanityImageUrl,
  type SanityBodyImage,
} from "@/lib/sanity";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getApprovedArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getApprovedArticleBySlug(slug);
  const imagePath = article ? sanityImageUrl(article.featuredImage) ?? undefined : undefined;

  return createMetadata(
    article?.title ?? "News article",
    article?.summary ?? "Read verified Green Belt Initiative news, updates and success stories from South Sudan.",
    { path: `/news/${slug}`, imagePath, type: "article" },
  );
}

function renderBodyImage({ value }: { value: SanityBodyImage }) {
  const imageUrl = sanityImageUrl(value, 1400);
  if (!imageUrl) return null;

  return (
    <figure className="mt-10 overflow-hidden border border-[#d1d5c7] bg-[#e8e2d2] p-2">
      <Image src={imageUrl} alt={value.alt} width={1400} height={900} className="h-auto w-full" />
      {value.caption && <figcaption className="px-2 py-3 text-sm leading-6 text-[#536b61]">{value.caption}</figcaption>}
    </figure>
  );
}

const portableTextComponents: PortableTextComponents<PortableTextBlock | SanityBodyImage> = {
  block: {
    h2: ({ children }) => <h2 className="font-display mt-12 text-3xl leading-tight text-[#17342a]">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display mt-10 text-2xl leading-tight text-[#17342a]">{children}</h3>,
    normal: ({ children }) => <p className="mt-5 leading-8 text-[#466256]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-[#466256]">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-[#466256]">{children}</ol>,
  },
  types: {
    image: renderBodyImage,
    bodyImage: renderBodyImage,
  },
};

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getApprovedArticleBySlug(slug);
  if (!article) notFound();

  const featuredImageUrl = sanityImageUrl(article.featuredImage);

  return (
    <main>
      <PageHero
        eyebrow={`${articleCategoryLabel(article.category).toUpperCase()} · ${formatArticleDate(article.publishedAt).toUpperCase()}`}
        title={article.title}
        intro={article.summary}
        backgroundImage="/images/gbi-sudd-wetlands-hero.jpg"
      />
      <article className="mx-auto max-w-4xl px-5 py-16 sm:px-10 lg:py-20">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-[#536b61]">
          <span>By {article.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        </div>
        {featuredImageUrl && article.featuredImage && (
          <figure className="mt-8 overflow-hidden border border-[#d1d5c7] bg-[#e8e2d2] p-2">
            <Image src={featuredImageUrl} alt={article.featuredImage.alt} width={1600} height={1000} className="h-auto w-full" priority />
            {article.featuredImage.caption && <figcaption className="px-2 py-3 text-sm leading-6 text-[#536b61]">{article.featuredImage.caption}</figcaption>}
          </figure>
        )}
        <div className="mt-10">
          <PortableText value={article.body} components={portableTextComponents} />
        </div>
        <Link className="mt-12 inline-block border-b border-[#153c2e] pb-2 font-bold text-[#153c2e]" href="/news">
          Back to News &amp; Updates
        </Link>
      </article>
    </main>
  );
}
