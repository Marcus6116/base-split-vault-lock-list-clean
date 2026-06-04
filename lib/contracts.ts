export const LOCK_LIST_VAULT_CONTRACT_ADDRESS = '0x3d0e8cc3b059b46164E35285ab375fFb71E2045e' as const

export const lockListVaultAbi = [
  {
    type: 'function',
    name: 'completeActiveSlot',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'proofHash', type: 'bytes32' }],
    outputs: [{ name: 'completedSlotId', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'completeSlot',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'slotId', type: 'uint256' },
      { name: 'proofHash', type: 'bytes32' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'getUserProgress',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'exists', type: 'bool' },
          { name: 'completedCount', type: 'uint256' },
          { name: 'pendingCount', type: 'uint256' },
          { name: 'totalSlots', type: 'uint256' },
          { name: 'progressBps', type: 'uint256' },
          { name: 'activeSlotId', type: 'uint256' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'hasProgressRecord',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'bool' }]
  },
  {
    type: 'function',
    name: 'activeSlotId',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'completedCount',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'totalSlots',
    stateMutability: 'pure',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'progressBps',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'pendingCount',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'proofFor',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'slotId', type: 'uint256' }
    ],
    outputs: [{ type: 'bytes32' }]
  },
  {
    type: 'event',
    name: 'SlotCompleted',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'slotId', type: 'uint256', indexed: true },
      { name: 'proofHash', type: 'bytes32', indexed: false },
      { name: 'completedCount', type: 'uint256', indexed: false }
    ]
  }
] as const
