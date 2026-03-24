"use client";

import Link from "next/link";

export default function BreathingPage() {
  return (
    <div className="relative min-h-screen bg-background text-on-surface font-sans antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0.1; }
        }
        .breathing-ring {
            animation: breathe 8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
      `}} />

      {/* Main Content Canvas */}
      <div className="max-w-6xl mx-auto space-y-24 py-12 lg:py-20">
        {/* Hero Header: Editorial Style */}
        <header className="relative">
          <div className="inline-block px-4 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-6">
            Immediate Support
          </div>
          <h2 className="text-6xl font-serif font-semibold text-on-surface leading-tight max-w-2xl">
            Find your ground, <br /><span className="italic text-primary">moment by moment.</span>
          </h2>
          <p className="text-lg text-secondary max-w-lg mt-8 leading-relaxed">
            You are in a safe space. Take a breath with the visualizer below, or reach out to someone who can help immediately.
          </p>
        </header>

        {/* Central Breathing Visualizer & Grounding Bento */}
        <div className="grid grid-cols-12 gap-8">
          {/* Breathing Visualizer: Large Circle */}
          <div className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-lg p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
            {/* Concentric Circles (Design System: Breathing Guides) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="breathing-ring w-96 h-96 rounded-full bg-primary-fixed/20"></div>
              <div className="breathing-ring w-64 h-64 rounded-full bg-primary-fixed/30" style={{ animationDelay: '1s' }}></div>
              <div className="breathing-ring w-32 h-32 rounded-full bg-primary-fixed/40" style={{ animationDelay: '2s' }}></div>
            </div>
            <div className="relative z-10 text-center space-y-8">
              <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-2xl transition-transform duration-[4000ms] hover:scale-110">
                <span className="text-white font-serif italic text-2xl">Breathe In</span>
              </div>
              <div className="space-y-2">
                <p className="font-serif text-xl italic text-on-surface-variant">Follow the rhythm</p>
                <p className="text-secondary text-sm uppercase tracking-widest">Hold for 4, Release for 4</p>
              </div>
            </div>
          </div>

          {/* Quick Grounding Exercises: Stacked Cards */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border-l-4 border-primary">
              <h3 className="font-serif text-2xl mb-4">5-4-3-2-1 Technique</h3>
              <p className="text-secondary mb-6">A sensory countdown to bring you back to the present moment.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-sm font-medium">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">5</span>
                  Things you can see
                </li>
                <li className="flex items-center gap-4 text-sm font-medium">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">4</span>
                  Things you can touch
                </li>
                <li className="flex items-center gap-4 text-sm font-medium opacity-60">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">3</span>
                  Things you can hear
                </li>
              </ul>
              <button className="mt-8 text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:translate-x-2 transition-transform">
                Full Exercise <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-2xl mb-2">Cool Water</h3>
                  <p className="text-secondary text-sm">Splash cold water on your face or hold an ice cube to reset your nervous system.</p>
                </div>
                <span className="material-symbols-outlined text-primary text-4xl">ac_unit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crisis Lifelines: Urgent Cards */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-outline-variant/15 pb-4">
            <h3 className="font-serif text-3xl">Crisis Lifelines</h3>
            <p className="text-secondary text-sm uppercase tracking-widest font-semibold">Available 24/7</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lifeline Card 1 */}
            <div className="bg-primary-fixed/30 p-10 rounded-lg flex flex-col justify-between hover:bg-primary-fixed/50 transition-colors group">
              <div>
                <span className="material-symbols-outlined text-primary text-3xl mb-6">phone_in_talk</span>
                <h4 className="font-serif text-2xl mb-2">Emergency Services</h4>
                <p className="text-on-surface-variant leading-snug">Immediate local support for life-threatening situations.</p>
              </div>
              <div className="mt-12">
                <a className="text-3xl font-serif font-bold text-primary block group-hover:underline" href="tel:911">911</a>
              </div>
            </div>
            {/* Lifeline Card 2 */}
            <div className="bg-surface-container-high p-10 rounded-lg flex flex-col justify-between hover:translate-y-[-8px] transition-transform shadow-sm">
              <div>
                <span className="material-symbols-outlined text-secondary text-3xl mb-6">sms</span>
                <h4 className="font-serif text-2xl mb-2">Crisis Text Line</h4>
                <p className="text-secondary leading-snug">Text HOME to 741741 to connect with a crisis counselor.</p>
              </div>
              <div className="mt-12">
                <span className="text-3xl font-serif font-bold text-on-surface">741741</span>
              </div>
            </div>
            {/* Lifeline Card 3 */}
            <div className="bg-surface-container-high p-10 rounded-lg flex flex-col justify-between hover:translate-y-[-8px] transition-transform shadow-sm">
              <div>
                <span className="material-symbols-outlined text-secondary text-3xl mb-6">support_agent</span>
                <h4 className="font-serif text-2xl mb-2">Suicide Lifeline</h4>
                <p className="text-secondary leading-snug">Emotional support for people in distress or suicidal crisis.</p>
              </div>
              <div className="mt-12">
                <span className="text-3xl font-serif font-bold text-on-surface">988</span>
              </div>
            </div>
          </div>
        </section>

        {/* Safe Place Visual: Large Immersive Card */}
        <div className="relative rounded-xl overflow-hidden min-h-[400px] flex items-end p-12 group">
          <img 
            alt="Peaceful beach sunset" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-[10000ms]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY58G5J7EGTmX9Hu4Lty7GAOGXvuIFqcWNXFaFAtKtqiU9jkr3tTxUUU8ZPXZpCSFE9l_ZsnGiTRk_uQF1KI75Gl8lJt8wAPmp_PPHD1FkgU7PGzawzlM5_Y_uIC2bEUad3DNGhnuL5Yk6XSru7bHKyX3OzDn7wVXwDtlNRlJXmQfsHwLkLfJwva2SJ3ojI2rXNbj7_NQgOhO3M6ra8LhGrFSX368jSDOE5wYk6X4BAXZACOqYQIW6u1yBwZiJU3QvLSn1lWjpVAqY"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-xl">
            <h3 className="text-4xl font-serif text-white italic mb-4">You are not alone in this.</h3>
            <p className="text-white/80 font-sans leading-relaxed">Sometimes the storm feels infinite, but every breath is a bridge to the other side. Stay here as long as you need.</p>
          </div>
        </div>
      </div>
      
      {/* Footer (Already provided by parent layout but re-implemented for exact matching if requested) */}
      <footer className="border-t border-[#DBC1BC]/15 py-12 px-8 bg-[#FCF9F3]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-lg italic text-[#954333]">Serenity</div>
          <div className="flex gap-8 text-[#665C59] font-sans text-sm uppercase tracking-widest">
            <Link className="hover:text-[#954333] transition-colors" href="#">Privacy Policy</Link>
            <Link className="hover:text-[#954333] transition-colors" href="#">Terms of Service</Link>
            <Link className="hover:text-[#954333] transition-colors" href="#">Help Center</Link>
          </div>
          <div className="text-[#665C59] font-sans text-xs tracking-widest">
            © 2024 Serenity. Crafted for Inner Peace.
          </div>
        </div>
      </footer>
    </div>
  );
}
