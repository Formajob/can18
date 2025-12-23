'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, Plus, Check, Lock, Play, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [matches, setMatches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMatch, setNewMatch] = useState({
    teamA: '',
    teamB: '',
    matchDateTime: '',
  })

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/matches')
      const data = await response.json()

      if (response.ok) {
        setMatches(data.matches || [])
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMatch),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du match')
      }

      toast.success('Match créé avec succès!')
      setNewMatch({ teamA: '', teamB: '', matchDateTime: '' })
      setIsDialogOpen(false)
      fetchMatches()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création du match')
    }
  }

  const handleLockMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/lock`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erreur lors du verrouillage')
      }

      toast.success('Match verrouillé!')
      fetchMatches()
    } catch (error) {
      toast.error('Erreur lors du verrouillage du match')
    }
  }

  const handleUnlockMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/unlock`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erreur lors du déverrouillage')
      }

      toast.success('Match déverrouillé!')
      fetchMatches()
    } catch (error) {
      toast.error('Erreur lors du déverrouillage du match')
    }
  }

  const handleUpdateResult = async (matchId: string, scoreA: number, scoreB: number) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scoreA, scoreB }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du résultat')
      }

      toast.success('Résultat mis à jour et points calculés!')
      fetchMatches()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du résultat')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge className="bg-amber-600">Programmé</Badge>
      case 'LOCKED':
        return <Badge className="bg-gray-600"><Lock className="w-3 h-3 mr-1" />Verrouillé</Badge>
      case 'COMPLETED':
        return <Badge className="bg-green-600"><Check className="w-3 h-3 mr-1" />Terminé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestion des matchs</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Créez, modifiez et validez les résultats des matchs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau match
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau match</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau match
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamA">Équipe A</Label>
                <Input
                  id="teamA"
                  placeholder="Ex: Maroc"
                  value={newMatch.teamA}
                  onChange={(e) => setNewMatch({ ...newMatch, teamA: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamB">Équipe B</Label>
                <Input
                  id="teamB"
                  placeholder="Ex: Sénégal"
                  value={newMatch.teamB}
                  onChange={(e) => setNewMatch({ ...newMatch, teamB: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchDateTime">Date et heure</Label>
                <Input
                  id="matchDateTime"
                  type="datetime-local"
                  value={newMatch.matchDateTime}
                  onChange={(e) => setNewMatch({ ...newMatch, matchDateTime: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                Créer le match
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-[700px]">
          <div className="space-y-4 pr-4">
            {matches.map((match) => (
              <Card key={match.id} className="shadow-md border-amber-200 dark:border-amber-900">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {match.teamA} vs {match.teamB}
                      </CardTitle>
                      <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(match.matchDateTime).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(match.matchDateTime).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(match.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {match.status === 'SCHEDULED' && (
                      <Button
                        onClick={() => handleLockMatch(match.id)}
                        variant="outline"
                        className="w-full"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Verrouiller les pronostics
                      </Button>
                    )}
                    {match.status === 'LOCKED' && (
                      <Button
                        onClick={() => handleUnlockMatch(match.id)}
                        variant="outline"
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Déverrouiller les pronostics
                      </Button>
                    )}

                    {(match.status === 'LOCKED' || match.status === 'COMPLETED') && (
                      <div className="space-y-3">
                        <Label>Enregistrer le résultat</Label>
                        <div className="flex items-center justify-center space-x-4">
                          <Input
                            type="number"
                            min="0"
                            defaultValue={match.actualScoreA ?? ''}
                            placeholder="Score A"
                            className="w-20 text-center text-2xl font-bold"
                            id={`scoreA-${match.id}`}
                          />
                          <ArrowRight className="w-6 h-6 text-amber-600" />
                          <Input
                            type="number"
                            min="0"
                            defaultValue={match.actualScoreB ?? ''}
                            placeholder="Score B"
                            className="w-20 text-center text-2xl font-bold"
                            id={`scoreB-${match.id}`}
                          />
                        </div>
                        <Button
                          onClick={() => {
                            const scoreA = parseInt(
                              (document.getElementById(`scoreA-${match.id}`) as HTMLInputElement)?.value || '0'
                            )
                            const scoreB = parseInt(
                              (document.getElementById(`scoreB-${match.id}`) as HTMLInputElement)?.value || '0'
                            )
                            handleUpdateResult(match.id, scoreA, scoreB)
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Valider et calculer les points
                        </Button>
                      </div>
                    )}

                    {match.status === 'COMPLETED' && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Score final</p>
                        <p className="text-3xl font-bold text-amber-600">
                          {match.actualScoreA} - {match.actualScoreB}
                        </p>
                      </div>
                    )}
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
