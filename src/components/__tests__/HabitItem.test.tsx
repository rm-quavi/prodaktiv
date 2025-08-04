import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HabitItem } from '../HabitItem'
import { Habit } from '@/types'
import { updateHabit, deleteHabit } from '@/lib/firestoreUtils'

// Mock the firestore utils
jest.mock('@/lib/firestoreUtils', () => ({
  updateHabit: jest.fn(),
  deleteHabit: jest.fn(),
}))

const mockHabit: Habit = {
  id: '1',
  userId: 'user1',
  title: 'Test Habit',
  recurrence: 'daily',
  timeOfDay: 'Morning',
  weekdays: [],
  status: 'Todo',
  streak: 5,
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('HabitItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders habit item correctly', () => {
    render(<HabitItem habit={mockHabit} />)
    
    expect(screen.getByText('Test Habit')).toBeInTheDocument()
    expect(screen.getByText('Morning')).toBeInTheDocument()
    expect(screen.getByText('5 days')).toBeInTheDocument()
    expect(screen.getByText('daily')).toBeInTheDocument()
  })

  it('shows completed state when habit is done', () => {
    const completedHabit = { ...mockHabit, status: 'Done' as const }
    render(<HabitItem habit={completedHabit} />)
    
    const checkbox = screen.getByRole('button', { name: /toggle status/i })
    expect(checkbox).toBeInTheDocument()
  })

  it('displays weekdays for weekly habits', () => {
    const weeklyHabit = { 
      ...mockHabit, 
      recurrence: 'weekly' as const,
      weekdays: ['monday', 'wednesday', 'friday']
    }
    render(<HabitItem habit={weeklyHabit} />)
    
    expect(screen.getByText('Mon, Wed, Fri')).toBeInTheDocument()
  })

  it('calls updateHabit when toggle button is clicked', async () => {
    const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
    mockUpdateHabit.mockResolvedValue(undefined)
    
    render(<HabitItem habit={mockHabit} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(mockUpdateHabit).toHaveBeenCalledWith('1', {
        status: 'Done',
        lastCompletedDate: expect.any(Date),
        streak: 1,
      })
    })
  })

  it('calls deleteHabit when delete button is clicked', async () => {
    const mockDeleteHabit = deleteHabit as jest.MockedFunction<typeof deleteHabit>
    mockDeleteHabit.mockResolvedValue(undefined)
    
    render(<HabitItem habit={mockHabit} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(mockDeleteHabit).toHaveBeenCalledWith('1')
    })
  })

  it('disables buttons during update', async () => {
    const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
    mockUpdateHabit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<HabitItem habit={mockHabit} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle status/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    fireEvent.click(toggleButton)
    
    expect(toggleButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('handles errors gracefully', async () => {
    const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUpdateHabit.mockRejectedValue(new Error('Update failed'))
    
    render(<HabitItem habit={mockHabit} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error updating habit:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('displays correct time of day styling', () => {
    render(<HabitItem habit={mockHabit} />)
    
    const timeElement = screen.getByText('Morning').closest('div')
    expect(timeElement).toHaveClass('bg-soft-blue', 'text-soft-blue')
  })

  it('displays singular day when streak is 1', () => {
    const habitWithOneStreak = { ...mockHabit, streak: 1 }
    render(<HabitItem habit={habitWithOneStreak} />)
    
    expect(screen.getByText('1 day')).toBeInTheDocument()
  })

  it('displays plural days when streak is more than 1', () => {
    const habitWithMultipleStreak = { ...mockHabit, streak: 5 }
    render(<HabitItem habit={habitWithMultipleStreak} />)
    
    expect(screen.getByText('5 days')).toBeInTheDocument()
  })

  it('shows different time of day colors', () => {
    const lunchHabit = { ...mockHabit, timeOfDay: 'Lunch' as const }
    render(<HabitItem habit={lunchHabit} />)
    
    const timeElement = screen.getByText('Lunch').closest('div')
    expect(timeElement).toHaveClass('bg-soft-orange', 'text-soft-orange')
  })
}) 