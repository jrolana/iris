import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  console.log('=== CALLBACK ROUTE HIT ===')
  
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  
  console.log('Search params:', {
    code: code ? 'present' : 'missing',
    token_hash: token_hash ? 'present' : 'missing',
    type,
    error,
    allParams: Object.fromEntries(searchParams)
  })

  // TODO: should handle signin error
  if (error) {
    console.error('Error from URL:', error)
    return NextResponse.redirect(`${origin}/error=${encodeURIComponent(error)}`)
  }

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

  // Handle INVITE tokens
  if (token_hash && type === 'invite') {
    console.log('Processing invite token...')
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      type: 'invite',
      token_hash,
    })
    
    if (verifyError || !data.session) {
      console.error('Invite verification failed:', verifyError)
      return NextResponse.redirect(`${origin}/welcome?error=${encodeURIComponent(verifyError?.message || 'Invite link expired or invalid')}`)
    }
    
    console.log('Invite verified successfully')
    
    // Redirect to welcome page on success
    return NextResponse.redirect(`${origin}/welcome`)
  }

  // Handle OAUTH code exchange
  if (!code) {
    console.error('No code or token_hash in callback URL')
    return NextResponse.redirect(`${origin}/signin`)
  }

  console.log('Code present, exchanging for session...')
  
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

  const { data: userRole, error: userError } = await supabase.rpc("get_user_role")
  console.log("Fetched user role:", { userRole, userError })
  
  if (userError || !userRole) {
    console.error("Failed to get user role", userError)
    return NextResponse.redirect(`${origin}/signin?error=no_role`)
  }

  const response = NextResponse.redirect(`${origin}/${userRole}`)
  cookieStore.getAll().forEach(({ name, value }) => {
    response.cookies.set(name, value)
  })
  
  return response
}