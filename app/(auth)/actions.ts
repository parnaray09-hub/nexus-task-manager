'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export async function login(prevState: any, formData: FormData) {
  const result = authSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { error: result.error.errors[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: result.data.email, password: result.data.password })

  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const result = authSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { error: result.error.errors[0].message }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email: result.data.email, password: result.data.password })

  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}