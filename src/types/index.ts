export interface GoalEvent {
  minute: number
  stoppageTime?: number
  scorer: string
  teamId: string
  assist?: string
  ownGoal?: boolean
  penalty?: boolean
}

export interface Match {
  id: number
  round: string
  date: string
  time: string
  timeUtc: string
  team1Id: string
  team2Id: string
  group: string
  groundId: string
  num?: number
  score1?: number
  score2?: number
  viutv?: boolean
  goals?: GoalEvent[]
  stage: 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final'
}

export interface Team {
  id: string
  name: string
  nameZh: string
  group: string
  ranking: number
  continent: string
  flag: string
}

export interface Group {
  id: string
  name: string
  nameZh: string
  teams: string[]
}

export interface GroupStanding {
  team: string
  teamZh: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  pts: number
  form: ('W' | 'D' | 'L')[]
  status?: 'advanced' | 'eliminated'
}

export interface Stadium {
  id: string
  name: string
  nameZh: string
  city: string
  cityZh: string
  country: string
  capacity: number
}

export interface ViuTVMatch {
  matchId: number
  hkDate: string
  hkTime: string
  stage: string
}
