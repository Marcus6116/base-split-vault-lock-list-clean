export type SlotStatus = 'locked' | 'active' | 'completed'

export type VaultSlot = {
  id: string
  index: number
  title: string
  summary: string
  status: SlotStatus
  proofHash?: `0x${string}`
}

export type SlotDefinition = Pick<VaultSlot, 'id' | 'index' | 'title' | 'summary'>

export const slotDefinitions: SlotDefinition[] = [
  {
    id: 'scope-map',
    index: 1,
    title: 'Map release scope',
    summary: 'Define the required work blocks and owner review path.'
  },
  {
    id: 'wallet-check',
    index: 2,
    title: 'Confirm wallet access',
    summary: 'Verify the connected wallet can update the vault progress.'
  },
  {
    id: 'launch-copy',
    index: 3,
    title: 'Approve launch copy',
    summary: 'Lock the public checklist language before final release.'
  },
  {
    id: 'qa-pass',
    index: 4,
    title: 'Run QA pass',
    summary: 'Complete the final route, mobile, and proof hash checks.'
  },
  {
    id: 'release-signal',
    index: 5,
    title: 'Publish release signal',
    summary: 'Publish the vault record after all checklist slots pass.'
  }
]
