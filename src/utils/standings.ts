import type { Match, GroupStanding } from '../types'
import { teams } from '../data/teams'

const teamMap = new Map(teams.map(t => [t.id, t]))

type Result = 0 | 1 | 2 // 0=home win, 1=draw, 2=away win

function generateResults(n: number): Result[][] {
  if (n === 0) return [[]]
  const sub = generateResults(n - 1)
  return sub.flatMap(r => [[0, ...r], [1, ...r], [2, ...r]])
}

export interface GroupStandingsResult {
  standings: GroupStanding[]
  confirmedFirstId?: string
}

export function computeStandings(group: string, matches: Match[]): GroupStandingsResult {
  const teamIds = new Set<string>()
  const groupMatches = matches.filter(m =>
    m.stage === 'group' && m.group === group && m.score1 !== undefined && m.score2 !== undefined
  )

  const remainingMatches = matches.filter(m =>
    m.stage === 'group' && m.group === group && m.score1 === undefined
  )

  for (const m of groupMatches) {
    teamIds.add(m.team1Id)
    teamIds.add(m.team2Id)
  }

  const standings = new Map<string, GroupStanding>()

  for (const id of teamIds) {
    const team = teamMap.get(id)
    standings.set(id, {
      team: team?.name || id,
      teamZh: team?.nameZh || id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      form: [],
    })
  }

  for (const m of groupMatches) {
    const s1 = standings.get(m.team1Id)!
    const s2 = standings.get(m.team2Id)!
    const g1 = m.score1!
    const g2 = m.score2!

    s1.played++
    s2.played++
    s1.gf += g1
    s1.ga += g2
    s2.gf += g2
    s2.ga += g1

    if (g1 > g2) {
      s1.won++; s2.lost++
      s1.pts += 3
      s1.form.push('W'); s2.form.push('L')
    } else if (g1 < g2) {
      s2.won++; s1.lost++
      s2.pts += 3
      s1.form.push('L'); s2.form.push('W')
    } else {
      s1.drawn++; s2.drawn++
      s1.pts += 1; s2.pts += 1
      s1.form.push('D'); s2.form.push('D')
    }
  }

  // Build head-to-head results from already-played matches
  const h2h = new Map<string, Map<string, number>>()
  for (const m of groupMatches) {
    if (!h2h.has(m.team1Id)) h2h.set(m.team1Id, new Map())
    if (!h2h.has(m.team2Id)) h2h.set(m.team2Id, new Map())
    const g1 = m.score1!
    const g2 = m.score2!
    if (g1 > g2) {
      h2h.get(m.team1Id)!.set(m.team2Id, 3)
      h2h.get(m.team2Id)!.set(m.team1Id, 0)
    } else if (g1 < g2) {
      h2h.get(m.team1Id)!.set(m.team2Id, 0)
      h2h.get(m.team2Id)!.set(m.team1Id, 3)
    } else {
      h2h.get(m.team1Id)!.set(m.team2Id, 1)
      h2h.get(m.team2Id)!.set(m.team1Id, 1)
    }
  }

  const allResults = generateResults(remainingMatches.length)
  const teamIdsList = Array.from(teamIds)

  const advanced = new Set<string>()
  const eliminated = new Set<string>()
  const confirmedFirst = new Set<string>()

  for (const id of teamIds) {
    let canFinishTop3 = false
    let canFinishOutsideTop2 = false
    let canFinishOutsideTop1 = false

    for (const results of allResults) {
      const finalPts = new Map<string, number>()
      for (const tid of teamIdsList) {
        finalPts.set(tid, standings.get(tid)!.pts)
      }
      for (let i = 0; i < remainingMatches.length; i++) {
        const m = remainingMatches[i]
        const r = results[i]
        if (r === 0) {
          finalPts.set(m.team1Id, (finalPts.get(m.team1Id) || 0) + 3)
        } else if (r === 2) {
          finalPts.set(m.team2Id, (finalPts.get(m.team2Id) || 0) + 3)
        } else {
          finalPts.set(m.team1Id, (finalPts.get(m.team1Id) || 0) + 1)
          finalPts.set(m.team2Id, (finalPts.get(m.team2Id) || 0) + 1)
        }
      }

      const teamPts = finalPts.get(id)!

      const definitelyAhead = Array.from(finalPts.entries())
        .filter(([tid, pts]) => {
          if (tid === id) return false
          if (pts > teamPts) return true
          if (pts === teamPts) {
            const h2hTid = h2h.get(tid)?.get(id) ?? 0
            const h2hId = h2h.get(id)?.get(tid) ?? 0
            return h2hTid > h2hId
          }
          return false
        }).length

      const notBehind = Array.from(finalPts.values()).filter(p => p >= teamPts).length

      if (definitelyAhead < 3) {
        canFinishTop3 = true
      }
      if (notBehind > 2) {
        canFinishOutsideTop2 = true
      }
      if (definitelyAhead > 0) {
        canFinishOutsideTop1 = true
      }
    }

    if (!canFinishTop3) eliminated.add(id)
    if (!canFinishOutsideTop2) advanced.add(id)
    if (!canFinishOutsideTop1) confirmedFirst.add(id)
  }

  const confirmedFirstId = confirmedFirst.size > 0 ? Array.from(confirmedFirst)[0] : undefined

  const result = Array.from(standings.entries())
    .map(([id, s]) => ({
      team: s.team,
      teamZh: s.teamZh,
      teamId: id,
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      gf: s.gf,
      ga: s.ga,
      gd: s.gf - s.ga,
      pts: s.pts,
      form: s.form,
      status: advanced.has(id) ? 'advanced' as const : eliminated.has(id) ? 'eliminated' as const : undefined,
    } as GroupStanding))
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      if (b.gd !== a.gd) return b.gd - a.gd
      if (b.gf !== a.gf) return b.gf - a.gf
      return a.team.localeCompare(b.team)
    })

  return { standings: result, confirmedFirstId }
}
