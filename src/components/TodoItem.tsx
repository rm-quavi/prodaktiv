'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Trash2, Calendar, Flag } from 'lucide-react'
import { Todo } from '@/types'
import { updateTodo, deleteTodo } from '@/lib/firestoreUtils'
import { useState } from 'react'

interface TodoItemProps {
  todo: Todo
}

const priorityColors = {
  Low: 'text-green-500',
  Medium: 'text-yellow-500',
  High: 'text-red-500',
}

const priorityBgColors = {
  Low: 'bg-soft-green',
  Medium: 'bg-soft-orange',
  High: 'bg-soft-pink',
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleStatus = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const newStatus = todo.status === 'Todo' ? 'Done' : 'Todo'
      await updateTodo(todo.id, { status: newStatus })
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      await deleteTodo(todo.id)
    } catch (error) {
      console.error('Error deleting todo:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const isOverdue = todo.status === 'Todo' && todo.deadline && new Date() > todo.deadline

  return (
    <Card className={`modern-card transition-all duration-200 hover:shadow-md ${
      todo.status === 'Done' ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-4 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base ${
                todo.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`text-sm mt-2 ${
                  todo.status === 'Done' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-4">
                {todo.deadline && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(todo.deadline)}</span>
                  </div>
                )}
                
                <div className={`flex items-center space-x-2 text-xs px-3 py-1 rounded-full ${priorityBgColors[todo.priority]}`}>
                  <Flag className={`h-3 w-3 ${priorityColors[todo.priority]}`} />
                  <span className={priorityColors[todo.priority]}>
                    {todo.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 