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

export interface ThirdPlaceEntry {
  group: string
  teamId: string
  teamName: string
  pts: number
  gd: number
  gf: number
}

export function computeThirdPlaceRanking(allMatches: Match[]): ThirdPlaceEntry[] {
  const groupMap = new Map<string, Match[]>()
  for (const m of allMatches) {
    if (m.stage !== 'group') continue
    if (!groupMap.has(m.group)) groupMap.set(m.group, [])
    groupMap.get(m.group)!.push(m)
  }

  const entries: ThirdPlaceEntry[] = []

  for (const [group, gm] of groupMap) {
    const teamIds = new Set<string>()
    const matchCounts = new Map<string, number>()
    let playedCount = 0
    for (const m of gm) {
      teamIds.add(m.team1Id)
      teamIds.add(m.team2Id)
      if (m.score1 !== undefined && m.score2 !== undefined) {
        matchCounts.set(m.team1Id, (matchCounts.get(m.team1Id) || 0) + 1)
        matchCounts.set(m.team2Id, (matchCounts.get(m.team2Id) || 0) + 1)
        playedCount++
      }
    }
    const allComplete = teamIds.size === 4 && playedCount === 6
    if (!allComplete) continue

    const { standings } = computeStandings(group, gm)
    if (standings.length >= 3) {
      const third = standings[2]
      entries.push({
        group,
        teamId: third.teamId || '',
        teamName: third.team,
        pts: third.pts,
        gd: third.gd,
        gf: third.gf,
      })
    }
  }

  entries.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.gd !== a.gd) return b.gd - a.gd
    if (b.gf !== a.gf) return b.gf - a.gf
    return a.teamName.localeCompare(b.teamName)
  })

  return entries
}

function computeMinThirdPlace(matches: Match[]): ThirdPlaceEntry | undefined {
  const groupMatches = matches.filter(m => m.score1 !== undefined && m.score2 !== undefined)
  const remainingMatches = matches.filter(m => m.score1 === undefined)
  if (remainingMatches.length === 0) return undefined

  const teamIds = new Set<string>()
  for (const m of groupMatches) {
    teamIds.add(m.team1Id)
    teamIds.add(m.team2Id)
  }
  for (const m of remainingMatches) {
    teamIds.add(m.team1Id)
    teamIds.add(m.team2Id)
  }

  const baseStats = new Map<string, { pts: number; gf: number; ga: number }>()
  for (const id of teamIds) {
    baseStats.set(id, { pts: 0, gf: 0, ga: 0 })
  }

  for (const m of groupMatches) {
    const s1 = baseStats.get(m.team1Id)!
    const s2 = baseStats.get(m.team2Id)!
    const g1 = m.score1!
    const g2 = m.score2!
    s1.gf += g1; s1.ga += g2
    s2.gf += g2; s2.ga += g1
    if (g1 > g2) s1.pts += 3
    else if (g2 > g1) s2.pts += 3
    else { s1.pts += 1; s2.pts += 1 }
  }

  const allResults = generateResults(remainingMatches.length)
  let worst: ThirdPlaceEntry | null = null
  const groupName = matches[0]?.group || ''

  for (const results of allResults) {
    const stats = new Map<string, { pts: number; gf: number; ga: number }>()
    for (const [id, s] of baseStats) {
      stats.set(id, { ...s })
    }

    for (let i = 0; i < remainingMatches.length; i++) {
      const m = remainingMatches[i]
      const r = results[i]
      const s1 = stats.get(m.team1Id)!
      const s2 = stats.get(m.team2Id)!
      const g1 = r === 0 ? 3 : r === 1 ? 0 : 0
      const g2 = r === 2 ? 3 : r === 1 ? 0 : 0
      s1.gf += g1; s1.ga += g2
      s2.gf += g2; s2.ga += g1
      if (r === 0) s1.pts += 3
      else if (r === 2) s2.pts += 3
      else { s1.pts += 1; s2.pts += 1 }
    }

    const sorted = [...teamIds].sort((a, b) => {
      const sa = stats.get(a)!
      const sb = stats.get(b)!
      if (sb.pts !== sa.pts) return sb.pts - sa.pts
      const gda = sa.gf - sa.ga, gdb = sb.gf - sb.ga
      if (gdb !== gda) return gdb - gda
      if (sb.gf !== sa.gf) return sb.gf - sa.gf
      return a.localeCompare(b)
    })

    const thirdId = sorted[2]
    if (thirdId) {
      const s = stats.get(thirdId)!
      const gd = s.gf - s.ga
      if (!worst || s.pts < worst.pts || (s.pts === worst.pts && gd < worst.gd) || (s.pts === worst.pts && gd === worst.gd && s.gf < worst.gf)) {
        worst = { group: groupName, teamId: thirdId, teamName: '', pts: s.pts, gd, gf: s.gf }
      }
    }
  }

  return worst || undefined
}

