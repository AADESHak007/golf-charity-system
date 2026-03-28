import { useState } from "react";
import { Check, X, Plus, Loader2 } from "lucide-react";

export function AdminScoreAdder({ userId, onUpdate }: { userId: string, onUpdate: () => void }) {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState("");
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = async () => {
    if (!score || !playedAt) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: parseInt(score), played_at: new Date(playedAt).toISOString() })
      });
      if (res.ok) {
        setAdding(false);
        setScore("");
        onUpdate();
      } else {
        const err = await res.json();
        alert(`Error adding score: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!adding) {
    return (
      <button 
        onClick={() => setAdding(true)}
        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1 transition-colors"
      >
        <Plus size={14} /> Add Score Manually
      </button>
    );
  }

  return (
    <div className="p-4 bg-indigo-50/50 rounded-2xl border-2 border-indigo-200 border-dashed flex items-center justify-between col-span-1 md:col-span-2 shadow-inner">
      <div className="flex items-center gap-4 flex-1">
        <input 
          type="number"
          min="1"
          max="150"
          placeholder="Score"
          value={score}
          onChange={e => setScore(e.target.value)}
          className="w-20 h-10 rounded-xl bg-white text-center text-lg font-black text-slate-900 border border-indigo-100 outline-none focus:border-indigo-500 shadow-sm"
        />
        <div className="flex-1 max-w-[150px]">
          <input 
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={playedAt}
            onChange={e => setPlayedAt(e.target.value)}
            className="w-full text-sm font-bold text-slate-700 bg-white border border-indigo-100 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>
      <div className="flex gap-1 ml-4">
        {saving ? (
           <div className="p-2 text-indigo-500"><Loader2 className="animate-spin" size={18}/></div>
        ) : (
           <>
             <button onClick={handleSave} className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-sm"><Check size={16} /></button>
             <button onClick={() => setAdding(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-all"><X size={16} /></button>
           </>
        )}
      </div>
    </div>
  );
}
