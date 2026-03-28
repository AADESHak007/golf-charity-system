"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Trophy, 
  Heart, 
  LayoutDashboard, 
  BarChart3, 
  Calendar, 
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Winner Verification", href: "/admin/winners", icon: Trophy },
  { name: "Charity Management", href: "/admin/charities", icon: Heart },
  { name: "Draw Simulation", href: "/admin/draws", icon: Calendar },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-3">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden",
              isActive 
                ? "bg-white/5 text-white shadow-xl border border-white/5" 
                : "text-slate-500 hover:text-slate-100 hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                isActive 
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rotate-3" 
                  : "bg-white/5 text-slate-500 group-hover:text-white group-hover:rotate-6 group-hover:bg-white/10"
              )}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] italic transition-all duration-500",
                isActive ? "text-white" : "text-slate-500"
              )}>
                {item.name}
              </span>
            </div>
            
            {isActive && (
              <div className="relative z-10 p-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <ChevronRight size={10} className="text-indigo-400" />
              </div>
            )}
            
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-3xl shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebarFoot() {
  return (
    <div className="pt-6 border-t border-white/5 group">
      <button className="flex items-center gap-4 w-full px-6 py-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-[2rem] transition-all duration-500 border border-transparent hover:border-white/5 group">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
           <LogOut size={18} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Sign Out</span>
      </button>
    </div>
  );
}
