import { evaluate, parse } from "groq-js";
import { sanityClient } from "../../lib/sanity";

export type Fixture = {
  _id: string;
  _type: "article";
  title?: string;
  slug?: { current?: string };
  category?: string;
  summary?: string;
  body?: Array<Record<string, unknown>>;
  author?: string;
  publishedAt?: string;
  featuredImage?: Record<string, unknown>;
  editorialStatus?: string;
  isVerified?: boolean;
  isTestArticle?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  apiToken?: string;
};

export type OptionalFixtureField = Exclude<keyof Fixture, "_id" | "_type">;

export const FIXED_NOW = new Date("2026-11-25T00:00:00.000Z");
export const INTERNAL_REVIEWER = "INTERNAL_REVIEWER_MUST_NOT_PUBLISH";
export const INTERNAL_NOTE = "INTERNAL_NOTE_MUST_NOT_PUBLISH";
export const INTERNAL_TOKEN = "INTERNAL_TOKEN_MUST_NOT_PUBLISH";
export const VALID_IMAGE_REF = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";

export const bodyBlock = {
  _type: "block",
  _key: "block-1",
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: "span-1", text: "Fixture body copy", marks: [] }],
};

export function fixture(name: string, overrides: Partial<Fixture> = {}): Fixture {
  return {
    _id: `${name}-article`,
    _type: "article",
    title: `Fixture ${name}`,
    slug: { current: `${name}-fixture-article` },
    category: "news",
    summary: `Fixture summary for ${name}.`,
    body: [{ ...bodyBlock, children: bodyBlock.children.map(child => ({ ...child })) }],
    author: "GBI Editorial Team",
    publishedAt: "2026-11-14T00:00:00.000Z",
    featuredImage: {
      _type: "image",
      asset: { _type: "reference", _ref: VALID_IMAGE_REF },
      alt: `Fixture image for ${name}`,
      caption: `Fixture image caption for ${name}`,
    },
    editorialStatus: "verified",
    isVerified: true,
    isTestArticle: false,
    verifiedBy: INTERNAL_REVIEWER,
    verifiedAt: "2026-11-10T00:00:00.000Z",
    verificationNotes: INTERNAL_NOTE,
    apiToken: INTERNAL_TOKEN,
    ...overrides,
  };
}

export function withoutField(article: Fixture, field: OptionalFixtureField): Fixture {
  const copy: Fixture = { ...article };
  delete copy[field];
  return copy;
}

export const approved = fixture("approved", {
  title: "Approved fixture article",
  slug: { current: "approved-fixture-article" },
});

export const approvedWithBodyImage = fixture("approved-with-body-image", {
  publishedAt: "2026-11-13T00:00:00.000Z",
  body: [
    { ...bodyBlock, children: bodyBlock.children.map(child => ({ ...child })) },
    {
      _type: "image",
      _key: "body-image-1",
      asset: { _type: "reference", _ref: VALID_IMAGE_REF },
      alt: "Fixture body image alt",
      caption: "Fixture body image caption",
      hotspot: { x: 0.5, y: 0.5, height: 0.4, width: 0.4 },
      crop: { top: 0, bottom: 0, left: 0, right: 0 },
    },
  ],
});

export const approvedWithBodyImageType = fixture("approved-with-bodyimage-type", {
  publishedAt: "2026-11-12T00:00:00.000Z",
  body: [
    { ...bodyBlock, children: bodyBlock.children.map(child => ({ ...child })) },
    {
      _type: "bodyImage",
      _key: "body-image-2",
      asset: { _type: "reference", _ref: VALID_IMAGE_REF },
      alt: "Fixture bodyImage alt",
    },
  ],
});

export const approvedWithoutFeaturedImage = withoutField(
  fixture("approved-without-featured-image", { publishedAt: "2026-11-11T00:00:00.000Z" }),
  "featuredImage",
);

