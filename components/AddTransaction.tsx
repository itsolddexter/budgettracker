'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TransactionPopup } from './TransactionPopup'

export function AddTransaction({ userId, mode }: { userId: string, mode: string | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: ''
  })

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      description: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const numericAmount = parseFloat(formData.amount)
      if (isNaN(numericAmount)) {
        throw new Error('Invalid amount')
      }

      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dexxy: `dexter_${userId}`,
          action: formData.type === 'income' ? 'add_income' : 'add_expense',
          amount: numericAmount,
          description: formData.description
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add transaction')
      }

      setPopupMessage(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!`)
      setShowPopup(true)
      resetForm()
      setTimeout(() => {
        setShowPopup(false)
        router.push(`/transactions?telegramid=dexter_${userId}&mode=${mode || ''}`)
        router.refresh()
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setPopupMessage('Failed to add transaction')
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
          <CardDescription>Enter the details of your transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'expense' | 'income' }))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Income</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <TransactionPopup 
        isVisible={showPopup} 
        isSuccess={!error} 
        message={popupMessage} 
      />
    </>
  )
}

