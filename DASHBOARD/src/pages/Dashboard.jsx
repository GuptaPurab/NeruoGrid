import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Gauge, TrendingUp, Cpu, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SparklineChart from '../components/SparklineChart';
import StatusBar from '../components/StatusBar';
import { assets, alerts as baseAlerts, generateEnergyFlow, jitter } from '../data/mockData';
import { useLiveValue } from '../hooks/useLiveData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Dashboard() {
  const activePower = useLiveValue(342, 5, 3000);
  const systemLoad = useLiveValue(78, 3, 4000);
  const efficiency = useLiveValue(94.2, 0.5, 5000);
  const [assetsOnline] = useState(47);

  const [chartData, setChartData] = useState(generateEnergyFlow);
  const [liveAlerts, setLiveAlerts] = useState(baseAlerts.slice(0, 3));

  // System status live values
  const overallHealth = useLiveValue(94, 1, 6000);
  const energyEff = useLiveValue(87, 1, 7000);
  const assetReliability = useLiveValue(76, 2, 5000);
  const gridStability = useLiveValue(92, 1, 8000);

  // Update chart data periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setChartData(prev =>
        prev.map(p => ({ ...p, power: Math.round(p.power + (Math.random() - 0.5) * 6) }))
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Cycle alert times
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveAlerts(prev =>
        prev.map(a => ({ ...a, time: incrementTime(a.time) }))
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const topAssets = assets.slice(0, 6);

  return (
    <motion.div className="page-content" variants={container} initial="hidden" animate="show">
      <motion.h1 className="page-title" variants={item}>Digital Twin Dashboard</motion.h1>
      <motion.p className="page-subtitle" variants={item}>
        Real-time monitoring and analytics for EHV 400/220 kV Substation
      </motion.p>

      {/* KPI Cards */}
      <motion.div className="kpi-grid" variants={item}>
        <KPICard
          label="Active Power"
          value={Math.round(activePower)}
          unit="MW"
          change="+2.5% from avg"
          positive
          icon={<Zap size={16} />}
          iconClass="cyan"
        />
        <KPICard
          label="System Load"
          value={Math.round(systemLoad)}
          unit="%"
          change="Within normal range"
          icon={<Gauge size={16} />}
          iconClass="cyan"
        />
        <KPICard
          label="Efficiency"
          value={efficiency.toFixed(1)}
          unit="%"
          change="+0.8% this week"
          positive
          icon={<TrendingUp size={16} />}
          iconClass="green"
        />
        <KPICard
          label="Assets Online"
          value={`${assetsOnline}/50`}
          change="3 under maintenance"
          icon={<Cpu size={16} />}
          iconClass="blue"
        />
      </motion.div>

      {/* Energy Flow + System Status */}
      <motion.div className="dashboard-grid" variants={item}>
        <div className="card">
          <div className="card-title">
            <Activity size={18} className="icon" />
            Energy Flow - 24hr Trend
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                interval={3}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                domain={['dataMin - 20', 'dataMax + 20']}
                label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a2235',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '13px',
                }}
              />
              <Area
                type="monotone"
                dataKey="power"
                stroke="#00d4ff"
                strokeWidth={2}
                fill="url(#powerGradient)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">
            <Activity size={18} className="icon" />
            System Status
          </div>
          <StatusBar label="Overall Health" value={Math.round(overallHealth)} color="green" />
          <StatusBar label="Energy Efficiency" value={Math.round(energyEff)} color="green" />
          <StatusBar label="Asset Reliability" value={Math.round(assetReliability)} color="orange" />
          <StatusBar label="Grid Stability" value={Math.round(gridStability)} color="green" />
        </div>
      </motion.div>

      {/* Asset Health Overview */}
      <motion.div variants={item}>
        <div className="card-title" style={{ marginBottom: 16 }}>
          <Cpu size={18} className="icon" />
          Asset Health Overview
        </div>
        <div className="assets-grid">
          {topAssets.map((asset) => (
            <AssetHealthCard key={asset.id} asset={asset} />
          ))}
        </div>
      </motion.div>

      {/* Alerts + Quick Actions */}
      <motion.div className="two-col" variants={item}>
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>
            <span style={{ color: 'var(--accent-cyan)' }}>⚡</span> Active Alerts
          </div>
          {liveAlerts.map((alert) => (
            <motion.div
              className="alert-item"
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="alert-left">
                <span className="alert-icon">{alert.icon}</span>
                <div>
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-meta">{alert.asset} • {alert.time}</div>
                </div>
              </div>
              <span className={`status-badge ${alert.severity.toLowerCase()}`}>
                {alert.severity}
              </span>
            </motion.div>
          ))}
        </div>

        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>Quick Actions</div>
          <div className="quick-actions">
            <button className="quick-action-btn" id="btn-diagnostics">Run System Diagnostics</button>
            <button className="quick-action-btn" id="btn-report">Generate Report</button>
            <button className="quick-action-btn" id="btn-maintenance">Schedule Maintenance</button>
            <button className="quick-action-btn" id="btn-export">Export Telemetry Data</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function KPICard({ label, value, unit, change, positive, icon, iconClass }) {
  return (
    <motion.div
      className="kpi-card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        <span className={`kpi-icon ${iconClass}`}>{icon}</span>
      </div>
      <div className="kpi-value">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      <div className="kpi-footer">
        <span className={`kpi-change ${positive ? 'positive' : 'neutral'}`}>{change}</span>
        <SparklineChart min={20} max={80} />
      </div>
    </motion.div>
  );
}

function AssetHealthCard({ asset }) {
  const health = useLiveValue(asset.health, 1, 5000);
  const temp = useLiveValue(asset.temp, 2, 4000);
  const load = useLiveValue(asset.load, 2, 6000);
  const roundedHealth = Math.round(health);
  const healthColor = roundedHealth >= 90 ? '#22c55e' : roundedHealth >= 80 ? '#eab308' : roundedHealth >= 70 ? '#f97316' : '#ef4444';
  const statusLabel = roundedHealth >= 85 ? 'optimal' : roundedHealth >= 70 ? 'warning' : 'critical';

  return (
    <motion.div
      className="asset-card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="asset-card-header">
        <div className="asset-card-info">
          <div className="asset-card-icon"><Cpu size={16} /></div>
          <div>
            <div className="asset-card-name">{asset.name.split(' ').slice(0, -1).join(' ')} {asset.id}</div>
            <div className="asset-card-id">{asset.id}</div>
          </div>
        </div>
        <span className={`status-badge ${statusLabel}`}>{statusLabel}</span>
      </div>
      <div className="asset-card-stats">
        <div className="asset-stat">
          <span className="asset-stat-label">Health</span>
          <div className="health-bar-track">
            <motion.div
              className="health-bar-fill"
              style={{ background: healthColor }}
              animate={{ width: `${roundedHealth}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <span className="asset-stat-value">{roundedHealth}%</span>
        </div>
        <div className="asset-stat">
          <span className="asset-stat-label">Temperature</span>
          <span className="asset-stat-value">{Math.round(temp)}°C</span>
        </div>
        <div className="asset-stat">
          <span className="asset-stat-label">Load</span>
          <span className="asset-stat-value">{Math.round(load)}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function incrementTime(t) {
  if (t.includes('min')) {
    const m = parseInt(t) + 1;
    return `${m} min ago`;
  }
  return t;
}
