'use server'

import { db } from '@/db'
import { projects, tasks } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function createProject(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name) return { error: 'Project name is required' }

    await db.insert(projects).values({
        name,
        description,
    })

    revalidatePath('/dashboard')
}

export async function createTask(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const projectId = formData.get('projectId') as string
    const assigneeId = formData.get('assigneeId') as string
    const dueDateStr = formData.get('dueDate') as string

    if (!title || !projectId || !dueDateStr) return { error: 'Missing required fields' }

    await db.insert(tasks).values({
        title,
        description,
        projectId,
        // If the select menu was left on "Unassigned" (empty string), we explicitly store null
        assigneeId: assigneeId ? assigneeId : null,
        dueDate: dueDateStr,
    })

    revalidatePath('/dashboard')
}

export async function updateTaskStatus(formData: FormData) {
    const taskId = formData.get('taskId') as string
    const status = formData.get('status') as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

    if (!taskId || !status) return { error: 'Missing required fields' }

    await db.update(tasks)
        .set({ status })
        .where(eq(tasks.id, taskId))

    revalidatePath('/dashboard')
}