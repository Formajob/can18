import { create } from 'zustand'

export interface Match {
  id: string
  teamA: string
  teamB: string
  matchDateTime: string
  actualScoreA: number | null
  actualScoreB: number | null
  status: 'SCHEDULED' | 'LOCKED' | 'COMPLETED' | 'CANCELLED'
}

export interface Prediction {
  id: string
  userId: string
  matchId: string
  predictedScoreA: number
  predictedScoreB: number
  pointsEarned: number
  createdAt: string
  updatedAt: string
  match?: Match
}

export interface RankingEntry {
  rank: number
  userId: string
  userName: string
  userActivity: string
  totalPoints: number
}

export interface ActivityRanking {
  activityName: string
  entries: RankingEntry[]
}

interface AppState {
  currentMatch: Match | null
  myPredictions: Prediction[]
  rankings: RankingEntry[]
  activityRankings: ActivityRanking[]
  activities: Array<{ id: string; name: string }>
  setCurrentMatch: (match: Match | null) => void
  setMyPredictions: (predictions: Prediction[]) => void
  setRankings: (rankings: RankingEntry[]) => void
  setActivityRankings: (rankings: ActivityRanking[]) => void
  setActivities: (activities: Array<{ id: string; name: string }>) => void
  addPrediction: (prediction: Prediction) => void
  updatePrediction: (predictionId: string, updates: Partial<Prediction>) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentMatch: null,
  myPredictions: [],
  rankings: [],
  activityRankings: [],
  activities: [],
  setCurrentMatch: (match) => set({ currentMatch: match }),
  setMyPredictions: (predictions) => set({ myPredictions: predictions }),
  setRankings: (rankings) => set({ rankings }),
  setActivityRankings: (rankings) => set({ activityRankings: rankings }),
  setActivities: (activities) => set({ activities }),
  addPrediction: (prediction) =>
    set((state) => ({
      myPredictions: [...state.myPredictions, prediction],
    })),
  updatePrediction: (predictionId, updates) =>
    set((state) => ({
      myPredictions: state.myPredictions.map((p) =>
        p.id === predictionId ? { ...p, ...updates } : p
      ),
    })),
}))
