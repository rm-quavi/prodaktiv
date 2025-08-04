'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Trash2, Flame, Clock, MoreVertical, Edit } from 'lucide-react'
import { Habit } from '@/types'
import { updateHabit, deleteHabit } from '@/lib/firestoreUtils'
import { updateStreakOnCompletion } from '@/lib/streakUtils'
import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { HabitForm } from '@/components/HabitForm'

interface HabitItemProps {
  habit: Habit
  userId: string
}

export function HabitItem({ habit, userId }: HabitItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

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

  const handleEdit = () => {
    setIsEditFormOpen(true)
  }

  return (
    <>
      <Card className={`modern-card transition-all duration-200 hover:shadow-md ${
        habit.status === 'Done' ? 'opacity-75' : ''
      }`}>
        <CardContent className="p-4 pt-3 pr-1">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleStatus}
                    disabled={isUpdating}
                    className="mt-[1px] h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors mr-1"
                    aria-label="Toggle habit status"
                  >
                    {habit.status === 'Done' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </Button>
                  <h3 className={`font-semibold text-base ${
                    habit.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {habit.title}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-4 mt-2">
                  
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
            
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  disabled={isUpdating}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Edit Habit Form */}
      <HabitForm
        habit={habit}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        userId={userId}
      />
    </>
  )
} 