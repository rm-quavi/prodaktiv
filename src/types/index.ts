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
  deadline: Date
  status: 'Todo' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
  recurring?: {
    type: 'weekly' | 'monthly'
    times: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Habit {
  id: string
  userId: string
  title: string
  recurrence: 'daily' | 'weekly' | 'monthly'
  timeOfDay: 'Morning' | 'Lunch' | 'Afternoon' | 'Evening' | 'Daily'
  status: 'Todo' | 'Done'
  streak: number
  lastCompletedDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TodoFormData {
  title: string
  description: string
  deadline: Date
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
} 