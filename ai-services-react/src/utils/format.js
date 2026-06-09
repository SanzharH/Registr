export function formatProbability(value) {
  if (typeof value !== "number") {
    return "";
  }

  return `${Math.round(value * 100)}%`;
}

export function normalizeAssetUrl(baseUrl, assetUrl) {
  if (!assetUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(assetUrl) || assetUrl.startsWith("blob:") || assetUrl.startsWith("data:")) {
    return assetUrl;
  }

  return `${baseUrl}${assetUrl.startsWith("/") ? "" : "/"}${assetUrl}`;
}
