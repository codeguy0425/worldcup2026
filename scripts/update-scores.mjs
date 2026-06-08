import fs from 'fs'

const OPENFOOTBALL_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
const MATCHES_FILE = 'src/data/matches.ts'

const TEAM_IDS = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR', 'Czech Republic': 'CZE',
  'Canada': 'CAN', 'Bosnia & Herzegovina': 'BIH', 'Qatar': 'QAT', 'Switzerland': 'SUI',
  'Brazil': 'BRA', 'Morocco': 'MAR', 'Haiti': 'HAI', 'Scotland': 'SCO',
  'USA': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS', 'Turkey': 'TUR',
  'Germany': 'GER', 'Curaçao': 'CUW', 'Ivory Coast': 'CIV', 'Ecuador': 'ECU',
  'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
  'Belgium': 'BEL', 'Egypt': 'EGY', 'Iran': 'IRN', 'New Zealand': 'NZL',
  'Spain': 'ESP', 'Cape Verde': 'CPV', 'Saudi Arabia': 'KSA', 'Uruguay': 'URU',
  'France': 'FRA', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Norway': 'NOR',
  'Argentina': 'ARG', 'Algeria': 'ALG', 'Austria': 'AUT', 'Jordan': 'JOR',
  'Portugal': 'POR', 'DR Congo': 'COD', 'Uzbekistan': 'UZB', 'Colombia': 'COL',
  'England': 'ENG', 'Croatia': 'CRO', 'Ghana': 'GHA', 'Panama': 'PAN',
}

async function main() {
  console.log('Fetching openfootball data...')
  const res = await fetch(OPENFOOTBALL_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching openfootball data`)
  const data = await res.json()
  console.log(`  ${data.matches.length} total matches in source`)

  const scoresByTeamKey = new Map()
  const scoresByNum = new Map()

  for (const m of data.matches) {
    if (m.score1 === undefined || m.score2 === undefined) continue
    const t1 = TEAM_IDS[m.team1]
    const t2 = TEAM_IDS[m.team2]
    if (t1 && t2) {
      scoresByTeamKey.set(`${m.date}|${t1}|${t2}`, { score1: m.score1, score2: m.score2 })
    }
    if (m.num) {
      scoresByNum.set(m.num, { score1: m.score1, score2: m.score2 })
    }
  }

  console.log(`  ${scoresByTeamKey.size + scoresByNum.size} matches have scores to apply`)

  let content = fs.readFileSync(MATCHES_FILE, 'utf-8')
  const lines = content.split('\n')
  let updated = 0
  let skipped = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const idMatch = line.match(/\b id: (\d+),/)
    if (!idMatch) continue

    const matchId = parseInt(idMatch[1])
    let score = scoresByNum.get(matchId)

    if (!score) {
      const t1 = line.match(/team1Id: '([^']+)'/)
      const t2 = line.match(/team2Id: '([^']+)'/)
      const date = line.match(/date: '([^']+)'/)
      if (t1 && t2 && date) {
        score = scoresByTeamKey.get(`${date[1]}|${t1[1]}|${t2[1]}`)
      }
    }

    if (!score) { skipped++; continue }

    if (/score1:\s*\d+/.test(line)) {
      lines[i] = line.replace(/score1: \d+, score2: \d+/g, `score1: ${score.score1}, score2: ${score.score2}`)
    } else {
      lines[i] = line.replace(/team2Id: '[^']+'/, `$&, score1: ${score.score1}, score2: ${score.score2}`)
    }
    updated++
  }

  fs.writeFileSync(MATCHES_FILE, lines.join('\n'))
  console.log(`  ${updated} matches updated, ${skipped} skipped (no score in source)`)
  console.log('Done!')
}

main().catch(err => { console.error(err); process.exit(1) })
