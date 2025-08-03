import { render, screen, fireEvent } from '@testing-library/react'
import { FloatingButton } from '../FloatingButton'

describe('FloatingButton', () => {
  it('renders floating button with plus icon', () => {
    const mockOnClick = jest.fn()
    render(<FloatingButton onClick={mockOnClick} />)
    
    const button = screen.getByRole('button', { name: /add new item/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn()
    render(<FloatingButton onClick={mockOnClick} />)
    
    const button = screen.getByRole('button', { name: /add new item/i })
    fireEvent.click(button)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const mockOnClick = jest.fn()
    const customClass = 'custom-class'
    render(<FloatingButton onClick={mockOnClick} className={customClass} />)
    
    const button = screen.getByRole('button', { name: /add new item/i })
    expect(button).toHaveClass(customClass)
  })
}) 