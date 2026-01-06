"use client"

export function HeroAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark Base with Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,107,0,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,107,0,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Primary Gradient Orb - Large */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,0,0.4) 0%, rgba(255,50,0,0.2) 40%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Secondary Orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,0,0.5) 0%, transparent 70%)',
          top: '20%',
          left: '-10%',
          animation: 'float1 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255,50,0,0.5) 0%, transparent 70%)',
          bottom: '10%',
          right: '-5%',
          animation: 'float2 10s ease-in-out infinite',
        }}
      />

      {/* Rotating Ring System */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Outer Ring */}
        <div
          className="absolute w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
          style={{ animation: 'spin 60s linear infinite' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-primary to-red-500 shadow-lg shadow-primary/50" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/60" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40" />
        </div>

        {/* Middle Ring */}
        <div
          className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/15"
          style={{ animation: 'spin 40s linear infinite reverse' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400/60" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400/60" />
        </div>

        {/* Inner Ring */}
        <div
          className="absolute w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
          style={{ animation: 'spin 25s linear infinite' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/50" />
        </div>

        {/* Core Glow */}
        <div
          className="absolute w-[150px] h-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/30 to-red-500/30 blur-xl"
          style={{ animation: 'pulse 3s ease-in-out infinite' }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.2 + Math.random() * 0.4,
            animation: `particle ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Shooting Lines */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div
          className="absolute w-[2px] h-[100px] bg-gradient-to-b from-transparent via-primary to-transparent"
          style={{
            top: '20%',
            left: '30%',
            transform: 'rotate(45deg)',
            animation: 'shoot 8s linear infinite',
          }}
        />
        <div
          className="absolute w-[2px] h-[150px] bg-gradient-to-b from-transparent via-orange-400 to-transparent"
          style={{
            top: '60%',
            right: '25%',
            transform: 'rotate(-30deg)',
            animation: 'shoot 12s linear infinite',
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute w-[2px] h-[80px] bg-gradient-to-b from-transparent via-red-500 to-transparent"
          style={{
            top: '40%',
            left: '70%',
            transform: 'rotate(60deg)',
            animation: 'shoot 10s linear infinite',
            animationDelay: '6s',
          }}
        />
      </div>

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translate(10px, -20px) scale(1.2);
            opacity: 0.5;
          }
          50% {
            transform: translate(-5px, -40px) scale(0.8);
            opacity: 0.3;
          }
          75% {
            transform: translate(15px, -60px) scale(1.1);
            opacity: 0.4;
          }
        }

        @keyframes shoot {
          0% {
            transform: rotate(45deg) translateY(-200px);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: rotate(45deg) translateY(200vh);
            opacity: 0;
          }
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Homepage text animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
