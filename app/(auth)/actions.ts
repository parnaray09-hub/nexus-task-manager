'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { profiles } from '@/db/schema'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const result = authSchema.safeParse({ email, password })

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const result = authSchema.safeParse({ email, password })

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
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
