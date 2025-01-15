'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDown } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  date: string;
  time: string;
  description: string;
}

export function TransactionHistory({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dexxy: `dexter_${userId}`,
            action: 'view_summary'
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const rawData = await response.json()
        
        if (!rawData || typeof rawData !== 'object') {
          throw new Error('Invalid response format')
        }

        const data = rawData.answer ? JSON.parse(rawData.answer) : rawData
        
        if (!data.transaction_history || !Array.isArray(data.transaction_history)) {
          throw new Error('Transaction history is missing or invalid')
        }

        setTransactions(data.transaction_history)
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId])

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(`${a.date} ${a.time}`).getTime()
      const dateB = new Date(`${b.date} ${b.time}`).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }
  })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-[100px]" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <p className="text-lg text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'amount')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={toggleSortOrder}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>
      {sortedTransactions.map((transaction, index) => (
        <Card key={`${transaction.date}-${transaction.time}-${index}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'} rounded-full`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date} at {transaction.time}
                  </p>
                </div>
              </div>
              <p className={`text-lg font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

