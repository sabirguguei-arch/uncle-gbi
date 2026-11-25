import { expect, test, type Page } from "@playwright/test";
import type { Metadata } from "next";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { ImageConfigContext } from "next/dist/shared/lib/image-config-context.shared-runtime";
import NewsArticlePage, { generateMetadata as generateArticleMetadata } from "../app/news/[slug]/page";
import NewsPage from "../app/news/page";
import sitemap from "../app/sitemap";
import { getApprovedArticleBySlug, getApprovedArticles, getApprovedArticleSlugs } from "../lib/sanity";
import { absoluteUrl } from "../lib/site-url";
import { fixture, VALID_IMAGE_REF, useFixtureDataset } from "./fixtures/sanity-fixture-dataset";

const slug = "approved-fixture-solar-pilot";
const unapprovedSlug = "unapproved-test-fixture-article";
const title = "Approved fixture: community solar pilot brings light to Wau";
const summary = "A verified fixture summary describing a community-led solar pilot in Wau.";
const author = "GBI Fixture Editorial Team";
const publishedAt = "2026-11-20T00:00:00.000Z";
const formattedDate = "20 November 2026";
const featuredAlt = "Fixture featured image: solar array beside a community hall";
const featuredCaption = "Fixture caption for the featured solar array.";
const bodyHeading = "Fixture section: how the pilot was verified";
const bodyCopy = "Fixture body copy: the editorial fixture proves approved content reaches the News page.";
const bodyListCopy = "Fixture list item: local reviewers confirmed the story.";
const bodyImageAlt = "Fixture body image: engineers checking a solar panel";
const bodyImageCaption = "Fixture caption for the body image.";

// Mirrors the remotePatterns in next.config.mjs so standalone rendering keeps the
// same image host validation as the running Next app.
const fixtureImageConfig = {
  ...imageConfigDefault,
  remotePatterns: [
    { protocol: "https" as const, hostname: "images.unsplash.com" },
    { protocol: "https" as const, hostname: "cdn.sanity.io" },
  ],
};

function renderWithFixtureImageConfig(element: ReactElement): string {
  return renderToStaticMarkup(createElement(ImageConfigContext.Provider, { value: fixtureImageConfig }, element));
}

