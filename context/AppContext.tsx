'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'employee' | 'mentor' | 'manager' | 'hr' | 'admin'
export type TaskStatus = 'active' | 'completed' | 'pending' | 'overdue' | 'rejected'
export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'

export interface CurrentUser {
  id: string
  username: string
  name: string
  role: UserRole
  loginTime: string
}

export interface Task {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: TaskStatus
  dueDate: string
  coins: number
  category: string
  progress: number
  mentor: string
  requiresApproval: boolean
  employeeId: string
  employeeName: string
  submittedAt?: string
  submissionNotes?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionFeedback?: string
}

export interface AppUser {
  id: string
  username: string
  name: string
  email: string
  role: UserRole
  department: string
  position: string
  status: 'active' | 'inactive'
  lastLogin: string | null
  createdAt: string
  skillCoins: number
  password: string
}

export interface Candidate {
  id: string
  name: string
  position: string
  email: string
  phone: string
  experience: string
  skills: string[]
  aiScore: number
  status: CandidateStatus
  appliedDate: string
  source: string
}

export interface Survey {
  id: string
  title: string
  description: string
  type: string
  targetAudience: string
  questions: string[]
  frequency: string
  createdAt: string
  createdBy: string
  completions: { userId: string }[]
}

export interface AppNotification {
  id: string
  message: string
  icon: string
  color: string
  createdAt: string
  read: boolean
  forUserId: string
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  currentUser: CurrentUser | null
  tasks: Task[]
  users: AppUser[]
  candidates: Candidate[]
  surveys: Survey[]
  notifications: AppNotification[]
  hasUnreadTaskFeedback: boolean
  loading: boolean

  login: (username: string, password: string) => Promise<CurrentUser | null>
  logout: () => Promise<void>

  submitTask: (taskId: number, progress: number, notes: string) => Promise<void>
  cancelTask: (taskId: number) => Promise<void>
  approveTask: (taskId: number, feedback: string) => Promise<void>
  rejectTask: (taskId: number, feedback: string) => Promise<void>
  clearTaskFeedback: () => void

  awardSkillCoins: (userId: string, amount: number) => Promise<void>

  createUser: (user: Omit<AppUser, 'id' | 'status' | 'lastLogin' | 'createdAt' | 'skillCoins'>) => Promise<void>
  updateUser: (id: string, updates: Partial<AppUser>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  toggleUserStatus: (id: string) => Promise<void>

  updateCandidateStatus: (id: string, status: CandidateStatus) => Promise<void>
  addCandidate: (candidate: Omit<Candidate, 'id'>) => Promise<void>

  createSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'completions'>) => Promise<void>
  completeSurvey: (surveyId: string) => Promise<void>

  getUnreadNotificationsCount: () => number
  markAllNotificationsRead: () => Promise<void>

  getCurrentUserData: () => AppUser | undefined
  getPendingTasksCount: () => number
  getUnansweredSurveysCount: () => number
}

