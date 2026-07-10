import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const mockHandler: ProxyHandler<any> = {
  get(target, prop) {
    if (prop === 'then') {
      return (resolve: any) => resolve({ data: null, error: new Error("Supabase credentials missing") })
    }
    if (typeof prop === 'string') {
      return (...args: any[]) => new Proxy({}, mockHandler)
    }
    return target[prop]
  }
}

const mockSupabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: new Error("Supabase credentials missing") }),
    signInWithPassword: async () => ({ data: {}, error: new Error("Supabase credentials missing") }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => new Proxy({}, mockHandler)
}

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn("Supabase environment variables are missing. Using mock server client.")
    return mockSupabase as any
  }

  const cookieStore = await cookies()

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