export const fixtures = {
  approved,
  approvedWithBodyImage,
  approvedWithBodyImageType,
  approvedWithoutFeaturedImage,
  publishedTest: fixture("published-test", { isTestArticle: true }),
  draft: fixture("draft", { _id: "drafts.draft-fixture-article", editorialStatus: "draft" }),
  rejected: fixture("rejected", { editorialStatus: "rejected" }),
  unverified: fixture("unverified", { isVerified: false }),
  inReview: fixture("in-review", { editorialStatus: "inReview" }),
  futureDated: fixture("future-dated", { publishedAt: "2026-12-01T00:00:00.000Z" }),
  missingTitle: fixture("missing-title", { title: "" }),
  missingSlug: fixture("missing-slug", { slug: { current: "" } }),
  unsupportedCategory: fixture("unsupported-category", { category: "personal" }),
  missingSummary: fixture("missing-summary", { summary: "" }),
  missingBody: fixture("missing-body", { body: [] }),
  imageWithoutAlt: fixture("image-without-alt", {
    body: [
      { ...bodyBlock, children: bodyBlock.children.map(child => ({ ...child })) },
      { _type: "image", _key: "bad-image", asset: { _ref: VALID_IMAGE_REF }, alt: "" },
    ],
  }),
  bodyImageWithoutAlt: fixture("bodyimage-without-alt", {
    body: [
      { ...bodyBlock, children: bodyBlock.children.map(child => ({ ...child })) },
      { _type: "bodyImage", _key: "bad-body-image", asset: { _ref: VALID_IMAGE_REF }, alt: "" },
    ],
  }),
  missingAuthor: fixture("missing-author", { author: "" }),
  missingPublishedAt: withoutField(fixture("missing-published-at"), "publishedAt"),
  missingFeaturedImageAsset: fixture("missing-featured-image-asset", { featuredImage: { alt: "No asset" } }),
  missingFeaturedImageAlt: fixture("missing-featured-image-alt", { featuredImage: { asset: { _ref: VALID_IMAGE_REF }, alt: "" } }),
};

export const publicFixtures = [approved, approvedWithBodyImage, approvedWithBodyImageType, approvedWithoutFeaturedImage];
export const publicIds = new Set(publicFixtures.map(article => article._id));
export const publicSlugs = publicFixtures.map(article => article.slug?.current ?? "");

export function publicImage(image: Record<string, unknown> | undefined) {
  const result: Record<string, unknown> = {};
  const asset = image?.asset as Record<string, unknown> | undefined;
  if (asset) {
    result.asset = Object.fromEntries(Object.entries(asset).filter(([key]) => key === "_ref" || key === "_type"));
  }
  if (image && "alt" in image) result.alt = image.alt;
  if (image && "caption" in image) result.caption = image.caption;
  return result;
}

export function publicBody(items: Array<Record<string, unknown>>) {
  return items.map(item => {
    if (item._type === "block") {
      return {
        _type: item._type,
        _key: item._key,
        style: item.style,
        markDefs: (item.markDefs as Array<Record<string, unknown>>).map(mark => ({ _key: mark._key, _type: mark._type })),
        children: (item.children as Array<Record<string, unknown>>).map(child => ({
          _type: child._type,
          _key: child._key,
          text: child.text,
          marks: child.marks,
        })),
      };
    }
    if (item._type === "image" || item._type === "bodyImage") {
      const result: Record<string, unknown> = {
        _type: item._type,
        _key: item._key,
        ...publicImage(item),
      };
      if (item.hotspot) result.hotspot = item.hotspot;
      if (item.crop) result.crop = item.crop;
      return result;
    }
    return {};
  });
}

export function publicCard(article: Fixture) {
  const card: Record<string, unknown> = {
    id: article._id,
    title: article.title,
    slug: article.slug?.current,
    category: article.category,
    summary: article.summary,
    publishedAt: article.publishedAt,
  };
  if (article.featuredImage !== undefined) card.featuredImage = publicImage(article.featuredImage);
  return card;
}

export function publicDetail(article: Fixture) {
  return {
    ...publicCard(article),
    author: article.author,
    body: publicBody(article.body ?? []),
  };
}

export function useFixtureDataset(dataset: Fixture[]) {
  const client = sanityClient as unknown as {
    fetch: (query: string, params?: Record<string, unknown>) => Promise<unknown>;
  };
  const originalFetch = client.fetch;
  const calls: Array<{ query: string; params: Record<string, unknown> }> = [];

  client.fetch = async (query, params = {}) => {
    calls.push({ query, params });
    const value = await evaluate(parse(query), { dataset, params, timestamp: FIXED_NOW });
    return value.get();
  };

  return {
    calls,
    restore: () => {
      client.fetch = originalFetch;
    },
  };
}
