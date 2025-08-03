import { shouldResetStreak, calculateStreak, updateStreakOnCompletion } from '../streakUtils'
import { Habit } from '@/types'

describe('streakUtils', () => {
  describe('shouldResetStreak', () => {
    it('should return true when habit has no lastCompletedDate', () => {
      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(shouldResetStreak(habit)).toBe(true)
    })

    it('should return true when last completed was not yesterday', () => {
      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        lastCompletedDate: new Date('2023-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(shouldResetStreak(habit)).toBe(true)
    })

    it('should return false when last completed was yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        lastCompletedDate: yesterday,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(shouldResetStreak(habit)).toBe(false)
    })
  })

  describe('calculateStreak', () => {
    it('should return current streak when habit is done', () => {
      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Done',
        streak: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(calculateStreak(habit)).toBe(5)
    })

    it('should return 0 when habit is not done and should reset', () => {
      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        lastCompletedDate: new Date('2023-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(calculateStreak(habit)).toBe(0)
    })

    it('should return current streak when habit is not done but should not reset', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        lastCompletedDate: yesterday,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(calculateStreak(habit)).toBe(5)
    })
  })

  describe('updateStreakOnCompletion', () => {
    it('should return 1 for first completion', () => {
      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(updateStreakOnCompletion(habit)).toBe(1)
    })

    it('should increment streak when last completed was yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        lastCompletedDate: yesterday,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(updateStreakOnCompletion(habit)).toBe(6)
    })

    it('should keep current streak when last completed was today', () => {
      const today = new Date()

      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        lastCompletedDate: today,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(updateStreakOnCompletion(habit)).toBe(5)
    })

    it('should reset to 1 when last completed was more than 1 day ago', () => {
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      const habit: Habit = {
        id: '1',
        userId: 'user1',
        title: 'Test Habit',
        recurrence: 'daily',
        timeOfDay: 'Morning',
        status: 'Todo',
        streak: 5,
        lastCompletedDate: twoDaysAgo,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(updateStreakOnCompletion(habit)).toBe(1)
    })
  })
}) 