import React from 'react';
import { Activity, ShieldAlert, Zap, Clock, TrendingUp, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';

export default function TelemetryWidgets({ alerts, metrics }) {
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;
  const mediumCount = alerts.filter(a => a.severity === 'MEDIUM').length;
  const total = alerts.length || 1;

  const criticalPct = Math.round((criticalCount / total) * 100);
  const highPct = Math.round((highCount / total) * 100);
  const mediumPct = Math.round((mediumCount / total) * 100);

  // 24h timeline hourly mock data points
  const timelinePoints = [
    { time: '00:00', val: 12 },
    { time: '03:00', val: 8 },
    { time: '06:00', val: 24 },
    { time: '09:00', val: 68 }, // Detection spike!
    { time: '12:00', val: 42 },
    { time: '15:00', val: 28 },
    { time: '18:00', val: 15 },
    { time: '21:00', val: 10 }
  ];

  const maxVal = 80;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Widget 1: 24h Incident Detection Timeline Chart */}
      <div className="glass-panel" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Activity size={16} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              24h SIEM Detection Telemetry Stream
            </h3>
          </div>
          <span style={{ fontSize: '0.675rem', background: 'rgba(56, 189, 248, 0.12)', color: 'var(--accent-cyan)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            4,850 EPS
          </span>
        </div>

        {/* SVG Sparkline / Bar chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '65px', padding: '0 0.5rem 0.25rem 0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          {timelinePoints.map((pt, idx) => {
            const heightPct = Math.max(10, Math.round((pt.val / maxVal) * 100));
            const isSpike = pt.val > 50;

            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div 
                  title={`${pt.time} - ${pt.val} Detection Events`}
                  style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: isSpike 
                      ? 'linear-gradient(180deg, #f85149 0%, rgba(248, 81, 73, 0.4) 100%)' 
                      : 'linear-gradient(180deg, #38bdf8 0%, rgba(56, 189, 248, 0.3) 100%)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Time Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>

      {/* Widget 2: Severity Distribution Breakdown */}
      <div className="glass-panel" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <ShieldAlert size={16} color="var(--accent-crimson)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Active Incident Severity Breakdown
            </h3>
          </div>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
            {alerts.length} Total Incidents
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div style={{
          height: '12px',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'flex',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          marginBottom: '0.85rem'
        }}>
          <div style={{ width: `${criticalPct}%`, background: 'var(--accent-crimson)', transition: 'width 0.4s ease' }} title={`Critical: ${criticalCount}`} />
          <div style={{ width: `${highPct}%`, background: 'var(--accent-amber)', transition: 'width 0.4s ease' }} title={`High: ${highCount}`} />
          <div style={{ width: `${mediumPct}%`, background: 'var(--accent-cyan)', transition: 'width 0.4s ease' }} title={`Medium: ${mediumCount}`} />
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-crimson)' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Critical:</span>
            <strong style={{ color: 'var(--accent-crimson)' }}>{criticalCount}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>High:</span>
            <strong style={{ color: 'var(--accent-amber)' }}>{highCount}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Medium:</span>
            <strong style={{ color: 'var(--accent-cyan)' }}>{mediumCount}</strong>
          </div>
        </div>
      </div>

      {/* Widget 3: SOAR Mitigation Velocity & SLA Gauge */}
      <div className="glass-panel" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Zap size={16} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              SOAR Mitigation Speed & Containment
            </h3>
          </div>
          <span className="badge badge-low" style={{ fontSize: '0.625rem' }}>SLA COMPLIANT</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Mean Latency (MTTM)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.1rem' }}>
              {metrics?.avgTimeSeconds || 38}s
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: &lt; 45 Seconds</div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Containment Rate</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.1rem' }}>
              {metrics?.containmentRate || 0}%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{metrics?.containedAlerts || 0} Incidents Secured</div>
          </div>
        </div>
      </div>
    </div>
  );
}
