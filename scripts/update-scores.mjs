import fs from 'fs'
import { TEAM_IDS } from './shared-data.mjs'

const OPENFOOTBALL_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
const MATCHES_FILE = 'src/data/matches.ts'

function parseMinute(str) {
  const parts = String(str).split('+')
  const minute = parseInt(parts[0])
  const stoppageTime = parts[1] ? parseInt(parts[1]) : undefined
  return { minute, stoppageTime }
}

function buildGoalsString(ofm, team1Id, team2Id) {
  const goals1 = ofm.goals1 || []
  const goals2 = ofm.goals2 || []
  if (goals1.length === 0 && goals2.length === 0) return null
  const esc = s => s.replace(/'/g, "\\'")
  const items = []
  for (const g of goals1) {
    const { minute, stoppageTime } = parseMinute(g.minute)
    const parts = [`minute: ${minute}`]
    if (stoppageTime !== undefined) parts.push(`stoppageTime: ${stoppageTime}`)
    parts.push(`scorer: '${esc(g.name)}'`, `teamId: '${team1Id}'`)
    if (g.owngoal) parts.push('ownGoal: true')
    if (g.penalty) parts.push('penalty: true')
    items.push(`{ ${parts.join(', ')} }`)
  }
  for (const g of goals2) {
    const { minute, stoppageTime } = parseMinute(g.minute)
    const parts = [`minute: ${minute}`]
    if (stoppageTime !== undefined) parts.push(`stoppageTime: ${stoppageTime}`)
    parts.push(`scorer: '${esc(g.name)}'`, `teamId: '${team2Id}'`)
    if (g.owngoal) parts.push('ownGoal: true')
    if (g.penalty) parts.push('penalty: true')
    items.push(`{ ${parts.join(', ')} }`)
  }
  items.sort((a, b) => {
    const ma = a.match(/minute: (\d+)/)?.[1] ?? 0
    const sa = a.match(/stoppageTime: (\d+)/)?.[1] ?? 0
    const mb = b.match(/minute: (\d+)/)?.[1] ?? 0
    const sb = b.match(/stoppageTime: (\d+)/)?.[1] ?? 0
    return (+ma * 60 + +sa) - (+mb * 60 + +sb)
  })
  return `goals: [${items.join(', ')}]`
}

async function main() {
  console.log('Fetching openfootball data...')
  const res = await fetch(OPENFOOTBALL_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching openfootball data`)
  const data = await res.json()
  const withScores = data.matches.filter(m => m.score?.ft?.length === 2)
  console.log(`  ${data.matches.length} total matches in source, ${withScores.length} with scores`)

  const byNum = new Map()
  const byTeamKey = new Map()

  for (const m of data.matches) {
    const t1 = TEAM_IDS[m.team1]
    const t2 = TEAM_IDS[m.team2]
    if (m.num) byNum.set(m.num, m)
    if (t1 && t2) {
      byTeamKey.set(`${t1}|${t2}`, m)
      byTeamKey.set(`${t2}|${t1}`, m)
    }
  }

  let content = fs.readFileSync(MATCHES_FILE, 'utf-8')
  const lines = content.split('\n')
  let updatedScores = 0
  let updatedTeams = 0
  let skipped = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const idMatch = line.match(/ id: (\d+),/)
    if (!idMatch) continue

    const matchId = parseInt(idMatch[1])

    let ofm = byNum.get(matchId)

    if (!ofm) {
      const t1 = line.match(/team1Id: '([^']+)'/)
      const t2 = line.match(/team2Id: '([^']+)'/)
      if (t1 && t2) {
        ofm = byTeamKey.get(`${t1[1]}|${t2[1]}`)
      }
    }

    if (!ofm) { skipped++; continue }

    const curT1 = line.match(/team1Id: '([^']+)'/)?.[1]
    const curT2 = line.match(/team2Id: '([^']+)'/)?.[1]
    const resolvedT1 = TEAM_IDS[ofm.team1]
    const resolvedT2 = TEAM_IDS[ofm.team2]
    if (ofm.score?.ft?.length === 2) {
      if (/score1:\s*\d+/.test(line)) {
        lines[i] = lines[i].replace(/score1: \d+, score2: \d+/g, `score1: ${ofm.score.ft[0]}, score2: ${ofm.score.ft[1]}`)
      } else {
        lines[i] = lines[i].replace(/team2Id: '[^']+'/, `$&, score1: ${ofm.score.ft[0]}, score2: ${ofm.score.ft[1]}`)
      }
      updatedScores++
      if ('goals1' in ofm || 'goals2' in ofm) {
        const goalsStr = buildGoalsString(ofm, resolvedT1 || curT1, resolvedT2 || curT2)
        if (goalsStr) {
          if (/goals: \[/.test(lines[i])) {
            lines[i] = lines[i].replace(/goals: \[[^\]]*\]/, goalsStr)
          } else {
            lines[i] = lines[i].replace(/(, stage: ')/, `, ${goalsStr}$1`)
          }
        } else {
          lines[i] = lines[i].replace(/, goals: \[[^\]]*\]/, '')
        }
      }
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
