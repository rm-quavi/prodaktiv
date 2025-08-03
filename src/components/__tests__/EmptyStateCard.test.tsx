import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyStateCard } from '../EmptyStateCard'

describe('EmptyStateCard', () => {
  const mockOnAddClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Tasks Type', () => {
    it('renders tasks empty state correctly', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      expect(screen.getByText('No tasks yet')).toBeInTheDocument()
      expect(screen.getByText('Get started by adding your first task!')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument()
    })

    it('calls onAddClick when Add Task button is clicked', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      const addButton = screen.getByRole('button', { name: 'Add Task' })
      fireEvent.click(addButton)
      
      expect(mockOnAddClick).toHaveBeenCalledTimes(1)
    })

    it('has correct styling for tasks', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      const button = screen.getByRole('button', { name: 'Add Task' })
      expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-purple-500')
    })
  })

  describe('Habits Type', () => {
    it('renders habits empty state correctly', () => {
      render(<EmptyStateCard type="habits" onAddClick={mockOnAddClick} />)
      
      expect(screen.getByText('No habits yet')).toBeInTheDocument()
      expect(screen.getByText('Start building good habits by adding your first one!')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add Habit' })).toBeInTheDocument()
    })

    it('calls onAddClick when Add Habit button is clicked', () => {
      render(<EmptyStateCard type="habits" onAddClick={mockOnAddClick} />)
      
      const addButton = screen.getByRole('button', { name: 'Add Habit' })
      fireEvent.click(addButton)
      
      expect(mockOnAddClick).toHaveBeenCalledTimes(1)
    })

    it('has correct styling for habits', () => {
      render(<EmptyStateCard type="habits" onAddClick={mockOnAddClick} />)
      
      const button = screen.getByRole('button', { name: 'Add Habit' })
      expect(button).toHaveClass('bg-gradient-to-r', 'from-purple-500', 'to-pink-500')
    })
  })

  describe('Common Features', () => {
    it('renders with modern card styling', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      const card = document.querySelector('.modern-card')
      expect(card).toBeInTheDocument()
    })

    it('renders with proper button styling', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      const button = screen.getByRole('button', { name: 'Add Task' })
      expect(button).toHaveClass(
        'text-white',
        'px-6',
        'py-3',
        'rounded-xl',
        'font-medium',
        'hover:shadow-lg',
        'transition-all',
        'duration-200'
      )
    })

    it('renders with Plus icon in button', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      const button = screen.getByRole('button', { name: 'Add Task' })
      const plusIcon = button.querySelector('svg')
      expect(plusIcon).toBeInTheDocument()
    })

    it('renders with proper icon styling', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      const iconContainer = document.querySelector('.w-16.h-16.bg-soft-blue')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has proper heading structure', () => {
      render(<EmptyStateCard type="tasks" onAddClick={mockOnAddClick} />)
      
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })
}) 