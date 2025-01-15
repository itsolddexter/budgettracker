'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { TransactionHistory } from '@/components/TransactionHistory'
import { MainNav } from '@/components/MainNav'

function TransactionsContentInner() {
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
          <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
          <TransactionHistory userId={userId} />
        </div>
      </main>
    </>
  )
}

export default function TransactionsContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionsContentInner />
      </Suspense>
    </div>
  )
}