function computeMaxThirdPlace(matches: Match[]): ThirdPlaceEntry | undefined {
  const groupMatches = matches.filter(m => m.score1 !== undefined && m.score2 !== undefined)
  const remainingMatches = matches.filter(m => m.score1 === undefined)
  if (remainingMatches.length === 0) return undefined

  const teamIds = new Set<string>()
  for (const m of groupMatches) {
    teamIds.add(m.team1Id)
    teamIds.add(m.team2Id)
  }
  for (const m of remainingMatches) {
    teamIds.add(m.team1Id)
    teamIds.add(m.team2Id)
  }

  const baseStats = new Map<string, { pts: number; gf: number; ga: number }>()
  for (const id of teamIds) {
    baseStats.set(id, { pts: 0, gf: 0, ga: 0 })
  }

  for (const m of groupMatches) {
    const s1 = baseStats.get(m.team1Id)!
    const s2 = baseStats.get(m.team2Id)!
    const g1 = m.score1!
    const g2 = m.score2!
    s1.gf += g1; s1.ga += g2
    s2.gf += g2; s2.ga += g1
    if (g1 > g2) s1.pts += 3
    else if (g2 > g1) s2.pts += 3
    else { s1.pts += 1; s2.pts += 1 }
  }

  const allResults = generateResults(remainingMatches.length)
  let best: ThirdPlaceEntry | null = null
  const groupName = matches[0]?.group || ''

  for (const results of allResults) {
    const stats = new Map<string, { pts: number; gf: number; ga: number }>()
    for (const [id, s] of baseStats) {
      stats.set(id, { ...s })
    }

    for (let i = 0; i < remainingMatches.length; i++) {
      const m = remainingMatches[i]
      const r = results[i]
      const s1 = stats.get(m.team1Id)!
      const s2 = stats.get(m.team2Id)!
      const g1 = r === 0 ? 2 : r === 1 ? 1 : 1
      const g2 = r === 2 ? 2 : r === 1 ? 1 : 1
      s1.gf += g1; s1.ga += g2
      s2.gf += g2; s2.ga += g1
      if (r === 0) s1.pts += 3
      else if (r === 2) s2.pts += 3
      else { s1.pts += 1; s2.pts += 1 }
    }

    const sorted = [...teamIds].sort((a, b) => {
      const sa = stats.get(a)!
      const sb = stats.get(b)!
      if (sb.pts !== sa.pts) return sb.pts - sa.pts
      const gda = sa.gf - sa.ga, gdb = sb.gf - sb.ga
      if (gdb !== gda) return gdb - gda
      if (sb.gf !== sa.gf) return sb.gf - sa.gf
      return a.localeCompare(b)
    })

    const thirdId = sorted[2]
    if (thirdId) {
      const s = stats.get(thirdId)!
      const gd = s.gf - s.ga
      if (!best || s.pts > best.pts || (s.pts === best.pts && gd > best.gd) || (s.pts === best.pts && gd === best.gd && s.gf > best.gf)) {
        best = { group: groupName, teamId: thirdId, teamName: '', pts: s.pts, gd, gf: s.gf }
      }
    }
  }

  return best || undefined
}

export function computeThirdPlaceCeilings(allMatches: Match[]): ThirdPlaceEntry[] {
  const groupMap = new Map<string, Match[]>()
  for (const m of allMatches) {
    if (m.stage !== 'group') continue
    if (!groupMap.has(m.group)) groupMap.set(m.group, [])
    groupMap.get(m.group)!.push(m)
  }

  const ceilings: ThirdPlaceEntry[] = []

  for (const [group, gm] of groupMap) {
    const teamIds = new Set<string>()
    let playedCount = 0
    for (const m of gm) {
      teamIds.add(m.team1Id)
      teamIds.add(m.team2Id)
      if (m.score1 !== undefined && m.score2 !== undefined) {
        playedCount++
      }
    }
    const allComplete = teamIds.size === 4 && playedCount === 6

    if (allComplete) {
      const { standings } = computeStandings(group, gm)
      if (standings.length >= 3) {
        const third = standings[2]
        ceilings.push({
          group,
          teamId: third.teamId || '',
          teamName: third.team,
          pts: third.pts,
          gd: third.gd,
          gf: third.gf,
        })
      }
    } else {
      const ceiling = computeMaxThirdPlace(gm)
      if (ceiling) ceilings.push(ceiling)
    }
  }

  return ceilings
}

