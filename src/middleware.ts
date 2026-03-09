import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

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
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Service role client for profile lookups (bypasses RLS)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Public routes
    if (pathname === '/' || pathname === '/login') {
        if (user && pathname === '/login') {
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile) {
                const dashboardPath = getRoleDashboard(profile.role)
                return NextResponse.redirect(new URL(dashboardPath, request.url))
            }
        }
        return supabaseResponse
    }

    // Protected routes require auth
    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If on /dashboard root, redirect to role-specific dashboard
    if (pathname === '/dashboard') {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile) {
            const dashboardPath = getRoleDashboard(profile.role)
            return NextResponse.redirect(new URL(dashboardPath, request.url))
        }
    }

    return supabaseResponse
}

function getRoleDashboard(role: string): string {
    switch (role) {
        case 'candidate':
            return '/dashboard/candidate'
        case 'hr_consultant':
            return '/dashboard/consultant'
        case 'super_admin':
            return '/dashboard/admin'
        case 'licensing':
            return '/dashboard/licensing'
        default:
            return '/dashboard/candidate'
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
