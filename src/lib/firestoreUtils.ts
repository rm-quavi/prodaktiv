import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { Todo, Habit, TodoFormData, HabitFormData } from '@/types'

// Todo operations
export async function addTodo(userId: string, todoData: TodoFormData): Promise<string> {
  const todoRef = await addDoc(collection(db, 'todo'), {
    userId,
    ...todoData,
    status: 'Todo',
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return todoRef.id
}

export async function updateTodo(todoId: string, updates: Partial<Todo>): Promise<void> {
  const todoRef = doc(db, 'todo', todoId)
  await updateDoc(todoRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTodo(todoId: string): Promise<void> {
  const todoRef = doc(db, 'todo', todoId)
  await updateDoc(todoRef, {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToTodos(userId: string, callback: (todos: Todo[]) => void) {
  const q = query(
    collection(db, 'todo'),
    where('userId', '==', userId),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const todos: Todo[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      todos.push({
        id: doc.id,
        ...data,
        deadline: data.deadline?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Todo)
    })
    callback(todos)
  })
}

// Habit operations
export async function addHabit(userId: string, habitData: HabitFormData): Promise<string> {
  const habitRef = await addDoc(collection(db, 'habit'), {
    userId,
    ...habitData,
    status: 'Todo',
    streak: 0,
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return habitRef.id
}

export async function updateHabit(habitId: string, updates: Partial<Habit>): Promise<void> {
  const habitRef = doc(db, 'habit', habitId)
  await updateDoc(habitRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteHabit(habitId: string): Promise<void> {
  const habitRef = doc(db, 'habit', habitId)
  await updateDoc(habitRef, {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToHabits(userId: string, callback: (habits: Habit[]) => void) {
  const q = query(
    collection(db, 'habit'),
    where('userId', '==', userId),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const habits: Habit[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      habits.push({
        id: doc.id,
        ...data,
        lastCompletedDate: data.lastCompletedDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Habit)
    })
    callback(habits)
  })
}

// User operations
export async function createUser(userId: string, userData: { email: string; name: string; avatarUrl?: string }) {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
  })
}

export async function getUser(userId: string) {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  
  if (userSnap.exists()) {
    const data = userSnap.data()
    return {
      id: userSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
    }
  }
  return null
} 