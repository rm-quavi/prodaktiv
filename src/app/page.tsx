'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import { subscribeToTodos, subscribeToHabits } from '@/lib/firestoreUtils'
import { Todo, Habit } from '@/types'
import { AppBar } from '@/components/AppBar'
import { FloatingButton } from '@/components/FloatingButton'
import { TodoItem } from '@/components/TodoItem'
import { HabitItem } from '@/components/HabitItem'
import { TodoForm } from '@/components/TodoForm'
import { HabitForm } from '@/components/HabitForm'
import { EmptyStateCard } from '@/components/EmptyStateCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Target } from 'lucide-react'

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

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false)
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('todos')
  const [isLoading, setIsLoading] = useState(true)
  const [isTodosLoading, setIsTodosLoading] = useState(false)
  const [isHabitsLoading, setIsHabitsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setIsLoading(false)
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!user) return

    setIsTodosLoading(true)
    setIsHabitsLoading(true)

    const unsubscribeTodos = subscribeToTodos(user.uid, (todos) => {
      setTodos(todos)
      setIsTodosLoading(false)
    })
    
    const unsubscribeHabits = subscribeToHabits(user.uid, (habits) => {
      setHabits(habits)
      setIsHabitsLoading(false)
    })

    return () => {
      unsubscribeTodos()
      unsubscribeHabits()
    }
  }, [user])

  const handleFloatingButtonClick = () => {
    if (activeTab === 'todos') {
      setIsTodoFormOpen(true)
    } else {
      setIsHabitFormOpen(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back!</h1>
          <p className="text-gray-600">Let&apos;s get productive today</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white p-1 rounded-2xl shadow-sm">
            <TabsTrigger 
              value="todos" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Tasks ({todos.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="habits" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4" />
              <span>Habits ({filterHabitsForToday(habits).length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            {/* Todo List */}
            <div className="space-y-4">
              {isTodosLoading ? (
                <Card className="modern-card">
                  <CardContent className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tasks...</p>
                  </CardContent>
                </Card>
              ) : todos.length === 0 ? (
                <EmptyStateCard 
                  type="tasks" 
                  onAddClick={() => setIsTodoFormOpen(true)} 
                />
              ) : (
                todos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            {/* Habit List */}
            <div className="space-y-4">
              {isHabitsLoading ? (
                <Card className="modern-card">
                  <CardContent className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading habits...</p>
                  </CardContent>
                </Card>
              ) : filterHabitsForToday(habits).length === 0 ? (
                <EmptyStateCard 
                  type="habits" 
                  onAddClick={() => setIsHabitFormOpen(true)} 
                />
              ) : (
                groupHabitsByTimeOfDay(filterHabitsForToday(habits)).map((section) => (
                  <div key={section.time} className="space-y-4">
                    <div className="flex items-center space-x-3 pt-6 first:pt-0">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="mr-2 text-xl">{section.icon}</span> {section.time}
                      </h3>
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {section.habits.length} habit{section.habits.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {section.habits.map((habit) => (
                        <HabitItem key={habit.id} habit={habit} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Info about hidden weekly habits */}
            {!isHabitsLoading && habits.length > 0 && getHiddenWeeklyHabitsCount(habits) > 0 && (
              <Card className="modern-card border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <span>ℹ️</span>
                    <span>
                      {getHiddenWeeklyHabitsCount(habits)} weekly habit{getHiddenWeeklyHabitsCount(habits) !== 1 ? 's' : ''} hidden for today
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <FloatingButton 
        onClick={handleFloatingButtonClick}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
      />

      <TodoForm
        isOpen={isTodoFormOpen}
        onClose={() => setIsTodoFormOpen(false)}
        userId={user?.uid || ''}
      />

      <HabitForm
        isOpen={isHabitFormOpen}
        onClose={() => setIsHabitFormOpen(false)}
        userId={user?.uid || ''}
      />
    </div>
  )
}
