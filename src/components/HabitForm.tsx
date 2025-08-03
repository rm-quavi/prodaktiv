'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HabitFormData } from '@/types'
import { addHabit } from '@/lib/firestoreUtils'

interface HabitFormProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function HabitForm({ isOpen, onClose, userId }: HabitFormProps) {
  const [formData, setFormData] = useState<HabitFormData>({
    title: '',
    recurrence: 'daily',
    timeOfDay: 'Daily',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      await addHabit(userId, formData)
      setFormData({
        title: '',
        recurrence: 'daily',
        timeOfDay: 'Daily',
      })
      onClose()
    } catch (error) {
      console.error('Error adding habit:', error)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Add New Habit</DialogTitle>
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
              <SelectTrigger className="modern-select">
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
              <SelectTrigger className="modern-select">
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
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
              disabled={isSubmitting || !formData.title.trim()}
              className="modern-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
            >
              {isSubmitting ? 'Adding...' : 'Add Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 