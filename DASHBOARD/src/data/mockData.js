// Mock data generators for NeuroGrid Dashboard

export const assets = [
  { id: 'T1', name: 'Power Transformer T1', type: 'Transformer', status: 'Operational', voltage: '400/220 kV', lastMaintenance: '2024-03-15', health: 94, temp: 82, load: 78 },
  { id: 'T2', name: 'Power Transformer T2', type: 'Transformer', status: 'Operational', voltage: '400/220 kV', lastMaintenance: '2024-03-10', health: 91, temp: 79, load: 72 },
  { id: 'R1', name: 'Shunt Reactor R1', type: 'Reactor', status: 'Warning', voltage: '400 kV', lastMaintenance: '2024-04-01', health: 76, temp: 88, load: 85 },
  { id: 'R2', name: 'Shunt Reactor R2', type: 'Reactor', status: 'Operational', voltage: '400 kV', lastMaintenance: '2024-03-20', health: 82, temp: 75, load: 68 },
  { id: 'CB1', name: 'Circuit Breaker CB1', type: 'Breaker', status: 'Operational', voltage: '400 kV', lastMaintenance: '2024-02-20', health: 88, temp: 45, load: 60 },
  { id: 'CB2', name: 'Circuit Breaker CB2', type: 'Breaker', status: 'Operational', voltage: '220 kV', lastMaintenance: '2024-02-22', health: 92, temp: 43, load: 65 },
  { id: 'CB3', name: 'Circuit Breaker CB3', type: 'Breaker', status: 'Maintenance', voltage: '400 kV', lastMaintenance: '2024-01-30', health: 68, temp: 50, load: 55 },
  { id: 'CT1', name: 'Current Transformer CT1', type: 'CT', status: 'Operational', voltage: '400 kV', lastMaintenance: '2024-01-15', health: 96, temp: 38, load: 55 },
  { id: 'CT2', name: 'Current Transformer CT2', type: 'CT', status: 'Operational', voltage: '220 kV', lastMaintenance: '2024-02-10', health: 94, temp: 40, load: 58 },
];

export const alerts = [
  { id: 1, title: 'Temperature threshold exceeded', asset: 'Transformer T1', time: '2 min ago', severity: 'Critical', icon: '🔴' },
  { id: 2, title: 'Oil level below optimal', asset: 'Reactor R2', time: '15 min ago', severity: 'Warning', icon: '⚠️' },
  { id: 3, title: 'Scheduled maintenance due', asset: 'Breaker CB3', time: '1 hour ago', severity: 'Info', icon: '🔵' },
  { id: 4, title: 'Unusual vibration pattern', asset: 'Transformer T2', time: '30 min ago', severity: 'Warning', icon: '⚠️' },
  { id: 5, title: 'Load spike detected', asset: 'Feeder F4', time: '1h ago', severity: 'Warning', icon: '⚠️' },
];

export const notifications = [
  { id: 1, title: 'High Temperature Alert', desc: 'Transformer T1 temperature exceeds safety threshold (95°C)', asset: 'T1', time: '7m ago', severity: 'Critical' },
  { id: 2, title: 'Oil Level Low', desc: 'Reactor R2 oil level at 65% - maintenance recommended', asset: 'R2', time: '20m ago', severity: 'Warning' },
  { id: 3, title: 'Maintenance Scheduled', desc: 'Circuit Breaker CB3 maintenance scheduled for tomorrow', asset: 'CB3', time: '1h ago', severity: 'Info' },
  { id: 4, title: 'Load Spike Detected', desc: 'Unusual load pattern detected on Feeder F4', asset: 'F4', time: '1h ago', severity: 'Warning' },
];

export const anomalies = [
  { id: 1, title: 'Unusual Current Pattern', asset: 'Transformer T1 - Phase B', desc: 'Current fluctuation pattern deviates from historical norm by 23%', status: 'Detected', severity: 'Warning' },
  { id: 2, title: 'Harmonic Distortion Spike', asset: 'Bus Section 2', desc: 'THD levels increased to 8.2%, exceeding 5% threshold', status: 'Investigating', severity: 'Warning' },
  { id: 3, title: 'Partial Discharge Activity', asset: 'Transformer T2 - Bushing H1', desc: 'PD magnitude increased by 15 pC over baseline readings', status: 'Monitoring', severity: 'Info' },
];

export const maintenancePredictions = [
  { id: 1, asset: 'Transformer T1', component: 'Cooling Fan Assembly', predictedFailure: '14 days', confidence: 87, recommendation: 'Schedule inspection within 7 days' },
  { id: 2, asset: 'Reactor R1', component: 'Oil Filtration System', predictedFailure: '21 days', confidence: 79, recommendation: 'Order replacement filters, schedule maintenance' },
  { id: 3, asset: 'Breaker CB3', component: 'Operating Mechanism', predictedFailure: '30 days', confidence: 72, recommendation: 'Include in next planned outage' },
];

// Generate sparkline data
export function generateSparkline(points = 12, min = 0, max = 100) {
  const data = [];
  let value = min + Math.random() * (max - min) * 0.5;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * (max - min) * 0.1;
    value = Math.max(min, Math.min(max, value));
    data.push(Math.round(value * 10) / 10);
  }
  return data;
}

// Generate 24-hour energy flow data
export function generateEnergyFlow() {
  const data = [];
  const baseValues = [180, 165, 155, 148, 145, 150, 175, 220, 280, 310, 330, 340, 342, 338, 325, 310, 295, 300, 320, 345, 350, 330, 280, 220];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';
    const value = baseValues[i] + (Math.random() - 0.5) * 20;
    data.push({ time: hour, power: Math.round(value) });
  }
  return data;
}

// Live data updater - adds small jitter to values
export function jitter(value, range = 2) {
  return Math.round((value + (Math.random() - 0.5) * range) * 10) / 10;
}

// Substation schematic data
export const schematicNodes = [
  { id: 'BUS1', type: 'busbar', label: 'BUS1', x: 50, y: 8 },
  { id: 'CB1', type: 'breaker', label: 'CB1', x: 20, y: 30, status: 'closed' },
  { id: 'CB2', type: 'breaker', label: 'CB2', x: 50, y: 30, status: 'closed' },
  { id: 'CB3', type: 'breaker', label: 'CB3', x: 80, y: 30, status: 'closed' },
  { id: 'T1', type: 'transformer', label: 'T1', power: '246 MW', x: 15, y: 55 },
  { id: 'CT1', type: 'ct', label: 'CT1', x: 30, y: 55 },
  { id: 'CT2', type: 'ct', label: 'CT2', x: 70, y: 55 },
  { id: 'T2', type: 'transformer', label: 'T2', power: '218 MW', x: 85, y: 55 },
];
