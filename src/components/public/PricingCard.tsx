'use client';

import { motion } from 'framer-motion';
import { Check, Rocket, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  type: 'monthly' | 'yearly';
  price: string;
  isPopular?: boolean;
  savings?: string;
}

const commonFeatures = [
  "Monthly prize draw entry",
  "Stableford score tracking",
  "Charity contribution control",
  "3, 4 and 5 number match prizes",
  "Verified charity directory access",
];

const yearlyAdditional = [
  "2 months free ($29.89 savings)",
  "Priority winner verification",
  "Exclusive yearly member badge",
];

export default function PricingCard({ type, price, isPopular, savings }: PricingCardProps) {
  const features = type === 'yearly' ? [...commonFeatures, ...yearlyAdditional] : commonFeatures;

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
            "relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col h-full",
            isPopular 
                ? "bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/20 text-white z-10 scale-105" 
                : "bg-white border-gray-100 hover:border-gray-200 text-gray-900"
        )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl border border-emerald-400">
          <Sparkles className="w-4 h-4" />
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="space-y-4 mb-10">
        <h3 className={cn("text-sm font-black uppercase tracking-[0.2em]", isPopular ? "text-indigo-200" : "text-gray-400")}>
            {type} Subscription
        </h3>
        <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black tracking-tighter leading-none">{price}</span>
            <span className={cn("text-xs font-bold uppercase tracking-widest", isPopular ? "text-indigo-200" : "text-gray-400")}>
                / {type === 'monthly' ? 'mo' : 'yr'}
            </span>
        </div>
        {savings && (
          <p className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
            <Zap className="w-3 h-3 fill-emerald-500" />
            {savings}
          </p>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-6 flex-1">
        <p className={cn("text-xs font-black uppercase tracking-widest", isPopular ? "text-indigo-200" : "text-gray-400")}>Everything including:</p>
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-4">
              <div className={cn("p-1 rounded-lg shrink-0 mt-0.5", isPopular ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-600")}>
                <Check className="w-3 h-3" />
              </div>
              <span className={cn("text-sm font-medium leading-relaxed", isPopular ? "text-indigo-50" : "text-gray-600")}>
                  {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12">
        <Link
          href={`/signup?plan=${type}`}
          className={cn(
            "w-full py-5 rounded-2xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest transition-all active:scale-95 group",
            isPopular 
                ? "bg-white text-indigo-600 hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)]" 
                : "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700"
          )}
        >
          {isPopular ? "Claim Free Months" : "Get Started"}
          <Rocket className={cn("w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1", isPopular ? "text-indigo-400" : "text-indigo-200")} />
        </Link>
        <p className={cn("text-center mt-4 text-[10px] font-bold uppercase tracking-widest", isPopular ? "text-indigo-300" : "text-gray-400")}>
            Stripe Secured Pay · Cancel Anytime
        </p>
      </div>
    </motion.div>
  );
}
