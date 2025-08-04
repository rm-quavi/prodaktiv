# Prodaktiv - Todo + Habit Productivity App

A modern, mobile-first productivity web application that combines **Todo Management** and **Habit Tracking** with beautiful analytics and real-time synchronization.

## 🚀 Features

### ✅ Todo Management
- **Add, edit, delete** todo items with rich metadata
- **Priority levels**: Low, Medium, High with color coding
- **Deadlines** with overdue detection
- **Recurring options**: Weekly and monthly patterns
- **Status tracking**: Todo/Done with visual indicators

### 🧘 Habit Tracker
- **Time-based categorization**: Morning, Lunch, Afternoon, Evening, Daily
- **Streak tracking** with intelligent reset logic
- **Recurrence patterns**: Daily, Weekly, Monthly
- **Visual progress indicators** with emoji icons
- **Completion celebration** when all daily habits are done

### 📊 Analytics Dashboard
- **Habit streak charts** with interactive visualizations
- **Todo completion trends** over time
- **Priority distribution** analysis
- **Time-of-day habit patterns**
- **Real-time statistics** and progress metrics

### 🔐 Authentication & Security
- **Firebase Authentication** with email/password and Google sign-in
- **Secure user sessions** with automatic redirects
- **User-specific data** isolation
- **Real-time data synchronization**

### 📱 Mobile-First Design
- **Responsive UI** optimized for mobile devices
- **Touch-friendly interactions** with proper spacing
- **Modern card-based layouts** inspired by the reference design
- **Smooth animations** and transitions
- **Accessible components** with proper ARIA labels

## 🤖 AI Productivity Assistant

The app includes an intelligent AI chatbot powered by DeepSeek API that provides personalized productivity advice:

- **Contextual Responses**: Understands your specific productivity challenges
- **Expert Guidance**: Offers proven techniques for time management, habit formation, and goal setting
- **Always Available**: Accessible via floating action button on all authenticated pages
- **Privacy-First**: Conversations are processed securely and not stored permanently
- **Fallback Support**: Graceful handling when AI service is unavailable

**To enable the AI chatbot:**
1. Get a DeepSeek API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Add `DEEPSEEK_API_KEY=your_api_key` to your `.env.local` file
3. Restart your development server

The chatbot specializes in productivity topics including:
- Time management techniques (Pomodoro, time blocking)
- Goal setting frameworks (SMART goals, OKRs)
- Habit formation strategies (atomic habits, habit stacking)
- Focus and concentration techniques
- Task prioritization methods (Eisenhower Matrix)
- Work-life balance strategies

## 🛠️ Tech Stack

| Purpose | Technology |
|---------|------------|
| **Frontend Framework** | Next.js 15 + React 19 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI + Shadcn UI |
| **Icons** | Lucide React |
| **Authentication** | Firebase Auth |
| **Database** | Firebase Firestore |
| **Analytics** | Chart.js + React-Chartjs-2 |
| **Testing** | Jest + React Testing Library |

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Main homepage with tabs
│   ├── login/page.tsx     # Authentication page
│   └── analytics/page.tsx # Analytics dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AppBar.tsx        # Navigation header
│   ├── FloatingButton.tsx # Add new item button
│   ├── TodoItem.tsx      # Individual todo display
│   ├── HabitItem.tsx     # Individual habit display
│   ├── TodoForm.tsx      # Todo creation/editing
│   └── HabitForm.tsx     # Habit creation/editing
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   ├── streakUtils.ts    # Habit streak logic
│   └── firestoreUtils.ts # Firebase operations
├── firebase/             # Firebase configuration
│   └── firebaseConfig.ts # Firebase setup
└── types/                # TypeScript type definitions
    └── index.ts          # Shared interfaces
```

## 🗃️ Database Schema

### Users Collection
```typescript
{
  id: string,           // Firebase Auth UID
  email: string,        // User email
  name: string,         // Display name
  createdAt: Date,      // Account creation date
  avatarUrl?: string    // Profile picture URL
}
```

### Todos Collection
```typescript
{
  id: string,                    // Auto-generated
  userId: string,                // Reference to user
  title: string,                 // Todo title
  description: string,           // Optional details
  deadline: Date,                // Due date
  status: 'Todo' | 'Done',       // Completion status
  priority: 'Low' | 'Medium' | 'High',
  recurring?: {                  // Optional recurring pattern
    type: 'weekly' | 'monthly',
    times: number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Habits Collection
```typescript
{
  id: string,                    // Auto-generated
  userId: string,                // Reference to user
  title: string,                 // Habit name
  recurrence: 'daily' | 'weekly' | 'monthly',
  timeOfDay: 'Morning' | 'Lunch' | 'Afternoon' | 'Evening' | 'Daily',
  status: 'Todo' | 'Done',       // Today's status
  streak: number,                // Consecutive days
  lastCompletedDate?: Date,      // Last completion
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

The project includes comprehensive test coverage:

### ✅ Passing Tests (27/41)
- **Utility Functions**: 15 tests covering streak logic and class name merging
- **FloatingButton Component**: 3 tests for button interactions
- **Core Logic**: Habit streak calculations and utility functions

### 🔧 Test Structure
```
src/
├── lib/__tests__/           # Utility function tests
│   ├── streakUtils.test.ts  # Habit streak logic
│   └── utils.test.ts        # General utilities
└── components/__tests__/    # Component tests
    ├── AppBar.test.tsx      # Navigation component
    ├── TodoItem.test.tsx    # Todo display component
    ├── HabitItem.test.tsx   # Habit display component
    └── FloatingButton.test.tsx # Add button component
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/lib/__tests__/streakUtils.test.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prodaktiv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Copy your Firebase config

4. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # DeepSeek API for AI Chatbot
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 UI Design Inspiration

The app's design is inspired by modern mobile productivity apps with:
- **Clean, minimalist interface** with subtle gradients
- **Card-based layouts** for easy scanning
- **Color-coded categories** for quick identification
- **Consistent iconography** using Lucide React
- **Mobile-first responsive design** with Tailwind CSS
- **Smooth animations** and micro-interactions

## 🔄 Development Workflow

1. **Feature Development**: Create new components in `src/components/`
2. **Data Layer**: Add Firebase utilities in `src/lib/firestoreUtils.ts`
3. **Testing**: Write tests alongside components in `__tests__/` folders
4. **Type Safety**: Define interfaces in `src/types/index.ts`
5. **Styling**: Use Tailwind CSS classes for consistent design

## 📱 Mobile Optimization

- **Touch targets** are minimum 44px for accessibility
- **Responsive breakpoints** optimized for mobile-first design
- **Gesture-friendly** interactions with proper spacing
- **Fast loading** with Next.js optimizations
- **Offline-ready** with service worker support (planned)

## 🔮 Future Enhancements

- [ ] **Push Notifications** for habit reminders
- [ ] **Dark Mode** support
- [ ] **Data Export** functionality
- [ ] **Team Collaboration** features
- [ ] **Advanced Analytics** with custom date ranges
- [ ] **Offline Support** with local storage sync
- [ ] **Voice Input** for quick todo/habit creation
- [ ] **Integration** with calendar apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Firebase** for the robust backend services
- **Lucide** for the beautiful icon set
- **Chart.js** for the powerful charting library

---

Built with ❤️ using modern web technologies for maximum productivity and user experience.
