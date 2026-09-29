import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, Zap, Crosshair } from 'lucide-react';

export default function MitreMatrix({ mitreData, onSelectAlert }) {
  if (!mitreData) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
        Loading MITRE ATT&CK Enterprise Matrix...
      </div>
    );
  }

  const { totalTechniques, coveredTechniques, coveragePercentage, matrix } = mitreData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner KPI */}
      <div className="glass-panel" style={{ padding: '1.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Layers size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              MITRE ATT&CK Matrix Runbook Coverage Map
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time correlation between indexed SOC runbooks and active enterprise threat vectors.
          </p>
        </div>

        {/* Big Metric Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Runbook Coverage Rate
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {coveragePercentage}%
            </div>
          </div>

          <div style={{
            width: '130px',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: `${coveragePercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)',
              borderRadius: '5px'
            }} />
          </div>
        </div>
      </div>

      {/* Legend & Grid Panel */}
      <div className="glass-panel" style={{ padding: '1.35rem' }}>
        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '1.75rem',
          marginBottom: '1.35rem',
          fontSize: '0.8rem',
          background: 'rgba(11, 15, 25, 0.7)',
          padding: '0.75rem 1.1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.3)', border: '1px solid #10b981' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Covered by Runbook</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.3)', border: '1px solid #ef4444' }}></span>
            <span style={{ color: '#f87171', fontWeight: 700 }}>Active Unmitigated Alert Target</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }}></span>
            <span style={{ color: 'var(--text-dim)' }}>Coverage Gap (No Runbook)</span>
          </div>
        </div>

        {/* Matrix Grid Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${matrix.length}, 1fr)`,
          gap: '1rem',
          overflowX: 'auto'
        }}>
          {matrix.map((column) => (
            <div key={column.tactic} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '0.65rem 0.5rem',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.775rem',
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {column.tactic}
              </div>

              {column.techniques.map((tech) => {
                const isActiveAlert = tech.status === 'ACTIVE_ALERT';
                const isCovered = tech.status === 'COVERED';

                return (
                  <div 
                    key={tech.id}
                    onClick={() => {
                      if (tech.activeAlertId) {
                        onSelectAlert(tech.activeAlertId);
                      }
                    }}
                    style={{
                      background: isActiveAlert 
                        ? 'rgba(239, 68, 68, 0.16)' 
                        : isCovered 
                          ? 'rgba(16, 185, 129, 0.1)' 
                          : 'rgba(17, 24, 39, 0.4)',
                      border: isActiveAlert 
                        ? '1px solid #ef4444' 
                        : isCovered 
                          ? '1px solid #10b981' 
                          : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      cursor: tech.activeAlertId ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      boxShadow: isActiveAlert ? '0 0 16px rgba(239, 68, 68, 0.25)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isActiveAlert ? '#f87171' : isCovered ? '#6ee7b7' : 'var(--text-dim)' }}>
                        {tech.id}
                      </span>
                      {isCovered && <CheckCircle2 size={12} color="#10b981" />}
                      {isActiveAlert && <AlertTriangle size={12} color="#ef4444" />}
                    </div>

                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                      {tech.name}
                    </div>

                    {tech.runbookId && (
                      <div style={{ fontSize: '0.675rem', color: 'var(--accent-purple)', marginTop: '0.45rem', fontFamily: 'var(--font-mono)' }}>
                        Ref: {tech.runbookId}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
