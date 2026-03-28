import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Edit2, Loader2 } from "lucide-react";

export function AdminScoreEditor({ scoreData, onUpdate }: { scoreData: any, onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(scoreData.score);
  const [playedAt, setPlayedAt] = useState(scoreData.played_at.split('T')[0]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/scores/${scoreData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: parseInt(score), played_at: new Date(playedAt).toISOString() })
      });
      if (res.ok) {
        setEditing(false);
        onUpdate();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-slate-900 border border-slate-100">
            {scoreData.score}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Played On</p>
            <p className="text-sm font-bold text-slate-700">{format(new Date(scoreData.played_at), 'PPP')}</p>
          </div>
        </div>
        <button 
          onClick={() => setEditing(true)}
          className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <Edit2 size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-3xl border-2 border-indigo-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <input 
          type="number"
          min="1"
          max="150"
          value={score}
          onChange={e => setScore(e.target.value)}
          className="w-16 h-12 rounded-2xl bg-slate-50 text-center text-xl font-black text-slate-900 border border-slate-200 outline-none focus:border-indigo-500"
        />
        <div className="flex-1 max-w-[160px]">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Played On</p>
          <input 
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={playedAt}
            onChange={e => setPlayedAt(e.target.value)}
            className="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="flex gap-2">
        {saving ? (
           <div className="p-2 text-indigo-500"><Loader2 className="animate-spin" size={18}/></div>
        ) : (
           <>
             <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"><Check size={18} /></button>
             <button onClick={() => setEditing(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><X size={18} /></button>
           </>
        )}
      </div>
    </div>
  );
}
