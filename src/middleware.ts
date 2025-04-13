
import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname

    const accessToken = req.cookies.get("accessToken")?.value || req.headers.get("Authorization")?.replace("Bearer ", "") || "";
    const refreshToken = req.cookies.get("refreshToken")?.value || req.headers.get("Authorization")?.replace("Bearer ", "") || "";


    const publicPath = ['/login', '/']
    const isPublicPath = publicPath.includes(path)

    if (path === '/login' && refreshToken) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (!isPublicPath && !accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (!isPublicPath && !accessToken && refreshToken) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if( path === '/' && !refreshToken && !accessToken) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (isPublicPath && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

}

export const config = {
    matcher: [
        "/",
        "/login",
        "/dashboard",
        "/dashboard/:path*"

    ]

}
