import { spawnSync } from 'child_process'

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

function main() {
  console.log('Step 1: Listing existing World Cup 2026 events...')
  const existing = listExisting()
  if (existing.length === 0) {
    console.log('  No existing events found. Nothing to update.')
    console.log('\nStep 2: Run `node scripts/calendar-viutv.mjs` to insert fresh events.')
    return
  }

  console.log(`  Found ${existing.length} events. Deleting...`)
  for (const ev of existing) {
    if (deleteEvent(ev.id)) {
      console.log(`  ✓ Deleted: ${ev.summary}`)
    } else {
      console.log(`  ✗ Failed to delete: ${ev.summary}`)
    }
  }

  console.log('\nStep 2: Run this command to re-insert with updated team names:')
  console.log('  node scripts/calendar-viutv.mjs')
}

main()
