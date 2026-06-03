import { BarChart3, KeyRound, ShieldCheck } from 'lucide-react'
import { ProgressMeter } from '@/components/ProgressMeter'

export function VaultSummaryPanel({
  completed,
  total,
  percent,
  address
}: {
  completed: number
  total: number
  percent: number
  address: string
}) {
  return (
    <aside className="summary-panel panel">
      <p className="section-title">Vault Summary</p>
      <ProgressMeter completed={completed} percent={percent} total={total} />
      <div className="summary-stat">
        <ShieldCheck size={18} />
        <span>
          <strong>Record</strong>
          <small>One wallet, one vault progress</small>
        </span>
      </div>
      <div className="summary-stat">
        <BarChart3 size={18} />
        <span>
          <strong>{completed} of {total}</strong>
          <small>Slots counted in public progress</small>
        </span>
      </div>
      <div className="summary-stat">
        <KeyRound size={18} />
        <span>
          <strong>{address.slice(0, 10)}...</strong>
          <small>Progress owner</small>
        </span>
      </div>
    </aside>
  )
}
