export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  avatarUrl?: string
}

export interface Todo {
  id: string
  userId: string
  title: string
  description: string
  deadline?: Date | null
  status: 'Todo' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
  recurring?: {
    type: 'weekly' | 'monthly'
    times: number
  }
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Habit {
  id: string
  userId: string
  title: string
  recurrence: 'daily' | 'weekly' | 'monthly'
  timeOfDay: 'Morning' | 'Lunch' | 'Afternoon' | 'Evening' | 'Daily'
  weekdays?: string[]
  status: 'Todo' | 'Done'
  streak: number
  lastCompletedDate?: Date
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TodoFormData {
  title: string
  description: string
  deadline?: Date | null
  priority: 'Low' | 'Medium' | 'High'
  recurring?: {
    type: 'weekly' | 'monthly'
    times: number
  }
}

export interface HabitFormData {
  title: string
  recurrence: 'daily' | 'weekly' | 'monthly'
  timeOfDay: 'Morning' | 'Lunch' | 'Afternoon' | 'Evening' | 'Daily'
  weekdays?: string[]
} 