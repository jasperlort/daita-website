export default function sitemap() {
  const base = 'https://getdaita.com';
  const now = new Date().toISOString();
  const sections = [
    '',           // /
    '#manifesto',
    '#how',
    '#capabilities',
    '#uses',
    '#contrib',
    '#final',
  ];
  return sections.map((s) => ({
    url: `${base}/${s}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: s === '' ? 1.0 : 0.7,
  }));
}
