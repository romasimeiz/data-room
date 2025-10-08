'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  const redirectToHome = () => {
    void router.replace('/')
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The folder you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>
      <Button
        variant="link"
        onClick={redirectToHome}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Go back to home
      </Button>
    </div>
  )
}
