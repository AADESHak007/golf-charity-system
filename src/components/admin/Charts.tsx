"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart, 
  Area 
} from "recharts";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

interface SubscriberChartProps {
  data: { date: string; subscribers: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[350px] w-full min-h-[350px] animate-in fade-in duration-1000">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f8fafc" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 800 }}
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 800 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#050810] text-white p-5 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 italic border-b border-white/5 pb-2">{payload[0].payload.month}. 2026</p>
                    <p className="text-xl font-serif italic text-indigo-400">${payload[0].value?.toLocaleString()}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="revenue" 
            radius={8} 
            fill="url(#barGradient)"
            barSize={40}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} className="hover:opacity-80 transition-all duration-500 cursor-pointer" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubscriberChart({ data }: SubscriberChartProps) {
  return (
    <div className="h-[350px] w-full min-h-[350px] animate-in fade-in duration-1000">
      <ResponsiveContainer width="99%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f8fafc" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 800 }}
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 800 }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 italic border-b border-slate-50 pb-2">{payload[0].payload.date}</p>
                    <p className="text-xl font-serif italic text-slate-900">{payload[0].value} Subscribers</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="subscribers" 
            stroke="#6366f1" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#areaGradient)" 
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