function block(key: string, text: string, style: "normal" | "h2" = "normal", listItem?: "bullet") {
  return {
    _type: "block",
    _key: key,
    style,
    ...(listItem ? { listItem } : {}),
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

const approvedVisualFixture = fixture("approved-visual", {
  title,
  slug: { current: slug },
  category: "successStory",
  summary,
  author,
  publishedAt,
  featuredImage: {
    _type: "image",
    asset: { _type: "reference", _ref: VALID_IMAGE_REF },
    alt: featuredAlt,
    caption: featuredCaption,
  },
  body: [
    block("body-1", bodyCopy),
    block("body-2", bodyHeading, "h2"),
    block("body-3", bodyListCopy, "normal", "bullet"),
    {
      _type: "image",
      _key: "body-image-fixture",
      asset: { _type: "reference", _ref: VALID_IMAGE_REF },
      alt: bodyImageAlt,
      caption: bodyImageCaption,
    },
  ],
});

const unapprovedFixture = fixture("unapproved-visual", {
  title: "Unapproved test article must never appear",
  slug: { current: unapprovedSlug },
  isTestArticle: true,
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceMain(html: string, mainHtml: string): string {
  const mainPattern = /<main\b[^>]*>[\s\S]*?<\/main>/i;
  if (mainPattern.test(html)) return html.replace(mainPattern, mainHtml);
  const bodyPattern = /<body\b[^>]*>/i;
  if (bodyPattern.test(html)) return html.replace(bodyPattern, match => `${match}${mainHtml}`);
  throw new Error("Fixture transport could not find a document body to receive the fixture article");
}

function setTitle(html: string, value: string): string {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(value)}</title>`);
}

function setCanonical(html: string, value: string): string {
  const canonicalPattern = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i;
  if (!canonicalPattern.test(html)) throw new Error("Fixture transport could not find the canonical link");
  return html.replace(canonicalPattern, `<link rel="canonical" href="${escapeHtml(value)}"/>`);
}

function setMeta(html: string, attributes: Record<string, string>, content: string): string {
  const attrPattern = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeRegExp(value)}"`)
    .join("\\s+");
  const pattern = new RegExp(`<meta\\s+${attrPattern}[^>]*\\/?>`, "i");
  if (!pattern.test(html)) throw new Error(`Fixture transport could not find meta ${JSON.stringify(attributes)}`);
  const replacementAttrs = Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(" ");
  return html.replace(pattern, `<meta ${replacementAttrs} content="${escapeHtml(content)}"/>`);
}

function asString(value: unknown, label: string): string {
  if (typeof value === "string") return value;
  if (value instanceof URL) return value.toString();
  throw new Error(`Expected ${label} to be a string or URL`);
}

type MetadataOverride = {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
};

function metadataOverride(metadata: Metadata): MetadataOverride {
  const openGraph = metadata.openGraph as Record<string, unknown>;
  const twitter = metadata.twitter as Record<string, unknown>;
  const ogImages = openGraph.images as Array<{ url: string }>;
  const twitterImages = twitter.images as Array<string>;
  return {
    title: `${asString(metadata.title, "metadata.title")} | Green Belt Initiative`,
    description: asString(metadata.description, "metadata.description"),
    canonical: asString(metadata.alternates?.canonical, "canonical"),
    ogTitle: asString(openGraph.title, "og:title"),
    ogDescription: asString(openGraph.description, "og:description"),
    ogUrl: asString(openGraph.url, "og:url"),
    ogImage: ogImages[0].url,
    ogImageAlt: featuredAlt,
    twitterTitle: asString(twitter.title, "twitter:title"),
    twitterDescription: asString(twitter.description, "twitter:description"),
    twitterImage: twitterImages[0],
  };
}

function applyMetadataOverride(html: string, override: MetadataOverride): string {
  let result = setTitle(html, override.title);
  result = setCanonical(result, override.canonical);
  result = setMeta(result, { name: "description" }, override.description);
  result = setMeta(result, { property: "og:title" }, override.ogTitle);
  result = setMeta(result, { property: "og:description" }, override.ogDescription);
  result = setMeta(result, { property: "og:url" }, override.ogUrl);
  result = setMeta(result, { property: "og:image" }, override.ogImage);
  result = setMeta(result, { property: "og:image:alt" }, override.ogImageAlt);
  result = setMeta(result, { property: "og:type" }, "article");
  result = setMeta(result, { name: "twitter:title" }, override.twitterTitle);
  result = setMeta(result, { name: "twitter:description" }, override.twitterDescription);
  result = setMeta(result, { name: "twitter:image" }, override.twitterImage);
  return result;
}

async function mockDocument(
  page: Page,
  documentPath: string,
  mainHtml: string,
  override?: MetadataOverride,
  sourcePath = documentPath,
) {
  await page.route(
    url => url.protocol === "http:" && url.hostname === "127.0.0.1" && url.pathname === documentPath,
    async route => {
      if (route.request().resourceType() !== "document") return route.continue();
      const original =
        sourcePath === documentPath
          ? await route.fetch()
          : await route.fetch({ url: `http://127.0.0.1:3013${sourcePath}` });
      let html = replaceMain(await original.text(), mainHtml);
      if (override) html = applyMetadataOverride(html, override);
      const headers = Object.fromEntries(
        Object.entries(original.headers()).filter(
          ([name]) => !["content-length", "content-encoding", "etag", "last-modified"].includes(name.toLowerCase()),
        ),
      );
      await route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", headers, body: html });
    },
  );
}

async function mockFixtureImages(page: Page) {
  const localImage = path.join(process.cwd(), "public", "images", "gbi-sudd-wetlands-hero.jpg");
  await page.route(
    url => url.pathname === "/_next/image" && (url.searchParams.get("url") ?? "").includes("cdn.sanity.io"),
    route => route.fulfill({ status: 200, contentType: "image/jpeg", path: localImage }),
  );
  await page.route("https://cdn.sanity.io/**", route =>
    route.fulfill({ status: 200, contentType: "image/jpeg", path: localImage }),
  );
}

async function waitForMainImages(page: Page) {
  const images = page.locator("main img");
  const count = await images.count();
  for (let index = 0; index < count; index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
      .toBe(true);
  }
}

test("approved fixture renders on the News list and article route through browser mocks", async ({ page }, testInfo) => {
  const state = useFixtureDataset([approvedVisualFixture, unapprovedFixture]);
  let listHtml: string;
  let detailHtml: string;
  let articleMetadata: Metadata;

  try {
    const articles = await getApprovedArticles();
    const detail = await getApprovedArticleBySlug(slug);
    const slugs = await getApprovedArticleSlugs();
    articleMetadata = await generateArticleMetadata({ params: Promise.resolve({ slug }) });
    const sitemapUrls = (await sitemap()).map(entry => entry.url);

    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({ title, slug, category: "successStory", summary, publishedAt });
    expect(detail).not.toMatchObject({ title: "Unapproved test article must never appear" });
    expect(detail?.author).toBe(author);
    expect(detail?.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ _type: "image", alt: bodyImageAlt, caption: bodyImageCaption })]),
    );
    expect(slugs).toEqual([slug]);
    expect(sitemapUrls).toContain(absoluteUrl(`/news/${slug}`));
    expect(sitemapUrls).not.toContain(absoluteUrl(`/news/${unapprovedSlug}`));
    expect(articleMetadata.title).toBe(title);
    expect(articleMetadata.description).toBe(summary);
    expect(articleMetadata.alternates?.canonical).toBe(absoluteUrl(`/news/${slug}`));
    expect((articleMetadata.openGraph as Record<string, unknown>).type).toBe("article");

    listHtml = renderWithFixtureImageConfig(await NewsPage());
    detailHtml = renderWithFixtureImageConfig(await NewsArticlePage({ params: Promise.resolve({ slug }) }));
  } finally {
    state.restore();
  }

  await mockFixtureImages(page);
  await mockDocument(page, "/news", listHtml);

  const listResponse = await page.goto("/news");
  expect(listResponse?.status()).toBe(200);
  const cards = page.locator('main [aria-label="Approved GBI articles"] article');
  await expect(cards).toHaveCount(1);
  const card = cards.first();
  await expect(card.getByRole("heading", { name: title })).toBeVisible();
  await expect(card).toContainText(summary);
  await expect(card).toContainText("Success story");
  await expect(card.locator("time")).toHaveAttribute("datetime", publishedAt);
  await expect(card).toContainText(formattedDate);
  await expect(card.getByRole("link", { name: "Read more" })).toHaveAttribute("href", `/news/${slug}`);
  await expect(card.getByRole("img", { name: featuredAlt })).toBeVisible();
  await waitForMainImages(page);
  expect(await page.locator("body").innerText()).not.toContain("CMS TEST");

  const screenshotDir = path.join(process.cwd(), "test-results", "fixture-approved-article");
  mkdirSync(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, "news-list-desktop.png"), fullPage: true });

  await mockDocument(page, `/news/${slug}`, detailHtml, metadataOverride(articleMetadata), "/news");
  const detailResponse = await page.goto(`/news/${slug}`);
  expect(detailResponse?.status()).toBe(200);
  await expect(page.locator("main h1")).toHaveText(title);
  await expect(page.locator("main")).toContainText(summary);
  await expect(page.locator("main")).toContainText(`By ${author}`);
  await expect(page.locator("main time")).toHaveAttribute("datetime", publishedAt);
  await expect(page.locator("main")).toContainText(formattedDate);
  await expect(page.locator("main h2")).toHaveText(bodyHeading);
  await expect(page.locator("main li")).toContainText(bodyListCopy);
  await expect(page.locator("main")).toContainText(bodyCopy);
  await expect(page.getByRole("img", { name: featuredAlt })).toBeVisible();
  await expect(page.getByRole("img", { name: bodyImageAlt })).toBeVisible();
  await expect(page.locator("figcaption").filter({ hasText: featuredCaption })).toHaveCount(1);
  await expect(page.locator("figcaption").filter({ hasText: bodyImageCaption })).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", absoluteUrl(`/news/${slug}`));
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", summary);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", `${title} | Green Belt Initiative`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /cdn\.sanity\.io/);
  await waitForMainImages(page);
  expect(await page.locator("body").innerText()).not.toContain("CMS TEST");
  await page.screenshot({ path: path.join(screenshotDir, "news-detail-desktop.png"), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/news/${slug}`);
  await expect(page.locator("main h1")).toHaveText(title);
  const overflow = await page.evaluate(() => {
    const width = window.innerWidth;
    return Array.from(document.querySelectorAll("body *"))
      .map(element => ({
        tag: element.tagName,
        className: typeof element.className === "string" ? element.className.slice(0, 80) : "",
        right: Math.round(element.getBoundingClientRect().right),
      }))
      .filter(item => item.right > width + 1)
      .slice(0, 8);
  });
  expect(overflow, JSON.stringify(overflow)).toEqual([]);
  await waitForMainImages(page);
  await page.screenshot({ path: path.join(screenshotDir, "news-detail-mobile.png"), fullPage: true });
});

test("isTestArticle fixture stays excluded from public data, sitemap, metadata and routing", async ({ request }) => {
  const state = useFixtureDataset([approvedVisualFixture, unapprovedFixture]);
  try {
    expect(await getApprovedArticles()).toHaveLength(1);
    expect(await getApprovedArticleSlugs()).toEqual([slug]);
    expect(await getApprovedArticleBySlug(unapprovedSlug)).toBeNull();
    const sitemapUrls = (await sitemap()).map(entry => entry.url);
    expect(sitemapUrls).toContain(absoluteUrl(`/news/${slug}`));
    expect(sitemapUrls).not.toContain(absoluteUrl(`/news/${unapprovedSlug}`));
    const metadata = await generateArticleMetadata({ params: Promise.resolve({ slug: unapprovedSlug }) });
    expect(metadata.title).toBe("News article");
    expect(metadata.description).toBe(
      "Read verified Green Belt Initiative news, updates and success stories from South Sudan.",
    );
  } finally {
    state.restore();
  }

  const response = await request.get(`/news/${unapprovedSlug}`);
  expect(response.status()).toBe(404);
});
