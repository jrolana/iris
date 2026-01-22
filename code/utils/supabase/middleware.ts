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

  const publicRoutes = ['/signin', '/signup', '/welcome', '/'] 
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: userData } = await supabase
      .from('private.users')
      .select('role')
      .eq('id', user.sub)
      .single()

    const userRole = userData?.role

    if (userRole) {
      supabaseResponse.cookies.set('user-role', userRole, {
        maxAge: 3600, // 1 hour
        httpOnly: true,
        secure: true,
      })
    }

    const roleRoutes = {
      admin: ['/admin'],
      'up-official': ['/up-official'],
      'techgen': ['/techgen'],
    }

    for (const [role, routes] of Object.entries(roleRoutes)) {
      const isAccessingRoleRoute = routes.some(route => pathname.startsWith(route))
      
      if (isAccessingRoleRoute && userRole !== role) {
        const url = request.nextUrl.clone()
        
        switch (userRole) {
          case 'admin':
            url.pathname = '/admin'
            break
          case 'up-official':
            url.pathname = '/up-official'
            break
          case 'techgen':
            url.pathname = '/techgen'
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