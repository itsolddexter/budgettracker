'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { AddTransaction } from '@/components/AddTransaction'
import { MainNav } from '@/components/MainNav'

function AddTransactionContentInner() {
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<string | null>(null)
  const [mode, setMode] = useState<string | null>(null)

  useEffect(() => {
    const telegramId = searchParams.get('telegramid')
    const modeParam = searchParams.get('mode')
    if (telegramId && telegramId.startsWith('dexter_')) {
      const extractedId = telegramId.split('_')[1]
      setUserId(extractedId)
    }
    setMode(modeParam)
  }, [searchParams])

  if (!userId) {
    return null;
  }

  return (
    <>
      <MainNav userId={userId} />
      <main className="flex-1">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Add Transaction</h1>
          <AddTransaction userId={userId} mode={mode} />
        </div>
      </main>
    </>
  )
}

export default function AddTransactionContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <AddTransactionContentInner />
      </Suspense>
    </div>
  )
}

