import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (Next.js 16 rename of middleware) — runs before every matched route.
 * Guards /admin/* so that unauthenticated requests are redirected to
 * /admin/login at the network boundary, before any server component or data
 * fetch runs.  The server component also calls getUser() as defence-in-depth.
 *
 * @supabase/ssr requires us to forward cookie mutations back to the browser on
 * every response (session refresh), which is why we create the client here and
 * call getUser() rather than just checking a cookie value manually.
 */
export async function proxy(request: NextRequest) {
  // We need a mutable response so @supabase/ssr can write refreshed session
  // cookies back to the browser.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // First write to the cloned request so downstream can see the cookies
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Re-create the response with the updated request so Next.js
          // propagates the new cookies to the client.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: call getUser() — never getSession() — to validate the JWT with
  // Supabase's server each time.  getSession() reads only the local cookie and
  // can be spoofed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Already on the login page → always allow (avoids redirect loops)
  if (pathname.startsWith("/admin/login")) {
    return supabaseResponse;
  }

  // Any other /admin/* path → require authentication
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on /admin and all sub-paths; exclude static assets & _next internals
    "/admin/:path*",
  ],
};
