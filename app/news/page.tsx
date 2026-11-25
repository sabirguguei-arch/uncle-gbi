import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/hero/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { createMetadata } from "@/lib/seo";
import { articleCategoryLabel, formatArticleDate, getApprovedArticles, sanityImageUrl } from "@/lib/sanity";

export const metadata = createMetadata(
  "News & Updates",
  "Read Green Belt Initiative news, updates and verified success stories from South Sudan.",
  { path: "/news" },
);

export const revalidate = 60;

export default async function NewsPage() {
  const articles = await getApprovedArticles();

  return (
    <main>
      <PageHero
        eyebrow="NEWS & UPDATES"
        title="News, Updates & Success Stories"
        intro="Verified GBI news, updates and community stories will be published here as approved content becomes available." backgroundImage="/images/gbi-sudd-wetlands-hero.jpg"
      />

      <section className="px-5 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            eyebrow="LATEST FROM GBI"
            title="A place for verified stories and updates"
            intro="This section is ready for approved articles from GBI's future content workflow."
          />

          {articles.length > 0 ? (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Approved GBI articles">
              {articles.map((article) => {
                const imageUrl = sanityImageUrl(article.featuredImage, 1200);
                return (
                  <article key={article.id} className="gbi-surface gbi-card-lift overflow-hidden">
                    {imageUrl && article.featuredImage && (
                      <div className="relative aspect-[16/10] bg-[#e8e2d2]">
                        <Image src={imageUrl} alt={article.featuredImage.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                      </div>
                    )}
                    <div className="p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[.67rem] font-extrabold uppercase tracking-[.14em] text-[#1e6685]">
                        <span>{articleCategoryLabel(article.category)}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
                      </div>
                      <h2 className="font-display mt-5 text-3xl leading-tight text-[#17342a]">{article.title}</h2>
                      <p className="mt-4 leading-7 text-[#536b61]">{article.summary}</p>
                      <Link href={`/news/${article.slug}`} className="mt-7 inline-flex border-b border-[#153c2e] pb-2 text-sm font-bold text-[#17342a]">
                        Read more
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="gbi-surface mt-12 p-7 sm:p-10" aria-live="polite">
              <p className="gbi-eyebrow">COMING SOON</p>
              <h2 className="font-display mt-5 text-3xl leading-tight text-[#17342a] sm:text-4xl">
                No verified articles are published yet.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#536b61]">
                Approved GBI news, updates and success stories will appear here when the content workflow is connected.
              </p>
            </div>
          )}
        </div>
      </section>

      {!articles.length && <section className="bg-[#e8e2d2] px-5 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            eyebrow="FEATURED STORIES"
            title="Verified stories will appear here as they are approved"
            intro="GBI is not publishing unverified articles, achievements, testimonials, statistics or photos in this initial section."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Approved content areas">
            <article className="gbi-surface p-7 sm:p-9">
              <p className="gbi-eyebrow">GBI NEWS</p>
              <h2 className="font-display mt-5 text-3xl leading-tight text-[#17342a]">No verified news articles yet</h2>
              <p className="mt-4 leading-7 text-[#536b61]">Approved GBI news will be added here when source material is available.</p>
            </article>
            <article className="gbi-surface p-7 sm:p-9">
              <p className="gbi-eyebrow">SUCCESS STORIES</p>
              <h2 className="font-display mt-5 text-3xl leading-tight text-[#17342a]">No verified success stories yet</h2>
              <p className="mt-4 leading-7 text-[#536b61]">Approved community stories will be added here without changing the existing site design.</p>
            </article>
          </div>
        </div>
      </section>}
    </main>
  );
}
