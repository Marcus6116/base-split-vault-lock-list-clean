'use client'

import { ChevronDown, LogOut, Wallet } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

const MANUAL_DISCONNECT_KEY = 'base-split-vault-manual-disconnect'
type EmbeddedProvider = {
  isBase?: boolean
  isCoinbaseWallet?: boolean
}

export function WalletButton() {
  const [isOpen, setIsOpen] = useState(false)
  const autoConnectAttemptedRef = useRef(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { address, connector: activeConnector, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const connectorOptions = useMemo(() => {
    const seen = new Set<string>()

    return connectors.filter((connector) => {
      const normalizedName = connector.name.toLowerCase()
      const key = normalizedName.includes('injected') ? 'browser-wallet' : connector.id

      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [connectors])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  useEffect(() => {
    if (autoConnectAttemptedRef.current) return
    if (isConnected || isPending || typeof window === 'undefined') return
    if (window.localStorage.getItem(MANUAL_DISCONNECT_KEY) === 'true') return
    if (!isBaseEmbeddedWallet()) return

    const injectedConnector = connectorOptions.find((connector) => connector.id === 'injected')
    if (injectedConnector) {
      autoConnectAttemptedRef.current = true
      connect({ connector: injectedConnector })
    }
  }, [connect, connectorOptions, isConnected, isPending])

  function getConnectorLabel(connectorName: string) {
    const normalizedName = connectorName.toLowerCase()

    if (normalizedName.includes('coinbase')) return 'Coinbase Wallet'
    if (normalizedName.includes('injected')) return 'Browser Wallet'
    return connectorName
  }

  function getConnectorHint(connectorName: string) {
    const normalizedName = connectorName.toLowerCase()

    if (normalizedName.includes('coinbase')) return 'Coinbase app or extension'
    if (normalizedName.includes('injected')) return 'Base App, MetaMask, OKX, and injected wallets'
    return 'Installed wallet provider'
  }

  if (isConnected) {
    return (
      <div className="wallet-menu" ref={menuRef}>
        <button className="control-button secondary wallet-button" onClick={() => setIsOpen((open) => !open)} type="button">
          <Wallet size={16} />
          <span>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}</span>
          <ChevronDown size={15} />
        </button>
        {isOpen ? (
          <div className="wallet-popover">
            <div className="wallet-active">
              <span>{activeConnector ? getConnectorLabel(activeConnector.name) : 'Connected Wallet'}</span>
              <small>{address}</small>
            </div>
            <button
              className="wallet-option danger"
              onClick={() => {
                window.localStorage.setItem(MANUAL_DISCONNECT_KEY, 'true')
                disconnect()
                setIsOpen(false)
              }}
              type="button"
            >
              <LogOut size={16} />
              <span>Disconnect</span>
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="wallet-menu" ref={menuRef}>
      <button
        className="control-button wallet-button"
        disabled={isPending}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Wallet size={16} />
        <span>{isPending ? 'Connecting' : 'Connect Wallet'}</span>
        <ChevronDown size={15} />
      </button>
      {isOpen ? (
        <div className="wallet-popover">
          {connectorOptions.length ? (
            connectorOptions.map((connector) => (
              <button
                className="wallet-option"
                key={connector.uid}
                onClick={() => {
                  window.localStorage.removeItem(MANUAL_DISCONNECT_KEY)
                  connect({ connector })
                  setIsOpen(false)
                }}
                type="button"
              >
                <Wallet size={16} />
                <span>
                  {getConnectorLabel(connector.name)}
                  <small>{getConnectorHint(connector.name)}</small>
                </span>
              </button>
            ))
          ) : (
            <div className="wallet-empty">
              <span>No wallet connector is ready</span>
              <small>Open this app in Base App, Coinbase Wallet, MetaMask, or OKX.</small>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function isBaseEmbeddedWallet() {
  if (typeof window === 'undefined') return false

  const ethereum = (window as Window & {
    ethereum?: EmbeddedProvider & {
      providers?: EmbeddedProvider[]
    }
  }).ethereum
  const providers: EmbeddedProvider[] = ethereum?.providers ?? []
  const userAgent = window.navigator.userAgent.toLowerCase()
  const hasBaseUserAgent = userAgent.includes('base') && userAgent.includes('wallet')
  const hasCoinbaseProvider =
    ethereum?.isBase ||
    ethereum?.isCoinbaseWallet ||
    providers.some((provider: EmbeddedProvider) => provider.isBase || provider.isCoinbaseWallet)

  return Boolean(hasBaseUserAgent && hasCoinbaseProvider)
}
