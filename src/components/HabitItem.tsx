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

const timeOfDayColors = {
  Morning: 'bg-soft-blue text-soft-blue',
  Lunch: 'bg-soft-orange text-soft-orange',
  Afternoon: 'bg-soft-pink text-soft-pink',
  Evening: 'bg-soft-purple text-soft-purple',
  Daily: 'bg-soft-green text-soft-green',
}

const timeOfDayIcons = {
  Morning: '🌅',
  Lunch: '🍽️',
  Afternoon: '☀️',
  Evening: '🌙',
  Daily: '📅',
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
      <CardContent className="p-4 px-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className="mt-1 h-8 w-8 p-0 rounded-xl hover:bg-gray-100"
              aria-label="Toggle status"
            >
              {habit.status === 'Done' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base ${
                habit.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {habit.title}
              </h3>
              
              <div className="flex items-center space-x-4 mt-4">
                <div className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full ${timeOfDayColors[habit.timeOfDay]}`}>
                  <span>{timeOfDayIcons[habit.timeOfDay]}</span>
                  <span>{habit.timeOfDay}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  <Flame className="h-3 w-3" />
                  <span>{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  <span className="capitalize">{habit.recurrence}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isUpdating}
            className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 