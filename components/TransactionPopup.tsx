import { CheckCircle2, XCircle } from 'lucide-react'

interface TransactionPopupProps {
  isVisible: boolean
  isSuccess: boolean
  message: string
}

export function TransactionPopup({ isVisible, isSuccess, message }: TransactionPopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 mb-4 flex justify-center items-center z-50">
      <div
        className={`px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 ${
          isSuccess ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-6 h-6 text-white" />
        ) : (
          <XCircle className="w-6 h-6 text-white" />
        )}
        <span className="text-white font-medium">{message}</span>
      </div>
    </div>
  )
}

