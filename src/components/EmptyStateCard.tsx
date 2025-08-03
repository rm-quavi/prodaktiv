import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Target, Plus } from 'lucide-react'

interface EmptyStateCardProps {
  type: 'tasks' | 'habits'
  onAddClick: () => void
}

export function EmptyStateCard({ type, onAddClick }: EmptyStateCardProps) {
  const config = {
    tasks: {
      icon: CheckCircle,
      title: 'No tasks yet',
      description: 'Get started by adding your first task!',
      buttonText: 'Add Task',
      buttonGradient: 'from-blue-500 to-purple-500',
      iconBgColor: 'bg-soft-blue',
      iconColor: 'text-soft-blue'
    },
    habits: {
      icon: Target,
      title: 'No habits yet',
      description: 'Start building good habits by adding your first one!',
      buttonText: 'Add Habit',
      buttonGradient: 'from-purple-500 to-pink-500',
      iconBgColor: 'bg-soft-purple',
      iconColor: 'text-soft-purple'
    }
  }

  const currentConfig = config[type]
  const IconComponent = currentConfig.icon

  return (
    <Card className="modern-card">
      <CardContent className="p-12 text-center">
        <div className={`w-16 h-16 ${currentConfig.iconBgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <IconComponent className={`h-8 w-8 ${currentConfig.iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentConfig.title}</h3>
        <p className="text-gray-600 mb-6">{currentConfig.description}</p>
        <button
          onClick={onAddClick}
          className={`bg-gradient-to-r ${currentConfig.buttonGradient} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          {currentConfig.buttonText}
        </button>
      </CardContent>
    </Card>
  )
} 