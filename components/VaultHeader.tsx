import { ShieldCheck } from 'lucide-react'
import { WalletButton } from '@/components/WalletButton'
import { VaultTopTabs } from '@/components/VaultTopTabs'

export function VaultHeader() {
  return (
    <header className="vault-header">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="eyebrow">Base checklist vault</p>
          <h1>base-split-vault-lock-list</h1>
        </div>
      </div>
      <div className="header-actions">
        <WalletButton />
      </div>
      <VaultTopTabs />
    </header>
  )
}
