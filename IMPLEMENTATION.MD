# implementation.md

## 🧩 Overview

This is a productivity web app that combines **Todo Management** and **Habit Tracking**. It is built using **Next.js 15**, **React (TypeScript)**, **Tailwind CSS**, **Shadcn UI**, and **Lucide React**. The app enables users to manage tasks, track recurring habits, and visualize their progress through analytics.

The system uses **Firebase Authentication** for user login, **Firestore** for cloud database storage, and **Chart.js** for real-time analytics. The app includes **push notifications** for incomplete habits based on their scheduled time.

---

## 🚀 Tech Stack

| Purpose             | Tech                                |
|---------------------|-------------------------------------|
| Frontend Framework  | Next.js 15 + React + TypeScript     |
| Styling             | Tailwind CSS                        |
| UI Components       | Shadcn UI                           |
| Icons               | Lucide React                        |
| Authentication      | Firebase Auth (Email + Google)      |
| Database            | Firebase Firestore                  |
| Analytics           | Chart.js                            |
| Notifications       | Firebase Cloud Messaging (FCM)      |

---

## 📁 File Structure (High-level)

app/
├─ page.tsx # Homepage with tabs
├─ login/page.tsx # Login page (Firebase)
├─ analytics/page.tsx # Analytics dashboard with charts
├─ components/
│ ├─ TodoForm.tsx
│ ├─ HabitForm.tsx
│ ├─ TodoItem.tsx
│ ├─ HabitItem.tsx
│ ├─ AppBar.tsx
│ └─ FloatingButton.tsx
├─ lib/
│ ├─ streakUtils.ts # Habit streak logic
│ ├─ firestoreUtils.ts # Firestore helpers
│ ├─ notificationUtils.ts # Push notification scheduling
├─ firebase/
│ ├─ firebaseConfig.ts # Firebase initialization
│ └─ messaging.ts # Push notification setup
├─ types/
│ └─ index.ts # Shared types

---

## ✅ Core Features

### ✅ Todo Management
- Add, edit, delete todo items
- Fields:
  - `title`, `description`, `deadline`, `status: "Todo" | "Done"`, `priority: "Low" | "Medium" | "High"`
- Recurring options:
  - Weekly: `1–7 times/week`
  - Monthly: once or twice
- Stored in Firestore under the `todo` collection with `userId` reference

---

### ✅ Habit Tracker
- Habits categorized by time of day:
  - `"Morning"`, `"Lunch"`, `"Afternoon"`, `"Evening"`, `"Daily"`
- Fields:
  - `title`, `recurrence: "daily" | "weekly" | "monthly"`, `status`, `streak`, `lastCompletedDate`
- Streak increases on consecutive completions
- Congratulatory modal appears when all daily habits are marked as “Done”
- Stored in Firestore under the `habit` collection with `userId` reference

---

### ✅ Push Notifications
> Powered by **Firebase Cloud Messaging (FCM)**

#### Habit Reminders:
- **Morning:** Notify at **11:00 AM**
- **Lunch:** Notify at **1:30 PM**
- **Afternoon:** Notify at **4:30 PM**
- **Evening:** Notify at **9:00 PM**
- **Daily:** Notify at **10:00 PM** (2 hrs before midnight)

#### Logic:
- Background job (Firebase Function or client timer) checks for unfinished habits
- Sends notification if any habits remain "Todo" for that time slot

---

### ✅ Analytics Dashboard
> Built with **Chart.js** at `/analytics`

Includes:
- Habit streak charts
- Todo completion trends
- Monthly habit/todo summaries
- Priority distribution graphs

---

### ✅ Authentication
> Managed with **Firebase Authentication**

- Login via Email/Password or Google
- Auth state syncs with Firestore to fetch user-specific todos/habits
- User session stored client-side with Firebase SDK

---

### ✅ UI & Navigation

#### App Bar
- **Left:** Logo + App name (clickable → homepage)
- **Right:** Logout button (Firebase sign-out)

#### Homepage
- Tabs: **Todo** | **Habits**
- Floating Action Button (FAB):
  - Shows `TodoForm` or `HabitForm` based on current tab

---

## 🗃️ Firestore Database Structure

### 🔐 `users` Collection

#### Document ID
`<userId>` — from Firebase Auth

#### Fields
| Field         | Type     | Description                           |
|---------------|----------|---------------------------------------|
| `email`       | string   | User's email address                  |
| `name`        | string   | Display name                          |
| `createdAt`   | timestamp | Date account was created              |
| `avatarUrl`   | string   | Profile picture (optional)            |

---

### ✅ `todo` Collection

#### Document ID
Auto-generated

#### Fields
| Field         | Type                 | Description                                  |
|---------------|----------------------|----------------------------------------------|
| `userId`      | string               | Reference to `users` document ID             |
| `title`       | string               | Task title                                   |
| `description` | string               | Task details                                 |
| `deadline`    | timestamp            | Due date                                     |
| `status`      | `"Todo"` \| `"Done"` | Completion status                            |
| `priority`    | `"Low"` \| `"Medium"` \| `"High"` | Priority                  |
| `recurring`   | object (optional)    | `{ type: "weekly" \| "monthly", times: number }` |
| `createdAt`   | timestamp            | Creation timestamp                           |
| `updatedAt`   | timestamp            | Last updated timestamp                       |

---

### 🧘 `habit` Collection

#### Document ID
Auto-generated

#### Fields
| Field              | Type                                       | Description                                |
|--------------------|--------------------------------------------|--------------------------------------------|
| `userId`           | string                                     | Reference to `users` document ID           |
| `title`            | string                                     | Habit name                                 |
| `recurrence`       | `"daily"` \| `"weekly"` \| `"monthly"`     | Frequency                                  |
| `timeOfDay`        | `"Morning"` \| `"Lunch"` \| `"Afternoon"` \| `"Evening"` \| `"Daily"` | Time slot |
| `status`           | `"Todo"` \| `"Done"`                       | Status for the current day                 |
| `streak`           | number                                     | Consecutive days of completion             |
| `lastCompletedDate`| timestamp                                  | For checking streak continuity             |
| `createdAt`        | timestamp                                  | When habit was added                       |
| `updatedAt`        | timestamp                                  | Last updated                               |

---

### 🔄 Daily Reset Logic

- At **12:00 AM**, reset all habit `status` to `"Todo"`
- If not done for today, reset `streak` to 0
- Can be implemented using Firebase Cloud Functions (cron job)
