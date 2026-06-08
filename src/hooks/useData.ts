import { useMemo } from 'react'
import { matches } from '../data/matches'
import { teams, teamByName } from '../data/teams'
import { groups } from '../data/groups'
import { stadiums } from '../data/stadiums'
import { viutvMatchIds, viutvMatches } from '../data/viutv'
import { computeStandings } from '../utils/standings'
import type { Match, Team, Group, Stadium, GroupStanding } from '../types'

export function useMatches(): Match[] {
  return useMemo(() => matches.map(m => ({
    ...m,
    viutv: viutvMatchIds.has(m.id),
  })), [])
}

export function useTeams(): Team[] {
  return teams
}

export function useGroups(): Group[] {
  return groups
}

export function useStadiums(): Stadium[] {
  return stadiums
}

export function useViuTVMatches(): (Match & { hkDate: string; hkTime: string })[] {
  return useMemo(() => {
    const matchMap = new Map(matches.map(m => [m.id, m]))
    return viutvMatches.map(v => {
      const m = matchMap.get(v.matchId)!
      return { ...m, viutv: true, hkDate: v.hkDate, hkTime: v.hkTime }
    })
  }, [])
}

export function useStandings(groupId: string): GroupStanding[] {
  return useMemo(() => {
    const groupMatches = matches.filter(m => m.stage === 'group' && m.group === `Group ${groupId}`)
    return computeStandings(`Group ${groupId}`, groupMatches)
  }, [groupId])
}

export function useTeamByName(name: string): Team | undefined {
  return useMemo(() => teamByName.get(name), [name])
}

export function useMatchById(id: number): (Match & { viutv: boolean }) | undefined {
  return useMemo(() => {
    const m = matches.find(m => m.id === id)
    if (!m) return undefined
    return { ...m, viutv: viutvMatchIds.has(m.id) }
  }, [id])
}

export function useGroupMatches(groupId: string): Match[] {
  return useMemo(() => {
    return matches.filter(m => m.stage === 'group' && m.group === `Group ${groupId}`)
  }, [groupId])
}
