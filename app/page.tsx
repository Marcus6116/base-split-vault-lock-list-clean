'use client'

import Link from 'next/link'
import { ListChecks } from 'lucide-react'
import { NextSlotPanel } from '@/components/NextSlotPanel'
import { SlotRail } from '@/components/SlotRail'
import { VaultHeader } from '@/components/VaultHeader'
import { VaultSummaryPanel } from '@/components/VaultSummaryPanel'
import { useLockListVault } from '@/hooks/useLockListVault'

export default function HomePage() {
  const vault = useLockListVault()

  return (
    <main className="app-shell page-stack">
      <VaultHeader />
      <section className="home-layout">
        <SlotRail activeId={vault.activeSlot?.id} slots={vault.slots} />
        <div className="board-column">
          <div className="board-intro panel">
            <p className="section-title">Vault Board</p>
            <h2>Active progress is locked to the next executable slot.</h2>
            <div className="quick-links">
              <Link className="control-button" href="/checklist">
                <ListChecks size={16} />
                Open Checklist
              </Link>
            </div>
          </div>
          <NextSlotPanel isConnected={vault.isConnected} isSubmitting={vault.isSubmitting} onComplete={vault.completeSlot} slot={vault.activeSlot} />
          {vault.actionStatus ? <p className="action-status">{vault.actionStatus}</p> : null}
          {vault.actionError ? <p className="action-error">{vault.actionError}</p> : null}
        </div>
        <VaultSummaryPanel address={vault.address} completed={vault.completedCount} percent={vault.progressPercent} total={vault.totalSlots} />
      </section>
    </main>
  )
}
