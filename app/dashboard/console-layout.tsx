'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command, LogOut, LayoutGrid, ListTodo, Settings2, Menu, X } from 'lucide-react'
import { logout } from '../(auth)/actions'

import { TaskChart } from './task-chart'
import { ProjectList } from './project-list'
import { TaskList } from './task-list'
import { AdminControls } from './admin-controls'

interface ConsoleLayoutProps {
    userEmail: string; userRole: string; currentUserId: string; projects: any[]; tasks: any[]; profiles: any[]; metrics: any;
}

export function ConsoleLayout({ userEmail, userRole, currentUserId, projects, tasks, profiles, metrics }: ConsoleLayoutProps) {
    const [activeView, setActiveView] = useState<'OVERVIEW' | 'WORKSTREAM' | 'SETTINGS'>('OVERVIEW')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const NavButtons = () => (
        <>
            <button onClick={() => { setActiveView('OVERVIEW'); setMobileMenuOpen(false) }} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all w-full sm:w-auto ${activeView === 'OVERVIEW' ? 'bg-indigo-600/10 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}><LayoutGrid className="w-4 h-4" /> Overview</button>
            <button onClick={() => { setActiveView('WORKSTREAM'); setMobileMenuOpen(false) }} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all w-full sm:w-auto ${activeView === 'WORKSTREAM' ? 'bg-indigo-600/10 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}><ListTodo className="w-4 h-4" /> Workstream</button>
            {userRole === 'ADMIN' && (
                <button onClick={() => { setActiveView('SETTINGS'); setMobileMenuOpen(false) }} className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all w-full sm:w-auto ${activeView === 'SETTINGS' ? 'bg-indigo-600/10 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}><Settings2 className="w-4 h-4" /> Settings</button>
            )}
        </>
    )

    return (
        <div className="min-h-screen pb-12 font-sans flex flex-col overflow-x-hidden">

            {/* Top Navigation */}
            <nav className="border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-[95%] lg:max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-500">
                            <Command className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-white leading-none">NEXUS</span>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden sm:flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-1.5 rounded-full">
                            <span className="text-xs font-medium text-zinc-400">{userEmail}</span>
                            <div className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">{userRole}</span>
                        </div>
                        <form action={logout}><button type="submit" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><LogOut className="w-4 h-4" /></button></form>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="sm:hidden text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="sm:hidden bg-[#050505] border-b border-white/5 overflow-hidden">
                        <div className="p-4 flex flex-col gap-2">
                            <NavButtons />
                            <form action={logout} className="mt-4 border-t border-white/5 pt-4"><button type="submit" className="flex items-center gap-2 text-xs font-medium text-red-400 w-full px-4 py-2 hover:bg-white/5 rounded-md"><LogOut className="w-4 h-4" /> Sign Out</button></form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sub-Navigation */}
            <div className="hidden sm:block border-b border-white/5 bg-[#050505]/50 backdrop-blur-md">
                <div className="max-w-[95%] lg:max-w-6xl mx-auto px-4 flex items-center gap-2 py-2"><NavButtons /></div>
            </div>

            {/* Main Content Area with View Transitions */}
            <main className="max-w-[95%] lg:max-w-6xl mx-auto px-4 mt-8 flex-1 w-full">
                <AnimatePresence mode="wait">

                    {activeView === 'OVERVIEW' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
                            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Pending', count: metrics.pending, color: 'text-zinc-300', hoverColor: 'hover:border-zinc-400' },
                                    { label: 'In Progress', count: metrics.inProgress, color: 'text-indigo-400', hoverColor: 'hover:border-indigo-500' },
                                    { label: 'Completed', count: metrics.completed, color: 'text-white', hoverColor: 'hover:border-white' },
                                    { label: 'Overdue', count: metrics.overdue, color: 'text-red-400', alert: true, hoverColor: 'hover:border-red-500' }
                                ].map((stat, i) => (
                                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="h-full">
                                        <div className={`bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full relative overflow-hidden transition-all duration-300 shadow-sm bg-gradient-to-b from-[#0a0a0a] to-[#050505] ${stat.hoverColor}`}>
                                            {stat.alert && <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />}
                                            <div className={`text-xs font-medium mb-3 ${stat.alert ? 'text-red-500/80' : 'text-zinc-500'}`}>{stat.label}</div>
                                            <div className={`text-4xl font-semibold tracking-tight ${stat.color}`}>{stat.count}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </section>

                            <div className="grid gap-8 lg:grid-cols-12">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:col-span-8">
                                    <ProjectList projects={projects} tasks={tasks} />
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="lg:col-span-4 h-[350px] sm:h-auto">
                                    <TaskChart pending={metrics.pending} inProgress={metrics.inProgress} completed={metrics.completed} />
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'WORKSTREAM' && (
                        <motion.div key="workstream" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full">
                            <TaskList tasks={tasks} userProfile={{ role: userRole }} currentUserId={currentUserId} />
                        </motion.div>
                    )}

                    {activeView === 'SETTINGS' && userRole === 'ADMIN' && (
                        <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
                            <AdminControls projects={projects} profiles={profiles} />
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    )
}