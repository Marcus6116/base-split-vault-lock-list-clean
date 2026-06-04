'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import type { VaultSlot } from '@/lib/slots'

export function CompleteSlotButton({
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
  const disabled = !slot || slot.status !== 'active' || isSubmitting || !isConnected
  const label = !isConnected ? 'Connect Wallet' : isSubmitting ? 'Waiting for Tx' : 'Complete Slot'

  return (
    <button className="control-button success complete-button" disabled={disabled} onClick={() => slot && onComplete(slot.id)} type="button">
      {isSubmitting ? <Loader2 className="spin" size={18} /> : <CheckCircle2 size={18} />}
      <span>{label}</span>
    </button>
  )
}
