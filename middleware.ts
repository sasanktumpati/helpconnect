import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const publicPaths = [
  "/",
  "/about",
  "/campaigns",
  "/help-requests",
  "/community-drives",
  "/directory",
  "/auth/login",
  "/auth/register",
  "/donation-items",
]

const specialAuthPaths = [
  "/campaigns/new",
  "/help-requests/new",
  "/community-drives/new",
  "/donation-items/new",
  "/create-campaign",
]

const isPublicPath = (path: string) => {
  return publicPaths.some((publicPath) => {
    if (publicPath === "/") {
      return path === "/"
    }
    return path.startsWith(publicPath)
  })
}

const isSpecialAuthPath = (path: string) => {
  return specialAuthPaths.some((authPath) => path === authPath)
}

const isDetailPath = (path: string) => {
  const detailPathPatterns = [
    /^\/campaigns\/[^/]+$/,
    /^\/help-requests\/[^/]+$/,
    /^\/community-drives\/[^/]+$/,
    /^\/directory\/[^/]+$/,
    /^\/donation-items\/[^/]+$/,
  ]

  if (isSpecialAuthPath(path)) {
    return false
  }

  return detailPathPatterns.some((pattern) => pattern.test(path))
}

const isStaticAsset = (path: string) => {
  return path.startsWith("/_next") || path.startsWith("/favicon.ico") || path.endsWith(".svg") || path.endsWith(".png")
}

export async function middleware(request: NextRequest) {
  if (isStaticAsset(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  if (isPublicPath(request.nextUrl.pathname) || isDetailPath(request.nextUrl.pathname)) {
    return response
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log(
    `Middleware: Path=${request.nextUrl.pathname}, HasSession=${!!session}, IsSpecialAuthPath=${isSpecialAuthPath(request.nextUrl.pathname)}`,
  )

  if (isSpecialAuthPath(request.nextUrl.pathname)) {
    if (!session) {
      console.log(`Middleware: Redirecting to login from ${request.nextUrl.pathname} due to missing session`)
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    console.log(`Middleware: Allowing access to ${request.nextUrl.pathname} with valid session`)
    return response
  }

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log(`Middleware: Redirecting to login from ${request.nextUrl.pathname} due to missing session`)
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const skipProfileCheck = ["/dashboard/profile/complete", "/dashboard/profile", "/api/", "/_next/"]

    if (!skipProfileCheck.some((path) => request.nextUrl.pathname.startsWith(path))) {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("profile_completed, role")
          .eq("id", session.user.id)
          .maybeSingle()

        if (userError) {
          console.error("Error checking user profile:", userError)
          return NextResponse.redirect(new URL("/auth/login", request.url))
        }

        if (!userData || !userData.profile_completed) {
          if (request.nextUrl.pathname.startsWith("/dashboard/profile/complete")) {
            return response
          }
          return NextResponse.redirect(new URL("/dashboard/profile/complete", request.url))
        }
      } catch (error) {
        console.error("Error in middleware:", error)
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
