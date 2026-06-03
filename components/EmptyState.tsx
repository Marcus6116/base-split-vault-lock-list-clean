import { Inbox } from 'lucide-react'

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <Inbox size={26} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  )
}
