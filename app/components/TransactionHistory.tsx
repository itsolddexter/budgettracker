'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Transaction, TransactionResponse } from '../types/budget'

export function TransactionHistory({ userId, onTransactionAdded }: { userId: string, onTransactionAdded: () => void }) {
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense' as const
  })
  const [error, setError] = useState<string | null>(null)

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: newTransaction.type === 'income' ? 'add_income' : 'add_expense',
          amount: newTransaction.amount,
          description: newTransaction.description
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add transaction')
      }

      const result: TransactionResponse = await response.json()

      setNewTransaction({ description: '', amount: '', type: 'expense' })
      onTransactionAdded()
    } catch (error) {
      console.error('Failed to save transaction:', error)
      setError('Failed to add transaction. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addTransaction} className="space-y-4 mb-4">
          <Input
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
            required
          />
          <select
            className="w-full p-2 border rounded"
            value={newTransaction.type}
            onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <Button type="submit">Add Transaction</Button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

