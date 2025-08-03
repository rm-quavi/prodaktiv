'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingButton({ onClick, className }: FloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={`cursor-pointer fixed bottom-6 right-6 h-14 w-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
      aria-label="Add new item"
    >
      <Plus className="h-6 w-6 text-white" />
    </Button>
  )
} 