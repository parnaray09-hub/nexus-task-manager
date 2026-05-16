import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NEXUS | Workspace',
  description: 'Enterprise Project Management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#030303] text-zinc-50 antialiased selection:bg-indigo-500/30`}>

        {/* Professional Ambient Glow */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none z-[-1]" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none z-[-1]" />

        {children}
        <Toaster theme="dark" position="bottom-right" toastOptions={{
          style: { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }
        }} />
      </body>
    </html>
  )
}