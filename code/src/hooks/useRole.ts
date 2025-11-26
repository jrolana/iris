'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export function useRole(allowedRoles: string[]) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkRole() {
      try {
        const supabase = createClient()
        
        // Wait for auth state to be ready
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log('No session found, redirecting to signin')
          setIsLoading(false)
          return
        }

        console.log('Session found, checking role for user:', session.user.id)

        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('uid', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching user role:', error)
          setIsLoading(false)
          return
        }

        if (!userData) {
          console.warn('No user data found in database')
          setIsLoading(false)
          return
        }

        console.log('User role:', userData.role, 'Allowed roles:', allowedRoles)

        // Check if user has allowed role
        if (allowedRoles.includes(userData.role)) {
          setIsAuthorized(true)
        } else {
          console.warn(`User role ${userData.role} not in allowed roles`)
        }
      } catch (error) {
        console.error('Error checking role:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkRole()
  }, [allowedRoles, router])

  return { isAuthorized, isLoading }
}