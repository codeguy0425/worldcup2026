import { useState, useEffect } from 'react'

export function CountdownTimer({ target }: { target: string }) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      const t = new Date(target)
      const diff = t.getTime() - now.getTime()
      if (diff <= 0) { setRemaining(''); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setRemaining(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`)
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [target])

  if (!remaining) return null

  return (
    <span className="text-xs font-mono text-gray-400">
      {remaining}
    </span>
  )
}
