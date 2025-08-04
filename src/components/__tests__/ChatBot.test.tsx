import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatBot } from '../ChatBot'

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}))

// Mock fetch for API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('ChatBot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset fetch mock
    mockFetch.mockClear()
  })

  it('should not render when isVisible is false', () => {
    render(<ChatBot isVisible={false} />)
    expect(screen.queryByRole('button', { name: /open ai assistant/i })).not.toBeInTheDocument()
  })

  it('should render floating action button when isVisible is true', () => {
    render(<ChatBot isVisible={true} />)
    const button = screen.getByRole('button', { name: /open ai assistant/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('fixed', 'bottom-24', 'right-6')
  })

  it('should open chat panel when floating button is clicked', () => {
    render(<ChatBot isVisible={true} />)
    const button = screen.getByRole('button', { name: /open ai assistant/i })
    
    fireEvent.click(button)
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('Productivity Expert')).toBeInTheDocument()
    expect(screen.getByText("Hello! I'm your productivity assistant. I can help you with time management, goal setting, habit formation, and productivity strategies. What would you like to know?")).toBeInTheDocument()
  })

  it('should close chat panel when close button is clicked', async () => {
    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    
    fireEvent.click(openButton)
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    
    const closeButton = screen.getByRole('button', { name: /close chat/i })
    fireEvent.click(closeButton)
    
    // Wait for the transition to complete and check for closed state
    await waitFor(() => {
      const overlay = document.querySelector('.fixed.inset-0')
      expect(overlay).toHaveClass('opacity-0', 'pointer-events-none')
    }, { timeout: 1000 })
  })

  it('should close chat panel when backdrop is clicked', async () => {
    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    
    fireEvent.click(openButton)
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    
    // Click on the backdrop (the overlay div)
    const backdrop = document.querySelector('.fixed.inset-0')
    if (backdrop) {
      fireEvent.click(backdrop)
    }
    
    // Wait for the transition to complete and check for closed state
    await waitFor(() => {
      const overlay = document.querySelector('.fixed.inset-0')
      expect(overlay).toHaveClass('opacity-0', 'pointer-events-none')
    }, { timeout: 1000 })
  })

  it('should send message when send button is clicked', async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Here is some productivity advice for you!' })
    })

    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    fireEvent.click(openButton)
    
    const input = screen.getByPlaceholderText('Ask about productivity...')
    const sendButton = screen.getByRole('button', { name: /send message/i })
    
    fireEvent.change(input, { target: { value: 'How can I improve my time management?' } })
    fireEvent.click(sendButton)
    
    // Check that the user message appears
    expect(screen.getByText('How can I improve my time management?')).toBeInTheDocument()
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('Here is some productivity advice for you!')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should send message when Enter key is pressed', async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Great question about habits! Here is some advice...' })
    })

    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    fireEvent.click(openButton)
    
    const input = screen.getByPlaceholderText('Ask about productivity...')
    
    fireEvent.change(input, { target: { value: 'Tell me about habits' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('Great question about habits! Here is some advice...')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should not send empty messages', () => {
    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    fireEvent.click(openButton)
    
    const sendButton = screen.getByRole('button', { name: /send message/i })
    expect(sendButton).toBeDisabled()
    
    const input = screen.getByPlaceholderText('Ask about productivity...')
    fireEvent.change(input, { target: { value: '   ' } })
    expect(sendButton).toBeDisabled()
  })

  it('should show loading state while AI is responding', async () => {
    // Mock delayed API response
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ response: 'AI response here' })
        }), 1000)
      )
    )

    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    fireEvent.click(openButton)
    
    const input = screen.getByPlaceholderText('Ask about productivity...')
    const sendButton = screen.getByRole('button', { name: /send message/i })
    
    fireEvent.change(input, { target: { value: 'How to prioritize tasks?' } })
    fireEvent.click(sendButton)
    
    // Check that loading indicator appears
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument()
    
    // Wait for response
    await waitFor(() => {
      expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    fireEvent.click(openButton)
    
    const input = screen.getByPlaceholderText('Ask about productivity...')
    const sendButton = screen.getByRole('button', { name: /send message/i })
    
    fireEvent.change(input, { target: { value: 'How to be more productive?' } })
    fireEvent.click(sendButton)
    
    // Wait for fallback error message
    await waitFor(() => {
      expect(screen.getByText(/I'm sorry, I'm having trouble connecting/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should focus input when chat is opened', () => {
    render(<ChatBot isVisible={true} />)
    const openButton = screen.getByRole('button', { name: /open ai assistant/i })
    
    fireEvent.click(openButton)
    
    const input = screen.getByPlaceholderText('Ask about productivity...')
    expect(input).toHaveFocus()
  })
}) 