'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckSquare, Clock3, Grid3X3, Home, UserRound } from 'lucide-react'

const tabs = [
  { href: '/', label: 'Board', icon: Home },
  { href: '/checklist', label: 'Checklist', icon: CheckSquare },
  { href: '/my', label: 'My Vault', icon: UserRound },
  { href: '/timeline', label: 'Timeline', icon: Clock3 }
]

export function VaultTopTabs() {
  const pathname = usePathname()

  return (
    <nav className="top-tabs" aria-label="Vault navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link className={active ? 'tab active' : 'tab'} href={tab.href} key={tab.href}>
            <Icon size={17} />
            <span>{tab.label}</span>
          </Link>
        )
      })}
      <Link className={pathname.startsWith('/slot') ? 'tab active' : 'tab'} href="/slot/launch-copy">
        <Grid3X3 size={17} />
        <span>Slot</span>
      </Link>
    </nav>
  )
}
