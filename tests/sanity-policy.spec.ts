import { expect, test } from "@playwright/test";
import { generateMetadata, generateStaticParams } from "../app/news/[slug]/page";
import sitemap from "../app/sitemap";
import {
  approvedArticleFilter,
  approvedArticleQuery,
  approvedArticleSlugsQuery,
  approvedArticlesQuery,
  getApprovedArticleBySlug,
  getApprovedArticleSlugs,
  getApprovedArticles,
  isSafeArticleSlug,
  sanityClient,
} from "../lib/sanity";
import { absoluteUrl } from "../lib/site-url";
import {
  fixtures,
  INTERNAL_NOTE,
  INTERNAL_REVIEWER,
  INTERNAL_TOKEN,
  publicCard,
  publicDetail,
  publicFixtures,
  publicIds,
  publicSlugs,
  useFixtureDataset,
} from "./fixtures/sanity-fixture-dataset";

test("public GROQ queries require explicitly non-test, approved, complete, published articles", () => {
  const queries = [approvedArticlesQuery, approvedArticleQuery, approvedArticleSlugsQuery];
  for (const query of queries) {
    expect(query).toContain(`*[_type == "article" &&`);
    expect(query).toContain(approvedArticleFilter);
    expect(query).toContain("isTestArticle == false");
    expect(query).not.toContain("isTestArticle != true");
    expect(query).not.toContain("...");
    expect(query).not.toContain("verificationNotes");
    expect(query).not.toContain("verifiedBy");
    expect(query).not.toContain("verifiedAt");
  }

  const requiredClauses = [
    `!(_id in path("drafts.**"))`,
    `editorialStatus == "verified"`,
    `isVerified == true`,
    `isTestArticle == false`,
    `defined(title) && title != ""`,
    `defined(slug.current) && slug.current != ""`,
    `category in ["news", "updates", "successStory"]`,
    `defined(summary) && summary != ""`,
    `count(body[_type == "block"]) > 0`,
    `count(body[_type in ["image", "bodyImage"] && (!defined(alt) || alt == "")]) == 0`,
    `defined(author) && author != ""`,
    `defined(publishedAt) && publishedAt <= now()`,
  ];
  for (const clause of requiredClauses) expect(approvedArticleFilter).toContain(clause);
});

test("real GROQ queries admit only approved fixtures across lists, detail pages, and slugs", async () => {
  const fixtureState = useFixtureDataset(Object.values(fixtures));
  try {
    expect(await getApprovedArticles()).toEqual(publicFixtures.map(publicCard));
    expect(await getApprovedArticleSlugs()).toEqual(publicSlugs);

    for (const [name, article] of Object.entries(fixtures)) {
      const detail = await getApprovedArticleBySlug(article.slug?.current ?? "");
      if (publicIds.has(article._id)) {
        expect(detail, name).toEqual(publicDetail(article));
      } else {
        expect(detail, name).toBeNull();
      }
    }

    expect(fixtureState.calls.length).toBeGreaterThan(0);
  } finally {
    fixtureState.restore();
  }
});

test("public data, metadata, static params, and sitemap contain no internal reviewer information", async () => {
  const fixtureState = useFixtureDataset(Object.values(fixtures));
  try {
    expect(await generateStaticParams()).toEqual(publicSlugs.map(slug => ({ slug })));

    const sitemapUrls = (await sitemap()).map(entry => entry.url);
    for (const slug of publicSlugs) expect(sitemapUrls).toContain(absoluteUrl(`/news/${slug}`));
    for (const article of Object.values(fixtures)) {
      if (!publicIds.has(article._id)) {
        expect(sitemapUrls).not.toContain(absoluteUrl(`/news/${article.slug?.current ?? ""}`));
      }
    }

    const metadataResults = [];
    for (const [name, article] of Object.entries(fixtures)) {
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: article.slug?.current ?? "" }) });
      metadataResults.push(metadata);
      if (publicIds.has(article._id)) {
        expect(metadata.title, name).toBe(article.title);
        expect(metadata.description, name).toBe(article.summary);
      } else {
        expect(metadata.title, name).toBe("News article");
        expect(metadata.description, name).toBe(
          "Read verified Green Belt Initiative news, updates and success stories from South Sudan.",
        );
      }
    }

    const publicResponses = JSON.stringify({
      cards: await getApprovedArticles(),
      details: await Promise.all(publicSlugs.map(slug => getApprovedArticleBySlug(slug))),
      slugs: await getApprovedArticleSlugs(),
      sitemapUrls,
      metadataResults,
    });

    for (const forbidden of [
      INTERNAL_REVIEWER,
      INTERNAL_NOTE,
      INTERNAL_TOKEN,
      "verifiedBy",
      "verifiedAt",
      "verificationNotes",
      "editorialStatus",
      "isVerified",
      "isTestArticle",
      "apiToken",
    ]) {
      expect(publicResponses, forbidden).not.toContain(forbidden);
    }
  } finally {
    fixtureState.restore();
  }
});

test("malformed slugs are rejected before a Sanity lookup", async () => {
  expect(isSafeArticleSlug("approved-fixture-article")).toBe(true);
  expect(isSafeArticleSlug("Needs Review")).toBe(false);
  expect(isSafeArticleSlug("article/preview")).toBe(false);
  expect(isSafeArticleSlug("a".repeat(97))).toBe(false);

  const client = sanityClient as unknown as { fetch: (...args: unknown[]) => Promise<unknown> };
  const originalFetch = client.fetch;
  let fetchCount = 0;
  client.fetch = async (...args) => {
    fetchCount += 1;
    return originalFetch(...args);
  };

  try {
    expect(await getApprovedArticleBySlug("Needs Review")).toBeNull();
    expect(fetchCount).toBe(0);
  } finally {
    client.fetch = originalFetch;
  }
});
