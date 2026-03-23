import { useState } from 'react';

export function Settings() {
  const [aiMemory, setAiMemory] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl text-primary tracking-tight">Privacy Architecture</h1>
        <p className="text-lg text-on-surface-variant font-medium">
          A memory built for you, controlled by you.
        </p>
      </header>

      <section className="space-y-8">
        <div className="bg-surface-container-low rounded-[2rem] p-8 space-y-8 border border-surface-variant/30">
          {/* AI Memory Toggle */}
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">memory</span>
                <h3 className="font-serif text-xl text-on-surface">AI Memory</h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Allow Serenity to remember context from past journals and reflections to provide more personalized support.
              </p>
            </div>
            
            <button 
              onClick={() => setAiMemory(!aiMemory)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 ${
                aiMemory ? 'bg-primary' : 'bg-surface-variant'
              }`}
            >
              <span className="sr-only">Enable AI Memory</span>
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest transition-transform ${
                  aiMemory ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-surface-variant/50 w-full"></div>

          {/* Private Mode Toggle */}
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">visibility_off</span>
                <h3 className="font-serif text-xl text-on-surface">Private Mode</h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                When enabled, your entries are stored locally on your device and are never sent to the cloud. AI features will be disabled.
              </p>
            </div>
            
            <button 
              onClick={() => setPrivateMode(!privateMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:ring-offset-2 ${
                privateMode ? 'bg-secondary' : 'bg-surface-variant'
              }`}
            >
              <span className="sr-only">Enable Private Mode</span>
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-surface-container-lowest transition-transform ${
                  privateMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Transparency */}
        <div className="bg-secondary-container/50 rounded-[2rem] p-8 space-y-6">
          <h3 className="font-serif text-xl text-on-secondary-container">Data Transparency</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl space-y-3 shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl">cloud_done</span>
              <h4 className="font-medium text-on-surface">End-to-End Encrypted</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your data is encrypted before it leaves your device. Only you hold the keys.
              </p>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl space-y-3 shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-2xl">delete_forever</span>
              <h4 className="font-medium text-on-surface">Right to Forget</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You can permanently delete all your data and AI memory context at any time.
              </p>
              <button className="text-error text-xs font-medium hover:underline mt-2 block">
                Delete My Data
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
