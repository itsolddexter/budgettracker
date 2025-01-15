'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

interface BudgetData {
  first_name?: string;
  total_income: string;
  total_expense: string;
  balance: string;
}

export default function BudgetSummary({ userId }: { userId: string }) {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchBudgetData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching budget data for user:', userId)
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
      console.log('Raw API response:', rawData)
      
      if (!rawData || typeof rawData !== 'object') {
        throw new Error('Invalid response format')
      }

      let data: BudgetData;
      if (typeof rawData.answer === 'string') {
        try {
          data = JSON.parse(rawData.answer);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Invalid JSON in response');
        }
      } else if (typeof rawData.answer === 'object') {
        data = rawData.answer;
      } else {
        throw new Error('Unexpected response format');
      }

      console.log('Parsed budget data:', data)

      if (!data.total_income || !data.total_expense || !data.balance) {
        throw new Error('Missing required budget data')
      }

      setBudgetData(data)
    } catch (error) {
      console.error('Error in fetchBudgetData:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgetData()
  }, [userId])

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <Button onClick={fetchBudgetData} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {budgetData?.first_name ? `${budgetData.first_name}'s Budget` : 'Budget Summary'}
        </h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={fetchBudgetData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[100px]" />
          ))}
        </div>
      ) : budgetData ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <ArrowUpIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Income</p>
                    <h2 className="text-3xl font-bold">${budgetData.total_income}</h2>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <ArrowDownIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expenses</p>
                    <h2 className="text-3xl font-bold">${budgetData.total_expense}</h2>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 ${Number(budgetData.balance) >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-full`}>
                    <ArrowUpIcon className={`h-8 w-8 ${Number(budgetData.balance) >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Balance</p>
                    <h2 className="text-3xl font-bold">${budgetData.balance}</h2>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center text-gray-500">No budget data available</div>
      )}
    </div>
  )
}

