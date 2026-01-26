import type { UserDataCredentials } from '../../../types/web'

const DEFAULT_PASSWORD = 'secret_sauce'

export const USERS = {
  STANDARD: { username: 'standard_user', password: DEFAULT_PASSWORD },
  LOCKED_OUT: { username: 'locked_out_user', password: DEFAULT_PASSWORD },
  PROBLEM: { username: 'problem_user', password: DEFAULT_PASSWORD },
  PERF_GLITCH: { username: 'performance_glitch_user', password: DEFAULT_PASSWORD },
  ERROR: { username: 'error_user', password: DEFAULT_PASSWORD },
  VISUAL: { username: 'visual_user', password: DEFAULT_PASSWORD }
} satisfies Record<string, UserDataCredentials>
