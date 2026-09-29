import React from 'react';
import { Clock, Download, FileText, CheckCircle2, AlertTriangle, Zap, Server } from 'lucide-react';

export default function AuditLogView({ metrics, auditLogs, onExportReport }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.1rem' }}>
        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Mean Time To Mitigate (MTTM)
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
            {metrics?.avgTimeSeconds || 38} Sec
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--accent-emerald)', marginTop: '0.2rem', fontWeight: 600 }}>
            ✓ Passed Target SLA (&lt; 45s)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Threat Containment Rate
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
            {metrics?.containmentRate || 0}%
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {metrics?.containedAlerts} of {metrics?.totalAlerts} Incidents Contained
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid var(--accent-crimson)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Active Unmitigated Threats
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-crimson)', marginTop: '0.2rem' }}>
            {metrics?.unmitigatedAlerts || 0}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Requires Rapid Analyst Triage
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Indexed Threat Runbooks
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '0.2rem' }}>
            {metrics?.totalRunbooks || 5}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            CISA & Vendor Advisory Sync
          </div>
        </div>
      </div>

      {/* Main Audit Trail Panel */}
      <div className="glass-panel" style={{ padding: '1.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.01em' }}>
              <Clock size={20} color="var(--accent-cyan)" />
              <span>SOC Incident Containment Audit Trail</span>
            </h2>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Chronological log of analyst automation triggers, command latency, and execution outcomes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={() => onExportReport('json')} style={{ fontSize: '0.8rem' }}>
              <Download size={14} />
              <span>Export JSON Log</span>
            </button>
            <button className="btn-primary" onClick={() => onExportReport('markdown')} style={{ fontSize: '0.8rem' }}>
              <FileText size={14} />
              <span>Export CISO Incident Report</span>
            </button>
          </div>
        </div>

        {/* Audit Log Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {auditLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              No mitigation actions recorded yet. Trigger a mitigation step from the Active Alerts view to start recording audit logs.
            </div>
          ) : (
            auditLogs.map((log) => (
              <div 
                key={log.id}
                style={{
                  background: 'rgba(11, 15, 25, 0.7)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      SUCCESS
                    </span>
                    <strong style={{ fontSize: '0.925rem', color: '#fff' }}>{log.stepTitle}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      ({log.alertId})
                    </span>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1.75rem' }}>
                  <span>Analyst: <strong style={{ color: '#fff' }}>{log.actionBy}</strong></span>
                  <span>Execution Latency: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{log.executionTimeMs} ms</strong></span>
                </div>

                <div style={{
                  background: '#060911',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.775rem',
                  color: '#38bdf8',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap'
                }}>
                  $ {log.commandExecuted}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
