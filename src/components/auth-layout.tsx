import type { ReactNode } from 'react';
import { KeyRound } from 'lucide-react';

const Logo = () => (
  <div className="flex flex-col items-center justify-center gap-4 mb-8">
    <div className="bg-primary/20 p-4 rounded-full">
      <KeyRound className="w-8 h-8 text-primary" />
    </div>
    <h1 className="text-3xl font-bold text-primary tracking-tight">AuthFlow</h1>
  </div>
);

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Logo />
        {children}
      </div>
    </main>
  );
}
