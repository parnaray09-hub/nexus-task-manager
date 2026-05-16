import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { profiles, projects, tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Import our new master layout
import { ConsoleLayout } from './console-layout'

export default async function DashboardPage() {
    // 1. Secure Authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. Fetch all required Data
    const userProfile = await db.query.profiles.findFirst({ where: eq(profiles.id, user.id) })
    const allProjects = await db.query.projects.findMany({ orderBy: (p, { desc }) => [desc(p.createdAt)] })
    const allProfiles = await db.query.profiles.findMany()
    const allTasks = await db.query.tasks.findMany({
        with: { project: true, assignee: true },
        orderBy: (t, { asc }) => [asc(t.dueDate)]
    })

    // 3. Pre-calculate metrics on the server for maximum speed
    const today = new Date().toISOString().split('T')[0]
    const metrics = {
        pending: allTasks.filter(t => t.status === 'PENDING').length,
        inProgress: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
        completed: allTasks.filter(t => t.status === 'COMPLETED').length,
        overdue: allTasks.filter(t => t.status !== 'COMPLETED' && t.dueDate < today).length
    }

    // 4. Mount the interactive console
    return (
        <ConsoleLayout
            userEmail={user.email || 'unknown'}
            userRole={userProfile?.role || 'MEMBER'}
            currentUserId={user.id}
            projects={allProjects}
            tasks={allTasks}
            profiles={allProfiles}
            metrics={metrics}
        />
    )
}