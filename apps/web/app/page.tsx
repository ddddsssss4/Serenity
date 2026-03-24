"use client";
import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '../lib/auth-client';

export default function Landing() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: 'http://localhost:3000/sanctuary',
      });
    } catch (err) {
      console.error('Google sign-in failed:', err);
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
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-on-surface">Welcome Home</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Begin your journey to mindfulness and emotional clarity.
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/sanctuary" 
              className="w-full py-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Begin Journey</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-4 bg-surface-container-highest text-on-surface rounded-full font-medium hover:bg-surface-variant transition-colors flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
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
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
            
            <button className="w-full py-4 bg-transparent border border-outline text-on-surface rounded-full font-medium hover:bg-surface-variant/50 transition-colors">
              Continue Anonymously
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
