'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import he from 'he'
import DOMPurify from 'isomorphic-dompurify'

export function WelcomeMessage() {
  const searchParams = useSearchParams()
  const [sanitizedName, setSanitizedName] = useState<string | null>(null)

  useEffect(() => {
    const name = searchParams.get('name')
    if (name) {
      const decodedName = he.decode(name)
      const sanitizedName = DOMPurify.sanitize(decodedName)
      setSanitizedName(sanitizedName)
    }
  }, [searchParams])

  if (!sanitizedName) {
    return null
  }

  return (
    <div className="text-2xl font-bold text-center text-primary py-4">
      👋 Welcome, <span dangerouslySetInnerHTML={{ __html: sanitizedName }} />
    </div>
  )
}

