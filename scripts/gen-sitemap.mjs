import { writeFileSync } from 'fs'
import { teams } from './shared-data.mjs'

const base = 'https://codeguy0425.github.io/worldcup2026'

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function url(loc, priority, changefreq) {
  return `  <url>\n    <loc>${base}${esc(loc)}</loc>\n    <priority>${priority}</priority>\n    <changefreq>${changefreq}</changefreq>\n  </url>`
}

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

const pages = [
  ['/', '1.0', 'daily'],
  ['/fixtures', '0.8', 'daily'],
  ['/groups', '0.8', 'weekly'],
  ['/teams', '0.7', 'weekly'],
  ['/stadiums', '0.6', 'monthly'],
  ['/bracket', '0.9', 'weekly'],
  ['/viutv', '0.9', 'weekly'],
  ['/more', '0.5', 'monthly'],
]
for (const [loc, pri, freq] of pages) {
  xml += url(loc, pri, freq) + '\n'
}

for (let i = 0; i < 12; i++) {
  const letter = String.fromCharCode(65 + i)
  xml += url('/groups/' + letter, '0.6', 'weekly') + '\n'
}

for (const t of teams) {
  xml += url('/teams/' + encodeURIComponent(t.name), '0.5', 'monthly') + '\n'
}

xml += '</urlset>\n'

writeFileSync('public/sitemap.xml', xml, 'utf-8')
console.log('Written ' + (pages.length + 12 + teams.length) + ' URLs to public/sitemap.xml')
