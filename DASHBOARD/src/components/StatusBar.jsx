import { motion } from 'framer-motion';

export default function StatusBar({ label, value, color = 'green' }) {
  return (
    <div className="status-item">
      <span className="status-label">{label}</span>
      <div className="status-bar-track">
        <motion.div
          className={`status-bar-fill ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <span className="status-value">{value}%</span>
    </div>
  );
}
