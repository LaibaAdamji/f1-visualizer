import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import f1Logo from '../assets/f1-logo.png';
import dashboardBackground from '../assets/dashboard-bg.jpg';

function Layout() {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: 0, y: 0 });
  const [trailSegments, setTrailSegments] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      setMousePos({ x, y });

      // Create trail segments for laser effect
      setTrailSegments(prev => {
        const now = Date.now();
        const newSegment = {
          id: now + Math.random(),
          x0: prevPosRef.current.x,
          y0: prevPosRef.current.y,
          x1: x,
          y1: y,
          timestamp: now,
        };

        const updated = [...prev, newSegment].slice(-28); // cap segments
        // Keep only recent segments (fade out over time)
        return updated.filter(seg => now - seg.timestamp < 260);
      });

      prevPosRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/drivers', label: 'Drivers' },
    { path: '/teams', label: 'Teams' },
    { path: '/races', label: 'Races' },
    { path: '/standings', label: 'Standings' },
  ];

  return (
    <div className="relative isolate min-h-screen text-white">
      {/* Laser Pointer Cursor Trail - SVG */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-50"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="wispBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="wispGrad" cx="30%" cy="30%">
            <stop offset="0%" stopColor="rgba(225,6,0,0.95)" />
            <stop offset="40%" stopColor="rgba(225,6,0,0.5)" />
            <stop offset="100%" stopColor="rgba(225,6,0,0)" />
          </radialGradient>
        </defs>

        {trailSegments.map((segment) => {
          const age = Date.now() - segment.timestamp;
          const t = Math.max(0, 1 - age / 260);
          // layered strokes for wisp effect
          return (
            <g key={segment.id} style={{ filter: 'url(#wispBlur)' }}>
              <line x1={segment.x0} y1={segment.y0} x2={segment.x1} y2={segment.y1}
                stroke={`rgba(225,6,0,${0.18 * t})`} strokeWidth={8 * t} strokeLinecap="round" />
              <line x1={segment.x0} y1={segment.y0} x2={segment.x1} y2={segment.y1}
                stroke={`rgba(225,6,0,${0.45 * t})`} strokeWidth={4 * t} strokeLinecap="round" />
              <line x1={segment.x0} y1={segment.y0} x2={segment.x1} y2={segment.y1}
                stroke={`rgba(225,6,0,${0.85 * t})`} strokeWidth={1.5 * t} strokeLinecap="round" />
            </g>
          );
        })}

        {/* Current position glow - layered circles for spread */}
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={mousePos.x} cy={mousePos.y} r={22} fill="url(#wispGrad)" style={{ opacity: 0.08 }} />
          <circle cx={mousePos.x} cy={mousePos.y} r={5} fill="rgba(225,6,0,0.75)" style={{ filter: 'drop-shadow(0 0 10px rgba(225,6,0,0.45))' }} />
        </g>
      </svg>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${dashboardBackground})`,
            backgroundSize: 'auto 170%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'calc(0% + var(--dashboard-parallax-x, 0px)) center',
            transform: 'scale(1.6)',
            opacity: 0.88,
            filter: 'contrast(1.05) saturate(1.05)'
          }}
        />
        <div
          className="absolute inset-0 bg-no-repeat blur-[2px] mix-blend-screen"
          style={{
            backgroundImage: `url(${dashboardBackground})`,
            backgroundSize: 'auto 170%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'calc(0% + var(--dashboard-parallax-x, 0px) + 2px) center',
            transform: 'scale(1.6)',
            opacity: 0.28,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,6,0,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(0,210,190,0.06),transparent_28%),linear-gradient(135deg,rgba(9,9,12,0.82)_0%,rgba(17,17,24,0.72)_24%,rgba(23,23,32,0.60)_50%,rgba(17,17,24,0.72)_76%,rgba(9,9,12,0.82)_100%)]"></div>
        <div className="absolute inset-0 soft-grid opacity-[0.15]"></div>
        <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-f1-red opacity-[0.03] rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-f1-accent opacity-[0.03] rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-4 z-20 page-shell mb-8">
        <div className="glass-card rounded-[1.75rem] border border-white/10 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="drop-shadow-[0_0_16px_rgba(225,6,0,0.35)]"
              >
                <img 
                  src={f1Logo} 
                  alt="F1 Analytics Logo" 
                  className="h-12 w-12 object-contain" 
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-f1-red via-white to-f1-accent bg-clip-text text-transparent">
                  F1 Analytics
                </h1>
                <p className="text-xs uppercase tracking-[0.28em] text-gray-400">Stats & Trends</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative group shrink-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 border text-sm
                        ${isActive 
                          ? 'border-transparent bg-gradient-to-r from-f1-red to-red-700 text-white shadow-lg shadow-f1-red/40' 
                          : 'border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5'
                        }
                      `}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-shell relative z-10 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Workaround: if framer-motion leaves inline opacity at 0 due to runtime error,
          ensure content becomes visible by clearing inline opacity on page-shell children. */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          try{
            setTimeout(function(){
              var els = document.querySelectorAll('.page-shell [style]');
              els.forEach(function(el){ if(el.style && el.style.opacity === '0'){ el.style.opacity = '1'; } });
            }, 120);
          }catch(e){/* ignore */}
        })();
      ` }} />

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 border-t border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="page-shell text-center">
          <p className="text-gray-300 text-sm">
            Formula 1 Analytics Platform • Database Systems Project 2024
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
            <span>PostgreSQL</span>
            <span>•</span>
            <span>MongoDB</span>
            <span>•</span>
            <span>React</span>
            <span>•</span>
            <span>Node.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;