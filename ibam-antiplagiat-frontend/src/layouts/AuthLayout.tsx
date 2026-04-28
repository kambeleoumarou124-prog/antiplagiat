import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden bg-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-light/20 blur-[120px]" />
        <div className="absolute top-[60%] right-[0%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10 glass-dark rounded-2xl overflow-hidden animate-in">
        <div className="bg-gradient-to-b from-primary-dark to-primary/90 p-8 flex flex-col items-center border-b border-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary-light to-accent"></div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20 shadow-inner">
            <span className="font-serif text-2xl font-bold text-white tracking-widest">IBAM</span>
          </div>
          <h1 className="text-white text-3xl font-serif mt-2 tracking-wide font-bold">Anti-Plagiat</h1>
          <p className="text-accent-light text-sm font-medium tracking-wide mt-2 uppercase">Plateforme d'analyse et de validation</p>
        </div>
        <div className="p-8 bg-white">
          <Outlet />
        </div>
      </div>
      
      <div className="absolute bottom-6 text-white/40 text-xs font-mono tracking-widest">
        SFD-IBAM-ANTIPLAGIAT-L3-2025
      </div>
    </div>
  );
}
