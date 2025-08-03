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

  const completedTodos = todos.filter(todo => todo.status === 'Done')
  const pendingTodos = todos.filter(todo => todo.status === 'Todo')
  const completedHabits = habits.filter(habit => habit.status === 'Done')
  const pendingHabits = habits.filter(habit => habit.status === 'Todo')

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
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
              <span>Habits ({habits.length})</span>
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
              ) : habits.length === 0 ? (
                <EmptyStateCard 
                  type="habits" 
                  onAddClick={() => setIsHabitFormOpen(true)} 
                />
              ) : (
                habits.map((habit) => (
                  <HabitItem key={habit.id} habit={habit} />
                ))
              )}
            </div>
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
