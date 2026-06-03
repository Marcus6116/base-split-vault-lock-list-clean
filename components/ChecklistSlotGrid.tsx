import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { VaultSlot } from '@/lib/mockData'
import { SlotStatusChip } from '@/components/SlotStatusChip'

export function ChecklistSlotGrid({ slots, selectedId }: { slots: VaultSlot[]; selectedId?: string }) {
  return (
    <div className="slot-grid">
      {slots.map((slot) => (
        <Link className={slot.id === selectedId ? `slot-tile ${slot.status} selected` : `slot-tile ${slot.status}`} href={`/slot/${slot.id}`} key={slot.id}>
          <div className="slot-tile-head">
            <span>Slot {String(slot.index).padStart(2, '0')}</span>
            <ArrowUpRight size={16} />
          </div>
          <h3>{slot.title}</h3>
          <p>{slot.summary}</p>
          <SlotStatusChip status={slot.status} />
        </Link>
      ))}
    </div>
  )
}
