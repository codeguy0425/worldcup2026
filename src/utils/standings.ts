import type { Match, GroupStanding } from '../types'
import { teams } from '../data/teams'

const teamMap = new Map(teams.map(t => [t.id, t]))

export function computeStandings(group: string, matches: Match[]): GroupStanding[] {
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

  const result = Array.from(standings.entries())
    .map(([id, s]) => {
      const remaining = remainingMatches.filter(m => m.team1Id === id || m.team2Id === id)

      // Best/worst case points
      const maxPts = s.pts + 3 * remaining.length

      // Other teams' currents pts (for elimination check - worst case for others
      // is they lose all remaining, so their "min" = current pts)
      const otherCurrentPts = Array.from(standings.entries())
        .filter(([oid]) => oid !== id)
        .map(([_, os]) => os.pts)
        .sort((a, b) => b - a)

      // Other teams' max possible pts (for advancement check)
      const otherMaxPts = Array.from(standings.entries())
        .filter(([oid]) => oid !== id)
        .map(([oid, os]) => {
          const oRemaining = remainingMatches.filter(m => m.team1Id === oid || m.team2Id === oid)
          return os.pts + 3 * oRemaining.length
        })
        .sort((a, b) => b - a)

      let status: 'advanced' | 'eliminated' | undefined

      // Eliminated: even winning all remaining, team can't reach 2nd place
      // (team's max pts < other teams' current 2nd-best pts who still have matches)
      if (maxPts < otherCurrentPts[1]) {
        status = 'eliminated'
      }

      // Advanced: even losing all remaining, no other team can catch top-2 spot
      // (team's current pts > 2nd-best possible pts of other teams)
      if (s.pts > otherMaxPts[1]) {
        status = 'advanced'
      }

      return {
        team: s.team,
        teamZh: s.teamZh,
        played: s.played,
        won: s.won,
        drawn: s.drawn,
        lost: s.lost,
        gf: s.gf,
        ga: s.ga,
        gd: s.gf - s.ga,
        pts: s.pts,
        form: s.form,
        status,
      } as GroupStanding
    })
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      if (b.gd !== a.gd) return b.gd - a.gd
      if (b.gf !== a.gf) return b.gf - a.gf
      return a.team.localeCompare(b.team)
    })

  return result
}
