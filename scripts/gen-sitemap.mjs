import { writeFileSync } from 'fs'

const teams = [
  { id:'MEX', name:'Mexico' }, { id:'RSA', name:'South Africa' }, { id:'KOR', name:'South Korea' }, { id:'CZE', name:'Czech Republic' },
  { id:'CAN', name:'Canada' }, { id:'BIH', name:'Bosnia & Herzegovina' }, { id:'QAT', name:'Qatar' }, { id:'SUI', name:'Switzerland' },
  { id:'BRA', name:'Brazil' }, { id:'MAR', name:'Morocco' }, { id:'HAI', name:'Haiti' }, { id:'SCO', name:'Scotland' },
  { id:'USA', name:'USA' }, { id:'PAR', name:'Paraguay' }, { id:'AUS', name:'Australia' }, { id:'TUR', name:'Turkey' },
  { id:'GER', name:'Germany' }, { id:'CUW', name:'Curaçao' }, { id:'CIV', name:'Ivory Coast' }, { id:'ECU', name:'Ecuador' },
  { id:'NED', name:'Netherlands' }, { id:'JPN', name:'Japan' }, { id:'SWE', name:'Sweden' }, { id:'TUN', name:'Tunisia' },
  { id:'BEL', name:'Belgium' }, { id:'EGY', name:'Egypt' }, { id:'IRN', name:'Iran' }, { id:'NZL', name:'New Zealand' },
  { id:'ESP', name:'Spain' }, { id:'CPV', name:'Cape Verde' }, { id:'KSA', name:'Saudi Arabia' }, { id:'URU', name:'Uruguay' },
  { id:'FRA', name:'France' }, { id:'SEN', name:'Senegal' }, { id:'IRQ', name:'Iraq' }, { id:'NOR', name:'Norway' },
  { id:'ARG', name:'Argentina' }, { id:'ALG', name:'Algeria' }, { id:'AUT', name:'Austria' }, { id:'JOR', name:'Jordan' },
  { id:'POR', name:'Portugal' }, { id:'COD', name:'DR Congo' }, { id:'UZB', name:'Uzbekistan' }, { id:'COL', name:'Colombia' },
  { id:'ENG', name:'England' }, { id:'CRO', name:'Croatia' }, { id:'GHA', name:'Ghana' }, { id:'PAN', name:'Panama' },
]

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
