'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Medal, Award, Building2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function RankingsPage() {
  const { user } = useAuthStore()
  const [individualRankings, setIndividualRankings] = useState<any[]>([])
  const [activityRankings, setActivityRankings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    try {
      setIsLoading(true)
      const [individualRes, activityRes] = await Promise.all([
        fetch('/api/rankings/individual'),
        fetch('/api/rankings/activities'),
      ])

      const individualData = await individualRes.json()
      const activityData = await activityRes.json()

      if (individualRes.ok) {
        setIndividualRankings(individualData.rankings || [])
      }
      if (activityRes.ok) {
        setActivityRankings(activityData.rankings || [])
      }
    } catch (error) {
      console.error('Error fetching rankings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-700" />
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
  }

  const getRankingCard = (entry: any, isCurrentUser: boolean) => {
    return (
      <div
        className={`flex items-center justify-between p-4 rounded-lg ${
          isCurrentUser
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-500 dark:border-amber-500'
            : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-center space-x-4">
          {getRankIcon(entry.rank)}
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{entry.userName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{entry.userActivity}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="text-lg font-semibold px-3 py-1">{entry.totalPoints} pts</Badge>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="shadow-md border-amber-200 dark:border-amber-900">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Votre position</p>
              <p className="text-3xl font-bold text-amber-600">
                #{individualRankings.findIndex((r) => r.userId === user?.id) + 1 || '-'}
              </p>
            </div>
            <Trophy className="w-10 h-10 text-amber-600" />
          </CardContent>
        </Card>
        <Card className="shadow-md border-amber-200 dark:border-amber-900">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vos points</p>
              <p className="text-3xl font-bold text-amber-600">{user?.totalPoints || 0}</p>
            </div>
            <Award className="w-10 h-10 text-amber-600" />
          </CardContent>
        </Card>
        <Card className="shadow-md border-amber-200 dark:border-amber-900">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Participants</p>
              <p className="text-3xl font-bold text-amber-600">{individualRankings.length}</p>
            </div>
            <Building2 className="w-10 h-10 text-amber-600" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">🏆 Classement individuel</TabsTrigger>
          <TabsTrigger value="activities">🏢 Par activité</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4 mt-6">
          <Card className="shadow-md border-amber-200 dark:border-amber-900">
            <CardHeader>
              <CardTitle>Classement général</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {individualRankings.map((entry) => (
                    <div key={entry.userId}>
                      {getRankingCard(entry, entry.userId === user?.id)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4 mt-6">
          <div className="space-y-6">
            {activityRankings.map((activityRanking) => (
              <Card key={activityRanking.activityName} className="shadow-md border-amber-200 dark:border-amber-900">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    <span>{activityRanking.activityName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {activityRanking.entries.map((entry: any) => (
                        <div key={entry.userId}>
                          {getRankingCard(entry, entry.userId === user?.id)}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
