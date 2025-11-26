import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  console.log('=== CALLBACK ROUTE HIT ===')
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  
  console.log('Search params:', {
    code: code ? 'present' : 'missing',
    error,
    allParams: Object.fromEntries(searchParams)
  })

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error from URL:', error)
    return NextResponse.redirect(`${origin}/signin?error=${error}`)
  }

  // If no code, something went wrong
  if (!code) {
    console.error('No code in callback URL')
    return NextResponse.redirect(`${origin}/signin`)
  }

  console.log('Code present, exchanging for session...')

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookieList) {
          try { 
            cookieList.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            )
          } catch (e) {
            console.error('Cookie error:', e)
          }
        }
      }
    }
  )

  const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
  
  console.log('Session exchange result:', {
    hasSession: !!session,
    hasUser: !!session?.user,
    error: sessionError
  })

  if (sessionError || !session?.user) {
    console.error('Code exchange failed:', sessionError)
    return NextResponse.redirect(`${origin}/signin?error=auth_failed`)
  }

  // Create response with redirect
  const response = NextResponse.redirect(`${origin}/admin`)

  // Manually set auth cookies on the response
  cookieStore.getAll().forEach(({ name, value }) => {
    response.cookies.set(name, value)
  })

  return response
}