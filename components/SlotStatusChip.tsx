import { Check, Lock, Radio, RotateCcw } from 'lucide-react'
import type { SlotStatus } from '@/lib/mockData'

const statusConfig = {
  locked: { label: 'Locked', icon: Lock },
  active: { label: 'Active', icon: Radio },
  completed: { label: 'Completed', icon: Check },
  released: { label: 'Released', icon: RotateCcw }
} satisfies Record<SlotStatus, { label: string; icon: typeof Lock }>

export function SlotStatusChip({ status }: { status: SlotStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={`status-chip ${status}`}>
      <Icon size={13} />
      {config.label}
    </span>
  )
}
