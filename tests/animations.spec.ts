import { expect, test } from "@playwright/test";

test("scroll reveals run once and keep content available", async ({ page }) => {
  await page.goto("/projects");
  const footer = page.locator("footer");
  await expect(footer).toHaveAttribute("data-motion", "pending");
  await expect(footer).toHaveCSS("translate", "none");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toHaveAttribute("data-motion", "visible");
  await expect(footer).toHaveCSS("opacity", "1");
  await expect(footer).toHaveCSS("translate", "none");
  await page.evaluate(() => scrollTo(0, 0));
  await expect(footer).toHaveAttribute("data-motion", "visible");
});

test("reduced motion retains static artwork and removes entrances", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-image h1")).toHaveCSS("animation-name", "none");
  await page.locator("[data-growth-illustration]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-growth-illustration] svg")).toBeVisible();
  await expect(page.locator("[data-sapling-player]")).toHaveCount(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-motion='pending']")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCSS("opacity", "1");
});

test("Remotion loads near the viewport, grows, and respects live motion preference", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-sapling-player]")).toHaveCount(0);
  await page.locator("[data-growth-illustration]").scrollIntoViewIfNeeded();
  const player = page.locator("[data-sapling-player]");
  await expect(player).toBeVisible();
  const stem = player.locator("path[stroke-dasharray='1']");
  await expect.poll(async () => Number(await stem.getAttribute("stroke-dashoffset"))).toBeLessThan(0.9);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  // Allow the visibility observer to pause before comparing animation state.
  await page.waitForTimeout(150);
  const paused = await stem.getAttribute("stroke-dashoffset");
  await page.waitForTimeout(250);
  expect(await stem.getAttribute("stroke-dashoffset")).toBe(paused);
  await page.locator("[data-growth-illustration]").scrollIntoViewIfNeeded();
  await expect(stem).toHaveAttribute("stroke-dashoffset", "0", { timeout: 7000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(player).toHaveCount(0);
  await expect(page.locator("[data-growth-illustration] svg")).toBeVisible();
});

test("content and static sapling remain visible with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Our Work", exact: true })).toBeVisible();
  await page.locator("[data-growth-illustration]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-growth-illustration] svg")).toBeVisible();
  await expect(page.locator("[data-motion='pending']")).toHaveCount(0);
  await context.close();
});

test("closing mobile navigation removes it from keyboard and accessibility navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  const menu = page.locator("#mobile-navigation");
  await expect(menu).not.toHaveAttribute("inert");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("inert");
  await expect(menu).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
});
