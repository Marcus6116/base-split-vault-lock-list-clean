import { Check, Lock, Radio } from 'lucide-react'
import type { SlotStatus } from '@/lib/slots'

const statusConfig = {
  locked: { label: 'Locked', icon: Lock },
  active: { label: 'Active', icon: Radio },
  completed: { label: 'Completed', icon: Check }
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
