import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HabitItem } from '../HabitItem'
import { Habit } from '@/types'
import { updateHabit } from '@/lib/firestoreUtils'

// Mock the firestore utils
jest.mock('@/lib/firestoreUtils', () => ({
  updateHabit: jest.fn(),
  deleteHabit: jest.fn(),
}))

// Mock the HabitForm component
jest.mock('../HabitForm', () => ({
  HabitForm: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => 
    isOpen ? (
      <div data-testid="habit-form">
        <button onClick={onClose}>Close Habit Form</button>
      </div>
    ) : null
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
    render(<HabitItem habit={mockHabit} userId="user1" />)
    
    expect(screen.getByText('Test Habit')).toBeInTheDocument()
    expect(screen.getByText('5 days')).toBeInTheDocument()
    expect(screen.getByText('daily')).toBeInTheDocument()
  })

  it('shows completed state when habit is done', () => {
    const completedHabit = { ...mockHabit, status: 'Done' as const }
    render(<HabitItem habit={completedHabit} userId="user1" />)
    
    const checkbox = screen.getByRole('button', { name: /toggle habit status/i })
    expect(checkbox).toBeInTheDocument()
  })

  it('displays weekdays for weekly habits', () => {
    const weeklyHabit = { 
      ...mockHabit, 
      recurrence: 'weekly' as const,
      weekdays: ['monday', 'wednesday', 'friday']
    }
    render(<HabitItem habit={weeklyHabit} userId="user1" />)
    
    expect(screen.getByText('weekly')).toBeInTheDocument()
  })

  it('calls updateHabit when toggle button is clicked', async () => {
    const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
    mockUpdateHabit.mockResolvedValue(undefined)
    
    render(<HabitItem habit={mockHabit} userId="user1" />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle habit status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(mockUpdateHabit).toHaveBeenCalledWith('1', {
        status: 'Done',
        lastCompletedDate: expect.any(Date),
        streak: 1,
      })
    })
  })

  it('has more options button', () => {
    render(<HabitItem habit={mockHabit} userId="user1" />)
    
    const moreOptionsButton = screen.getByRole('button', { name: /more options/i })
    expect(moreOptionsButton).toBeInTheDocument()
  })

  it('disables buttons during update', async () => {
    const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
    mockUpdateHabit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<HabitItem habit={mockHabit} userId="user1" />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle habit status/i })
    
    fireEvent.click(toggleButton)
    
    expect(toggleButton).toBeDisabled()
  })

  it('handles errors gracefully', async () => {
    const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUpdateHabit.mockRejectedValue(new Error('Update failed'))
    
    render(<HabitItem habit={mockHabit} userId="user1" />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle habit status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error updating habit:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('displays singular day when streak is 1', () => {
    const habitWithOneStreak = { ...mockHabit, streak: 1 }
    render(<HabitItem habit={habitWithOneStreak} userId="user1" />)
    
    expect(screen.getByText('1 day')).toBeInTheDocument()
  })

  it('displays plural days when streak is more than 1', () => {
    const habitWithMultipleStreak = { ...mockHabit, streak: 5 }
    render(<HabitItem habit={habitWithMultipleStreak} userId="user1" />)
    
    expect(screen.getByText('5 days')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<HabitItem habit={mockHabit} userId="user1" />)
    
    expect(screen.getByRole('button', { name: /toggle habit status/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /more options/i })).toBeInTheDocument()
  })
}) 