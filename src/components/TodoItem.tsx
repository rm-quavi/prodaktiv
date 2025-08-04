'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Trash2, Calendar, Flag, MoreVertical, Edit } from 'lucide-react'
import { Todo } from '@/types'
import { updateTodo, deleteTodo } from '@/lib/firestoreUtils'
import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface TodoItemProps {
  todo: Todo
  onEdit: (todo: Todo) => void
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

export function TodoItem({ todo, onEdit }: TodoItemProps) {
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

  const handleEdit = () => {
    onEdit(todo)
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
      <CardContent className="p-4 pt-3 pr-1">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleStatus}
                  disabled={isUpdating}
                  className="mt-[1px] h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors mr-1"
                  aria-label="Toggle todo status"
                >
                  {todo.status === 'Done' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </Button>
                <h3 className={`font-semibold text-base ${
                  todo.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
              </div>
              
              {todo.description && (
                <p className={`text-sm mt-2 ${
                  todo.status === 'Done' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-2">
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
          
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem asChild>
                <div onClick={handleEdit} className="cursor-pointer flex items-center px-2 py-1.5 text-sm outline-none hover:bg-gray-100">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div 
                  onClick={handleDelete} 
                  className="cursor-pointer flex items-center px-2 py-1.5 text-sm outline-none hover:bg-gray-100 text-red-600 focus:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: isUpdating ? 'none' : 'auto' }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
} 