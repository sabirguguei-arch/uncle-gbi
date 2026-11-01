import { expect, test } from "@playwright/test";
import { programs } from "../content/programs";
import { publicProjects } from "../content/projects";

const routes = [
  "/", "/about", "/programs", "/projects", "/contact", "/get-involved",
  ...programs.map(program => `/programs/${program.slug}`),
  ...publicProjects.map(project => `/projects/${project.slug}`),
];

test("all public pages render, photographs load, and layouts fit the viewport", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Green Belt Initiative home" })).toBeVisible();
    await expect(page.getByAltText("Green Belt Initiative logo").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { message: `${route}: ${await image.getAttribute("alt")}` }).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("desktop and mobile navigation, escape dismissal, and back history work", async ({ page }) => {
  await page.goto("/");
  const primary = page.getByRole("navigation", { name: "Primary navigation" });
  if (await primary.isVisible()) {
    await primary.getByRole("link", { name: "About GBI", exact: true }).click();
  } else {
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "About GBI", exact: true }).click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
  }
  await expect(page).toHaveURL(/\/about$/);
  await page.locator("footer").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
});

test("direct-entry back button falls back to home", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("contact validates fields and prepares the existing email without sending", async ({ page }) => {
  await page.goto("/contact");
  const submit = page.getByRole("button", { name: "Prepare email" });
  await submit.click();
  await expect(page.locator("form").getByRole("alert")).toHaveCount(4);
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await page.getByLabel("Name", { exact: true }).fill("GBI migration check");
  await page.getByLabel("Email", { exact: true }).fill("invalid");
  await page.getByLabel("Subject", { exact: true }).fill("Website validation");
  await page.getByLabel("Message", { exact: true }).fill("Local validation only & no email sent.");
  await submit.click();
  await expect(page.getByText("Please enter a valid email address.", { exact: true })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("validation@example.org");
  await submit.click();
  await expect(page.locator("form").getByRole("alert")).toHaveCount(0);
  const href = await page.getByRole("link", { name: "Open prepared email" }).getAttribute("href");
  const mailto = new URL(href!);
  expect(mailto.protocol).toBe("mailto:");
  expect(mailto.pathname).toBe("green.beltinitiative@gmail.com");
  expect(mailto.searchParams.get("subject")).toBe("Website validation");
  expect(mailto.searchParams.get("body")).toContain("Local validation only & no email sent.");
  await page.getByLabel("Subject", { exact: true }).fill("Updated subject");
  await expect(page.getByRole("link", { name: "Open prepared email" })).toHaveCount(0);
});

test("image optimization accepts valid requests and rejects unsafe sources", async ({ request }) => {
  const image = await request.get("/_next/image?url=%2Fimages%2Fgbi-sudd-wetlands-hero.jpg&w=640&q=75", { headers: { accept: "image/webp" } });
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toBe("image/webp");
  expect((await image.body()).length).toBeGreaterThan(1000);
  expect((await request.get("/_next/image?url=%2Fimages%2Fgbi-sudd-wetlands-hero.jpg&w=640&q=99")).status()).toBe(400);
  expect((await request.get("/_next/image?url=https%3A%2F%2Fexample.org%2Fimage.jpg&w=640&q=75")).status()).toBe(400);
});

test("sitemap, robots, and missing pages preserve existing behavior", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("<urlset");
  for (const route of ["/about", "/programs", "/projects", "/contact", "/get-involved"]) expect(xml).toContain(`${route}</loc>`);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  for (const route of ["/migration-missing", "/programs/migration-missing", "/projects/migration-missing"]) expect((await request.get(route)).status()).toBe(404);
});

test("donation availability and narrow mobile layout remain unchanged", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const amount = page.getByLabel("Contribution amount", { exact: true });
  await amount.fill("25");
  await page.getByRole("button", { name: "Donate with PayPal" }).click();
  await expect(page.locator("#donation-note")).toContainText("Online donations are not available yet. Please check back soon.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page).toHaveURL("/");
});
