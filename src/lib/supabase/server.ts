import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in Server Components and Route Handlers.
 * Uses the publishable key (respects RLS). For admin operations that need to
 * bypass RLS, use createAdminClient() — never expose SUPABASE_SECRET_KEY client-side.
 */
export async function createClient() {
  let cookieStore: any = null;
  try {
    cookieStore = await cookies();
  } catch {
    // Called outside request scope (e.g. testing or CLI)
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll() ?? [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore?.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — cookies are read-only,
            // safe to ignore if session refresh middleware is not set up.
          }
        },
      },
    }
  );
}

/**
 * Admin client using the secret key — bypasses RLS.
 * ONLY for use in Server Actions / Route Handlers that require elevated privileges.
 * NEVER import this in any client component or expose to the browser.
 */
export async function createAdminClient() {
  let cookieStore: any = null;
  try {
    cookieStore = await cookies();
  } catch {
    // Called outside request scope
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll() ?? [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore?.set(name, value, options)
            );
          } catch {
            // intentionally blank — see above
          }
        },
      },
    }
  );
}
