'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Lock, Play } from 'lucide-react'
import { Match, Prediction } from '@/store/appStore'
import { cn } from '@/lib/utils'

interface MatchCardProps {
  match: Match
  userPrediction?: Prediction
  canPredict: boolean
  onPredict: (scoreA: number, scoreB: number) => void
}

export default function MatchCard({ match, userPrediction, canPredict, onPredict }: MatchCardProps) {
  const [scoreA, setScoreA] = useState(userPrediction?.predictedScoreA ?? 0)
  const [scoreB, setScoreB] = useState(userPrediction?.predictedScoreB ?? 0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const matchDate = new Date(match.matchDateTime)
  const isMatchStarted = match.status === 'LOCKED' || match.status === 'COMPLETED'
  const isMatchCompleted = match.status === 'COMPLETED'

  const handleScoreChange = (team: 'A' | 'B', change: number) => {
    const newScore = team === 'A' ? Math.max(0, scoreA + change) : Math.max(0, scoreB + change)
    if (team === 'A') {
      setScoreA(newScore)
    } else {
      setScoreB(newScore)
    }
  }

  const handleSubmitPrediction = async () => {
    setIsSubmitting(true)
    try {
      await onPredict(scoreA, scoreB)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = () => {
    if (match.status === 'COMPLETED') {
      return <Badge className="bg-green-600">Terminé</Badge>
    }
    if (match.status === 'LOCKED') {
      return (
        <Badge variant="secondary" className="bg-gray-600">
          <Lock className="w-3 h-3 mr-1" />
          Verrouillé
        </Badge>
      )
    }
    return <Badge className="bg-amber-600">À venir</Badge>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-amber-200 dark:border-amber-900 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg md:text-xl font-semibold">Match du jour</CardTitle>
          {getStatusBadge()}
        </div>
        <div className="flex items-center space-x-4 text-sm text-amber-100 dark:text-amber-200">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{matchDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center space-y-4">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
              <span className="text-3xl md:text-4xl">⚽</span>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                {match.teamA}
              </h3>
            </div>
          </div>

          <div className="flex-shrink-0 mx-4 md:mx-8">
            <div className="flex items-center space-x-2 md:space-x-4">
              {isMatchCompleted ? (
                <div className="flex items-center space-x-3 md:space-x-4 text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  <span>{match.actualScoreA ?? '-'}</span>
                  <span className="text-amber-600 dark:text-amber-400">:</span>
                  <span>{match.actualScoreB ?? '-'}</span>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  {userPrediction && !canPredict ? (
                    <div className="text-2xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
                      {userPrediction.predictedScoreA} - {userPrediction.predictedScoreB}
                    </div>
                  ) : canPredict ? (
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 md:w-10 md:h-10"
                          onClick={() => handleScoreChange('A', -1)}
                          disabled={!canPredict}
                        >
                          -
                        </Button>
                        <span className="w-8 md:w-12 text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {scoreA}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 md:w-10 md:h-10"
                          onClick={() => handleScoreChange('A', 1)}
                          disabled={!canPredict}
                        >
                          +
                        </Button>
                      </div>
                      <span className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
                        -
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 md:w-10 md:h-10"
                          onClick={() => handleScoreChange('B', -1)}
                          disabled={!canPredict}
                        >
                          -
                        </Button>
                        <span className="w-8 md:w-12 text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {scoreB}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 md:w-10 md:h-10"
                          onClick={() => handleScoreChange('B', 1)}
                          disabled={!canPredict}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">Verrouillé</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center space-y-4">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-orange-100 to-red-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
              <span className="text-3xl md:text-4xl">⚽</span>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                {match.teamB}
              </h3>
            </div>
          </div>
        </div>

        {canPredict && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSubmitPrediction}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Validation...' : 'Valider mon pronostic'}
            </Button>
          </div>
        )}

        {userPrediction && !canPredict && (
          <div className="mt-6 text-center">
            <Badge variant="outline" className="text-sm">
              ✅ Pronostic enregistré: {userPrediction.predictedScoreA} - {userPrediction.predictedScoreB}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
