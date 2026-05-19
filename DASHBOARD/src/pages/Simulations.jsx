import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Play, RotateCcw, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const scenarios = [
  {
    id: 'fault',
    title: 'Transformer Fault Scenario',
    desc: 'Simulate T1 failure and observe automatic load rerouting through T2 and emergency reserves',
    icon: AlertTriangle,
  },
  {
    id: 'overload',
    title: 'Peak Load Stress Test',
    desc: 'Simulate 120% peak demand to test load shedding protocols and emergency response',
    icon: Zap,
  },
  {
    id: 'renewable',
    title: 'Renewable Integration',
    desc: 'Simulate high solar/wind variability with rapid generation changes of ±50 MW',
    icon: FlaskConical,
  },
  {
    id: 'cascade',
    title: 'Cascading Failure Analysis',
    desc: 'Simulate sequential breaker failure to test system isolation and self-healing response',
    icon: AlertTriangle,
  },
];

function generateSimData(scenario) {
  const data = [];
  for (let i = 0; i <= 60; i++) {
    const t = i;
    let load, generation, stability;
    if (scenario === 'fault') {
      load = 300 + Math.sin(t * 0.1) * 20 + (t > 20 ? -40 : 0) + (t > 35 ? 30 : 0);
      generation = 320 + Math.sin(t * 0.08) * 15 + (t > 20 ? -80 : 0) + (t > 30 ? 70 : 0);
      stability = 98 - (t > 20 && t < 35 ? (t - 20) * 2 : 0) + (t >= 35 ? (t - 35) * 1.5 : 0);
    } else if (scenario === 'overload') {
      load = 300 + t * 2 + Math.random() * 10;
      generation = 340 + t * 1.2 + Math.random() * 8;
      stability = 95 - t * 0.3 + Math.random() * 3;
    } else if (scenario === 'renewable') {
      load = 280 + Math.sin(t * 0.15) * 40 + Math.random() * 15;
      generation = 290 + Math.sin(t * 0.15) * 60 + Math.cos(t * 0.3) * 20;
      stability = 90 + Math.sin(t * 0.1) * 8;
    } else {
      load = 310 - (t > 15 ? 20 : 0) - (t > 30 ? 30 : 0) + (t > 45 ? 40 : 0);
      generation = 330 - (t > 15 ? 50 : 0) - (t > 30 ? 40 : 0) + (t > 40 ? 80 : 0);
      stability = 97 - (t > 15 ? 15 : 0) - (t > 30 ? 20 : 0) + (t > 40 ? 30 : 0);
    }
    data.push({
      time: `${t}s`,
      load: Math.max(0, Math.round(load)),
      generation: Math.max(0, Math.round(generation)),
      stability: Math.max(0, Math.min(100, Math.round(stability))),
    });
  }
  return data;
}

export default function Simulations() {
  const [activeScenario, setActiveScenario] = useState('fault');
  const [isRunning, setIsRunning] = useState(false);
  const [simData, setSimData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [simResults, setSimResults] = useState(null);

  const runSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setSimData([]);
    setSimResults(null);
    const fullData = generateSimData(activeScenario);

    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      setSimData(fullData.slice(0, idx));
      setProgress(Math.round((idx / fullData.length) * 100));
      if (idx >= fullData.length) {
        clearInterval(timer);
        setIsRunning(false);
        setSimResults({
          status: 'Complete',
          selfHealingTime: '14.2s',
          maxLoadDrop: '23%',
          recoveryRate: '97.3%',
        });
      }
    }, 80);
  };

  const resetSim = () => {
    setSimData([]);
    setProgress(0);
    setIsRunning(false);
    setSimResults(null);
  };

  return (
    <motion.div className="page-content" variants={container} initial="hidden" animate="show">
      <motion.h1 className="page-title" variants={item}>Scenario Simulations</motion.h1>
      <motion.p className="page-subtitle" variants={item}>
        Test grid resilience and self-healing under various failure scenarios
      </motion.p>

      {/* Controls */}
      <motion.div className="simulation-controls" variants={item}>
        <button
          className={`sim-btn ${isRunning ? '' : 'active'}`}
          onClick={runSimulation}
          disabled={isRunning}
          id="btn-run-sim"
        >
          <Play size={16} />
          {isRunning ? `Running... ${progress}%` : 'Run Simulation'}
        </button>
        <button className="sim-btn" onClick={resetSim} id="btn-reset-sim">
          <RotateCcw size={16} />
          Reset
        </button>
      </motion.div>

      {/* Scenario Cards */}
      <motion.div className="sim-scenario-grid" variants={item}>
        {scenarios.map(s => (
          <motion.div
            className={`sim-scenario-card ${activeScenario === s.id ? 'active' : ''}`}
            key={s.id}
            onClick={() => { if (!isRunning) { setActiveScenario(s.id); resetSim(); } }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <s.icon size={16} style={{ color: 'var(--accent-cyan)' }} />
              <div className="sim-scenario-title">{s.title}</div>
            </div>
            <div className="sim-scenario-desc">{s.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Simulation Chart */}
      {simData.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 20 }}
        >
          <div className="card-title">
            <FlaskConical size={18} className="icon" />
            Simulation Output — {scenarios.find(s => s.id === activeScenario)?.title}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={simData}>
              <defs>
                <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="stabGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} interval={9} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: '#1a2235',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="load" stroke="#f97316" fill="url(#loadGrad)" strokeWidth={2} name="Load (MW)" animationDuration={300} />
              <Area type="monotone" dataKey="generation" stroke="#22c55e" fill="url(#genGrad)" strokeWidth={2} name="Generation (MW)" animationDuration={300} />
              <Area type="monotone" dataKey="stability" stroke="#00d4ff" fill="url(#stabGrad)" strokeWidth={2} name="Stability (%)" animationDuration={300} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Results */}
      {simResults && (
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="card-title">
            <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} />
            Simulation Results
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <ResultBox label="Status" value={simResults.status} color="var(--accent-green)" />
            <ResultBox label="Self-Healing Time" value={simResults.selfHealingTime} color="var(--accent-cyan)" />
            <ResultBox label="Max Load Drop" value={simResults.maxLoadDrop} color="var(--accent-orange)" />
            <ResultBox label="Recovery Rate" value={simResults.recoveryRate} color="var(--accent-green)" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ResultBox({ label, value, color }) {
  return (
    <div style={{
      padding: 16,
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 8,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  );
}
