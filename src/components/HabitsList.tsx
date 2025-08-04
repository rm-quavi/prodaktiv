'use client'

import { Habit } from '@/types'
import { HabitItem } from './HabitItem'
import { EmptyStateCard } from './EmptyStateCard'
import { Card, CardContent } from '@/components/ui/card'

interface HabitsListProps {
  habits: Habit[]
  isLoading: boolean
  onAddClick: () => void
}

// Helper function to get current day of week in lowercase
const getCurrentDayOfWeek = (): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

// Helper function to filter habits based on current day
const filterHabitsForToday = (habits: Habit[]): Habit[] => {
  const currentDay = getCurrentDayOfWeek()
  
  return habits.filter(habit => {
    // Show daily habits always
    if (habit.recurrence === 'daily') return true
    
    // Show monthly habits always (they don't have specific weekdays)
    if (habit.recurrence === 'monthly') return true
    
    // For weekly habits, only show if today is in their weekdays array
    if (habit.recurrence === 'weekly' && habit.weekdays) {
      return habit.weekdays.includes(currentDay)
    }
    
    // Default to showing if no weekdays specified (fallback for weekly habits without weekdays)
    return true
  })
}

// Helper function to count hidden weekly habits
const getHiddenWeeklyHabitsCount = (habits: Habit[]): number => {
  const currentDay = getCurrentDayOfWeek()
  
  return habits.filter(habit => 
    habit.recurrence === 'weekly' && 
    habit.weekdays && 
    !habit.weekdays.includes(currentDay)
  ).length
}

// Helper function to group habits by time of day
const groupHabitsByTimeOfDay = (habits: Habit[]) => {
  const timeOrder = ['Morning', 'Lunch', 'Afternoon', 'Evening', 'Daily']
  const timeIcons = {
    Morning: '🌅',
    Lunch: '🍽️',
    Afternoon: '☀️',
    Evening: '🌙',
    Daily: '📅',
  }
  const grouped = {
    Morning: [] as Habit[],
    Lunch: [] as Habit[],
    Afternoon: [] as Habit[],
    Evening: [] as Habit[],
    Daily: [] as Habit[],
  }
  
  habits.forEach(habit => {
    if (grouped[habit.timeOfDay]) {
      grouped[habit.timeOfDay].push(habit)
    }
  })
  
  return timeOrder.map(time => ({
    time,
    icon: timeIcons[time as keyof typeof timeIcons],
    habits: grouped[time as keyof typeof grouped]
  })).filter(section => section.habits.length > 0)
}

export function HabitsList({ habits, isLoading, onAddClick }: HabitsListProps) {
  const filteredHabits = filterHabitsForToday(habits)
  const hiddenWeeklyHabitsCount = getHiddenWeeklyHabitsCount(habits)

  if (isLoading) {
    return (
      <Card className="modern-card">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading habits...</p>
        </CardContent>
      </Card>
    )
  }

  if (habits.length === 0) {
    return <EmptyStateCard type="habits" onAddClick={onAddClick} />
  }

  if (filteredHabits.length === 0) {
    return <EmptyStateCard type="habits" onAddClick={onAddClick} />
  }

  return (
    <div className="space-y-6">
      {/* Habits grouped by time of day */}
      <div className="space-y-6">
        {groupHabitsByTimeOfDay(filteredHabits).map((section) => (
          <div key={section.time} className="space-y-4">
            <div className="flex items-center space-x-3 pt-6 first:pt-0">
              <h3 className="font-light text-gray-900 flex items-center text-sm">
                <span className="mr-2">{section.icon}</span> {section.time}
              </h3>
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {section.habits.length} habit{section.habits.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3">
              {section.habits.map((habit) => (
                <HabitItem key={habit.id} habit={habit} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Info about hidden weekly habits */}
      {hiddenWeeklyHabitsCount > 0 && (
        <Card className="modern-card border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <span>ℹ️</span>
              <span>
                {hiddenWeeklyHabitsCount} weekly habit{hiddenWeeklyHabitsCount !== 1 ? 's' : ''} hidden for today
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 