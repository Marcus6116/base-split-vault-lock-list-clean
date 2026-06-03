import type { SlotStatus, TimelineRecord, VaultSlot } from '@/lib/mockData'

export function getCompletedCount(slots: VaultSlot[]) {
  return slots.filter((slot) => slot.status === 'completed' || slot.status === 'released').length
}

export function getProgressPercent(slots: VaultSlot[]) {
  if (!slots.length) return 0
  return Math.round((getCompletedCount(slots) / slots.length) * 100)
}

export function getActiveSlot(slots: VaultSlot[]) {
  return slots.find((slot) => slot.status === 'active') ?? slots.find((slot) => slot.status === 'locked') ?? slots[0]
}

export function getSlotById(slots: VaultSlot[], id: string) {
  return slots.find((slot) => slot.id === id)
}

export function createProofHash(slotId: string) {
  const stamp = Date.now().toString(16)
  return `0x${slotId.replace(/[^a-f0-9]/gi, '').padEnd(8, '0')}${stamp}`.padEnd(66, '0').slice(0, 66)
}

export function completeSlot(slots: VaultSlot[], slotId: string) {
  let completedTitle = ''
  const updated = slots.map((slot) => {
    if (slot.id !== slotId || slot.status !== 'active') return slot
    completedTitle = slot.title
    return {
      ...slot,
      status: 'completed' as SlotStatus,
      proofHash: createProofHash(slot.id),
      completedAt: new Date().toISOString()
    }
  })

  let promoted = false
  const finalSlots = updated.map((slot) => {
    if (!promoted && slot.status === 'locked') {
      promoted = true
      return { ...slot, status: 'active' as SlotStatus }
    }
    return slot
  })

  const completed = finalSlots.find((slot) => slot.id === slotId)
  const event: TimelineRecord | null =
    completed && completedTitle
      ? {
          id: `evt-${slotId}-${Date.now()}`,
          slotId,
          title: completedTitle,
          event: 'completed',
          proofHash: completed.proofHash,
          timestamp: completed.completedAt ?? new Date().toISOString()
        }
      : null

  return { slots: finalSlots, event }
}
