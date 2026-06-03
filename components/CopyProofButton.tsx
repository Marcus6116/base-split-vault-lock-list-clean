'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyProofButton({ proof }: { proof: string }) {
  const [copied, setCopied] = useState(false)

  async function copyProof() {
    await navigator.clipboard.writeText(proof)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button className="icon-button" onClick={copyProof} title={copied ? 'Copied' : 'Copy proof'} type="button">
      {copied ? <Check size={17} /> : <Copy size={17} />}
    </button>
  )
}
