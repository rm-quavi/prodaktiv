'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Habit, HabitFormData } from '@/types'
import { addHabit, updateHabit } from '@/lib/firestoreUtils'

interface HabitFormProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  habit?: Habit | null // Optional habit for edit mode
}

const WEEKDAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

export function HabitForm({ isOpen, onClose, userId, habit }: HabitFormProps) {
  const [formData, setFormData] = useState<HabitFormData>({
    title: '',
    recurrence: 'daily',
    timeOfDay: 'Daily',
    weekdays: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine if we're in edit mode
  const isEditMode = !!habit

  // Populate form data when habit changes (edit mode)
  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title,
        recurrence: habit.recurrence,
        timeOfDay: habit.timeOfDay,
        weekdays: habit.weekdays || [],
      })
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        recurrence: 'daily',
        timeOfDay: 'Daily',
        weekdays: [],
      })
    }
  }, [habit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    
    // Validate weekdays for weekly recurrence
    if (formData.recurrence === 'weekly' && (!formData.weekdays || formData.weekdays.length === 0)) {
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode && habit) {
        // Update existing habit
        await updateHabit(habit.id, {
          title: formData.title,
          recurrence: formData.recurrence,
          timeOfDay: formData.timeOfDay,
          weekdays: formData.weekdays,
        })
      } else {
        // Create new habit
        await addHabit(userId, formData)
        // Reset form only for create mode
        setFormData({
          title: '',
          recurrence: 'daily',
          timeOfDay: 'Daily',
          weekdays: [],
        })
      }
      onClose()
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} habit:`, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof HabitFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleWeekdayToggle = (weekday: string) => {
    setFormData(prev => ({
      ...prev,
      weekdays: prev.weekdays?.includes(weekday)
        ? prev.weekdays.filter(w => w !== weekday)
        : [...(prev.weekdays || []), weekday],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Habit' : 'Add New Habit'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Habit Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter habit title"
              className="modern-input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-2">
              Time of Day
            </label>
            <Select
              value={formData.timeOfDay}
              onValueChange={(value: string) => handleInputChange('timeOfDay', value as HabitFormData['timeOfDay'])}
            >
              <SelectTrigger className="modern-select w-full">
                <SelectValue placeholder="Select time of day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-2">
              Recurrence
            </label>
            <Select
              value={formData.recurrence}
              onValueChange={(value: string) => handleInputChange('recurrence', value as HabitFormData['recurrence'])}
            >
              <SelectTrigger className="modern-select w-full">
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.recurrence === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Weekdays
              </label>
              <div className="grid grid-cols-2 gap-2">
                {WEEKDAYS.map((weekday) => (
                  <button
                    key={weekday.value}
                    type="button"
                    onClick={() => handleWeekdayToggle(weekday.value)}
                    className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                      formData.weekdays?.includes(weekday.value)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {weekday.label}
                  </button>
                ))}
              </div>
              {formData.weekdays && formData.weekdays.length === 0 && (
                <p className="text-sm text-gray-500 mt-4 text-center">Please select at least one weekday</p>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="modern-button rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || (formData.recurrence === 'weekly' && (!formData.weekdays || formData.weekdays.length === 0))}
              className="modern-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
            >
              {isSubmitting 
                ? (isEditMode ? 'Updating...' : 'Adding...') 
                : (isEditMode ? 'Update Habit' : 'Add Habit')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 