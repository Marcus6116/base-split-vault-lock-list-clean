'use client'

import Link from 'next/link'
import { Clock3 } from 'lucide-react'
import { CopyProofButton } from '@/components/CopyProofButton'
import { EmptyState } from '@/components/EmptyState'
import { VaultHeader } from '@/components/VaultHeader'
import { useLockListVault } from '@/hooks/useLockListVault'

export default function TimelinePage() {
  const vault = useLockListVault()

  return (
    <main className="app-shell page-stack">
      <VaultHeader />
      <section className="timeline-layout">
        <div className="timeline-head panel">
          <Clock3 size={26} />
          <div>
            <p className="section-title">Progress Ledger</p>
            <h2>Completed slot events</h2>
          </div>
          <strong>{vault.timeline.length} records</strong>
        </div>
        <div className="timeline-list">
          {vault.timeline.length === 0 ? (
            <EmptyState title="No records" text="Completed slots will appear here." />
          ) : (
            vault.timeline.map((record) => (
              <article className="timeline-record panel" key={record.id}>
                <div className="timeline-pin" />
                <div>
                  <span className="record-event">{record.event}</span>
                  <h3>{record.title}</h3>
                  <p>{record.timestamp}</p>
                </div>
                <Link className="control-button secondary compact" href={`/slot/${record.slotId}`}>
                  Open Slot
                </Link>
                <div className="record-proof">
                  <span>{record.proofHash}</span>
                  <CopyProofButton proof={record.proofHash} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
