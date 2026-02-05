const RAW_BASE = (import.meta as any)?.env?.VITE_API_BASE_URL;

const API_BASE_URL = typeof RAW_BASE === 'string' ? RAW_BASE.trim().replace(/\/+$/, '') : '';

function joinUrl(base: string, urlPath: string) {
  if (!base) return urlPath;
  if (/^https?:\/\//i.test(urlPath)) return urlPath;
  if (urlPath.startsWith('/')) return `${base}${urlPath}`;
  return `${base}/${urlPath}`;
}

export function apiUrl(path: string) {
  return joinUrl(API_BASE_URL, path);
}

export function resolvePublicUrl(url: string) {
  if (!url) return url;
  // Quando o frontend fica em outro domínio, URLs como "/uploads/..." precisam ir para o domínio da API.
  if (API_BASE_URL && url.startsWith('/uploads/')) return joinUrl(API_BASE_URL, url);
  return url;
}
