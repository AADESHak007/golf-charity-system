import { ReactNode } from "react";
import { AdminNav, AdminSidebarFoot } from "@/components/admin/AdminNav";
import { ShieldCheck, User, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-[300px] bg-[#050810] text-slate-100 flex flex-col border-r border-white/5 shrink-0 fixed inset-y-0 z-50">
        {/* Sidebar Header */}
        <div className="p-10 pb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-serif italic text-white tracking-widest leading-none mb-1">Admin.</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] truncate italic opacity-80">General Ops Console</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 ml-4 italic opacity-50">Operational Menu</p>
          <AdminNav />
        </div>

        {/* Sidebar Footer */}
        <div className="p-8">
          <div className="bg-white/5 rounded-3xl p-5 flex items-center gap-4 border border-white/10 group hover:bg-white/10 transition-all duration-500 cursor-pointer mb-6">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-serif italic text-xl border border-indigo-500/30 group-hover:scale-110 transition-transform">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate tracking-tight text-white mb-0.5">Administrator</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest italic opacity-70">Overseer</p>
            </div>
          </div>
          <AdminSidebarFoot />
        </div>
      </aside>

      {/* Main Content Side */}
      <main className="flex-1 flex flex-col min-h-screen ml-[300px] relative z-10">
        {/* Dynamic Content Area */}
        <div className="flex-1 p-12 w-full max-w-[1700px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-1000">
           {children}
        </div>
      </main>
    </div>
  );
}
