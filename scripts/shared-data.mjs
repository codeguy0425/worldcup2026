export const TEAM_IDS = {
  'Mexico': 'MEX', 'South Africa': 'RSA', 'South Korea': 'KOR', 'Czech Republic': 'CZE',
  'Canada': 'CAN', 'Bosnia & Herzegovina': 'BIH', 'Qatar': 'QAT', 'Switzerland': 'SUI',
  'Brazil': 'BRA', 'Morocco': 'MAR', 'Haiti': 'HAI', 'Scotland': 'SCO',
  'USA': 'USA', 'Paraguay': 'PAR', 'Australia': 'AUS', 'Turkey': 'TUR',
  'Germany': 'GER', 'Curaçao': 'CUW', 'Ivory Coast': 'CIV', 'Ecuador': 'ECU',
  'Netherlands': 'NED', 'Japan': 'JPN', 'Sweden': 'SWE', 'Tunisia': 'TUN',
  'Belgium': 'BEL', 'Egypt': 'EGY', 'Iran': 'IRN', 'New Zealand': 'NZL',
  'Spain': 'ESP', 'Cape Verde': 'CPV', 'Saudi Arabia': 'KSA', 'Uruguay': 'URU',
  'France': 'FRA', 'Senegal': 'SEN', 'Iraq': 'IRQ', 'Norway': 'NOR',
  'Argentina': 'ARG', 'Algeria': 'ALG', 'Austria': 'AUT', 'Jordan': 'JOR',
  'Portugal': 'POR', 'DR Congo': 'COD', 'Uzbekistan': 'UZB', 'Colombia': 'COL',
  'England': 'ENG', 'Croatia': 'CRO', 'Ghana': 'GHA', 'Panama': 'PAN',
}

export const TEAM_NAMES = Object.fromEntries(Object.entries(TEAM_IDS).map(([k, v]) => [v, k]))

export const teams = Object.entries(TEAM_IDS).map(([name, id]) => ({ id, name }))

export const STADIUMS = {
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

export const STAGE_LABELS = {
  'group': 'Group Stage',
  'r32': 'Round of 32',
  'r16': 'Round of 16',
  'qf': 'Quarter-final',
  'sf': 'Semi-final',
  'third': 'Third Place',
  'final': 'Final',
}

export const FAIR_PLAY = {
  'PAR': -11,
  'ALG': -1,
}

export const VIUTV_MATCHES = [
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
