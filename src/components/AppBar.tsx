'use client'

import { Button } from '@/components/ui/button'
import { LogOut, Menu } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import { useRouter } from 'next/navigation'

interface AppBarProps {
  onMenuClick?: () => void
}

export function AppBar({ onMenuClick }: AppBarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleLogoClick = () => {
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden h-10 w-10 rounded-xl hover:bg-gray-100"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Prodaktiv</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  )
} 