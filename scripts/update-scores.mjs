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

  const byNum = new Map()
  const byTeamKey = new Map()

  for (const m of data.matches) {
    const t1 = TEAM_IDS[m.team1]
    const t2 = TEAM_IDS[m.team2]
    if (m.num) byNum.set(m.num, m)
    if (t1 && t2) {
      byTeamKey.set(`${m.date}|${t1}|${t2}`, m)
    }
  }

  let content = fs.readFileSync(MATCHES_FILE, 'utf-8')
  const lines = content.split('\n')
  let updatedScores = 0
  let updatedTeams = 0
  let skipped = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const idMatch = line.match(/\b id: (\d+),/)
    if (!idMatch) continue

    const matchId = parseInt(idMatch[1])
    let ofm = byNum.get(matchId)

    if (!ofm) {
      const t1 = line.match(/team1Id: '([^']+)'/)
      const t2 = line.match(/team2Id: '([^']+)'/)
      const date = line.match(/date: '([^']+)'/)
      if (t1 && t2 && date) {
        ofm = byTeamKey.get(`${date[1]}|${t1[1]}|${t2[1]}`)
      }
    }

    if (!ofm) { skipped++; continue }

    const curT1 = line.match(/team1Id: '([^']+)'/)?.[1]
    const curT2 = line.match(/team2Id: '([^']+)'/)?.[1]
    const resolvedT1 = TEAM_IDS[ofm.team1]
    const resolvedT2 = TEAM_IDS[ofm.team2]

    if (ofm.score1 !== undefined && ofm.score2 !== undefined) {
      if (/score1:\s*\d+/.test(line)) {
        lines[i] = lines[i].replace(/score1: \d+, score2: \d+/g, `score1: ${ofm.score1}, score2: ${ofm.score2}`)
      } else {
        lines[i] = lines[i].replace(/team2Id: '[^']+'/, `$&, score1: ${ofm.score1}, score2: ${ofm.score2}`)
      }
      updatedScores++
    }

    if (curT1 && resolvedT1 && curT1 !== resolvedT1) {
      lines[i] = lines[i].replace(/team1Id: '[^']+'/, `team1Id: '${resolvedT1}'`)
      updatedTeams++
    }
    if (curT2 && resolvedT2 && curT2 !== resolvedT2) {
      lines[i] = lines[i].replace(/team2Id: '[^']+'/, `team2Id: '${resolvedT2}'`)
      updatedTeams++
    }
  }

  fs.writeFileSync(MATCHES_FILE, lines.join('\n'))
  console.log(`  Scores updated: ${updatedScores}, Team IDs resolved: ${updatedTeams}` +
    `, Skipped (no match in source): ${skipped}`)
  console.log('Done!')
}

main().catch(err => { console.error(err); process.exit(1) })
