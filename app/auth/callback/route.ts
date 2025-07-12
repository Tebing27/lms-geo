// app/auth/callback/route.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    
    // Buat Supabase client menggunakan cara terbaru
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    // Tukarkan kode otorisasi dengan sesi pengguna
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && session) {
      // Logika kita sebelumnya: jika pengguna baru (pertama kali login)
      // Arahkan ke halaman untuk membuat password.
      const isNewUser = session.user.last_sign_in_at === null;
      if (isNewUser) {
        return NextResponse.redirect(`${origin}/update-password`)
      }
      
      // Jika pengguna lama, arahkan ke halaman utama
      return NextResponse.redirect(origin)
    }
  }

  // Jika ada error atau tidak ada kode, arahkan ke halaman error (opsional)
  // Untuk sekarang, kita arahkan saja ke halaman login
  return NextResponse.redirect(`${origin}/login`)
}