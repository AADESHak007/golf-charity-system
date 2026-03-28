'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  User, 
  Mail, 
  Lock, 
  Loader2, 
  ShieldCheck,
  Info
} from 'lucide-react';
import Image from 'next/image';

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [charities, setCharities] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [formData, setFormData] = useState({
    charityId: '',
    contribution: 20,
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const initOnboarding = async () => {
      setLoadingInitial(true);
      try {
        const charitiesRes = await fetch('/api/charities');
        const charitiesData = await charitiesRes.json();

        if (charitiesData.success) {
          setCharities(charitiesData.data.slice(0, 6)); // More variety for the dedicated charity step
        }
      } catch (err) {
        console.error('Failed to initialize onboarding data');
      } finally {
        setLoadingInitial(false);
      }
    };

    initOnboarding();
  }, []);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'PLAYER',
          charityId: formData.charityId,
          contributionPercentage: formData.contribution
        }),
      });
      
      const signupData = await signupRes.json();
      if (!signupData.success) {
        setError(signupData.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      router.push('/dashboard?welcome=true');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 z-0" />
        {[1, 2, 3].map((num) => (
          <div 
            key={num}
            className={cn(
              "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
              step >= num ? "bg-accent text-black" : "bg-[#0a0f1e] text-white/20 border border-white/5"
            )}
          >
            {step > num ? <Check className="w-4 h-4" /> : num}
            {step === num && (
               <motion.div 
                 layoutId="active-step"
                 className="absolute inset-[-4px] border border-accent/30 rounded-full"
               />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10"
        >
          {loadingInitial ? (
             <div className="flex flex-col items-center justify-center py-24 space-y-4">
               <Loader2 className="w-8 h-8 animate-spin text-accent" />
               <p className="text-white/20 text-xs tracking-widest uppercase font-medium">Initializing Journey...</p>
             </div>
          ) : step === 1 ? (
            <div className="space-y-10">
              <div className="text-center space-y-4">
                <span className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Step 01</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white italic tracking-tighter">Choose a mission.</h2>
                <p className="text-white/40 font-light max-w-sm mx-auto">Select a cause that aligns with your values. You can change this later in your dashboard.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {charities.map((charity) => (
                  <button
                    key={charity.id}
                    onClick={() => setFormData({ ...formData, charityId: charity.id })}
                    className={cn(
                      "p-5 rounded-2xl border text-left transition-all duration-500 flex items-center gap-5 group relative overflow-hidden",
                      formData.charityId === charity.id 
                        ? "bg-white border-white text-black shadow-2xl" 
                        : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
                    )}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-lg">
                       <Image 
                         src={charity.image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200'} 
                         alt={charity.name}
                         fill
                         sizes="64px"
                         className="object-cover"
                       />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold tracking-tight leading-tight">{charity.name}</h3>
                      <p className={cn(
                        "text-[10px] uppercase tracking-widest font-bold",
                        formData.charityId === charity.id ? "text-black/40" : "text-white/40"
                      )}>
                        {charity.category}
                      </p>
                    </div>
                    {formData.charityId === charity.id && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-black flex items-center justify-center">
                         <Check className="w-3.5 h-3.5 text-accent" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link href="/signin" className="p-4 px-8 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                  Cancel
                </Link>
                <button 
                  onClick={nextStep}
                  disabled={!formData.charityId}
                  className="flex-1 btn-premium disabled:opacity-50"
                >
                  Continue to Contribution
                </button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <span className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Step 02</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white italic tracking-tighter">Impact Level.</h2>
                <p className="text-white/40 font-light max-w-sm mx-auto">What percentage of your membership fee should go directly to the cause?</p>
              </div>

              <div className="space-y-12 py-12 px-6 bg-white/[0.02] border border-white/5 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Heart className="w-32 h-32 text-accent" />
                </div>
                
                <div className="flex justify-between items-end relative z-10">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Your Dedication</span>
                  <div className="text-right">
                     <span className="text-7xl font-serif italic text-accent leading-none">{formData.contribution}%</span>
                  </div>
                </div>
                
                <div className="relative z-10 px-2">
                   <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    step="5"
                    value={formData.contribution}
                    onChange={(e) => setFormData({ ...formData, contribution: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent transition-all"
                  />
                  <div className="flex justify-between mt-4 text-[10px] uppercase tracking-widest font-bold text-white/20">
                     <span>Min (10%)</span>
                     <span>Max (50%)</span>
                  </div>
                </div>

                <div className="p-6 bg-accent/5 border border-accent/10 rounded-2xl flex items-start gap-4">
                   <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                   <p className="text-xs text-white/60 leading-relaxed italic">
                      "Once you choose a subscription plan in the dashboard, this percentage will be automatically distributed to your chosen charity from every payment."
                   </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={prevStep} className="p-4 rounded-full border border-white/10 text-white/40 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextStep} className="flex-1 btn-premium">
                  Continue to Finalize
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="text-center space-y-4">
                <span className="text-accent text-xs font-bold uppercase tracking-[0.2em]">Step 03</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white italic tracking-tighter">Join the movement.</h2>
                <p className="text-white/40 font-light max-w-sm mx-auto">Create your account to save your impact settings and explore the dashboard.</p>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 font-light transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 font-light transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 font-light transition-all"
                  />
                </div>

                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                         <ShieldCheck className="w-5 h-5 text-accent" />
                      </div>
                      <div className="space-y-0.5">
                         <h4 className="text-sm font-bold text-white uppercase tracking-tight">One Last Step</h4>
                         <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">After signup, you can active your membership in the dashboard.</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Your Impact</span>
                         <p className="text-accent text-sm font-medium">{formData.contribution}% Contribution</p>
                      </div>
                      <div className="space-y-1">
                         <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Chosen Cause</span>
                         <p className="text-white text-sm font-medium truncate">
                            {charities.find(c => c.id === formData.charityId)?.name || 'Selected Charity'}
                         </p>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                  <button type="button" onClick={prevStep} className="p-5 rounded-full border border-white/10 text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 btn-premium group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete My Signup"}
                    </span>
                  </button>
                </div>
              </form>

              {error && <p className="text-center text-rose-500 text-sm font-medium animate-shake">{error}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 text-center border-t border-white/5 pt-8">
         <p className="text-white/20 text-[10px] uppercase tracking-widest font-medium">
           Already a member? <Link href="/signin" className="text-white hover:text-accent transition-colors ml-1">Sign In</Link>
         </p>
      </div>

    </div>
  );
}
