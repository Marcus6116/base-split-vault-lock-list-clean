'use client'

import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BaseError } from 'viem'
import { useAccount, usePublicClient, useReadContract, useReadContracts, useSwitchChain, useWriteContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { LOCK_LIST_VAULT_CONTRACT_ADDRESS, lockListVaultAbi } from '@/lib/contracts'
import { attributedWriteOptions } from '@/lib/wagmi'
import { slotDefinitions, type VaultSlot } from '@/lib/slots'

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000' as const

export function useLockListVault() {
  const { address, chainId, isConnected } = useAccount()
  const queryClient = useQueryClient()
  const publicClient = usePublicClient({ chainId: base.id })
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data: progress } = useReadContract({
    address: LOCK_LIST_VAULT_CONTRACT_ADDRESS,
    abi: lockListVaultAbi,
    functionName: 'getUserProgress',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  })

  const { data: proofResults } = useReadContracts({
    contracts: address
      ? slotDefinitions.map((slot) => ({
          address: LOCK_LIST_VAULT_CONTRACT_ADDRESS,
          abi: lockListVaultAbi,
          functionName: 'proofFor',
          args: [address, BigInt(slot.index)]
        }))
      : [],
    query: {
      enabled: Boolean(address)
    }
  })

  const completedCount = progress ? Number(progress.completedCount) : 0
  const totalSlots = progress ? Number(progress.totalSlots) : slotDefinitions.length
  const activeSlotId = progress ? Number(progress.activeSlotId) : completedCount + 1
  const progressPercent = progress ? Math.round(Number(progress.progressBps) / 100) : 0

  const slots = useMemo<VaultSlot[]>(() => {
    return slotDefinitions.map((slot, slotIndex) => {
      const proofResult = proofResults?.[slotIndex] as { status?: string; result?: unknown } | undefined
      const proofHashValue = proofResult?.status === 'success' ? proofResult.result : undefined
      const proofHash =
        typeof proofHashValue === 'string' && proofHashValue !== ZERO_BYTES32 ? (proofHashValue as `0x${string}`) : undefined

      if (slot.index <= completedCount) {
        return {
          ...slot,
          status: 'completed' as const,
          proofHash
        }
      }

      if (slot.index === activeSlotId) {
        return {
          ...slot,
          status: 'active' as const
        }
      }

      return {
        ...slot,
        status: 'locked' as const
      }
    })
  }, [activeSlotId, completedCount, proofResults])

  const activeSlot = useMemo(() => slots.find((slot) => slot.status === 'active'), [slots])

  async function completeSlot(slotId: string) {
    if (isSubmitting) return
    if (!isConnected || !address) {
      setActionError('Connect a wallet before completing a slot.')
      return
    }

    const targetSlot = slots.find((slot) => slot.id === slotId)
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

      setLastTxHash(txHash)
      await queryClient.invalidateQueries()
      setActionStatus('Completed on Base.')
    } catch (error) {
      const message = error instanceof BaseError ? error.shortMessage : error instanceof Error ? error.message : 'Transaction failed.'
      setActionError(message)
      setActionStatus(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    address,
    activeSlot,
    completedCount,
    actionStatus,
    actionError,
    hasProgressRecord: isConnected,
    isConnected,
    isSubmitting,
    lastTxHash,
    progressPercent,
    slots,
    totalSlots,
    completeSlot
  }
}
