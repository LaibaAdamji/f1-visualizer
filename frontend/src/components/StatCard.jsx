import { motion } from 'framer-motion';

function StatCard({ label, value, color = 'red', trend, index = 0 }) {
  const gradients = {
    red: 'from-red-600 via-red-500 to-orange-500',
    blue: 'from-blue-600 via-blue-500 to-cyan-500',
    green: 'from-green-600 via-emerald-500 to-teal-500',
    yellow: 'from-yellow-600 via-yellow-500 to-orange-400',
    purple: 'from-purple-600 via-purple-500 to-pink-500',
  };

  const icons = {
    red: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.5l-6-3.75V8.25L12 4.5l6 3.75v8.5l-6 3.75z"/>
      </svg>
    ),
    blue: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    green: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    ),
    yellow: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className="text-4xl font-bold text-white font-display">
              {value?.toLocaleString() || '0'}
            </p>
            {trend !== undefined && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
                <span className="text-gray-500 text-xs ml-2">vs last month</span>
              </div>
            )}
          </div>
          <div className={`text-white bg-gradient-to-br ${gradients[color]} p-3 rounded-xl`}>
            {icons[color] || icons.red}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </motion.div>
  );
}

export default StatCard;