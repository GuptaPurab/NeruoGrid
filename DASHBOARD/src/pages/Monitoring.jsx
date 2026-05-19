import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Thermometer, Radio } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useLiveValue } from '../hooks/useLiveData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function useMiniChart(baseValue, range, interval = 2000) {
  const [data, setData] = useState(() => {
    const d = [];
    let v = baseValue;
    for (let i = 0; i < 20; i++) {
      v += (Math.random() - 0.5) * range;
      d.push({ v: Math.round(v * 10) / 10 });
    }
    return d;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1].v;
        let newV = last + (Math.random() - 0.5) * range;
        next.push({ v: Math.round(newV * 10) / 10 });
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [baseValue, range, interval]);

  return data;
}

export default function Monitoring() {
  const voltage = useLiveValue(398.2, 3, 2000);
  const current = useLiveValue(845, 10, 2500);
  const temperature = useLiveValue(84, 2, 3000);
  const frequency = useLiveValue(50.02, 0.03, 2000);

  const voltageChart = useMiniChart(398, 5, 1500);
  const currentChart = useMiniChart(845, 15, 1800);
  const tempChart = useMiniChart(84, 3, 2000);
  const freqChart = useMiniChart(50, 0.05, 1600);

  const [showPowerFlow, setShowPowerFlow] = useState(true);
  const [zoom] = useState(100);

  const voltageStatus = voltage > 380 && voltage < 420 ? 'Normal' : 'Warning';
  const currentStatus = current < 900 ? 'Normal' : 'Warning';
  const tempStatus = temperature < 85 ? 'Normal' : temperature < 95 ? 'Warning' : 'Critical';
  const freqStatus = frequency > 49.9 && frequency < 50.1 ? 'Normal' : 'Warning';

  return (
    <motion.div className="page-content" variants={container} initial="hidden" animate="show">
      <motion.h1 className="page-title" variants={item}>Real-Time Monitoring</motion.h1>
      <motion.p className="page-subtitle" variants={item}>
        Live data streams from SCADA systems and IoT sensors
      </motion.p>

      {/* Live Metrics */}
      <motion.div className="monitoring-grid" variants={item}>
        <MonitorCard
          label="Voltage (Bus 1)"
          value={voltage.toFixed(1)}
          unit="kV"
          status={voltageStatus}
          icon={<Zap size={14} />}
          chartData={voltageChart}
          color="#00d4ff"
        />
        <MonitorCard
          label="Current"
          value={Math.round(current)}
          unit="A"
          status={currentStatus}
          icon={<Activity size={14} />}
          chartData={currentChart}
          color="#00d4ff"
        />
        <MonitorCard
          label="Temperature"
          value={Math.round(temperature)}
          unit="°C"
          status={tempStatus}
          icon={<Thermometer size={14} />}
          chartData={tempChart}
          color={tempStatus === 'Warning' ? '#eab308' : tempStatus === 'Critical' ? '#ef4444' : '#00d4ff'}
        />
        <MonitorCard
          label="Frequency"
          value={frequency.toFixed(2)}
          unit="Hz"
          status={freqStatus}
          icon={<Radio size={14} />}
          chartData={freqChart}
          color="#00d4ff"
        />
      </motion.div>

      {/* Substation Schematic */}
      <motion.div className="schematic-container" variants={item}>
        <div className="schematic-header">
          <div className="card-title" style={{ margin: 0 }}>
            <Activity size={18} className="icon" />
            Substation Schematic
          </div>
          <div className="schematic-controls">
            <button
              className={`schematic-btn ${showPowerFlow ? 'active' : ''}`}
              onClick={() => setShowPowerFlow(!showPowerFlow)}
            >
              <Zap size={14} />
              {showPowerFlow ? 'Hide' : 'Show'} Power Flow
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{zoom}%</span>
            <span className="operation-badge">● NORMAL OPERATION</span>
          </div>
        </div>

        <SchematicSVG showPowerFlow={showPowerFlow} />
      </motion.div>
    </motion.div>
  );
}

