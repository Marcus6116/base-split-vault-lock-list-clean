import { createConfig, http, injected } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

// TODO: Replace this value after Base.dev verification.
export const BUILDER_CODE_SUFFIX = '' as `0x${string}` | ''

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true
    }),
    coinbaseWallet({
      appName: 'Base Split Vault',
      preference: 'all'
    })
  ],
  transports: {
    [base.id]: http()
  },
  ...(BUILDER_CODE_SUFFIX ? { dataSuffix: BUILDER_CODE_SUFFIX } : {}),
  ssr: true
})

export const attributedWriteOptions = BUILDER_CODE_SUFFIX
  ? { dataSuffix: BUILDER_CODE_SUFFIX }
  : {}
