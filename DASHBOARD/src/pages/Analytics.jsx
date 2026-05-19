import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, ShieldCheck, AlertTriangle, Wrench, TrendingUp } from 'lucide-react';
import { anomalies, maintenancePredictions } from '../data/mockData';
import { useLiveValue } from '../hooks/useLiveData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('anomaly');
  const accuracy = useLiveValue(94.7, 0.3, 8000);
  const predictions = useLiveValue(1247, 2, 10000);
  const prevented = useLiveValue(23, 0.5, 12000);

  return (
    <motion.div className="page-content" variants={container} initial="hidden" animate="show">
      <motion.h1 className="page-title" variants={item}>AI/ML Analytics</motion.h1>
      <motion.p className="page-subtitle" variants={item}>
        Predictive maintenance and intelligent insights powered by machine learning
      </motion.p>

      {/* KPI Row */}
      <motion.div className="analytics-kpi-grid" variants={item}>
        <motion.div className="analytics-kpi" whileHover={{ scale: 1.02 }}>
          <div className="analytics-kpi-icon">
            <Brain size={16} style={{ color: 'var(--accent-cyan)' }} />
            Model Accuracy
          </div>
          <div className="analytics-kpi-value">{accuracy.toFixed(1)}%</div>
          <div className="analytics-kpi-desc">Validated on 10K+ data points</div>
        </motion.div>

        <motion.div className="analytics-kpi" whileHover={{ scale: 1.02 }}>
          <div className="analytics-kpi-icon">
            <Target size={16} style={{ color: 'var(--accent-cyan)' }} />
            Predictions Made
          </div>
          <div className="analytics-kpi-value">{Math.round(predictions).toLocaleString()}</div>
          <div className="analytics-kpi-desc">Last 30 days</div>
        </motion.div>

        <motion.div className="analytics-kpi" whileHover={{ scale: 1.02 }}>
          <div className="analytics-kpi-icon">
            <ShieldCheck size={16} style={{ color: 'var(--accent-cyan)' }} />
            Prevented Failures
          </div>
          <div className="analytics-kpi-value">{Math.round(prevented)}</div>
          <div className="analytics-kpi-desc">This quarter</div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div className="tabs" variants={item}>
        <button
          className={`tab-btn ${activeTab === 'anomaly' ? 'active' : ''}`}
          onClick={() => setActiveTab('anomaly')}
          id="tab-anomaly"
        >
          Anomaly Detection
        </button>
        <button
          className={`tab-btn ${activeTab === 'predictive' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictive')}
          id="tab-predictive"
        >
          Predictive Maintenance
        </button>
        <button
          className={`tab-btn ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
          id="tab-optimization"
        >
          Optimization
        </button>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'anomaly' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-title" style={{ marginBottom: 16 }}>
            <AlertTriangle size={18} style={{ color: 'var(--accent-yellow)' }} />
            Real-time Anomaly Detection
          </div>
          {anomalies.map(a => (
            <motion.div
              className="anomaly-card"
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: a.id * 0.1 }}
            >
              <div className="anomaly-header">
                <div className="anomaly-title">{a.title}</div>
                <span className={`status-badge ${a.status === 'Detected' ? 'warning' : a.status === 'Investigating' ? 'critical' : 'info'}`}>
                  {a.status}
                </span>
              </div>
              <div className="anomaly-asset">{a.asset}</div>
              <div className="anomaly-desc">{a.desc}</div>
              <div className="anomaly-actions">
                <button className="btn btn-primary">Investigate</button>
                <button className="btn btn-ghost">Dismiss</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'predictive' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-title" style={{ marginBottom: 16 }}>
            <Wrench size={18} style={{ color: 'var(--accent-orange)' }} />
            Predictive Maintenance Forecast
          </div>
          {maintenancePredictions.map(p => (
            <motion.div
              className="prediction-card"
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: p.id * 0.1 }}
            >
              <div className="prediction-header">
                <div className="prediction-asset">{p.asset}</div>
                <span className="prediction-time">⏱ {p.predictedFailure}</span>
              </div>
              <div className="prediction-component">Component: {p.component}</div>
              <div className="confidence-bar">
                <div className="confidence-label">
                  <span>Confidence</span>
                  <span>{p.confidence}%</span>
                </div>
                <div className="confidence-track">
                  <motion.div
                    className="confidence-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.confidence}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
              <div className="prediction-recommendation">
                💡 {p.recommendation}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'optimization' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-title" style={{ marginBottom: 16 }}>
            <TrendingUp size={18} style={{ color: 'var(--accent-green)' }} />
            Optimization Recommendations
          </div>
          {[
            { title: 'Load Balancing Opportunity', desc: 'Redistribute 15 MW from Feeder F2 to F4 to reduce congestion by 12%', impact: 'High', savings: '~₹2.4L/month' },
            { title: 'Reactive Power Compensation', desc: 'Adjust Reactor R1 tap position to improve power factor from 0.92 to 0.97', impact: 'Medium', savings: '~₹1.1L/month' },
            { title: 'Transformer Loading Optimization', desc: 'Shift 8% load from T1 to T2 to equalize aging and extend lifecycle', impact: 'Medium', savings: 'Extended asset life' },
          ].map((opt, i) => (
            <motion.div
              className="anomaly-card"
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className="anomaly-header">
                <div className="anomaly-title">{opt.title}</div>
                <span className={`status-badge ${opt.impact === 'High' ? 'warning' : 'info'}`}>
                  {opt.impact} Impact
                </span>
              </div>
              <div className="anomaly-desc">{opt.desc}</div>
              <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 600, marginBottom: 10 }}>
                Estimated savings: {opt.savings}
              </div>
              <div className="anomaly-actions">
                <button className="btn btn-primary">Apply</button>
                <button className="btn btn-ghost">Simulate First</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
