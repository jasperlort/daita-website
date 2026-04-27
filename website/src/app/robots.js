export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://getdaita.com/sitemap.xml',
    host: 'https://getdaita.com',
  };
}
