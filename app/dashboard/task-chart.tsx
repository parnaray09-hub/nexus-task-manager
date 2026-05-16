'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Activity } from 'lucide-react'

export function TaskChart({ pending, inProgress, completed }: { pending: number, inProgress: number, completed: number }) {
  const data = [
    { name: 'Pending', value: pending, color: '#3f3f46', percentage: 0 },
    { name: 'In Progress', value: inProgress, color: '#818cf8', percentage: 0 },
    { name: 'Completed', value: completed, color: '#f8fafc', percentage: 0 },
  ]

  const totalTasks = pending + inProgress + completed
  if (totalTasks > 0) {
    data.forEach(d => d.percentage = Math.round((d.value / totalTasks) * 100))
  }
  
  const displayData = totalTasks === 0 ? [{ name: 'No Data', value: 1, color: '#18181b', percentage: 0 }] : data
  const completedPercentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white">System Analytics</h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">{totalTasks} TOTAL</span>
      </div>
      
      <div className="flex-1 w-full flex items-center justify-between gap-4">
        {/* Static Doughnut */}
        <div className="relative w-[140px] h-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={displayData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value" stroke="none"
              >
                {displayData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {totalTasks > 0 && (
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-xl font-semibold text-white">{completedPercentage}%</span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1">Done</span>
            </div>
          )}
        </div>

        {/* Statistical Breakdown */}
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div 
              key={item.name} 
              className="flex items-center justify-between p-2 rounded-lg transition-colors cursor-default border border-transparent hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
                <span className="text-[11px] font-medium text-zinc-400">{item.name}</span>
              </div>
              <span className="text-xs font-mono text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
