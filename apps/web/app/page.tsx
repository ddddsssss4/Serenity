"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/auth-client';

export default function Landing() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/sanctuary');
    }
  }, [session, router]);

  if (isPending || session) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: `${window.location.origin}/sanctuary`,
      });
      if ((result as any)?.error) {
        setErrorMsg((result as any).error.message || 'Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setErrorMsg('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20 mb-2">
            <span className="material-symbols-outlined text-4xl md:text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl text-primary tracking-tight">Serenity</h1>
          <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-lg mx-auto leading-relaxed text-center">
            A safe space for your heart.
          </p>
        </div>

        <div className="bg-surface-container-low/80 backdrop-blur-3xl rounded-[3rem] p-12 shadow-sm border border-surface-variant/30 space-y-8">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-on-surface">Welcome Home</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Begin your journey to mindfulness and emotional clarity.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-4 px-6 bg-surface-container-highest/50 border border-outline-variant/40 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/60 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50 font-sans"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-4 px-6 bg-surface-container-highest/50 border border-outline-variant/40 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/60 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50 font-sans"
              />
            </div>

            {errorMsg && (
              <p className="text-error text-sm font-medium text-center px-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">login</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between px-1 text-center">
              <button type="button" className="text-xs font-medium text-primary/70 hover:text-primary hover:underline transition-all">
                Forgot Password?
              </button>
              <button type="button" className="text-xs font-medium text-primary/70 hover:text-primary hover:underline transition-all">
                Create Account
              </button>
            </div>
          </form>

          <div className="pt-6 border-t border-outline-variant/20 space-y-3">
            <button
              disabled
              className="w-full py-3.5 bg-surface-container-highest/20 text-on-surface-variant/40 rounded-full font-medium cursor-not-allowed flex items-center justify-center gap-2 border border-outline-variant/10 text-sm"
            >
              <span>Begin Journey</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button
              disabled
              className="w-full py-3.5 bg-transparent border border-outline-variant/20 text-on-surface-variant/40 rounded-full font-medium cursor-not-allowed text-sm"
            >
              Continue Anonymously
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
