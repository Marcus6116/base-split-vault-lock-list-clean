'use client'

import { notFound, useParams } from 'next/navigation'
import { ActionBar } from '@/components/ActionBar'
import { SlotDetailBoard } from '@/components/SlotDetailBoard'
import { SlotRail } from '@/components/SlotRail'
import { VaultHeader } from '@/components/VaultHeader'
import { useLockListVault } from '@/hooks/useLockListVault'

export default function SlotDetailPage() {
  const params = useParams<{ id: string }>()
  const vault = useLockListVault()
  const slot = vault.slots.find((item) => item.id === params.id)

  if (!slot) {
    notFound()
  }

  return (
    <main className="app-shell page-stack">
      <VaultHeader />
      <section className="slot-detail-layout">
        <SlotRail activeId={slot.id} slots={vault.slots} />
        <SlotDetailBoard isConnected={vault.isConnected} isSubmitting={vault.isSubmitting} onComplete={vault.completeSlot} slot={slot} />
        {vault.actionStatus ? <p className="action-status">{vault.actionStatus}</p> : null}
        {vault.actionError ? <p className="action-error">{vault.actionError}</p> : null}
      </section>
      <ActionBar backHref="/checklist" backLabel="Back to checklist" />
    </main>
  )
}
