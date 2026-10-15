import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';



// App pages that need a signed-in user: /<workspaceId>/planner, /clients, /employees, /reports
const protectedPagePattern = /^\/[^/]+\/(planner|employees|clients|reports)(\/|$)/

// Pages a signed-in user shouldn't see
const signedOutOnlyPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
    const { pathname, origin } = request.nextUrl

    if (!isLoggedIn && protectedPagePattern.test(pathname)) {
        return NextResponse.redirect(origin)
    }

    if (isLoggedIn && signedOutOnlyPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
        return NextResponse.redirect(origin)
    }
}

// Only run on page requests. Never on Next's own files (JS chunks, image optimization) or static
// assets; redirecting those breaks page loading (e.g. a ChunkLoadError right after signing out).
export const config = {
    matcher: ['/((?!_next/|api/|favicon.ico|images/|videos/).*)'],
}
