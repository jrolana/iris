import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROLE_CONFIG, type Role } from '@/lib/roles'

const PUBLIC_ROUTES = ['/signin', '/signup', '/welcome', '/']

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get authenticated user claims
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  // Redirect unauthenticated users from protected routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Check if we already have the role cookie
    let userRole = request.cookies.get('user-role') as Role | undefined

    // If no role cookie, fetch from DB
    if (!userRole) {
      const { data: userData } = await supabase
        .from('private.users')
        .select('role')
        .eq('id', user.sub)
        .single()

      userRole = userData?.role as Role | undefined

      if (userRole) {
        response.cookies.set('user-role', userRole, {
          maxAge: 3600, // 1 hour
          httpOnly: true,
          secure: true,
        })
      }
    }

    // If the user is trying to access a route outside their allowed prefixes
    const allowedPrefixes = ROLE_CONFIG[userRole!]?.allowedPrefixes || []
    const isRouteAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix))

    if (!isRouteAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = ROLE_CONFIG[userRole!]?.home || '/'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}