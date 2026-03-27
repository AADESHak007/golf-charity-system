import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 page-enter">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
            🏌️ Golf meets Charity
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Compete on the Course.<br />
            <span className="gradient-text">Change the World.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Subscribe to GolfCharity and enter weekly prize draws. Every subscription
            automatically donates to charity — you choose how much.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5 transition-all">
              View Plans →
            </Link>
            <Link href="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all">
              Sign In
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '£40%', label: 'Prize Pool Split' },
              { value: '10%+', label: 'Goes to Charity' },
              { value: '2', label: 'Subscription Plans' },
              { value: '∞', label: 'Good Causes' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-28">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: 'Compete in Weekly Draws', desc: '5-match, 4-match, and 3-match prize splits. Your subscription score card counts every week.' },
              { icon: '❤️', title: 'Choose Your Charity %', desc: 'Set your charity contribution percentage — minimum 10%. You decide how much good you do.' },
              { icon: '📊', title: 'Track Everything', desc: 'Your dashboard shows subscription status, billing period, and contribution history in real time.' },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-7 hover:border-green-500/20 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prize Pool Breakdown */}
        <section className="max-w-4xl mx-auto px-6 pb-28">
          <div className="glass rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">Prize Pool Breakdown</h2>
            <p className="text-gray-400 mb-8 text-sm">Per billing cycle, the prize pool is split as follows:</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { match: '5-Match', pct: '40%', color: 'from-green-400 to-green-600' },
                { match: '4-Match', pct: '35%', color: 'from-blue-400 to-blue-600' },
                { match: '3-Match', pct: '25%', color: 'from-purple-400 to-purple-600' },
              ].map((p) => (
                <div key={p.match} className="bg-white/4 rounded-2xl p-6">
                  <div className={`text-4xl font-extrabold bg-gradient-to-br ${p.color} bg-clip-text text-transparent`}>{p.pct}</div>
                  <div className="text-sm text-gray-400 mt-1">{p.match}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
          © 2026 GolfCharity. All rights reserved.
        </footer>
      </main>
    </>
  );
}
