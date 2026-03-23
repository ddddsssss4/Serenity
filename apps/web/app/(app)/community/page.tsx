"use client";

import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="flex max-w-screen-xl mx-auto w-full">


      {/* Main Content Area */}
      <main className="flex-1 px-8 lg:px-12 py-12 overflow-y-auto">
        {/* Hero Section */}
        <header className="mb-16 max-w-2xl">
          <h1 className="font-serif text-5xl lg:text-6xl text-primary leading-[1.1] mb-6 tracking-tight">
            Find your tribe in our <span className="italic">tactile sanctuary.</span>
          </h1>
          <p className="text-lg text-secondary leading-relaxed mb-8">
            Discover soulful communities built on shared intention, meaningful dialogue, and restorative practices.
          </p>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium shadow-[0_40px_60px_-10px_rgba(28,28,24,0.04)]">All Groups</button>
            <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-highest transition-colors">Trending</button>
            <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-highest transition-colors">Local</button>
            <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-highest transition-colors">Mindfulness</button>
            <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-highest transition-colors">Creativity</button>
          </div>
        </header>

        {/* Community Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
          
          {/* Card 1: Daily Calm */}
          <article className="group relative bg-surface-container-low rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-outline-variant/15">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBf6hETYAY55eeqQbnGVsy8Zd5y5FLagv5SI6vPOgWVu9HdU7-HNawIwPoBXaLWa_-tkqGXCaNKAw10tmrNEAphPKQjq4b8gGfDBlaeOgCqOViKIJ4FvMoYHDBIWIoKQQmYQX02HOnHikZTLJ8QPI3xYW9WADnW1YbtvzEC_vxuCtw6F0Ye8oGV2ek70xt8HWYGHn1NHQz3ygxr3cSGO4iOMtc9fz1OI38LROpaDPAVKwMJcFwPaD4Oi5YOT01zvGMVucGVOqc7kt-H" 
                alt="Yoga and meditation" 
              />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-serif text-2xl text-on-surface leading-tight">Daily Calm</h3>
                <span className="text-[0.65rem] tracking-widest uppercase font-bold text-primary bg-primary-fixed px-2 py-1 rounded">MEMBER FAVORITE</span>
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-8 line-clamp-2">
                A ritualistic space for morning breathwork and evening reflection with a global community of practitioners.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline font-medium">1.2k members</span>
                <Link href="/community/morning-glow" className="px-8 py-3 bg-gradient-to-b from-primary to-primary-container text-white rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm shadow-primary/20">
                  Join Circle
                </Link>
              </div>
            </div>
          </article>

          {/* Card 2: Relationship Support */}
          <article className="group relative bg-surface-container-low rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-outline-variant/15">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhcQNq0CtGUxqmIdh7aOjEW_zOh5kCCMHn1n3HYWS-qci-CV61AxRLtoHxpyg6yMOw5dMEDmJS2GG_7GnGEsjOSKvJ3dXNhNIEXhxkhf51EUaUZt6z5Nys3jokg-9RytyN7aBhwMucQ6o_frm0R76xE-XbiPBAjaHEmS1fW-hM7uIz01DSH-dzMf3ZLIcPVfhAANCi29q8EOKlESTxPfCOgsykRL0kTY_8Yw_z22jbjyLR9p0zjpiYk7irKbCh2--vWPkvSVqQD23T" 
                alt="Friends talking" 
              />
            </div>
            <div className="p-8">
              <h3 className="font-serif text-2xl text-on-surface leading-tight mb-3">Relationship Support</h3>
              <p className="text-secondary text-sm leading-relaxed mb-8 line-clamp-2">
                Navigate the complexities of human connection in a safe, moderated environment centered on empathy.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline font-medium">856 members</span>
                <button className="px-8 py-3 bg-surface-container-high text-primary rounded-full text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                  Enter
                </button>
              </div>
            </div>
          </article>

          {/* Card 3: Motherhood */}
          <article className="group relative bg-surface-container-low rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-outline-variant/15">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuTlPHHRbAfAsOJgYqJ5dHGBVmq1L29gopSfpvTZJMNlj2P7fFy2f06Ry3tGJ4Qj17levufccOX3q0Hcwvz9TtcnAb-9pFczkOBPzy61yt9HUmUj2Mku-qD44ykfN1NFHPL062na16OmxjzLgOa8otEluYFu7NzRmYofezciMYt4xcVuHARSL1U-UBVvtXsbfDCHsfw3yiDAn4yhrcJl4ykJLJ8sp2t5Kw3RdTMekkMpYZYMDjgr5vLPeI8h3AeTkl4UBlH4o8IbPM" 
                alt="Mother and child" 
              />
            </div>
            <div className="p-8">
              <h3 className="font-serif text-2xl text-on-surface leading-tight mb-3">Motherhood</h3>
              <p className="text-secondary text-sm leading-relaxed mb-8 line-clamp-2">
                Shared wisdom and support for every stage of the journey, from postpartum care to conscious parenting.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline font-medium">2.4k members</span>
                <button className="px-8 py-3 bg-gradient-to-b from-primary to-primary-container text-white rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm shadow-primary/20">
                  Join Circle
                </button>
              </div>
            </div>
          </article>

          {/* Card 4: Professional Growth */}
          <article className="group relative bg-surface-container-low rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-outline-variant/15">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoDRK5COjUdnF67rStwLKmOZv2a9-yj8sNDNKOifYuYu2xTK7c4JEcaYntG1F2tFfFp-H5-ONbqFWNzi2jZGsJtyfy9yYa5aJC6tfgybj2Gce0ReTFeUBdqnwt_8pYGrFzt3qSK-L91fGQWXSkAYc1NTbg9zkEO0ZOfa0IwULbe_jYueG99P1LMU6L7dbWkwidPZwZWTMumA3BKHjuMznKuf7FeilyM1O0PaY7VfBI8nXsf47NnbTmcGrBr7z5t7K2LHrxW-6Szlh7" 
                alt="Workspace" 
              />
            </div>
            <div className="p-8">
              <h3 className="font-serif text-2xl text-on-surface leading-tight mb-3">Professional Growth</h3>
              <p className="text-secondary text-sm leading-relaxed mb-8 line-clamp-2">
                A curated network of thoughtful leaders prioritizing emotional intelligence and sustainable success.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline font-medium">642 members</span>
                <button className="px-8 py-3 bg-surface-container-high text-primary rounded-full text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                  Enter
                </button>
              </div>
            </div>
          </article>

          {/* Card 5: Self Discovery */}
          <article className="group relative bg-surface-container-low rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-outline-variant/15">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxw7mNchRM-9i4-COAJ1CU3o2wSh_dkKJrXR9ereloH7Sp6FXOyiZuwfDMHQCR4EHaST6zyV_Eq9bksK2OI_bTXjejap5QjfWthIvVIzoFsRXrt40HhqpRMy_1IXcspzMNVX2Sggv2c7wVSvXC3uSUwVVo2jCl6Lbb1h0A6Qb1kMIIzXLCTeweE2cO1hjvYKiLzD8tqnGPtAVCxf564r05TZKcHwbcE82V9-M5EsBRZPEO2UEGTmkM4ehQlLQZd20IX1xPUHgJzS7H" 
                alt="Journaling" 
              />
            </div>
            <div className="p-8">
              <h3 className="font-serif text-2xl text-on-surface leading-tight mb-3">Self Discovery</h3>
              <p className="text-secondary text-sm leading-relaxed mb-8 line-clamp-2">
                Deep-dive workshops and journaling circles focused on unfolding your most authentic narrative.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline font-medium">1.1k members</span>
                <button className="px-8 py-3 bg-gradient-to-b from-primary to-primary-container text-white rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm shadow-primary/20">
                  Join Circle
                </button>
              </div>
            </div>
          </article>

          {/* Add New Circle Placeholder */}
          <article className="group relative bg-surface-container border-2 border-dashed border-outline-variant/30 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-8 text-center transition-all hover:bg-surface-container-high min-h-[360px]">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <h3 className="font-serif text-xl text-on-surface mb-2">Create Your Space</h3>
            <p className="text-secondary text-sm mb-6 max-w-[200px]">Have a unique interest? Start a new tribe today.</p>
            <button className="px-6 py-2 border border-primary text-primary rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all shadow-sm">
              Get Started
            </button>
          </article>

        </div>
      </main>
    </div>
  );
}
