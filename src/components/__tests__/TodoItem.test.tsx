import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoItem } from '../TodoItem'
import { Todo } from '@/types'
import { updateTodo } from '@/lib/firestoreUtils'

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
  status: 'Todo',
  priority: 'Medium',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockOnEdit = jest.fn()

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders todo item correctly', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />)
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('shows completed state when todo is done', () => {
    const completedTodo = { ...mockTodo, status: 'Done' as const }
    render(<TodoItem todo={completedTodo} onEdit={mockOnEdit} />)
    
    const checkbox = screen.getByRole('button', { name: /toggle todo status/i })
    expect(checkbox).toBeInTheDocument()
  })

  it('calls updateTodo when toggle button is clicked', async () => {
    const mockUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>
    mockUpdateTodo.mockResolvedValue(undefined)
    
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle todo status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith('1', { status: 'Done' })
    })
  })

  it('has more options button', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />)
    
    const moreOptionsButton = screen.getByRole('button', { name: /more options/i })
    expect(moreOptionsButton).toBeInTheDocument()
  })

  it('disables buttons during update', async () => {
    const mockUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>
    mockUpdateTodo.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle todo status/i })
    
    fireEvent.click(toggleButton)
    
    expect(toggleButton).toBeDisabled()
  })

  it('handles errors gracefully', async () => {
    const mockUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUpdateTodo.mockRejectedValue(new Error('Update failed'))
    
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle todo status/i })
    fireEvent.click(toggleButton)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error updating todo:', expect.any(Error))
    })
    
    consoleSpy.mockRestore()
  })

  it('shows overdue styling for overdue todos', () => {
    const overdueTodo = { 
      ...mockTodo, 
      deadline: new Date('2020-01-01'),
      status: 'Todo' as const
    }
    render(<TodoItem todo={overdueTodo} onEdit={mockOnEdit} />)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('border-red-200', 'bg-red-50')
  })

  it('shows completed styling for done todos', () => {
    const completedTodo = { ...mockTodo, status: 'Done' as const }
    render(<TodoItem todo={completedTodo} onEdit={mockOnEdit} />)
    
    const card = screen.getByRole('article')
    expect(card).toHaveClass('opacity-75')
  })

  it('has accessible buttons', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />)
    
    expect(screen.getByRole('button', { name: /toggle todo status/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /more options/i })).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />)
    
    const moreOptionsButton = screen.getByRole('button', { name: /more options/i })
    fireEvent.click(moreOptionsButton)
    
    const editButton = screen.getByRole('menuitem', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo)
  })
}) 