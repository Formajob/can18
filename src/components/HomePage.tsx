'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/appStore'
import MatchCard from '@/components/MatchCard'
import Header from '@/components/Header'
import PredictionsHistory from '@/components/PredictionsHistory'
import RankingsPage from '@/components/RankingsPage'
import AdminDashboard from '@/components/AdminDashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Match } from '@/store/appStore'

interface HomePageProps {
  showPredictionsPage?: boolean
  showRankingsPage?: boolean
  showAdminPage?: boolean
}

export default function HomePage({ showPredictionsPage = false, showRankingsPage = false, showAdminPage = false }: HomePageProps) {
  const { user, isAuthenticated } = useAuthStore()
  const { currentMatch, setCurrentMatch } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [userPrediction, setUserPrediction] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    if (!showPredictionsPage && !showRankingsPage && !showAdminPage) {
      fetchCurrentMatch()
    }
  }, [isAuthenticated, showPredictionsPage, showRankingsPage, showAdminPage])

  const fetchCurrentMatch = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/matches/current?userId=${user?.id}`)
      const data = await response.json()

      if (response.ok) {
        setCurrentMatch(data.match)
        setUserPrediction(data.prediction || null)
      } else {
        console.error('Failed to fetch current match:', data.error)
      }
    } catch (error) {
      console.error('Error fetching current match:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePredict = async (scoreA: number, scoreB: number) => {
    if (!currentMatch || !user) return

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          matchId: currentMatch.id,
          predictedScoreA: scoreA,
          predictedScoreB: scoreB,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission du pronostic')
      }

      setUserPrediction(data.prediction)
      toast.success('Pronostic enregistré avec succès!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la soumission du pronostic')
    }
  }

  const canPredict = currentMatch && currentMatch.status === 'SCHEDULED' && !userPrediction

  if (showPredictionsPage) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentPage="predictions" />
      <main className="container mx-auto px-4 py-8">
        <PredictionsHistory />
      </main>
    </div>
  }

  if (showRankingsPage) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentPage="rankings" />
      <main className="container mx-auto px-4 py-8">
        <RankingsPage />
      </main>
    </div>
  }

  if (showAdminPage) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentPage="admin" />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentPage="home" />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          ) : currentMatch ? (
            <MatchCard
              match={currentMatch}
              userPrediction={userPrediction}
              canPredict={!!canPredict}
              onPredict={handlePredict}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Aucun match disponible pour le moment
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-amber-200 dark:border-amber-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🎯 3 points</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Score exact</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-amber-200 dark:border-amber-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🟡 1 point</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bon vainqueur</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-amber-200 dark:border-amber-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">❌ 0 point</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mauvais pronostic</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
