import Link from 'next/link'
import { ArrowLeft, CheckSquare } from 'lucide-react'

export function ActionBar({ backHref = '/', backLabel = 'Back to board' }: { backHref?: string; backLabel?: string }) {
  return (
    <div className="action-bar">
      <Link className="control-button secondary" href={backHref}>
        <ArrowLeft size={16} />
        {backLabel}
      </Link>
      <Link className="control-button" href="/checklist">
        <CheckSquare size={16} />
        Open Checklist
      </Link>
    </div>
  )
}
