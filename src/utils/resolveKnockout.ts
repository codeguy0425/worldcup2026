import { teams } from '../data/teams'
import type { Match } from '../types'
import { computeStandings, type GroupStandingsResult } from './standings'

const groupMatchCache = new Map<string, GroupStandingsResult>()

function getGroupStandings(groupId: string, allGroupMatches: Match[]): GroupStandingsResult {
  if (!groupMatchCache.has(groupId)) {
    const groupMatches = allGroupMatches.filter(m => m.group === `Group ${groupId}`)
    groupMatchCache.set(groupId, computeStandings(`Group ${groupId}`, groupMatches))
  }
  return groupMatchCache.get(groupId)!
}

function isRealTeamId(id: string): boolean {
  return teams.some(t => t.id === id)
}

export function resolveTeamId(placeholder: string, allGroupMatches: Match[]): string {
  if (isRealTeamId(placeholder)) return placeholder

  const winnerMatch = placeholder.match(/^1([A-L])$/)
  if (winnerMatch) {
    const groupId = winnerMatch[1]
    const result = getGroupStandings(groupId, allGroupMatches)
    if (result.confirmedFirstId) return result.confirmedFirstId
  }

  return placeholder
}

export function clearKnockoutCache() {
  groupMatchCache.clear()
}
