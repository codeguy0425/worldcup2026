import type { Match, GroupStanding } from '../types'
import { teams } from '../data/teams'

const teamMap = new Map(teams.map(t => [t.id, t]))

export function computeStandings(group: string, matches: Match[]): GroupStanding[] {
  const teamIds = new Set<string>()
  const groupMatches = matches.filter(m =>
    m.stage === 'group' && m.group === group && m.score1 !== undefined && m.score2 !== undefined
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

  return Array.from(standings.values())
    .map(s => ({ ...s, gd: s.gf - s.ga }))
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      if (b.gd !== a.gd) return b.gd - a.gd
      return b.gf - a.gf
    })
}
