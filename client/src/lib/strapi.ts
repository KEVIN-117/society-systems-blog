const DEFAULT_STRAPI_URL = "http://localhost:1337";

export function getStrapiUrl(path = ""): string {
  const baseUrl = (
    process.env.NEXT_PUBLIC_STRAPI_URL || DEFAULT_STRAPI_URL
  ).replace(/\/+$/, "");

  if (!path) return baseUrl;
  if (/^https?:\/\//i.test(path)) return path;

  return `${baseUrl}/${path.replace(/^\/+/, "")}`;
}
