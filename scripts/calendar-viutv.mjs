import fs from 'fs'
import { execSync } from 'child_process'
import { TEAM_NAMES, STADIUMS, STAGE_LABELS, VIUTV_MATCHES } from './shared-data.mjs'

const MATCHES_FILE = 'src/data/matches.ts'
const EVENT_IDS_FILE = 'scripts/.calendar-event-ids.json'

function readMatchData() {
  const content = fs.readFileSync(MATCHES_FILE, 'utf-8')
  const map = new Map()
  for (const line of content.split('\n')) {
    const id = line.match(/^\s*\{\s*id:\s*(\d+)/)?.[1]
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
  const ms = d.getTime() + 2 * 3600000 + 8 * 3600000
  const d2 = new Date(ms)
  const y = d2.getUTCFullYear()
  const m = String(d2.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d2.getUTCDate()).padStart(2, '0')
  const h = String(d2.getUTCHours()).padStart(2, '0')
  const min = String(d2.getUTCMinutes()).padStart(2, '0')
  return `${y}-${m}-${day}T${h}:${min}:00+08:00`
}

function gws(args) {
  const parts = args.map(a => {
    if (a.startsWith('-')) return a
    return "'" + a.replace(/'/g, "''") + "'"
  })
  const cmd = 'gws ' + parts.join(' ')
  try {
    const out = execSync(cmd, { shell: 'powershell.exe', encoding: 'utf-8', timeout: 15000 })
    return { ok: true, stdout: out?.trim() || '' }
  } catch (e) {
    return { ok: false, stderr: e.stderr?.toString()?.trim() || e.message }
  }
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
