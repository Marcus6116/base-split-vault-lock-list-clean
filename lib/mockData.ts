export type SlotStatus = 'locked' | 'active' | 'completed' | 'released'

export type VaultSlot = {
  id: string
  index: number
  title: string
  summary: string
  status: SlotStatus
  proofHash: string
  completedAt?: string
  owner: string
}

export type TimelineRecord = {
  id: string
  slotId: string
  title: string
  event: 'completed' | 'released'
  proofHash: string
  timestamp: string
}

export const MOCK_ADDRESS = '0x8b2d3f42a1059f3d95b4184dc7a7a4a51e62b9d1'

export const initialSlots: VaultSlot[] = [
  {
    id: 'scope-map',
    index: 1,
    title: 'Map release scope',
    summary: 'Define the required work blocks and owner review path.',
    status: 'active',
    proofHash: '0xa91d34f70a2f8c64c41e0b8b877c3d0216ad425b66dbf40dc87487c95e10a11b',
    owner: MOCK_ADDRESS
  },
  {
    id: 'wallet-check',
    index: 2,
    title: 'Confirm wallet access',
    summary: 'Verify the connected wallet can update the vault progress.',
    status: 'locked',
    proofHash: '0xb24c9ae203fbfe8349ff7d4dc62d0cc84c1c6c96e338bd932a4d65cf9d92b152',
    owner: MOCK_ADDRESS
  },
  {
    id: 'launch-copy',
    index: 3,
    title: 'Approve launch copy',
    summary: 'Lock the public checklist language before final release.',
    status: 'locked',
    proofHash: '0xc0e27714f0872f062150b8a4a2e36a6114f75b2d219ba37b1cfdf84d11245791',
    owner: MOCK_ADDRESS
  },
  {
    id: 'qa-pass',
    index: 4,
    title: 'Run QA pass',
    summary: 'Complete the final route, mobile, and proof hash checks.',
    status: 'locked',
    proofHash: '0xd39c305477b5e33b4bc07f79ff6a6ff65b7294e8e0271c24a092207e38c45c30',
    owner: MOCK_ADDRESS
  },
  {
    id: 'release-signal',
    index: 5,
    title: 'Publish release signal',
    summary: 'Publish the vault record after all checklist slots pass.',
    status: 'locked',
    proofHash: '0xe82a452913a407d912175a5de72129fd848d9d9d9402e95ad3056de0f1148201',
    owner: MOCK_ADDRESS
  }
]

export const initialTimeline: TimelineRecord[] = []
