'use client'

import { useState } from 'react'
import { updateTaskStatus } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface TaskListProps {
    tasks: any[]
    userProfile: any
    currentUserId: string
}

export function TaskList({ tasks, userProfile, currentUserId }: TaskListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL')
    const today = new Date().toISOString().split('T')[0]

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.project.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = activeFilter === 'ALL' || task.status === activeFilter
        return matchesSearch && matchesFilter
    })

    const urgentTasks = filteredTasks.filter(t => t.dueDate < today && t.status !== 'COMPLETED')
    const regularTasks = filteredTasks.filter(t => !(t.dueDate < today && t.status !== 'COMPLETED'))

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-1 p-1 bg-[#0A0A0A] border border-white/5 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                    {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            className={`px-4 py-1.5 text-[11px] font-medium tracking-wide rounded-md transition-all ${activeFilter === filter ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {filter.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        placeholder="Search network..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 bg-[#0A0A0A] border-white/5 text-xs text-white focus-visible:ring-1 focus-visible:ring-white/20 w-full rounded-lg"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {urgentTasks.length > 0 && (
                    <div className="border border-red-500/20 rounded-2xl bg-[#0A0A0A] overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                        <div className="bg-red-500/10 px-6 py-3 flex items-center gap-2 border-b border-red-500/10">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Immediate Action Required</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {urgentTasks.map(task => <TaskRow key={task.id} task={task} userProfile={userProfile} currentUserId={currentUserId} isUrgent={true} />)}
                        </div>
                    </div>
                )}

                <div className="border border-white/5 rounded-2xl bg-[#0A0A0A] divide-y divide-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                    {regularTasks.length === 0 && urgentTasks.length === 0 ? (
                        <div className="p-16 text-center text-sm text-zinc-500">No signals match criteria.</div>
                    ) : (
                        regularTasks.map(task => <TaskRow key={task.id} task={task} userProfile={userProfile} currentUserId={currentUserId} isUrgent={false} />)
                    )}
                </div>
            </div>
        </div>
    )
}

function TaskRow({ task, userProfile, currentUserId, isUrgent }: { task: any, userProfile: any, currentUserId: string, isUrgent: boolean }) {
    const canEdit = userProfile?.role === 'ADMIN' || task.assigneeId === currentUserId

    const handleStatusUpdate = async (formData: FormData) => {
        const promise = updateTaskStatus(formData)
        toast.promise(promise, {
            loading: 'Updating status...',
            success: 'Status synchronized',
            error: 'Failed to update'
        })
    }

    return (
        <div className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-white/[0.02]`}>
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-zinc-600' : task.status === 'IN_PROGRESS' ? 'bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-transparent border border-zinc-500'}`} />
                    <h3 className={`text-sm font-medium ${task.status === 'COMPLETED' ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>
                        {task.title}
                    </h3>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono tracking-wide text-zinc-500 pl-5">
                    <span className="text-zinc-400">{task.project.name}</span>
                    <span>•</span>
                    <span>{task.assignee?.email.split('@')[0] || 'Unassigned'}</span>
                    <span>•</span>
                    <span className={isUrgent ? 'text-red-400' : ''}>{task.dueDate}</span>
                </div>
            </div>

            {canEdit ? (
                <form action={handleStatusUpdate} className="flex items-center gap-2 pl-5 sm:pl-0">
                    <input type="hidden" name="taskId" value={task.id} />
                    <select
                        name="status" defaultValue={task.status}
                        className="h-8 w-32 rounded-lg border border-white/5 bg-[#050505] px-2 text-xs text-zinc-300 focus:ring-1 focus:ring-white/20 outline-none cursor-pointer"
                    >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <Button type="submit" size="sm" variant="outline" className="h-8 text-xs bg-white text-black hover:bg-zinc-200 border-none px-4 rounded-lg">Save</Button>
                </form>
            ) : (
                <div className="pl-5 sm:pl-0">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 border border-white/5 px-3 py-1.5 rounded-lg bg-white/5">{task.status.replace('_', ' ')}</span>
                </div>
            )}
        </div>
    )
}