"use client";

import Link from "next/link";
import { use } from "react";

export default function CircleChatPage({
  params,
}: {
  params: Promise<{ circleId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="flex flex-1 h-[calc(100vh-5rem)] overflow-hidden">
      {/* Main Chat Canvas */}
      <main className="flex-1 flex flex-col bg-surface relative">
        {/* Chat Header */}
        <header className="px-8 py-6 flex items-center justify-between bg-surface-container-low border-b border-outline-variant/10 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <button className="p-2 text-primary">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-primary capitalize">
                {resolvedParams.circleId.replace('-', ' ')}
              </h1>
              <p className="text-sm text-secondary font-sans">24 members present in the calm</p>
            </div>
          </div>
          <div className="flex -space-x-3 overflow-hidden">
            <img 
              className="inline-block h-8 w-8 rounded-full ring-2 ring-surface object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAoO31DfO3ncnJ4nIF_onEdthz7RI2a1nl35uHftNyYhnEwddTerHRd3DuEW7-87jJcvvTwZ1np-J2sI4GsAemj3BPg-IWZAxi-YBGMDKFEfmMcW_crzbtn3EUfUeioTGq6mdSDyWplz5Arg-7efy8i0FMz2Q3-5Sf4NqtsA-eKdh7B-koZ70oEthl18dyvldrMnRD8kFSIyLBZNgPATQYjpcxy3BYjQvo0mORLtAspISv11j-NupoBDOg2xy1c9IVyT24Y-weamUx" 
              alt="Member" 
            />
            <img 
              className="inline-block h-8 w-8 rounded-full ring-2 ring-surface object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLwaAJOFH4JD412jH4ahlZIj3O_vgOnfVZdsC2Z_R_GG2NMcQynwAJEnaRfuPZcjrInZvvVXDT8RMfBQPttXPSIJEHKZgtWXw4_klUgkHh8ljK56_UOtUI3qRTvyF6b4RbbCNfB6mw4St02B9wZgzll60QYzCB6C9BI0m2Y_6JOVB0btfzgMX5ueavt2HTg7oyfle5SwkD1G5YkvoFILTAcDycfbJFjGBmPS57aQFdBrqW3jaZ7_nsI3ZtP5hYuVZNuG-QNetHJqa-" 
              alt="Member" 
            />
            <img 
              className="inline-block h-8 w-8 rounded-full ring-2 ring-surface object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBgQAA6uAnbecBise9_eR_aJlumAVcqApRgAgIVbiM5gPzDmNlOScoAbDdYWjEVTn94-XyrVcGUxYqPP48QfhOBBYRX7d1H4PHbC0jf7tDR4Kc165cKkivsGyEAu8uvMHpd0C8KSzCBBK04npAlhPRpvKW_aiauaNx-zUAt7Ltgp_jwfOKaTvn2vD3qXZvS3IEONPPeyCpioXX2ydG5WdeBb2BgQNnmRQSmTbP7FwdjftyVxo1cUc3xDY94pGJ9wxH0z6DLp0O_sq3" 
              alt="Member" 
            />
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-container text-[10px] font-bold text-on-primary-container ring-2 ring-surface">
              +18
            </div>
          </div>
        </header>

        {/* Chat Messages Area */}
        <section className="flex-1 overflow-y-auto p-8 space-y-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-fixed/20 via-transparent to-transparent">
          {/* Date Separator */}
          <div className="flex justify-center">
            <span className="bg-surface-container px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-secondary font-bold">Today</span>
          </div>

          {/* Message: Other */}
          <div className="flex items-start gap-4 max-w-2xl">
            <img 
              className="w-10 h-10 rounded-2xl object-cover shadow-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD89sm-aRqDILh2IlY24_meZD6IUs5NzQ5n2t16jS-9hENeKx0HI5HcAJ8Wibd4rqUU8LbZLpZQnBJXpM5z5gRpd3XvnPOxw1B_xAx3by-qW4UjaTDDJP4gG0Nwm2ct3RcPSxysft9YIFSUhXh9EZfMhMdanz2gWt9yeoxs8FMoTPrT46TIGV33Yav5EJOWhIaAyZheDHBJpjXkYTyu0pBiA26IKHUfuZJJKweNhdqR9_rLPc1x3-4lFvjYy6rIpg16Vzl2ksrob9Ae" 
              alt="Elena" 
            />
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-semibold text-sm text-tertiary">Elena Rose</span>
                <span className="text-[10px] text-secondary/60">08:14 AM</span>
              </div>
              <div className="bg-primary-fixed/40 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none text-on-surface-variant leading-relaxed shadow-sm">
                Good morning, lovely collective. Has anyone tried the new heart-opening meditation this morning? It felt so grounding.
              </div>
            </div>
          </div>

          {/* Message: Other */}
          <div className="flex items-start gap-4 max-w-2xl">
            <img 
              className="w-10 h-10 rounded-2xl object-cover shadow-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGeWp4S0NwL-zfPLkAta2uOCsJLqSjopnwmGwT70xJWOrBnZCROh4-Pm1ps2hCPWZeC_AtJO-aRuJyPD5aWYRFO-sfz0JlNrxrKsVIV845zqE5Xp5XiI28vmwMwa6RIosHLfuIUrc9_EvVlJyIWD9nJaUicwHaPvNe-wXfSZfAT7sf0lGCLz4tUq_T64Zm1QSfO2BQSp7oq9yjDH8n6saG86gNPoATjQemjz7CYIj2j_I6mwz-C-GOsKNBs50QKyzHYToNJSsV0juU" 
              alt="Julian" 
            />
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-semibold text-sm text-tertiary">Julian Hayes</span>
                <span className="text-[10px] text-secondary/60">08:22 AM</span>
              </div>
              <div className="bg-primary-fixed/40 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none text-on-surface-variant leading-relaxed shadow-sm">
                I just finished it, Elena. The pacing was perfect. I paired it with some peppermint tea—definitely recommended.
              </div>
            </div>
          </div>

          {/* Shared Image Context */}
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-10 shrink-0"></div>
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 max-w-sm border-4 border-surface-container-lowest">
              <img 
                className="w-full h-auto object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALiphDrKAPdPi-O5j-MJ3jjvHX2W4BnNHSXsY87OblZiR02YiLd9JjQFV-TuqDKYJwzSpCUMw-vaU90urGQ_RfiKfdh1iDIm8ZWs-t-t2RrT9M4ZEgcnx1bGE8j6JNzVHiBdUzDZjm9uC5qxZ3uz0i6Igf6u40zheDLQSnvxkHN2rKqohKUrIoVGxrtVQBIHOfVHxlXr5Hcd81K7JkHO1x_y_avaLrUDJEu0khKoLa4FBAZU5BA6R1fEdXPiTZMqRHGd65NjrllsJU" 
                alt="Herbal Tea" 
              />
            </div>
          </div>

          {/* Message: User */}
          <div className="flex items-start gap-4 max-w-2xl ml-auto flex-row-reverse">
            <div className="w-10 h-10 rounded-2xl bg-primary flex shrink-0 items-center justify-center text-on-primary font-serif font-bold text-lg shadow-lg shadow-primary/20">
              S
            </div>
            <div className="space-y-1 text-right">
              <div className="flex items-baseline gap-2 flex-row-reverse">
                <span className="font-serif font-semibold text-sm text-primary">You</span>
                <span className="text-[10px] text-secondary/60">08:45 AM</span>
              </div>
              <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-none text-left leading-relaxed shadow-xl shadow-primary/10">
                That tea looks wonderful, Julian. I'm just about to start my practice now. Grateful for this space every morning. ✨
              </div>
            </div>
          </div>
        </section>

        {/* Message Input Area */}
        <footer className="p-6 bg-surface-container-low/50 backdrop-blur-md shrink-0">
          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-surface-container-lowest p-2 pr-4 rounded-full shadow-2xl shadow-on-surface/5 border border-outline-variant/10">
            <button className="p-3 text-secondary hover:text-primary transition-colors hover:bg-surface-container rounded-full">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <input 
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-on-surface placeholder:text-secondary/50 font-sans text-sm px-2" 
              placeholder="Share a reflection or a moment of peace..." 
              type="text" 
            />
            <div className="flex items-center gap-2">
              <button className="p-2 text-secondary hover:text-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">sentiment_satisfied</span>
              </button>
              <button className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Right Sidebar (Community Stats/Info) */}
      <aside className="hidden xl:flex w-80 flex-col bg-surface-container-low p-8 border-l border-outline-variant/15 shrink-0 overflow-y-auto">
        <h4 className="font-serif text-lg text-primary mb-6">Circle Essence</h4>
        <div className="space-y-6">
          <div className="p-6 bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10">
            <p className="text-xs font-bold text-secondary tracking-widest uppercase mb-3">Today's Focus</p>
            <p className="font-serif italic text-on-surface-variant leading-relaxed">"The morning breeze has secrets to tell you. Don't go back to sleep."</p>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-sm">auto_stories</span>
              <span className="text-xs font-semibold">Rumi's Wisdom</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-secondary tracking-widest uppercase px-2">Circle Shared Media</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXJEERoaTRbg12ZVlZ2uzcB-VGlGJRELhC7bOG1n4yssqdln_haeybJnfkxDrmgZHkcdfeKD3-HIoWxwBmr6OTYDiWw6txhJ1o4NY9zSzpeemKd3ux3onPKf5LFTsYOvkWzGlqJTAr8YGbmPXX3LtHDkPfg8bx4kTHugQK4C-GqfXXgIJNA4RQk4jf15Tm3BJE_4u2nVGFewrn58trz00Ez311AShhew5LqQ70EOvgwxyjnZD4pCWXOPjulDyMfKK1_dPvHLMUopRt" 
                  alt="Media"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIJD38TdaGLhy0DWdhCL2Iq6X-kbPXSkNtZfgi0WvdigPY87VkbPDLjBx0LJ8x-kDUEd9VPZ6FDwgGh9Q-XukSP3YjYwevNrjsjy5Tn1yA0SukCRSdvFcOpu2aQQpKiPzFGQc2pVJDGrFUtxo4fAgZ_9hFbyDcIhued_9DUIONUFtePGNUcsbDaqov0p_IGD22GVF1B7NHqgfnvkDceOJxUIvhZApn-UNkv6XX9dLZ-gRdn_66NK_U_OkMIO2iABCeQ5ybW8CkBSAG" 
                  alt="Media"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIOHyPfigPoz0gWf1gDWzVQlx0pCn_6RQ0abOR9ZXF05JJOD5muUOPjBCdQcWCrBUu42uCEhS_sSDKtSkG0x7Hs4FvKFWX8zVbC4OOsCTnEQafkdvXpfJFYMQph3y3ZfbF8ii8hNUezshquecSPJOXWYzWeyo3GE-DDIirLIwVmT-ZaGRJQzWbFS6q7BlP-u7_vNpoy-8bM-gCJwI4HO7kqA1W6OZmsWWGKf29Jj87-zyaZIfJt82uK_yfCcflifTxEnPWtBzAIJ5h" 
                  alt="Media"
                />
              </div>
              <div className="aspect-square rounded-2xl bg-surface-container flex items-center justify-center text-primary/40 font-bold text-sm">
                +42
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full py-3 px-4 rounded-2xl border border-primary/20 text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-sm">door_open</span>
              Leave Circle Quietly
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