export function computeThirdPlaceFloors(allMatches: Match[]): ThirdPlaceEntry[] {
  const groupMap = new Map<string, Match[]>()
  for (const m of allMatches) {
    if (m.stage !== 'group') continue
    if (!groupMap.has(m.group)) groupMap.set(m.group, [])
    groupMap.get(m.group)!.push(m)
  }

  const floors: ThirdPlaceEntry[] = []

  for (const [group, gm] of groupMap) {
    const teamIds = new Set<string>()
    let playedCount = 0
    for (const m of gm) {
      teamIds.add(m.team1Id)
      teamIds.add(m.team2Id)
      if (m.score1 !== undefined && m.score2 !== undefined) {
        playedCount++
      }
    }
    const allComplete = teamIds.size === 4 && playedCount === 6

    if (allComplete) {
      const { standings } = computeStandings(group, gm)
      if (standings.length >= 3) {
        const third = standings[2]
        floors.push({
          group,
          teamId: third.teamId || '',
          teamName: third.team,
          pts: third.pts,
          gd: third.gd,
          gf: third.gf,
        })
      }
    } else {
      const floor = computeMinThirdPlace(gm)
      if (floor) floors.push(floor)
    }
  }

  return floors
}

export function computeStandings(
  group: string,
  matches: Match[],
  thirdPlaceRanking?: ThirdPlaceEntry[],
  thirdPlaceCeilings?: ThirdPlaceEntry[],
  thirdPlaceFloors?: ThirdPlaceEntry[]
): GroupStandingsResult {
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

  // Build a list of team IDs sorted by full tiebreakers
  const sortedTeamIds = [...teamIds].sort((a, b) => {
    const sa = standings.get(a)!
    const sb = standings.get(b)!
    if (sb.pts !== sa.pts) return sb.pts - sa.pts
    if (sb.gd !== sa.gd) return sb.gd - sa.gd
    if (sb.gf !== sa.gf) return sb.gf - sa.gf
    const h2hA = h2h.get(a)?.get(b) ?? 0
    const h2hB = h2h.get(b)?.get(a) ?? 0
    if (h2hB !== h2hA) return h2hB - h2hA
    return a.localeCompare(b)
  })

  const advanced = new Set<string>()
  const eliminated = new Set<string>()
  const confirmedFirst = new Set<string>()

  if (remainingMatches.length === 0) {
    // Group completed — use sorted standings directly
    for (let i = 0; i < sortedTeamIds.length; i++) {
      if (i < 2) advanced.add(sortedTeamIds[i])
      else if (i > 2) eliminated.add(sortedTeamIds[i])
      else if (i === 2) {
        if (thirdPlaceRanking) {
          const rankIdx = thirdPlaceRanking.findIndex(e => e.group === group)
          if (rankIdx >= 8) eliminated.add(sortedTeamIds[i])
        }
        if (thirdPlaceCeilings) {
          const thirdId = sortedTeamIds[2]
          const ts = standings.get(thirdId)
          if (ts) {
            const targetGd = ts.gf - ts.ga
            let betterCount = 0
            for (const c of thirdPlaceCeilings) {
              if (c.group === group) continue
              if (c.pts > ts.pts || (c.pts === ts.pts && c.gd > targetGd) || (c.pts === ts.pts && c.gd === targetGd && c.gf > ts.gf)) {
                betterCount++
              }
            }
            if (betterCount < 8) advanced.add(thirdId)
          }
        }
        if (thirdPlaceFloors) {
          const thirdId = sortedTeamIds[2]
          const ts = standings.get(thirdId)
          if (ts) {
            const targetGd = ts.gf - ts.ga
            let aheadCount = 0
            for (const f of thirdPlaceFloors) {
              if (f.group === group) continue
              if (f.pts > ts.pts || (f.pts === ts.pts && f.gd > targetGd) || (f.pts === ts.pts && f.gd === targetGd && f.gf > ts.gf)) {
                aheadCount++
              }
            }
            if (aheadCount >= 8) eliminated.add(thirdId)
          }
        }
      }
    }
    confirmedFirst.add(sortedTeamIds[0])
  } else {
    // Group still in progress — simulate all outcomes
    const allResults = generateResults(remainingMatches.length)
    const teamIdsList = Array.from(teamIds)

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
