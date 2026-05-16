'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { profiles } from '@/db/schema'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Native Validation (100% TypeScript safe)
  if (!email || !email.includes('@')) return { error: 'Invalid email address' }
  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Native Validation (100% TypeScript safe)
  if (!email || !email.includes('@')) return { error: 'Invalid email address' }
  if (!password || password.length < 6) return { error: 'Password must be at least 6 characters' }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) return { error: error.message }

  if (data.user) {
    try {
      await db.insert(profiles).values({
        id: data.user.id,
        email: data.user.email!,
        role: 'MEMBER'
      })
    } catch (e) {
      console.error(e)
    }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
