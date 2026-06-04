import Link from 'next/link'
import { ArrowLeft, Hash } from 'lucide-react'
import type { VaultSlot } from '@/lib/slots'
import { CompleteSlotButton } from '@/components/CompleteSlotButton'
import { CopyProofButton } from '@/components/CopyProofButton'
import { SlotStatusChip } from '@/components/SlotStatusChip'

export function SlotDetailBoard({
  slot,
  isConnected,
  isSubmitting,
  onComplete
}: {
  slot: VaultSlot
  isConnected: boolean
  isSubmitting: boolean
  onComplete: (slotId: string) => void
}) {
  return (
    <section className="detail-board panel">
      <div className="detail-main">
        <Link className="control-button secondary compact" href="/checklist">
          <ArrowLeft size={16} />
          Checklist
        </Link>
        <div className="detail-index">Slot {String(slot.index).padStart(2, '0')}</div>
        <h2>{slot.title}</h2>
        <p>{slot.summary}</p>
        <SlotStatusChip status={slot.status} />
        <CompleteSlotButton isConnected={isConnected} isSubmitting={isSubmitting} onComplete={onComplete} slot={slot} />
      </div>
      <div className="proof-board">
        <p className="section-title">Contract Proof</p>
        {slot.proofHash ? (
          <div className="proof-row">
            <Hash size={18} />
            <span>{slot.proofHash}</span>
            <CopyProofButton proof={slot.proofHash} />
          </div>
        ) : (
          <p className="muted">Awaiting onchain completion.</p>
        )}
      </div>
    </section>
  )
}
