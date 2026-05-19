import { motion } from 'framer-motion';
import { FileText, Download, Calendar, BarChart2, Shield, Zap } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const reports = [
  { id: 1, name: 'Monthly Asset Health Summary', date: '2024-03-01', type: 'Health', icon: BarChart2 },
  { id: 2, name: 'Q1 Predictive Maintenance Report', date: '2024-03-15', type: 'Maintenance', icon: Zap },
  { id: 3, name: 'Annual Grid Performance Analysis', date: '2024-02-28', type: 'Performance', icon: BarChart2 },
  { id: 4, name: 'Security Compliance Audit', date: '2024-03-10', type: 'Security', icon: Shield },
  { id: 5, name: 'Renewable Integration Impact Study', date: '2024-03-05', type: 'Analysis', icon: Zap },
  { id: 6, name: 'Transformer Oil Analysis Report', date: '2024-02-20', type: 'Health', icon: FileText },
  { id: 7, name: 'Load Forecasting Accuracy Review', date: '2024-03-12', type: 'Analytics', icon: BarChart2 },
  { id: 8, name: 'Incident Response Protocol Summary', date: '2024-01-30', type: 'Operations', icon: Shield },
];

export default function Reports() {
  return (
    <motion.div className="page-content" variants={container} initial="hidden" animate="show">
      <motion.h1 className="page-title" variants={item}>Reports</motion.h1>
      <motion.p className="page-subtitle" variants={item}>
        Generated reports, analytics summaries, and compliance documentation
      </motion.p>

      <motion.div style={{ display: 'flex', gap: 12, marginBottom: 24 }} variants={item}>
        <button className="sim-btn active" id="btn-generate-report">
          <FileText size={16} />
          Generate New Report
        </button>
        <button className="sim-btn" id="btn-schedule-report">
          <Calendar size={16} />
          Schedule Report
        </button>
      </motion.div>

      <motion.div className="reports-list" variants={container} initial="hidden" animate="show">
        {reports.map(report => (
          <motion.div
            className="report-item"
            key={report.id}
            variants={item}
            whileHover={{ scale: 1.01, x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="report-info">
              <div className="report-icon">
                <report.icon size={18} />
              </div>
              <div>
                <div className="report-name">{report.name}</div>
                <div className="report-date">{report.type} • {report.date}</div>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} />
              Download
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
