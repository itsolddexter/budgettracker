'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import BudgetSummary from '@/components/BudgetSummary'
import { MainNav } from '@/components/MainNav'

function BudgetContentInner() {
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const telegramId = searchParams.get('telegramid')
    if (telegramId && telegramId.startsWith('dexter_')) {
      const extractedId = telegramId.split('_')[1]
      setUserId(extractedId)
    }
  }, [searchParams])

  if (!userId) {
    return null;
  }

  return (
    <>
      <MainNav userId={userId} />
      <main className="flex-1">
        <div className="container mx-auto p-4">
          <BudgetSummary userId={userId} />
        </div>
      </main>
    </>
  )
}

export default function BudgetContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <BudgetContentInner />
      </Suspense>
    </div>
  )
}

