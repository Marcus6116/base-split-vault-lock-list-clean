import Link from 'next/link'
import type { VaultSlot } from '@/lib/mockData'
import { SlotStatusChip } from '@/components/SlotStatusChip'

export function SlotRail({ slots, activeId }: { slots: VaultSlot[]; activeId?: string }) {
  return (
    <aside className="slot-rail panel">
      <p className="section-title">Vault Slots</p>
      <div className="rail-list">
        {slots.map((slot) => (
          <Link className={slot.id === activeId ? 'rail-item active' : 'rail-item'} href={`/slot/${slot.id}`} key={slot.id}>
            <span className="rail-index">{String(slot.index).padStart(2, '0')}</span>
            <span className="rail-copy">
              <strong>{slot.title}</strong>
              <SlotStatusChip status={slot.status} />
            </span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
