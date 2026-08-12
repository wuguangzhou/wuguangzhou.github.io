export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatMonth(date: Date): string {
  return String(date.getMonth() + 1).padStart(2, '0');
}

export function readingTime(text: string): number {
  const chars = text.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(chars / 300));
}

/** Astro 7 glob loader 的 entry.id 含 .md 后缀，此函数提取纯 slug */
export function slug(entry: { id: string }): string {
  return entry.id.replace(/\.md$/, '');
}
