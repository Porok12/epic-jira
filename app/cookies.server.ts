import { createCookie } from '@remix-run/node'

export const userPrefs = createCookie('user-prefs', {
  secure: true,
  secrets: ['s3cret1'],
})
