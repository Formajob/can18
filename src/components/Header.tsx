'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy, Home, History, BarChart3, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface HeaderProps {
  currentPage: 'home' | 'predictions' | 'rankings' | 'admin'
}

export default function Header({ currentPage }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home, href: '/' },
    { id: 'predictions', label: 'Mes Pronostics', icon: History, href: '/?page=predictions' },
    { id: 'rankings', label: 'Classements', icon: BarChart3, href: '/?page=rankings' },
  ]

  if (user?.isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield, href: '/?page=admin' })
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-amber-500 to-orange-600 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
              <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white dark:text-gray-100">CAN 2025</h1>
              <p className="text-xs text-amber-100 dark:text-amber-200">Pronostics</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'text-white hover:text-amber-100 dark:text-gray-100 dark:hover:text-amber-200',
                      currentPage === item.id &&
                        'bg-white/20 text-white dark:bg-gray-800/50'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-white dark:text-gray-100">
                {user?.name}
              </span>
              <span className="text-xs text-amber-100 dark:text-amber-200">
                🏆 {user?.totalPoints} pts
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:text-amber-100 dark:text-gray-100 dark:hover:text-amber-200"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <nav className="md:hidden flex items-center justify-around mt-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'text-white hover:text-amber-100 dark:text-gray-100 dark:hover:text-amber-200',
                    currentPage === item.id && 'bg-white/20 text-white dark:bg-gray-800/50'
                  )}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
