'use client'

import Link from 'next/link'
import { CheckCircle2, Clock, ListChecks } from 'lucide-react'
import { ProgressMeter } from '@/components/ProgressMeter'
import { SlotStatusChip } from '@/components/SlotStatusChip'
import { VaultHeader } from '@/components/VaultHeader'
import { useLockListVault } from '@/hooks/useLockListVault'

export default function MyVaultPage() {
  const vault = useLockListVault()
  const pending = vault.slots.filter((slot) => slot.status === 'locked' || slot.status === 'active')
  const completed = vault.slots.filter((slot) => slot.status === 'completed')

  return (
    <main className="app-shell page-stack">
      <VaultHeader />
      <section className="my-layout">
        <div className="my-record panel">
          <p className="section-title">My Vault</p>
          <h2>Wallet execution record</h2>
          <p className="muted">{vault.address ?? 'Connect a wallet to read your onchain progress.'}</p>
          <ProgressMeter completed={vault.completedCount} percent={vault.progressPercent} total={vault.totalSlots} />
          <div className="record-actions">
            <Link className="control-button" href="/checklist">
              <ListChecks size={16} />
              Continue
            </Link>
          </div>
        </div>
        <div className="my-columns">
          <section className="my-lane panel">
            <h3>
              <CheckCircle2 size={18} />
              Completed
            </h3>
            {completed.map((slot) => (
              <Link className="mini-slot" href={`/slot/${slot.id}`} key={slot.id}>
                <strong>{slot.title}</strong>
                <SlotStatusChip status={slot.status} />
              </Link>
            ))}
          </section>
          <section className="my-lane panel">
            <h3>
              <Clock size={18} />
              Pending
            </h3>
            {pending.map((slot) => (
              <Link className="mini-slot" href={`/slot/${slot.id}`} key={slot.id}>
                <strong>{slot.title}</strong>
                <SlotStatusChip status={slot.status} />
              </Link>
            ))}
          </section>
        </div>
      </section>
    </main>
  )
}
