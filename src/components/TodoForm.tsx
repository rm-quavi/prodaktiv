'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DateTimeInput } from '@/components/DateTimeInput'
import { TodoFormData, Todo } from '@/types'
import { addTodo, updateTodo } from '@/lib/firestoreUtils'

interface TodoFormProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  todo?: Todo | null // Optional todo for edit mode
}

export function TodoForm({ isOpen, onClose, userId, todo }: TodoFormProps) {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    deadline: null,
    priority: 'High',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine if we're in edit mode
  const isEditMode = !!todo

  // Populate form data when todo changes (edit mode)
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description,
        deadline: todo.deadline || null,
        priority: todo.priority,
      })
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        deadline: null,
        priority: 'High',
      })
    }
  }, [todo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      if (isEditMode && todo) {
        // Update existing todo
        await updateTodo(todo.id, {
          ...formData,
          deadline: formData.deadline ? new Date(formData.deadline) : null,
        })
      } else {
        // Create new todo
        await addTodo(userId, {
          ...formData,
          deadline: formData.deadline ? new Date(formData.deadline) : null,
        })
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        deadline: null,
        priority: 'High',
      })
      onClose()
    } catch (error) {
      console.error('Error saving todo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TodoFormData, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
              className="modern-input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
              className="modern-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline (optional)
            </label>
            <DateTimeInput
              value={formData.deadline || null}
              onChange={(date) => handleInputChange('deadline', date)}
              placeholder="Set deadline"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority
            </label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value: string) => handleInputChange('priority', value as 'Low' | 'Medium' | 'High')}
              className="grid grid-cols-3 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Low" id="priority-low" />
                <label htmlFor="priority-low" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Low
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Medium" id="priority-medium" />
                <label htmlFor="priority-medium" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Medium
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="High" id="priority-high" />
                <label htmlFor="priority-high" className="text-sm font-medium text-gray-700 cursor-pointer">
                  High
                </label>
              </div>
            </RadioGroup>
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
              className="modern-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Task' : 'Add Task')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 