import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROLE_CONFIG, type Role } from '@/lib/roles'

const PUBLIC_ROUTES = ['/signin', '/signup', '/welcome', '/', '/application-registry', '/application-document', '/application-guide', '/api']

export async function proxy(request: NextRequest) {
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

  console.log('=== MIDDLEWARE DEBUG ===')
  console.log('pathname:', pathname)
  console.log('user sub:', user?.sub)

  // Redirect unauthenticated users from protected routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user && !isPublicRoute) {
    const rawCookie = request.cookies.get('user-role')
    console.log('raw cookie object:', rawCookie)
    console.log('cookie value:', rawCookie?.value)

    let userRole = rawCookie?.value as Role | undefined

    // If no role cookie, fetch from DB
    if (!userRole) {
      console.log('No role cookie, fetching from DB...')
      const { data: userData, error } = await supabase
        .schema("private")
        .from('users')
        .select('role')
        .eq('id', user.sub)
        .single()
      console.log('DB result:', userData, 'error:', error)
      userRole = userData?.role as Role | undefined
      console.log('userRole from DB:', userRole)
    }

    // If the user is trying to access a route outside their allowed prefixes
    const allowedPrefixes = ROLE_CONFIG[userRole!]?.allowedPrefixes || []
    const isRouteAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix))
    console.log('allowedPrefixes:', allowedPrefixes)
    console.log('isRouteAllowed:', allowedPrefixes.some(prefix => pathname.startsWith(prefix)))
    console.log('======================')
    
    if (!isRouteAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = ROLE_CONFIG[userRole!]?.home || '/'
      const redirectResponse = NextResponse.redirect(url)
      // carry over the role cookie to the redirect response
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      return redirectResponse
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}