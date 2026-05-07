import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/drivers', label: 'Drivers', icon: '🏎️' },
    { path: '/teams', label: 'Teams', icon: '🏁' },
    { path: '/races', label: 'Races', icon: '🏆' },
    { path: '/standings', label: 'Standings', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-f1-dark via-f1-darkGray to-f1-dark">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-f1-red opacity-5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-f1-accent opacity-5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 glass-card mx-4 mt-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-4xl"
              >
                🏎️
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  F1 Analytics
                </h1>
                <p className="text-xs text-gray-400">Stats & Trends</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-f1-red to-red-700 text-white shadow-lg shadow-f1-red' 
                          : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                        }
                      `}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span className="hidden md:inline">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Formula 1 Analytics Platform • Database Systems Project 2024
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-500">
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