import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 overflow-hidden bg-gradient-to-br from-[#1A3A5C] via-[#0F2840] to-[#1A3A5C]">
      {/* Background decoration - abstract patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] rounded-full bg-primary/30 blur-[150px] opacity-60" />
        <div className="absolute top-[55%] right-[-5%] w-[35%] h-[35%] rounded-full bg-accent/25 blur-[120px] opacity-50" />
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] rounded-full bg-primary-light/20 blur-[100px] opacity-40" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="w-full max-w-md z-10 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 p-8">
        <Outlet />
      </div>
      
      <div className="absolute bottom-8 text-white/30 text-xs font-mono tracking-widest">
        SFD-IBAM-ANTIPLAGIAT-L3-2025
      </div>
    </div>
  );
}
