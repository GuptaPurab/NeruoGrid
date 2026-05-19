import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Box, Cpu, Zap } from 'lucide-react';
import { assets } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const typeIcons = {
  Transformer: Zap,
  Reactor: Cpu,
  Breaker: Box,
  CT: Cpu,
};

export default function Assets() {
  const [search, setSearch] = useState('');

  const filtered = assets.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div className="page-content" variants={container} initial="hidden" animate="show">
      <motion.h1 className="page-title" variants={item}>Asset Management</motion.h1>
      <motion.p className="page-subtitle" variants={item}>
        Monitor and manage substation equipment and components
      </motion.p>

      <motion.div className="asset-search" variants={item}>
        <Search className="search-icon" size={16} />
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          id="asset-search-input"
        />
      </motion.div>

      <motion.div className="assets-grid" variants={container} initial="hidden" animate="show">
        {filtered.map(asset => {
          const Icon = typeIcons[asset.type] || Box;
          const statusClass = asset.status === 'Operational' ? 'operational'
            : asset.status === 'Warning' ? 'warning'
            : asset.status === 'Maintenance' ? 'maintenance' : 'operational';

          return (
            <motion.div
              className="asset-card"
              key={asset.id}
              variants={item}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="asset-card-header">
                <div className="asset-card-info">
                  <div className="asset-card-icon"><Icon size={16} /></div>
                  <div>
                    <div className="asset-card-name">{asset.name}</div>
                    <div className="asset-card-id">{asset.type}</div>
                  </div>
                </div>
                <span className={`status-badge ${statusClass}`}>{asset.status}</span>
              </div>

              <div className="asset-card-stats">
                <div className="asset-stat">
                  <span className="asset-stat-label">Status</span>
                  <span className={`status-badge ${statusClass}`} style={{ fontSize: 10, padding: '2px 8px' }}>{asset.status}</span>
                </div>
                <div className="asset-stat">
                  <span className="asset-stat-label">Voltage</span>
                  <span className="asset-stat-value">{asset.voltage}</span>
                </div>
                <div className="asset-stat">
                  <span className="asset-stat-label">Last Maintenance</span>
                  <span className="asset-stat-value">{asset.lastMaintenance}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
