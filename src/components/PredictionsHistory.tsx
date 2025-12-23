'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/store/authStore'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Trophy, Target } from 'lucide-react'

export default function PredictionsHistory() {
  const { user } = useAuthStore()
  const [predictions, setPredictions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/predictions/mine?userId=${user?.id}`)
      const data = await response.json()

      if (response.ok) {
        setPredictions(data.predictions || [])
      }
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPointsBadge = (points: number) => {
    if (points === 3) {
      return <Badge className="bg-green-600">🎯 +3 points</Badge>
    }
    if (points === 1) {
      return <Badge className="bg-yellow-600">🟡 +1 point</Badge>
    }
    return <Badge variant="outline">❌ 0 point</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-amber-200 dark:border-amber-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Historique des pronostics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tous vos pronostics et leurs résultats
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            <span className="text-2xl font-bold text-amber-600">{user?.totalPoints || 0}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">points</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : predictions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Aucun pronostic enregistré
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Faites votre premier pronostic sur le match du jour!
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px] w-full rounded-md border border-amber-200 dark:border-amber-900">
          <div className="space-y-4 p-4">
            {predictions.map((prediction) => (
              <Card key={prediction.id} className="shadow-md border-amber-200 dark:border-amber-900">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(prediction.match.matchDateTime).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {prediction.match.teamA} vs {prediction.match.teamB}
                      </CardTitle>
                    </div>
                    {getPointsBadge(prediction.pointsEarned)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Votre pronostic</p>
                        <p className="text-xl font-bold text-amber-600">
                          {prediction.predictedScoreA} - {prediction.predictedScoreB}
                        </p>
                      </div>
                      {prediction.match.status === 'COMPLETED' && (
                        <>
                          <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
                          <div className="text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Score réel</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {prediction.match.actualScoreA} - {prediction.match.actualScoreB}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
