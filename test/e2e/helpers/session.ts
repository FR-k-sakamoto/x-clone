import { expect, type Page } from "@playwright/test";

export async function loginWithCredentials(page: Page, email: string, password: string) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/", { timeout: 5000 }).catch(() => null);
  if (!page.url().endsWith("/")) {
    const error = (await page.getByRole("alert").first().textContent().catch(() => null)) ?? "unknown";
    throw new Error(
      `Login failed (${email}). Current URL: ${page.url()}, alert: ${error}. Run: npx prisma db seed --config prisma.config.ts`
    );
  }

  for (let i = 0; i < 3; i += 1) {
    await page.goto("/");
    const composer = page.getByPlaceholder("160文字以内で投稿");
    await composer.waitFor({ state: "visible", timeout: 4000 }).catch(() => null);
    if (await composer.isVisible().catch(() => false)) {
      return;
    }
    await page.waitForTimeout(500);
  }

  const loginCtaVisible = await page
    .getByRole("link", { name: "Go to login" })
    .isVisible()
    .catch(() => false);
  if (loginCtaVisible) {
    throw new Error(
      "Session was not established after sign-in (even after retries). Run: npx prisma db seed --config prisma.config.ts"
    );
  }
  throw new Error("Timed out waiting for authenticated home UI (Post composer).");
}

export async function loginAsSeedAlice(page: Page) {
  await loginWithCredentials(page, "alice@example.com", "password1234");
}

export async function loginAsSeedBob(page: Page) {
  await loginWithCredentials(page, "bob@example.com", "password1234");
}
