export function utcToHkt(utcTime: string, date: string): { date: string; time: string } {
  const [h, m] = utcTime.split(':').map(Number)
  let totalMinutes = h * 60 + m + 8 * 60
  let dayOffset = 0
  if (totalMinutes >= 24 * 60) {
    totalMinutes -= 24 * 60
    dayOffset = 1
  }
  const hktH = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const hktM = String(totalMinutes % 60).padStart(2, '0')

  let d = new Date(date + 'T00:00:00')
  d.setDate(d.getDate() + dayOffset)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')

  return { date: `${y}-${mo}-${da}`, time: `${hktH}:${hktM}` }
}

export function hkDisplay(date: string, time: string): string {
  const d = new Date(date + 'T' + time + ':00')
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const day = days[d.getDay()]
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'pm' : 'am'
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${day} ${date.slice(5)} ${hour12}:${m}${ampm} HKT`
}
