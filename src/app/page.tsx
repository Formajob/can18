'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/components/LoginPage'
import HomePage from '@/components/HomePage'

function PageContent() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 'home'

  return (
    <HomePage
      showPredictionsPage={page === 'predictions'}
      showRankingsPage={page === 'rankings'}
      showAdminPage={page === 'admin'}
    />
  )
}

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const [isClient, setIsClient] = useState(false)

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
    <Suspense fallback={<div>Chargement...</div>}>
      <PageContent />
    </Suspense>
  )
}
