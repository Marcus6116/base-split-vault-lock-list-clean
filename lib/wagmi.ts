import { createConfig, http, injected } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

// Builder code: bc_v2jvcg89
export const BUILDER_CODE_SUFFIX = '0x62635f76326a76636738390b0080218021802180218021802180218021' as const

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
