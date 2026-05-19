import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Settings() {
  const [toggles, setToggles] = useState({
    realTimeAlerts: true,
    autoRerouting: true,
    predictiveMaint: true,
    emailNotifications: false,
    darkMode: true,
    soundAlerts: false,
    dataLogging: true,
    twoFactor: true,
  });

  const toggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div className="page-content" variants={container} initial="hidden" animate="show">
      <motion.h1 className="page-title" variants={item}>Settings</motion.h1>
      <motion.p className="page-subtitle" variants={item}>
        Configure system preferences, alerts, and integrations
      </motion.p>

      <motion.div className="settings-section" variants={item}>
        <h3>🔔 Alert Configuration</h3>
        <SettingRow label="Real-time alert notifications" active={toggles.realTimeAlerts} onToggle={() => toggle('realTimeAlerts')} />
        <SettingRow label="Sound alerts for critical events" active={toggles.soundAlerts} onToggle={() => toggle('soundAlerts')} />
        <SettingRow label="Email notifications" active={toggles.emailNotifications} onToggle={() => toggle('emailNotifications')} />
      </motion.div>

      <motion.div className="settings-section" variants={item}>
        <h3>🤖 AI & Automation</h3>
        <SettingRow label="Automatic power rerouting on fault" active={toggles.autoRerouting} onToggle={() => toggle('autoRerouting')} />
        <SettingRow label="Predictive maintenance scheduling" active={toggles.predictiveMaint} onToggle={() => toggle('predictiveMaint')} />
        <SettingRow label="Continuous data logging" active={toggles.dataLogging} onToggle={() => toggle('dataLogging')} />
      </motion.div>

      <motion.div className="settings-section" variants={item}>
        <h3>🔒 Security</h3>
        <SettingRow label="Two-factor authentication" active={toggles.twoFactor} onToggle={() => toggle('twoFactor')} />
        <SettingRow label="Dark mode" active={toggles.darkMode} onToggle={() => toggle('darkMode')} />
      </motion.div>

      <motion.div className="settings-section" variants={item}>
        <h3>📡 Data Sources</h3>
        <div className="setting-row">
          <span className="setting-label">SCADA Connection</span>
          <span className="status-badge operational">Connected</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">IoT Gateway</span>
          <span className="status-badge operational">Connected</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Weather API</span>
          <span className="status-badge operational">Connected</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">ML Model Endpoint</span>
          <span className="status-badge operational">Active</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SettingRow({ label, active, onToggle }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <motion.button
        className={`toggle ${active ? 'active' : ''}`}
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
      />
    </div>
  );
}
