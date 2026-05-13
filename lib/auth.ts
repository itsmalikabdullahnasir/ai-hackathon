export const AUTH_KEY = 'autocamp_auth'
export const ONBOARDING_KEY = 'autocamp_onboarding'
export const USER_LEVEL_KEY = 'autocamp_level'
export const USER_NAME_KEY = 'autocamp_username'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(AUTH_KEY)
}

export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(ONBOARDING_KEY)
}

export function login(email: string): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email, loginTime: Date.now() }))
  window.dispatchEvent(new Event('autocamp-auth'))
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(USER_NAME_KEY)
  window.dispatchEvent(new Event('autocamp-auth'))
}

export function getAuthEmail(): string | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed?.email === 'string' ? parsed.email : null
  } catch {
    return null
  }
}

export function getUsername(): string | null {
  if (typeof window === 'undefined') return null
  const name = localStorage.getItem(USER_NAME_KEY)
  return name ? name.trim() : null
}

export function setUsername(name: string): void {
  const trimmed = name.trim()
  if (!trimmed) return
  localStorage.setItem(USER_NAME_KEY, trimmed)
  window.dispatchEvent(new Event('autocamp-username'))
}

export function completeOnboarding(data: {
  level: string
  course_id: string
  estimated_weeks: number
  skill_tags: string[]
}): void {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data))
}

export function getOnboardingResult(): {
  level: string
  course_id: string
  estimated_weeks: number
  skill_tags: string[]
} | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(ONBOARDING_KEY)
  return raw ? JSON.parse(raw) : null
}

