import { useState, useEffect, useCallback } from 'react';
import { jitter, generateSparkline } from '../data/mockData';

// Hook for live-updating values with jitter
export function useLiveValue(initial, range = 2, interval = 3000) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue(prev => jitter(prev, range));
    }, interval);
    return () => clearInterval(timer);
  }, [range, interval]);

  return value;
}

// Hook for live sparkline data
export function useLiveSparkline(points = 12, min = 0, max = 100, interval = 4000) {
  const [data, setData] = useState(() => generateSparkline(points, min, max));

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        let newVal = last + (Math.random() - 0.48) * (max - min) * 0.08;
        newVal = Math.max(min, Math.min(max, newVal));
        next.push(Math.round(newVal * 10) / 10);
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [points, min, max, interval]);

  return data;
}

// Hook for live chart data (shifts and adds new points)
export function useLiveChart(initialGenerator, interval = 5000) {
  const [data, setData] = useState(initialGenerator);

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const next = prev.map(point => ({
          ...point,
          power: point.power + (Math.random() - 0.5) * 8,
        }));
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return data;
}

// Hook for cycling through alerts
export function useLiveAlerts(baseAlerts, interval = 15000) {
  const [alerts, setAlerts] = useState(baseAlerts);

  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts(prev => {
        const updated = prev.map(a => ({
          ...a,
          time: updateTime(a.time),
        }));
        return updated;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return alerts;
}

function updateTime(timeStr) {
  if (timeStr.includes('min')) {
    const mins = parseInt(timeStr) + 1;
    return `${mins} min ago`;
  }
  return timeStr;
}

// Hook for a clock-like timestamp
export function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}
