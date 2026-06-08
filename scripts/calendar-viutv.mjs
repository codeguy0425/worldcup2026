import fs from 'fs'
import { spawnSync } from 'child_process'

const MATCHES_FILE = 'src/data/matches.ts'
const EVENT_IDS_FILE = 'scripts/.calendar-event-ids.json'

const TEAM_NAMES = {
  'MEX': 'Mexico', 'RSA': 'South Africa', 'KOR': 'South Korea', 'CZE': 'Czech Republic',
  'CAN': 'Canada', 'BIH': 'Bosnia & Herzegovina', 'QAT': 'Qatar', 'SUI': 'Switzerland',
  'BRA': 'Brazil', 'MAR': 'Morocco', 'HAI': 'Haiti', 'SCO': 'Scotland',
  'USA': 'USA', 'PAR': 'Paraguay', 'AUS': 'Australia', 'TUR': 'Turkey',
  'GER': 'Germany', 'CUW': 'Curaçao', 'CIV': 'Ivory Coast', 'ECU': 'Ecuador',
  'NED': 'Netherlands', 'JPN': 'Japan', 'SWE': 'Sweden', 'TUN': 'Tunisia',
  'BEL': 'Belgium', 'EGY': 'Egypt', 'IRN': 'Iran', 'NZL': 'New Zealand',
  'ESP': 'Spain', 'CPV': 'Cape Verde', 'KSA': 'Saudi Arabia', 'URU': 'Uruguay',
  'FRA': 'France', 'SEN': 'Senegal', 'IRQ': 'Iraq', 'NOR': 'Norway',
  'ARG': 'Argentina', 'ALG': 'Algeria', 'AUT': 'Austria', 'JOR': 'Jordan',
  'POR': 'Portugal', 'COD': 'DR Congo', 'UZB': 'Uzbekistan', 'COL': 'Colombia',
  'ENG': 'England', 'CRO': 'Croatia', 'GHA': 'Ghana', 'PAN': 'Panama',
}

const STADIUMS = {
  'mexico_city': { name: 'Estadio Azteca', city: 'Mexico City' },
  'guadalajara': { name: 'Estadio Guadalajara', city: 'Guadalajara' },
  'monterrey': { name: 'Estadio BBVA', city: 'Monterrey' },
  'toronto': { name: 'BMO Field', city: 'Toronto' },
  'vancouver': { name: 'BC Place', city: 'Vancouver' },
  'los_angeles': { name: 'SoFi Stadium', city: 'Los Angeles' },
  'new_york': { name: 'MetLife Stadium', city: 'New York/New Jersey' },
  'dallas': { name: 'AT&T Stadium', city: 'Dallas' },
  'kansas_city': { name: 'Arrowhead Stadium', city: 'Kansas City' },
  'houston': { name: 'NRG Stadium', city: 'Houston' },
  'atlanta': { name: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  'philadelphia': { name: 'Lincoln Financial Field', city: 'Philadelphia' },
  'seattle': { name: 'Lumen Field', city: 'Seattle' },
  'san_francisco': { name: "Levi's Stadium", city: 'San Francisco Bay Area' },
  'boston': { name: 'Gillette Stadium', city: 'Boston' },
  'miami': { name: 'Hard Rock Stadium', city: 'Miami' },
}

const STAGE_LABELS = {
  'group': 'Group Stage',
  'r32': 'Round of 32',
  'r16': 'Round of 16',
  'qf': 'Quarter-final',
  'sf': 'Semi-final',
  'third': 'Third Place',
  'final': 'Final',
}

const VIUTV_MATCHES = [
  { matchId: 1, hkDate: '2026-06-12', hkTime: '03:00' },
  { matchId: 7, hkDate: '2026-06-13', hkTime: '03:00' },
  { matchId: 19, hkDate: '2026-06-13', hkTime: '09:00' },
  { matchId: 49, hkDate: '2026-06-17', hkTime: '03:00' },
  { matchId: 62, hkDate: '2026-06-18', hkTime: '10:00' },
  { matchId: 4, hkDate: '2026-06-19', hkTime: '09:00' },
  { matchId: 21, hkDate: '2026-06-20', hkTime: '03:00' },
  { matchId: 36, hkDate: '2026-06-21', hkTime: '12:00' },
  { matchId: 40, hkDate: '2026-06-22', hkTime: '09:00' },
  { matchId: 52, hkDate: '2026-06-23', hkTime: '08:00' },
  { matchId: 58, hkDate: '2026-06-23', hkTime: '11:00' },
  { matchId: 70, hkDate: '2026-06-24', hkTime: '07:00' },
  { matchId: 64, hkDate: '2026-06-24', hkTime: '10:00' },
  { matchId: 6, hkDate: '2026-06-25', hkTime: '09:00' },
  { matchId: 23, hkDate: '2026-06-26', hkTime: '10:00' },
  { matchId: 42, hkDate: '2026-06-27', hkTime: '11:00' },
  { matchId: 89, hkDate: '2026-07-04', hkTime: '05:00' },
  { matchId: 91, hkDate: '2026-07-05', hkTime: '04:00' },
  { matchId: 93, hkDate: '2026-07-07', hkTime: '03:00' },
  { matchId: 98, hkDate: '2026-07-10', hkTime: '03:00' },
  { matchId: 100, hkDate: '2026-07-12', hkTime: '09:00' },
  { matchId: 101, hkDate: '2026-07-14', hkTime: '03:00' },
  { matchId: 102, hkDate: '2026-07-15', hkTime: '03:00' },
  { matchId: 103, hkDate: '2026-07-19', hkTime: '05:00' },
  { matchId: 104, hkDate: '2026-07-20', hkTime: '03:00' },
]

function readMatchData() {
  const content = fs.readFileSync(MATCHES_FILE, 'utf-8')
  const map = new Map()
  for (const line of content.split('\n')) {
    const id = line.match(/\b id: (\d+),/)?.[1]
    if (!id) continue
    map.set(parseInt(id), {
      team1Id: line.match(/team1Id: '([^']+)'/)?.[1],
      team2Id: line.match(/team2Id: '([^']+)'/)?.[1],
      groundId: line.match(/groundId: '([^']+)'/)?.[1],
      stage: line.match(/stage: '([^']+)'/)?.[1],
    })
  }
  return map
}

