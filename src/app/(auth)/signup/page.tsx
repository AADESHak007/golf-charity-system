import OnboardingFlow from '@/components/auth/OnboardingFlow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Movement — GolfCharity',
  description: 'Start your journey of impact and prize draws today.',
};

export default function SignUpPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen flex items-center justify-center">
      <OnboardingFlow />
    </div>
  );
}
