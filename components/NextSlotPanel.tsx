import Link from 'next/link'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import type { VaultSlot } from '@/lib/slots'
import { CompleteSlotButton } from '@/components/CompleteSlotButton'
import { SlotStatusChip } from '@/components/SlotStatusChip'

export function NextSlotPanel({
  slot,
  isConnected,
  isSubmitting,
  onComplete
}: {
  slot?: VaultSlot
  isConnected: boolean
  isSubmitting: boolean
  onComplete: (slotId: string) => void
}) {
  if (!slot) return null

  return (
    <section className="next-slot-panel panel">
      <div className="active-marker">
        <LockKeyhole size={22} />
      </div>
      <div className="next-slot-copy">
        <p className="section-title">Active Slot</p>
        <h2>{slot.title}</h2>
        <p>{slot.summary}</p>
        <SlotStatusChip status={slot.status} />
      </div>
      <div className="next-slot-actions">
        <CompleteSlotButton isConnected={isConnected} isSubmitting={isSubmitting} onComplete={onComplete} slot={slot} />
        <Link className="control-button secondary" href={`/slot/${slot.id}`}>
          <ArrowRight size={16} />
          Inspect Slot
        </Link>
      </div>
    </section>
  )
}
