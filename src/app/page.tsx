'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/components/LoginPage'
import HomePage from '@/components/HomePage'

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)

  const page = searchParams.get('page') || 'home'

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <HomePage
      showPredictionsPage={page === 'predictions'}
      showRankingsPage={page === 'rankings'}
      showAdminPage={page === 'admin'}
    />
  )
}
