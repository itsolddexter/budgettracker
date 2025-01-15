'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useSearchParams } from 'next/navigation'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme={mode === 'dark' ? 'dark' : 'light'} 
      forcedTheme={mode === 'dark' ? 'dark' : 'light'}
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  )
}

