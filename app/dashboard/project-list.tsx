'use client'

import { FolderGit2 } from 'lucide-react'

export function ProjectList({ projects, tasks }: { projects: any[], tasks: any[] }) {
    if (projects.length === 0) return null

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Active Systems</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(project => {
                    const projectTasks = tasks.filter(t => t.projectId === project.id)
                    const totalTasks = projectTasks.length
                    const progressPercentage = totalTasks === 0 ? 0 : Math.round((projectTasks.filter(t => t.status === 'COMPLETED').length / totalTasks) * 100)

                    return (
                        <div key={project.id} className="p-6 border border-white/5 rounded-2xl bg-[#0A0A0A] hover:bg-white/[0.02] transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                                        <FolderGit2 className="w-5 h-5 text-zinc-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">{project.name}</h3>
                                        <p className="text-[11px] font-mono text-zinc-500">{totalTasks} records</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-white">{progressPercentage}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}