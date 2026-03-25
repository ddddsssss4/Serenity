import { Sidebar } from '../../components/Sidebar';
import { TourProvider } from '../../components/TourProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider>
      <div className="flex flex-1 w-full bg-surface">
        <Sidebar />
        <div className="flex-1 w-full md:ml-72 flex flex-col items-stretch overflow-x-hidden">
          {children}
          
          {/* Floating Safety Button */}
          {/* <button className="fixed bottom-10 right-10 w-20 h-20 bg-surface text-error rounded-full flex items-center justify-center shadow-[0_40px_60px_-10px_rgba(28,28,24,0.12)] border border-outline-variant/20 hover:scale-110 active:scale-95 transition-all group z-50">
            <span className="material-symbols-outlined text-4xl group-hover:animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            <div className="absolute -top-12 right-0 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sans font-bold">
              Immediate Support
            </div>
          </button> */}
        </div>
      </div>
    </TourProvider>
  );
}
