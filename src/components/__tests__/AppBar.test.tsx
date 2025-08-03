import { render, screen, fireEvent } from '@testing-library/react'
import { AppBar } from '../AppBar'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Firebase auth
jest.mock('@/firebase/firebaseConfig', () => ({
  auth: {},
}))

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
}))

describe('AppBar', () => {
  it('renders app name and logo', () => {
    render(<AppBar />)
    
    expect(screen.getByText('Prodaktiv')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(<AppBar />)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()
  })

  it('calls onMenuClick when menu button is clicked', () => {
    const mockOnMenuClick = jest.fn()
    render(<AppBar onMenuClick={mockOnMenuClick} />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)
    
    expect(mockOnMenuClick).toHaveBeenCalled()
  })

  it('does not render menu button when onMenuClick is not provided', () => {
    render(<AppBar />)
    
    const menuButton = screen.queryByRole('button', { name: /menu/i })
    expect(menuButton).not.toBeInTheDocument()
  })
}) 