const AppContext = createContext<AppContextType | null>(null)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [hasUnreadTaskFeedback, setHasUnreadTaskFeedback] = useState(false)
  const [loading, setLoading] = useState(true)

  // Загружаем данные при старте
  useEffect(() => {
    const init = async () => {
      try {
        // Проверяем текущую сессию
        const meRes = await fetch('/api/auth/me')
        const me = await meRes.json()
        if (me) setCurrentUser(me)

        // Загружаем все данные параллельно
        const [tasksRes, usersRes, candidatesRes, surveysRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/users'),
          fetch('/api/candidates'),
          fetch('/api/surveys')
        ])

        setTasks(await tasksRes.json())
        setUsers(await usersRes.json())
        setCandidates(await candidatesRes.json())
        setSurveys(await surveysRes.json())

        // Уведомления загружаем после получения пользователя
        if (me) {
          const notifRes = await fetch(`/api/notifications?userId=${me.id}`)
          setNotifications(await notifRes.json())
        }
      } catch (e) {
        console.error('Init error:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Загружаем уведомления при смене пользователя
  useEffect(() => {
    if (!currentUser) return
    fetch(`/api/notifications?userId=${currentUser.id}`)
      .then(r => r.json())
      .then(setNotifications)
  }, [currentUser?.id])

  // ── Helpers ───────────────────────────────────────────────────────────────

  const addNotification = async (forUserId: string, message: string, icon: string, color: string) => {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forUserId, message, icon, color })
    })
    const notif = await res.json()
    if (currentUser && forUserId === currentUser.id) {
      setNotifications(prev => [notif, ...prev])
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = async (username: string, password: string): Promise<CurrentUser | null> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (!res.ok) return null
    const { user } = await res.json()
    setCurrentUser(user)
    // Обновляем lastLogin в локальном стейте
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u))
    return user
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setCurrentUser(null)
    setNotifications([])
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────

  const submitTask = async (taskId: number, progress: number, notes: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const updates: Partial<Task> = task.requiresApproval && progress === 100
      ? { status: 'pending', progress, submittedAt: new Date().toISOString(), submissionNotes: notes }
      : !task.requiresApproval && progress === 100
      ? { status: 'completed', progress, approvedAt: new Date().toISOString() }
      : { progress }

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, awardCoins: !task.requiresApproval && progress === 100 })
    })
    const updated = await res.json()
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updated } : t))

    if (!task.requiresApproval && progress === 100) {
      setUsers(prev => prev.map(u => u.id === task.employeeId ? { ...u, skillCoins: u.skillCoins + task.coins } : u))
    }
  }

  const cancelTask = async (taskId: number) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active', progress: 0, submittedAt: null, submissionNotes: null })
    })
    const updated = await res.json()
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updated } : t))
  }

  const approveTask = async (taskId: number, feedback: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'completed',
        approvedAt: new Date().toISOString(),
        rejectionFeedback: feedback || null,
        awardCoins: true
      })
    })
    const updated = await res.json()
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updated } : t))
    setUsers(prev => prev.map(u => u.id === task.employeeId ? { ...u, skillCoins: u.skillCoins + task.coins } : u))
    setHasUnreadTaskFeedback(true)
    await addNotification(task.employeeId, `Задача «${task.title}» одобрена! +${task.coins} SC`, 'ri-check-double-line', 'text-green-600')
  }

  const rejectTask = async (taskId: number, feedback: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionFeedback: feedback,
        progress: 0
      })
    })
    const updated = await res.json()
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updated } : t))
    setHasUnreadTaskFeedback(true)
    await addNotification(task.employeeId, `Задача «${task.title}» отклонена. ${feedback.slice(0, 60)}`, 'ri-close-circle-line', 'text-red-600')
  }

  const clearTaskFeedback = () => setHasUnreadTaskFeedback(false)

  // ── SkillCoins ────────────────────────────────────────────────────────────

  const awardSkillCoins = async (userId: string, amount: number) => {
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillCoins: { increment: amount } })
    })
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, skillCoins: u.skillCoins + amount } : u))
    if (amount > 0) {
      await addNotification(userId, `Вам начислено ${amount} SkillCoins от руководителя!`, 'ri-coin-line', 'text-yellow-600')
    }
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  const createUser = async (user: Omit<AppUser, 'id' | 'status' | 'lastLogin' | 'createdAt' | 'skillCoins'>) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    const newUser = await res.json()
    setUsers(prev => [...prev, newUser])
  }

  const updateUser = async (id: string, updates: Partial<AppUser>) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const updated = await res.json()
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u))
    if (currentUser && currentUser.id === id && updates.role) {
      const cu = { ...currentUser, role: updates.role }
      setCurrentUser(cu)
    }
  }

  const deleteUser = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const toggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id)
    if (!user) return
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    await updateUser(id, { status: newStatus })
  }

  // ── Candidates ────────────────────────────────────────────────────────────

  const updateCandidateStatus = async (id: string, status: CandidateStatus) => {
    const res = await fetch(`/api/candidates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    const updated = await res.json()
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c))
  }

  const addCandidate = async (candidate: Omit<Candidate, 'id'>) => {
    const res = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate)
    })
    const newCandidate = await res.json()
    setCandidates(prev => [...prev, newCandidate])
  }

  // ── Surveys ───────────────────────────────────────────────────────────────

  const createSurvey = async (survey: Omit<Survey, 'id' | 'createdAt' | 'completions'>) => {
    const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(survey)
    })
    const newSurvey = await res.json()
    setSurveys(prev => [...prev, newSurvey])
  }

  const completeSurvey = async (surveyId: string) => {
    if (!currentUser) return
    await fetch(`/api/surveys/${surveyId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    })
    setSurveys(prev => prev.map(s =>
      s.id === surveyId
        ? { ...s, completions: [...s.completions, { userId: currentUser.id }] }
        : s
    ))
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  const getUnreadNotificationsCount = () => {
    if (!currentUser) return 0
    return notifications.filter(n => n.forUserId === currentUser.id && !n.read).length
  }

  const markAllNotificationsRead = async () => {
    if (!currentUser) return
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    })
    setNotifications(prev => prev.map(n =>
      n.forUserId === currentUser.id ? { ...n, read: true } : n
    ))
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getCurrentUserData = () => {
    if (!currentUser) return undefined
    return users.find(u => u.id === currentUser.id)
  }

  const getPendingTasksCount = () => tasks.filter(t => t.status === 'pending').length

  const getUnansweredSurveysCount = () => {
    if (!currentUser) return 0
    return surveys.filter(s => !s.completions.some(c => c.userId === currentUser.id)).length
  }

  return (
    <AppContext.Provider value={{
      currentUser, tasks, users, candidates, surveys, notifications,
      hasUnreadTaskFeedback, loading,
      login, logout,
      submitTask, cancelTask, approveTask, rejectTask, clearTaskFeedback,
      awardSkillCoins,
      createUser, updateUser, deleteUser, toggleUserStatus,
      updateCandidateStatus, addCandidate,
      createSurvey, completeSurvey,
      getUnreadNotificationsCount, markAllNotificationsRead,
      getCurrentUserData, getPendingTasksCount, getUnansweredSurveysCount
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider')
  return ctx
}
