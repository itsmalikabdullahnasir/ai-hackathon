export const AUTH_KEY = 'atomlearn_auth'
export const ONBOARDING_KEY = 'atomlearn_onboarding'
export const USER_LEVEL_KEY = 'atomlearn_level'

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
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
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
