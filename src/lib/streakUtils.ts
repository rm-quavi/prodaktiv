import { Habit } from '@/types'

/**
 * Calculate if a habit streak should be reset based on last completion date
 */
export function shouldResetStreak(habit: Habit): boolean {
  if (!habit.lastCompletedDate) return true
  
  const today = new Date()
  const lastCompleted = new Date(habit.lastCompletedDate)
  
  // Reset if last completed was not yesterday (for daily habits)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  return lastCompleted.toDateString() !== yesterday.toDateString()
}

/**
 * Calculate the current streak for a habit
 */
export function calculateStreak(habit: Habit): number {
  if (habit.status === 'Done') {
    return habit.streak
  }
  
  // If habit is not done today and should reset, return 0
  if (shouldResetStreak(habit)) {
    return 0
  }
  
  return habit.streak
}

/**
 * Update streak when habit is completed
 */
export function updateStreakOnCompletion(habit: Habit): number {
  const today = new Date()
  const lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null
  
  if (!lastCompleted) {
    return 1 // First completion
  }
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // If last completed was yesterday, increment streak
  if (lastCompleted.toDateString() === yesterday.toDateString()) {
    return habit.streak + 1
  }
  
  // If last completed was today, keep current streak
  if (lastCompleted.toDateString() === today.toDateString()) {
    return habit.streak
  }
  
  // Otherwise, reset to 1
  return 1
} 