function MonitorCard({ label, value, unit, status, icon, chartData, color }) {
  const statusClass = status === 'Normal' ? 'operational' : status === 'Warning' ? 'warning' : 'critical';

  return (
    <motion.div
      className="monitor-card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="monitor-card-header">
        <div className="monitor-label">
          <span className="dot" style={{ background: color }} />
          {label}
        </div>
        <span className={`status-badge ${statusClass}`}>{status}</span>
      </div>
      <motion.div
        className="monitor-value"
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}<span className="unit">{unit}</span>
      </motion.div>
      <div className="mini-chart">
        <ResponsiveContainer width="100%" height={40}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function SchematicSVG({ showPowerFlow }) {
  const [flowOffset, setFlowOffset] = useState(0);

  useEffect(() => {
    if (!showPowerFlow) return;
    const timer = setInterval(() => {
      setFlowOffset(prev => (prev + 2) % 20);
    }, 80);
    return () => clearInterval(timer);
  }, [showPowerFlow]);

  const breakerColor = '#166534';
  const breakerBorder = '#22c55e';
  const lineColor = showPowerFlow ? '#00d4ff' : '#334155';

  return (
    <svg className="schematic-svg" viewBox="0 0 800 340" fill="none">
      {/* Busbar */}
      <line x1="60" y1="40" x2="740" y2="40" stroke={lineColor} strokeWidth="2" strokeDasharray="8 4"
        strokeDashoffset={showPowerFlow ? flowOffset : 0} />
      <rect x="370" y="28" width="60" height="24" rx="4" fill="#0a0e1a" stroke={lineColor} strokeWidth="1" />
      <text x="400" y="44" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontWeight="600">BUS1</text>
      <text x="400" y="70" textAnchor="middle" fill="#64748b" fontSize="10">busbar</text>

      {/* Breakers */}
      {[{ x: 160, id: 'CB1' }, { x: 400, id: 'CB2' }, { x: 640, id: 'CB3' }].map(b => (
        <g key={b.id}>
          <line x1={b.x} y1="52" x2={b.x} y2="100" stroke={lineColor} strokeWidth="1.5"
            strokeDashoffset={showPowerFlow ? flowOffset : 0}
            strokeDasharray={showPowerFlow ? '4 4' : 'none'} />
          <text x={b.x} y="95" textAnchor="middle" fill="#94a3b8" fontSize="10">A</text>
          <rect x={b.x - 30} y="106" width="60" height="50" rx="6" fill={breakerColor} stroke={breakerBorder} strokeWidth="1.5" />
          <text x={b.x} y="130" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">{b.id}</text>
          <text x={b.x} y="146" textAnchor="middle" fill="#94a3b8" fontSize="10">breaker</text>
          <circle cx={b.x} cy="168" r="4" fill="#22c55e" />
          <line x1={b.x} y1="172" x2={b.x} y2="210" stroke={lineColor} strokeWidth="1.5"
            strokeDashoffset={showPowerFlow ? flowOffset : 0}
            strokeDasharray={showPowerFlow ? '4 4' : 'none'} />
        </g>
      ))}

      {/* Transformers & CTs */}
      {/* T1 */}
      <rect x="100" y="215" width="60" height="55" rx="6" fill={breakerColor} stroke={breakerBorder} strokeWidth="1.5" />
      <text x="130" y="238" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">T1</text>
      <text x="130" y="252" textAnchor="middle" fill="#94a3b8" fontSize="10">transformer</text>
      <text x="130" y="265" textAnchor="middle" fill="#00d4ff" fontSize="10">246 MW</text>
      <circle cx="120" cy="280" r="4" fill="#22c55e" />
      <circle cx="140" cy="280" r="4" fill="#22c55e" />

      {/* CT1 */}
      <rect x="190" y="215" width="50" height="55" rx="6" fill={breakerColor} stroke={breakerBorder} strokeWidth="1.5" />
      <text x="215" y="238" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">CT1</text>
      <text x="215" y="252" textAnchor="middle" fill="#94a3b8" fontSize="10">ct</text>
      <circle cx="205" cy="280" r="4" fill="#22c55e" />
      <circle cx="225" cy="280" r="4" fill="#22c55e" />

      {/* CT2 */}
      <rect x="560" y="215" width="50" height="55" rx="6" fill={breakerColor} stroke={breakerBorder} strokeWidth="1.5" />
      <text x="585" y="238" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">CT2</text>
      <text x="585" y="252" textAnchor="middle" fill="#94a3b8" fontSize="10">ct</text>
      <circle cx="575" cy="280" r="4" fill="#22c55e" />
      <circle cx="595" cy="280" r="4" fill="#22c55e" />

      {/* T2 */}
      <rect x="640" y="215" width="60" height="55" rx="6" fill={breakerColor} stroke={breakerBorder} strokeWidth="1.5" />
      <text x="670" y="238" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="600">T2</text>
      <text x="670" y="252" textAnchor="middle" fill="#94a3b8" fontSize="10">transformer</text>
      <text x="670" y="265" textAnchor="middle" fill="#00d4ff" fontSize="10">218 MW</text>
      <circle cx="660" cy="280" r="4" fill="#22c55e" />
      <circle cx="680" cy="280" r="4" fill="#22c55e" />

      {/* Connection lines from breakers to equipment */}
      <line x1="160" y1="210" x2="130" y2="215" stroke={lineColor} strokeWidth="1" />
      <line x1="160" y1="210" x2="215" y2="215" stroke={lineColor} strokeWidth="1" />
      <line x1="640" y1="210" x2="585" y2="215" stroke={lineColor} strokeWidth="1" />
      <line x1="640" y1="210" x2="670" y2="215" stroke={lineColor} strokeWidth="1" />

      {/* Bottom bus */}
      <line x1="100" y1="300" x2="270" y2="300" stroke={lineColor} strokeWidth="1.5" strokeDasharray="6 3"
        strokeDashoffset={showPowerFlow ? flowOffset : 0} />
      <line x1="530" y1="300" x2="720" y2="300" stroke={lineColor} strokeWidth="1.5" strokeDasharray="6 3"
        strokeDashoffset={showPowerFlow ? flowOffset : 0} />
    </svg>
  );
}
