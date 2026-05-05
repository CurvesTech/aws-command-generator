import { useState } from 'react'

const STORAGE_KEY = 'aws-gen-recent-profiles'
const MAX_PROFILES = 8

export function useProfiles() {
  const [profiles, setProfiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  const addProfile = (profile) => {
    if (!profile?.trim()) return
    setProfiles(prev => {
      const next = [profile, ...prev.filter(p => p !== profile)].slice(0, MAX_PROFILES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return { profiles, addProfile }
}
