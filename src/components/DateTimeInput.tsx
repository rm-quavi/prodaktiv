'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface DateTimeInputProps {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DateTimeInput({ value, onChange, placeholder = "Set deadline", className = "" }: DateTimeInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dateValue, setDateValue] = useState('')
  const [timeValue, setTimeValue] = useState('')

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatTimeForInput = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const formatDisplayDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const handleDateChange = (newDate: string) => {
    setDateValue(newDate)
    if (newDate && timeValue) {
      const combinedDateTime = new Date(`${newDate}T${timeValue}`)
      onChange(combinedDateTime)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime)
    if (dateValue && newTime) {
      const combinedDateTime = new Date(`${dateValue}T${newTime}`)
      onChange(combinedDateTime)
    }
  }

  const handleClear = () => {
    setDateValue('')
    setTimeValue('')
    onChange(null)
    setIsOpen(false)
  }

  const handleSetNow = () => {
    const now = new Date()
    const dateStr = formatDateForInput(now)
    const timeStr = formatTimeForInput(now)
    setDateValue(dateStr)
    setTimeValue(timeStr)
    onChange(now)
    setIsOpen(false)
  }

  const handleSetToday = () => {
    const today = new Date()
    today.setHours(23, 59, 0, 0) // End of day
    const dateStr = formatDateForInput(today)
    const timeStr = formatTimeForInput(today)
    setDateValue(dateStr)
    setTimeValue(timeStr)
    onChange(today)
    setIsOpen(false)
  }

  // Initialize values when component mounts or value changes
  useEffect(() => {
    if (value) {
      setDateValue(formatDateForInput(value))
      setTimeValue(formatTimeForInput(value))
    }
  }, [value])

  return (
    <div className={`relative ${className}`}>
      {/* Display Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between modern-button border-gray-200 hover:bg-gray-50 text-left font-normal"
      >
        <div className="flex items-center space-x-2">
          <span className={`${value ? 'text-gray-900' : 'text-[#878b92]'} font-normal`}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>
        {value && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="h-6 w-6 p-0 hover:bg-gray-100 rounded flex items-center justify-center cursor-pointer"
          >
            <X className="h-3 w-3" />
          </div>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 modern-card shadow-lg border-gray-200">
          <CardContent className="p-4 space-y-4">
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSetNow}
                className="flex-1 modern-button text-xs"
              >
                Now
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSetToday}
                className="flex-1 modern-button text-xs"
              >
                End of Day
              </Button>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <Input
                type="date"
                value={dateValue}
                onChange={(e) => handleDateChange(e.target.value)}
                className="modern-input"
              />
            </div>

            {/* Time Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <Input
                type="time"
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="modern-input"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 modern-button"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 modern-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Set
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 