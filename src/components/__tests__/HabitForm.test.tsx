import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HabitForm } from '../HabitForm'
import { Habit } from '@/types'
import { addHabit, updateHabit } from '@/lib/firestoreUtils'

// Mock the firestore utils
jest.mock('@/lib/firestoreUtils', () => ({
  addHabit: jest.fn(),
  updateHabit: jest.fn(),
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

describe('HabitForm', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Create Mode', () => {
    it('renders create form with empty fields', () => {
      render(<HabitForm isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      expect(screen.getByText('Add New Habit')).toBeInTheDocument()
      expect(screen.getByDisplayValue('')).toBeInTheDocument()
      expect(screen.getByText('Add Habit')).toBeInTheDocument()
    })

    it('calls addHabit when form is submitted', async () => {
      const mockAddHabit = addHabit as jest.MockedFunction<typeof addHabit>
      mockAddHabit.mockResolvedValue('new-habit-id')
      
      render(<HabitForm isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const titleInput = screen.getByDisplayValue('')
      fireEvent.change(titleInput, { target: { value: 'New Habit' } })
      
      const submitButton = screen.getByText('Add Habit')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockAddHabit).toHaveBeenCalledWith('user1', {
          title: 'New Habit',
          recurrence: 'daily',
          timeOfDay: 'Daily',
          weekdays: [],
        })
      })
    })

    it('calls onClose after successful creation', async () => {
      const mockAddHabit = addHabit as jest.MockedFunction<typeof addHabit>
      mockAddHabit.mockResolvedValue('new-habit-id')
      
      render(<HabitForm isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const titleInput = screen.getByDisplayValue('')
      fireEvent.change(titleInput, { target: { value: 'New Habit' } })
      
      const submitButton = screen.getByText('Add Habit')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  describe('Edit Mode', () => {
    it('renders edit form with pre-populated data', () => {
      render(<HabitForm habit={mockHabit} isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      expect(screen.getByText('Edit Habit')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Habit')).toBeInTheDocument()
      expect(screen.getByText('Update Habit')).toBeInTheDocument()
    })

    it('calls updateHabit when form is submitted', async () => {
      const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
      mockUpdateHabit.mockResolvedValue(undefined)
      
      render(<HabitForm habit={mockHabit} isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const titleInput = screen.getByDisplayValue('Test Habit')
      fireEvent.change(titleInput, { target: { value: 'Updated Habit' } })
      
      const submitButton = screen.getByText('Update Habit')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockUpdateHabit).toHaveBeenCalledWith('1', {
          title: 'Updated Habit',
          recurrence: 'daily',
          timeOfDay: 'Morning',
          weekdays: [],
        })
      })
    })

    it('calls onClose after successful update', async () => {
      const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
      mockUpdateHabit.mockResolvedValue(undefined)
      
      render(<HabitForm habit={mockHabit} isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const submitButton = screen.getByText('Update Habit')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  describe('Common Functionality', () => {
    it('does not render when isOpen is false', () => {
      render(<HabitForm isOpen={false} onClose={mockOnClose} userId="user1" />)
      
      expect(screen.queryByText('Add New Habit')).not.toBeInTheDocument()
      expect(screen.queryByText('Edit Habit')).not.toBeInTheDocument()
    })

    it('calls onClose when cancel button is clicked', () => {
      render(<HabitForm isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('disables submit button when title is empty', () => {
      render(<HabitForm isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const submitButton = screen.getByText('Add Habit')
      expect(submitButton).toBeDisabled()
    })

    it('shows validation error for weekly habits without weekdays', () => {
      const weeklyHabit = { ...mockHabit, recurrence: 'weekly' as const }
      render(<HabitForm habit={weeklyHabit} isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      // The validation error should appear for weekly habits without weekdays
      expect(screen.getByText('Please select at least one weekday')).toBeInTheDocument()
    })

    it('handles creation errors gracefully', async () => {
      const mockAddHabit = addHabit as jest.MockedFunction<typeof addHabit>
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockAddHabit.mockRejectedValue(new Error('Creation failed'))
      
      render(<HabitForm isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const titleInput = screen.getByDisplayValue('')
      fireEvent.change(titleInput, { target: { value: 'New Habit' } })
      
      const submitButton = screen.getByText('Add Habit')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error adding habit:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })

    it('handles update errors gracefully', async () => {
      const mockUpdateHabit = updateHabit as jest.MockedFunction<typeof updateHabit>
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockUpdateHabit.mockRejectedValue(new Error('Update failed'))
      
      render(<HabitForm habit={mockHabit} isOpen={true} onClose={mockOnClose} userId="user1" />)
      
      const submitButton = screen.getByText('Update Habit')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error updating habit:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })
}) 