import { headers } from "next/headers";

function getFirstHeaderValue(value: string | null) {
  if (!value) return null;
  return value.split(",")[0]?.trim() || null;
}

export async function assertServerActionCsrf() {
  if (process.env.NODE_ENV === "test") return;

  const headerStore = await Promise.resolve(headers());
  const host = getFirstHeaderValue(
    headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  );
  if (!host) return;

  const protocol = getFirstHeaderValue(headerStore.get("x-forwarded-proto")) ?? "https";
  const expectedOrigin = `${protocol}://${host}`;
  const origin = getFirstHeaderValue(headerStore.get("origin"));

  if (origin && origin !== expectedOrigin) {
    throw new Error("Invalid origin");
  }

  const referer = headerStore.get("referer");
  if (referer && !referer.startsWith(expectedOrigin)) {
    throw new Error("Invalid referer");
  }
}
