//middleware.js
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    const { pathname } = req.nextUrl

    // Redirect logged-in users away from login or register pages
    if (token && (pathname === '/login' || pathname === '/')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users away from protected routes
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/dashboard/:path*'))) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/dashboard/:path*', '/']
}