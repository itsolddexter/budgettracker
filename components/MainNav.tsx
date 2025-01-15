'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PlusCircle, Receipt, LineChart } from 'lucide-react'

export function MainNav({ userId }: { userId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const name = searchParams.get('name')

  const routes = [
    {
      href: `/?telegramid=dexter_${userId}&mode=${mode || ''}&name=${name || ''}`,
      label: 'Overview',
      icon: LineChart,
      active: pathname === '/',
    },
    {
      href: `/transactions?telegramid=dexter_${userId}&mode=${mode || ''}`,
      label: 'History',
      icon: Receipt,
      active: pathname === '/transactions',
    },
    {
      href: `/add-transaction?telegramid=dexter_${userId}&mode=${mode || ''}`,
      label: 'Add',
      icon: PlusCircle,
      active: pathname === '/add-transaction',
    },
  ]

  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                route.active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <route.icon className="h-4 w-4" />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

