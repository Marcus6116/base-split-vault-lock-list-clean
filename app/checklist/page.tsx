'use client'

import { ShieldCheck } from 'lucide-react'
import { ChecklistSlotGrid } from '@/components/ChecklistSlotGrid'
import { CompleteSlotButton } from '@/components/CompleteSlotButton'
import { ProgressMeter } from '@/components/ProgressMeter'
import { VaultHeader } from '@/components/VaultHeader'
import { useLockListVault } from '@/hooks/useLockListVault'

export default function ChecklistPage() {
  const vault = useLockListVault()

  return (
    <main className="app-shell page-stack">
      <VaultHeader />
      <section className="checklist-layout">
        <div className="execution-strip panel">
          <p className="section-title">Active Slots</p>
          <h2>Complete the active slot to unlock the next task.</h2>
          <div className="execution-rule">
            <ShieldCheck size={18} />
            <span>One wallet, one vault progress</span>
          </div>
          <CompleteSlotButton isConnected={vault.isConnected} isSubmitting={vault.isSubmitting} onComplete={vault.completeSlot} slot={vault.activeSlot} />
          {vault.actionStatus ? <p className="action-status">{vault.actionStatus}</p> : null}
          {vault.actionError ? <p className="action-error">{vault.actionError}</p> : null}
        </div>
        <div className="checklist-main panel">
          <div className="checklist-head">
            <div>
              <p className="section-title">Slot Board</p>
              <h2>{vault.activeSlot?.title ?? 'No active slot'}</h2>
            </div>
            <ProgressMeter completed={vault.completedCount} percent={vault.progressPercent} total={vault.totalSlots} />
          </div>
          <ChecklistSlotGrid selectedId={vault.activeSlot?.id} slots={vault.slots} />
        </div>
      </section>
    </main>
  )
}
