'use client'

import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BaseError } from 'viem'
import { useAccount, usePublicClient, useReadContract, useSwitchChain, useWriteContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { LOCK_LIST_VAULT_CONTRACT_ADDRESS, lockListVaultAbi } from '@/lib/contracts'
import { attributedWriteOptions } from '@/lib/wagmi'
import { initialSlots, initialTimeline, MOCK_ADDRESS, type TimelineRecord, type VaultSlot } from '@/lib/mockData'
import { completeSlot as completeSlotState, getActiveSlot, getCompletedCount, getProgressPercent } from '@/lib/vaultLogic'
import { trackTransaction } from '@/utils/track'

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000' as const

export function useLockListVault() {
  const { address, chainId, isConnected } = useAccount()
  const queryClient = useQueryClient()
  const publicClient = usePublicClient({ chainId: base.id })
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const [slots, setSlots] = useState<VaultSlot[]>(initialSlots)
  const [timeline, setTimeline] = useState<TimelineRecord[]>(initialTimeline)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const userAddress = address ?? MOCK_ADDRESS
  const { data: progress } = useReadContract({
    address: LOCK_LIST_VAULT_CONTRACT_ADDRESS,
    abi: lockListVaultAbi,
    functionName: 'getUserProgress',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  })

  const syncedSlots = useMemo(() => {
    if (!progress) return slots

    const chainCompletedCount = Number(progress.completedCount)
    const chainActiveSlotId = Number(progress.activeSlotId)

    return slots.map((slot) => {
      if (slot.index <= chainCompletedCount) {
        return {
          ...slot,
          status: 'completed' as const,
          owner: userAddress,
          completedAt: slot.completedAt ?? 'Completed on Base'
        }
      }

      if (slot.index === chainActiveSlotId) {
        return {
          ...slot,
          status: 'active' as const,
          owner: userAddress,
          completedAt: undefined
        }
      }

      return {
        ...slot,
        status: 'locked' as const,
        owner: userAddress,
        completedAt: undefined
      }
    })
  }, [progress, slots, userAddress])

  const syncedCompletedCount = useMemo(() => getCompletedCount(syncedSlots), [syncedSlots])
  const syncedProgressPercent = useMemo(() => getProgressPercent(syncedSlots), [syncedSlots])
  const syncedActiveSlot = useMemo(() => getActiveSlot(syncedSlots), [syncedSlots])

  async function completeSlot(slotId: string) {
    if (isSubmitting) return
    if (!isConnected || !address) {
      setActionError('Connect a wallet before completing a slot.')
      return
    }

    const targetSlot = syncedSlots.find((slot) => slot.id === slotId)
    if (!targetSlot || targetSlot.status !== 'active') {
      setActionError('Only the active onchain slot can be completed.')
      return
    }

    setIsSubmitting(true)
    setActionStatus('Open your wallet to approve the contract transaction.')
    setActionError(null)

    try {
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id })
      }

      const txHash = await writeContractAsync({
        address: LOCK_LIST_VAULT_CONTRACT_ADDRESS,
        abi: lockListVaultAbi,
        functionName: 'completeSlot',
        args: [BigInt(targetSlot.index), ZERO_BYTES32],
        ...attributedWriteOptions
      })

      setActionStatus('Transaction sent. Waiting for Base confirmation.')

      if (!publicClient) {
        throw new Error('Base RPC client is not ready.')
      }

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      setSlots((current) => {
        const next = completeSlotState(current, slotId)
        if (next.event) {
          setTimeline((records) => [
            {
              ...(next.event as TimelineRecord),
              proofHash: txHash
            },
            ...records
          ])
        }
        return next.slots.map((slot) => (slot.id === slotId ? { ...slot, proofHash: txHash, owner: address } : slot))
      })
      setLastTxHash(txHash)
      await queryClient.invalidateQueries()
      setActionStatus('Completed on Base.')

      await trackTransaction('app-lock-list', 'base-split-vault-lock-list', address, txHash)
    } catch (error) {
      const message = error instanceof BaseError ? error.shortMessage : error instanceof Error ? error.message : 'Transaction failed.'
      setActionError(message)
      setActionStatus(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    address: userAddress,
    activeSlot: syncedActiveSlot,
    completedCount: syncedCompletedCount,
    actionStatus,
    actionError,
    hasProgressRecord: isConnected,
    isConnected,
    isSubmitting,
    lastTxHash,
    progressPercent: syncedProgressPercent,
    slots: syncedSlots,
    timeline,
    totalSlots: slots.length,
    completeSlot
  }
}
