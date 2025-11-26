import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => 
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ['/signin', '/signup', '/auth', '/'] // Added homepage
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // If no user and trying to access protected route, redirect to homepage
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // If user exists, check their role from public.users
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('uid', user.sub)
      .single()

    const userRole = userData?.role

    // SET THE ROLE COOKIE HERE
    if (userRole) {
      supabaseResponse.cookies.set('user-role', userRole, {
        maxAge: 3600, // 1 hour
        httpOnly: true,
        secure: true,
      })
    }

    // Define role-based route permissions
    const roleRoutes = {
      admin: ['/admin'],
      'up-officials': ['/up-officials'],
    }

    // Check if user is trying to access a role-protected route
    for (const [role, routes] of Object.entries(roleRoutes)) {
      const isAccessingRoleRoute = routes.some(route => pathname.startsWith(route))
      
      if (isAccessingRoleRoute && userRole !== role) {
        // User is trying to access a route they don't have permission for
        const url = request.nextUrl.clone()
        
        // Redirect to their appropriate dashboard
        switch (userRole) {
          case 'admin':
            url.pathname = '/admin'
            break
          case 'up-officials':
            url.pathname = '/up-officials'
            break
          default:
            url.pathname = '/'
        }
        
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}