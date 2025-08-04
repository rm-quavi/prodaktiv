'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Trash2, Flame, Clock } from 'lucide-react'
import { Habit } from '@/types'
import { updateHabit, deleteHabit } from '@/lib/firestoreUtils'
import { updateStreakOnCompletion } from '@/lib/streakUtils'
import { useState } from 'react'

interface HabitItemProps {
  habit: Habit
}

export function HabitItem({ habit }: HabitItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleStatus = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const newStatus = habit.status === 'Todo' ? 'Done' : 'Todo'
      const updates: Partial<Habit> = { status: newStatus }
      
      if (newStatus === 'Done') {
        updates.lastCompletedDate = new Date()
        updates.streak = updateStreakOnCompletion(habit)
      }
      
      await updateHabit(habit.id, updates)
    } catch (error) {
      console.error('Error updating habit:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      await deleteHabit(habit.id)
    } catch (error) {
      console.error('Error deleting habit:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className={`modern-card transition-all duration-200 hover:shadow-md ${
      habit.status === 'Done' ? 'opacity-75' : ''
    }`}>
      <CardContent className="p-4 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base ${
                habit.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {habit.title}
              </h3>
              
              <div className="flex items-center space-x-4 mt-4">
                
                <div className="flex items-center space-x-2 text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  <Flame className="h-3 w-3" />
                  <span>{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span className="capitalize">{habit.recurrence}</span>
                </div>
                
                {habit.recurrence === 'weekly' && habit.weekdays && habit.weekdays.length > 0 && (
                  <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <span>📅</span>
                    <span>{habit.weekdays.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 