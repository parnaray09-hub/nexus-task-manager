'use client'

import { useActionState } from 'react'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowRight, Hexagon } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-6 font-sans">
      <div className="w-full max-w-[400px] space-y-8">

        {/* Sleek Logo & Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-12 h-12 bg-[#0A0A0A] border border-white/5 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-zinc-400">Authenticate to access your workspace.</p>
          </div>
        </div>

        {/* Bento-style Auth Card */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <form action={formAction} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-zinc-400 font-medium ml-1">Email address</Label>
                <Input
                  id="email" name="email" type="email" required placeholder="name@company.com"
                  className="bg-white/[0.02] border-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/10 h-11 rounded-lg transition-all"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs text-zinc-400 font-medium">Password</Label>
                </div>
                <Input
                  id="password" name="password" type="password" required placeholder="••••••••"
                  className="bg-white/[0.02] border-white/5 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/10 h-11 rounded-lg transition-all"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-400 text-[13px] font-medium p-3 rounded-lg border border-red-500/10 bg-red-500/5 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-red-500" />
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 h-11 rounded-lg font-medium shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all" disabled={isPending}>
              {isPending ? 'Authenticating...' : 'Sign in'}
              {!isPending && <ArrowRight className="w-4 h-4 ml-2 opacity-50" />}
            </Button>
          </form>
        </div>

        <p className="text-center text-[13px] text-zinc-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-white hover:text-zinc-300 font-medium underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all">Request access</Link>
        </p>
      </div>
    </div>
  )
}