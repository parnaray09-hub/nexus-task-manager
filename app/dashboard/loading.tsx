import { Command } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#030303] text-zinc-50 font-sans pb-24">
            <nav className="border-b border-white/5 bg-[#030303] sticky top-0 z-50">
                <div className="max-w-[95%] lg:max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/5">
                            <Command className="w-4 h-4 text-zinc-700 animate-pulse" />
                        </div>
                        <div className="w-24 h-4 bg-zinc-900 rounded animate-pulse" />
                    </div>
                </div>
            </nav>

            <div className="max-w-[95%] lg:max-w-6xl mx-auto px-4 mt-16 space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-28 animate-pulse" />
                    ))}
                </div>
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-2xl h-[400px] animate-pulse" />
                    <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-2xl h-[400px] animate-pulse" />
                </div>
            </div>
        </div>
    )
}