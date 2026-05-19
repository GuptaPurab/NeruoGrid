import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';
import { notifications } from '../data/mockData';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header">
      <div className="header-search">
        <Search className="search-icon" size={16} />
        <input type="text" placeholder="Search assets, alerts, reports..." />
      </div>

      <div className="header-right">
        <div className="system-status">
          <span className="pulse-dot" />
          <span>System Online</span>
          <span style={{ opacity: 0.7 }}>99.8% uptime</span>
        </div>

        <button
          className="header-btn"
          onClick={() => setShowNotifications(!showNotifications)}
          id="notifications-btn"
        >
          <Bell size={18} />
          <span className="badge">{notifications.length}</span>
        </button>

        <div className="avatar" id="user-avatar">OP</div>
      </div>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="notifications-panel"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notifications-header">
              <h3>Notifications</h3>
              <span>{notifications.length} unread notifications</span>
            </div>
            {notifications.map((n) => (
              <div className="notification-item" key={n.id}>
                <div className="notification-row">
                  <span className={`notification-dot ${n.severity.toLowerCase()}`} />
                  <div>
                    <div className="notification-title">{n.title}</div>
                    <div className="notification-desc">{n.desc}</div>
                    <div className="notification-meta">
                      <span className="asset-tag">{n.asset}</span>
                      <span>•</span>
                      <span>{n.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
