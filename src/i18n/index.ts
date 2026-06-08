export const zh: Record<string, string> = {
  'Home': '首頁',
  'Fixtures': '賽程',
  'Groups': '積分榜',
  'Teams': '球隊',
  'Stadiums': '球場',
  'ViuTV': '免費直播',
  'Bracket': '淘汰賽',
  'Match Details': '比賽詳情',
  'Group': '組別',
  'Round': '回合',
  'Stage': '階段',
  'Venue': '場地',
  'Capacity': '容量',
  'Standings': '積分表',
  'Top Scorers': '射手榜',
  'Upcoming': '即將開始',
  'Live': '進行中',
  'Finished': '已結束',
  'All': '全部',
  'Group Stage': '分組賽',
  'Round of 32': '32強',
  'Round of 16': '16強',
  'Quarter-final': '八強',
  'Semi-final': '四強',
  'Third Place': '季軍戰',
  'Final': '決賽',
  'PTS': '積分',
  'PL': '賽',
  'W': '勝',
  'D': '和',
  'L': '負',
  'GF': '入球',
  'GA': '失球',
  'GD': '得失',
  'Team': '球隊',
  'No matches found': '沒有找到賽事',
  'Loading': '加載中...',
  'Today': '今日',
  'Yesterday': '昨日',
  'Tomorrow': '明日',
  'Free on ViuTV': 'ViuTV免費直播',
  'ViuTV Free Broadcast': 'ViuTV免費直播',
  'Hong Kong Time': '香港時間',
  'Switch to 中文': 'Switch to EN',
  'Language': '語言',
}

export type Lang = 'en' | 'zh'

let currentLang: Lang = 'zh'

export function getLang(): Lang {
  return currentLang
}

export function setLang(l: Lang) {
  currentLang = l
}

export function t(key: string): string {
  if (currentLang === 'zh') {
    return zh[key] || key
  }
  return key
}
