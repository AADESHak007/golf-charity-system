import AuthBranding from '@/components/auth/AuthBranding';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050810] selection:bg-accent/30 selection:text-white">
      {/* Brand Panel (left on large, hidden on small) */}
      <AuthBranding />

      {/* Form Panel (full on small, half on large) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative min-h-screen">
        {/* Subtle noise/texture overlay consistent with landing page */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] z-0" />
        
        <div className="relative z-10 w-full py-12">
            {children}
        </div>
      </div>
    </div>
  );
}
