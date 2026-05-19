import { motion } from 'framer-motion';
import { useLiveSparkline } from '../hooks/useLiveData';

export default function SparklineChart({ min = 0, max = 100, color = 'var(--accent-cyan)' }) {
  const data = useLiveSparkline(12, min, max, 3000);
  const maxVal = Math.max(...data);

  return (
    <div className="sparkline-container">
      {data.map((val, i) => (
        <motion.div
          key={i}
          className="sparkline-bar"
          style={{ background: color }}
          initial={false}
          animate={{ height: `${Math.max(4, (val / maxVal) * 24)}px` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
