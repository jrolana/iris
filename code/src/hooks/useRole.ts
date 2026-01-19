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
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log('No session found, redirecting to signin')
          setIsLoading(false)
          return
        }

        console.log('Session found, checking role for user:', session.user.id)

        const { data: userRole, error } =  await supabase.rpc("get_user_role")

        if (error) {
          console.error('Error fetching user role:', error)
          setIsLoading(false)
          return
        }

        if (!userRole) {
          console.warn('No user data found in database')
          setIsLoading(false)
          return
        }

        console.log('User role:', userRole, 'Allowed roles:', allowedRoles)

        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true)
        } else {
          console.warn(`User role ${userRole} not in allowed roles`)
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