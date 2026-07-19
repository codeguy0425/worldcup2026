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
  'Latest Results': '最新賽果',
  'Live': '進行中',
  'Finished': '已結束',
  'All': '全部',
  'Group Stage': '小組賽',
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
  '25 matches free on ViuTV 99台': 'ViuTV 99台免費直播25場',
  'All times in Hong Kong Time (HKT)': '所有時間為香港時間 (HKT)',
  'ViuTV 99台 will broadcast 25 selected matches for free including the opening match, both semi-finals and the final. All times below are in HKT (UTC+8).': 'ViuTV 99台將免費直播25場精選賽事，包括開幕戰、兩場四強賽及決賽。以下所有時間均為香港時間 (UTC+8)。',

  'Results': '賽果',
  'Knockout': '淘汰賽',
  'Free ViuTV': '免費直播',
  'VS': '對',
  'vs': '對',
  'matches': '場賽事',
  'teams': '支球隊',

  'Page Not Found': '找不到頁面',
  "This page doesn't exist": '此頁面不存在',
  'Back to Home': '返回首頁',

  'World Cup 2026': '世界盃 2026',

  'Opening Match': '開幕戰',
  'FIFA World Cup 2026': 'FIFA 世界盃 2026',
  '11 Jun – 19 Jul': '6月11日 – 7月19日',
  'USA · Canada · Mexico': '美國 · 加拿大 · 墨西哥',

  'Standings will appear after matches begin': '賽事開始後將顯示積分表',

  'R32': '32強',
  'R16': '16強',
  'QF': '八強',
  'SF': '四強',

  'Sunday': '星期日',
  'Monday': '星期一',
  'Tuesday': '星期二',
  'Wednesday': '星期三',
  'Thursday': '星期四',
  'Friday': '星期五',
  'Saturday': '星期六',

  'North America': '北美洲',
  'South America': '南美洲',
  'Europe': '歐洲',
  'Asia': '亞洲',
  'Africa': '非洲',
  'Oceania': '大洋洲',

  '48 teams, groups & rankings': '48支球隊、組別及排名',
  '16 venues across 3 countries': '3個國家共16個球場',
  'Round of 32 to the Final': '32強至決賽',
  '25 free matches schedule': '25場免費直播賽程',
  'Knockout Bracket': '淘汰賽',
  'Third-Placed': '第三名',
  'Third-Placed Ranking': '各小組第三名排名',
  'Top 8 third-placed teams advance to Round of 32': '最佳8支小組第三名晉級32強',
  'Best 3rd place teams ranking': '最佳第三名排行榜',
  'Qualifying (top 8)': '晉級中（前8名）',
  'Currently out': '出局',
  'Q': '進',
  'OUT': ' OUT',
  'ViuTV Free Matches': 'ViuTV 免費直播',
  'FIFA World Cup 2026™': 'FIFA 世界盃 2026™',
  'Data: openfootball · Not affiliated with FIFA': '資料：openfootball · 與FIFA無關',
  'Free': '免費',
  'HKT': 'HKT',
  'UTC': 'UTC',
  'FIFA': 'FIFA',
  'Goals': '入球',
  'Assist': '助攻',
  'Penalty': '十二碼',
  'Penalties': '十二碼大戰',
  'Own Goal': '烏龍球',
  'Player': '球員',
  'No goals scored yet': '尚未有入球',
  'Mexico': '墨西哥',
  'South Africa': '南非',
  '12 Jun 03:00 HKT': '6月12日 03:00 HKT',
  'Tournament Completed': '賽事完結',
  'Champion': '冠軍',
  'Runner-up': '亞軍',
  'Fourth Place': '殿軍',
  'Top Scorer': '神射手',
  'Final Ranking': '最終排名',
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