function endTime(hkDate, hkTime) {
  const d = new Date(`${hkDate}T${hkTime}:00+08:00`)
  d.setHours(d.getHours() + 2)
  return d.toISOString().replace(/\.\d{3}Z$/, '+08:00')
}

function gws(args) {
  const r = spawnSync('gws', args, { encoding: 'utf-8', timeout: 15000 })
  return { ok: r.status === 0, stdout: r.stdout?.trim() || '', stderr: r.stderr?.trim() || '' }
}

function listExisting() {
  const args = ['calendar', 'events', 'list', '--params', '{"q":"World Cup 2026"}', '--format', 'json']
  const r = gws(args)
  if (!r.ok) return []
  try {
    const data = JSON.parse(r.stdout)
    return (data.items || []).map(i => ({ id: i.id, summary: i.summary }))
  } catch { return [] }
}

function deleteEvent(eventId) {
  const r = gws(['calendar', 'events', 'delete', '--params', JSON.stringify({ eventId })])
  return r.ok
}

function insertEvent(summary, start, end, location, description) {
  const args = ['calendar', '+insert',
    '--summary', summary,
    '--start', start,
    '--end', end,
    '--location', location || 'TBD',
    '--description', description || '',
    '--format', 'json',
  ]
  const r = gws(args)
  if (r.ok) {
    try {
      const data = JSON.parse(r.stdout)
      return { ok: true, eventId: data.id }
    } catch {
      return { ok: true, eventId: null }
    }
  }
  return { ok: false, error: r.stderr }
}

async function main() {
  const isUpdate = process.argv.includes('--update')
  const matchMap = readMatchData()

  if (isUpdate) {
    console.log('Listing existing World Cup 2026 events...')
    const existing = listExisting()
    if (existing.length === 0) {
      console.log('  No existing events found to update.')
    } else {
      console.log(`  Found ${existing.length} events. Deleting...`)
      for (const ev of existing) {
        if (deleteEvent(ev.id)) {
          console.log(`  ✓ Deleted: ${ev.summary}`)
        } else {
          console.log(`  ✗ Failed to delete: ${ev.summary}`)
        }
      }
    }
    console.log()
  }

  console.log('Inserting ViuTV matches into calendar...')
  const eventIds = []
  let ok = 0
  let fail = 0

  for (const v of VIUTV_MATCHES) {
    const match = matchMap.get(v.matchId)
    if (!match) { console.log(`  ✗ Match ${v.matchId} not found`); fail++; continue }

    const team1 = TEAM_NAMES[match.team1Id] || match.team1Id
    const team2 = TEAM_NAMES[match.team2Id] || match.team2Id
    const stadium = STADIUMS[match.groundId]
    const stageLabel = STAGE_LABELS[match.stage] || match.stage

    const summary = `${team1} vs ${team2} (World Cup 2026)`
    const start = `${v.hkDate}T${v.hkTime}:00+08:00`
    const end = endTime(v.hkDate, v.hkTime)
    const location = stadium ? `${stadium.name}, ${stadium.city}` : ''
    const description = `${stageLabel} · ViuTV 99台 免費直播\nFree broadcast on ViuTV Hong Kong`

    const result = insertEvent(summary, start, end, location, description)
    if (result.ok) {
      console.log(`  ✓ ${summary}`)
      eventIds.push({ matchId: v.matchId, eventId: result.eventId, summary })
      ok++
    } else {
      console.log(`  ✗ ${summary} — ${result.error}`)
      fail++
    }
  }

  fs.writeFileSync(EVENT_IDS_FILE, JSON.stringify(eventIds, null, 2))
  console.log(`\nDone! ${ok} created, ${fail} failed. Event IDs saved to ${EVENT_IDS_FILE}`)
}

main().catch(err => { console.error(err); process.exit(1) })
