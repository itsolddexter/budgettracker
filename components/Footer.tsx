import { Bot } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-8 py-6 px-4">
      <div 
        className="mx-auto max-w-md rounded-lg bg-card p-6 shadow-lg"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="text-2xl font-bold"
          >
            Made By{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Sandesh
            </span>
          </div>

          <div 
            className="flex items-center gap-2 text-muted-foreground"
          >
            <span>Made With</span>
            <Bot className="h-5 w-5" />
            <span className="font-semibold">Bots.Business</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

