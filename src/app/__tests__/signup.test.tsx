import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth'
import { createUser } from '@/lib/firestoreUtils'
import SignupPage from '../signup/page'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn(),
}))

// Mock Firestore utils
jest.mock('@/lib/firestoreUtils', () => ({
  createUser: jest.fn(),
}))

// Mock Firebase config
jest.mock('@/firebase/firebaseConfig', () => ({
  auth: {},
}))

describe('SignupPage', () => {
  const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>
  const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<typeof signInWithPopup>
  const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>
  const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>

  beforeEach(() => {
    jest.clearAllMocks()
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null) // No user initially
      return jest.fn() // Return unsubscribe function
    })
  })

  describe('Rendering', () => {
    it('renders signup form with all required fields', () => {
      render(<SignupPage />)
      
      expect(screen.getByText('Join Prodaktiv')).toBeInTheDocument()
      expect(screen.getByText('Create your account to start your productivity journey')).toBeInTheDocument()
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sign up with Google/ })).toBeInTheDocument()
    })

    it('renders navigation link to login page', () => {
      render(<SignupPage />)
      
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('shows error when form is submitted with empty fields', async () => {
      render(<SignupPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      fireEvent.click(submitButton)
      
      // The form should prevent submission and show validation error
      expect(mockCreateUserWithEmailAndPassword).not.toHaveBeenCalled()
    })

    it('submits form with valid data', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'john@example.com',
        photoURL: null,
      } as User
      
      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      } as ReturnType<typeof createUserWithEmailAndPassword>)
      
      mockCreateUser.mockResolvedValue(undefined)
      
      render(<SignupPage />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'john@example.com',
          'password123'
        )
      })
      
      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith('user123', {
          email: 'john@example.com',
          name: 'John Doe',
          avatarUrl: undefined,
        })
      })
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('shows loading state during signup', async () => {
      mockCreateUserWithEmailAndPassword.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )
      
      render(<SignupPage />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })

    it('handles signup error', async () => {
      const errorMessage = 'Email already in use'
      mockCreateUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage))
      
      render(<SignupPage />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })
  })

  describe('Google Signup', () => {
    it('handles Google signup successfully', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'john@gmail.com',
        displayName: 'John Doe',
        photoURL: 'https://example.com/photo.jpg',
      } as User
      
      mockSignInWithPopup.mockResolvedValue({
        user: mockUser,
      } as ReturnType<typeof signInWithPopup>)
      
      mockCreateUser.mockResolvedValue(undefined)
      
      render(<SignupPage />)
      
      const googleButton = screen.getByRole('button', { name: /Sign up with Google/ })
      fireEvent.click(googleButton)
      
      await waitFor(() => {
        expect(mockSignInWithPopup).toHaveBeenCalled()
      })
      
      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith('user123', {
          email: 'john@gmail.com',
          name: 'John Doe',
          avatarUrl: 'https://example.com/photo.jpg',
        })
      })
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('handles Google signup error', async () => {
      const errorMessage = 'Popup closed by user'
      mockSignInWithPopup.mockRejectedValue(new Error(errorMessage))
      
      render(<SignupPage />)
      
      const googleButton = screen.getByRole('button', { name: /Sign up with Google/ })
      fireEvent.click(googleButton)
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('redirects to home when user is already authenticated', () => {
      mockOnAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'user123' } as User)
        return jest.fn()
      })
      
      render(<SignupPage />)
      
      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('navigates to login page when sign in link is clicked', () => {
      render(<SignupPage />)
      
      const signInLink = screen.getByRole('button', { name: 'Sign in' })
      fireEvent.click(signInLink)
      
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<SignupPage />)
      
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })

    it('has proper button roles', () => {
      render(<SignupPage />)
      
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sign up with Google/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    })

    it('disables buttons during loading', async () => {
      mockCreateUserWithEmailAndPassword.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )
      
      render(<SignupPage />)
      
      const nameInput = screen.getByLabelText('Full Name')
      const emailInput = screen.getByLabelText('Email Address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const submitButton = screen.getByRole('button', { name: 'Create Account' })
      const googleButton = screen.getByRole('button', { name: /Sign up with Google/ })
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
        expect(googleButton).toBeDisabled()
      })
    })
  })
}) 