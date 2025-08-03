import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoItem } from '../TodoItem'
import { Todo } from '@/types'
import { updateTodo, deleteTodo } from '@/lib/firestoreUtils'

// Mock the firestore utils
jest.mock('@/lib/firestoreUtils', () => ({
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}))

const mockTodo: Todo = {
  id: '1',
  userId: 'user1',
  title: 'Test Todo',
  description: 'Test description',
  deadline: new Date('2024-12-31'),
  priority: 'Medium',
  status: 'Todo',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders todo item correctly', () => {
    render(<TodoItem todo={mockTodo} />)
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('shows completed state when todo is done', () => {
    const completedTodo = { ...mockTodo, status: 'Done' as const }
    render(<TodoItem todo={completedTodo} />)
    
    const checkbox = screen.getByRole('button', { name: /toggle status/i })
    expect(checkbox).toBeInTheDocument()
  })

  it('calls updateTodo when toggle button is clicked', async () => {
    const mockUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>
    mockUpdateTodo.mockResolvedValue(undefined)
    
    render(<TodoItem todo={mockTodo} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', { status: 'Done' })
    })
  })

  it('calls deleteTodo when delete button is clicked', async () => {
    const mockDeleteTodo = deleteTodo as jest.MockedFunction<typeof deleteTodo>
    mockDeleteTodo.mockResolvedValue(undefined)
    
    render(<TodoItem todo={mockTodo} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete todo/i })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(mockDeleteTodo).toHaveBeenCalledWith('1')
    })
  })

  it('disables buttons during update', async () => {
    const mockUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>
    mockUpdateTodo.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<TodoItem todo={mockTodo} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle status/i })
    const deleteButton = screen.getByRole('button', { name: /delete todo/i })
    
    fireEvent.click(toggleButton)
    
    expect(toggleButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('handles errors gracefully', async () => {
    const mockUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUpdateTodo.mockRejectedValue(new Error('Update failed'))
    
    render(<TodoItem todo={mockTodo} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error updating todo:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('shows overdue styling when todo is overdue', () => {
    const overdueTodo = { 
      ...mockTodo, 
      deadline: new Date('2020-01-01'),
      status: 'Todo' as const 
    }
    render(<TodoItem todo={overdueTodo} />)
    
    const card = screen.getByText('Test Todo').closest('[class*="border-red-200"]')
    expect(card).toBeInTheDocument()
  })

  it('does not show overdue styling when todo is completed', () => {
    const completedOverdueTodo = { 
      ...mockTodo, 
      deadline: new Date('2020-01-01'),
      status: 'Done' as const 
    }
    render(<TodoItem todo={completedOverdueTodo} />)
    
    const card = screen.getByText('Test Todo').closest('[class*="border-red-200"]')
    expect(card).not.toBeInTheDocument()
  })
}) 