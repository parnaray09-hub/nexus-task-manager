'use client'

import { createProject, createTask } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Rocket, FolderPlus } from 'lucide-react'

export function AdminControls({ projects, profiles }: { projects: any[], profiles: any[] }) {

    const handleCreateTask = async (formData: FormData) => {
        const promise = new Promise(async (resolve, reject) => {
            const res = await createTask(formData)
            if (res?.error) reject(res.error)
            else resolve('Task deployed')
        })

        toast.promise(promise, {
            loading: 'Deploying task to network...',
            success: 'Task successfully deployed',
            error: (err) => `Deployment failed: ${err}`
        })
    }

    const handleCreateProject = async (formData: FormData) => {
        const promise = new Promise(async (resolve, reject) => {
            const res = await createProject(formData)
            if (res?.error) reject(res.error)
            else resolve('Project initialized')
        })

        toast.promise(promise, {
            loading: 'Initializing project core...',
            success: 'Project established',
            error: (err) => `Initialization failed: ${err}`
        })
    }

    return (
        <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-zinc-300" />
                    </div>
                    <h2 className="text-sm font-medium text-white">Deploy Task</h2>
                </div>

                <form action={handleCreateTask} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Designation</Label>
                        <Input name="title" required className="bg-white/[0.02] border-white/5 h-10 text-sm text-white focus-visible:ring-1 focus-visible:ring-white/20 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">System</Label>
                        <select name="projectId" required className="w-full h-10 rounded-lg border border-white/5 bg-[#0A0A0A] px-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none">
                            <option value="">Select Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Operator</Label>
                        <select name="assigneeId" className="w-full h-10 rounded-lg border border-white/5 bg-[#0A0A0A] px-3 text-sm text-white focus:ring-1 focus:ring-white/20 outline-none">
                            <option value="">Unassigned</option>
                            {profiles.map(prof => <option key={prof.id} value={prof.id}>{prof.email.split('@')[0]}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Deadline</Label>
                        <Input name="dueDate" type="date" required className="bg-white/[0.02] border-white/5 h-10 text-sm text-white focus-visible:ring-1 focus-visible:ring-white/20 rounded-lg [color-scheme:dark]" />
                    </div>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 h-10 text-sm font-medium mt-2 rounded-lg">Execute</Button>
                </form>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                        <FolderPlus className="w-4 h-4 text-zinc-300" />
                    </div>
                    <h2 className="text-sm font-medium text-white">Initialize Project</h2>
                </div>
                <form action={handleCreateProject} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Core Name</Label>
                        <Input name="name" required className="bg-white/[0.02] border-white/5 h-10 text-sm text-white focus-visible:ring-1 focus-visible:ring-white/20 rounded-lg" />
                    </div>
                    <Button type="submit" variant="outline" className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 h-10 text-sm font-medium rounded-lg transition-colors">Establish</Button>
                </form>
            </div>
        </div>
    )
}