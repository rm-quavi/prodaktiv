'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import { subscribeToTodos, subscribeToHabits } from '@/lib/firestoreUtils'
import { Todo, Habit } from '@/types'
import { AppBar } from '@/components/AppBar'
import { ChatBot } from '@/components/ChatBot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

    const unsubscribeTodos = subscribeToTodos(user.uid, setTodos)
    const unsubscribeHabits = subscribeToHabits(user.uid, setHabits)

    return () => {
      unsubscribeTodos()
      unsubscribeHabits()
    }
  }, [user])

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
    }
    return days
  }

  const getHabitStreakData = () => {
    const habitStreaks = habits.map(habit => habit.streak)
    const habitNames = habits.map(habit => habit.title)
    
    return {
      labels: habitNames,
      datasets: [
        {
          label: 'Current Streak (days)',
          data: habitStreaks,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  const getTodoCompletionData = () => {
    const days = getLast7Days()
    const completionData = days.map(() => Math.floor(Math.random() * 10) + 1) // Mock data
    
    return {
      labels: days,
      datasets: [
        {
          label: 'Todos Completed',
          data: completionData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
      ],
    }
  }

  const getPriorityDistributionData = () => {
    const priorities = ['Low', 'Medium', 'High']
    const counts = priorities.map(priority => 
      todos.filter(todo => todo.priority === priority).length
    )
    
    return {
      labels: priorities,
      datasets: [
        {
          data: counts,
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  const getTimeOfDayDistributionData = () => {
    const timeSlots = ['Morning', 'Lunch', 'Afternoon', 'Evening', 'Daily']
    const counts = timeSlots.map(time => 
      habits.filter(habit => habit.timeOfDay === time).length
    )
    
    return {
      labels: timeSlots,
      datasets: [
        {
          label: 'Habits by Time of Day',
          data: counts,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(75, 192, 192, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-gray-600">Track your productivity progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Habit Streaks */}
          <Card>
            <CardHeader>
              <CardTitle>Habit Streaks</CardTitle>
            </CardHeader>
            <CardContent>
              {habits.length > 0 ? (
                <Bar 
                  data={getHabitStreakData()} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No habits to display
                </div>
              )}
            </CardContent>
          </Card>

          {/* Todo Completion Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Todo Completion Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <Line 
                data={getTodoCompletionData()} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Todo Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {todos.length > 0 ? (
                <Doughnut 
                  data={getPriorityDistributionData()} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No todos to display
                </div>
              )}
            </CardContent>
          </Card>

          {/* Time of Day Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Habits by Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              {habits.length > 0 ? (
                <Bar 
                  data={getTimeOfDayDistributionData()} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No habits to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{todos.length}</div>
                <div className="text-sm text-gray-600">Total Todos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {todos.length > 0 ? Math.round((todos.filter(t => t.status === 'Done').length / todos.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{habits.length}</div>
                <div className="text-sm text-gray-600">Total Habits</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0}
                </div>
                <div className="text-sm text-gray-600">Avg Streak</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <ChatBot isVisible={!!user} />
    </div>
  )
} 