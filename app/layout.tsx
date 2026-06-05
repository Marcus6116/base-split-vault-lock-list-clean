import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/components/AppProviders'

export const metadata: Metadata = {
  title: 'base-split-vault-lock-list',
  description: 'A locked checklist vault for tracking task progress on Base.',
  applicationName: 'base-split-vault-lock-list',
  metadataBase: new URL('https://base-split-vault-lock-list.vercel.app')
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a1fe10a4a7867dea5dcf4fa" />
        <meta
          name="talentapp:project_verification"
          content="c72e1997b2a5f7c751001aaf5fe9122349136a041df6c64c06cd757abb94722c9ac31eeb56c47c32b9d1df209346c1e29836d4403d9167139361adee2266fc4e"
        />
        <meta
          name="talentapp:project_verification"
          content="bbe4d93f308820a001463633fb487f80308a2f077573272387434159623d2668c683205dd0af8b07e27b54fec2fa0fc565ddefe16b4a7ab64a061d132e1af755"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
