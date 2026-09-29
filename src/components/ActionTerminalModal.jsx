import React from 'react';
import { Terminal, X, CheckCircle2, ShieldCheck, Copy, ArrowRight } from 'lucide-react';

export default function ActionTerminalModal({ log, onClose }) {
  if (!log) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 220,
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '820px',
        width: '100%',
        background: '#070a11',
        border: '1px solid var(--accent-cyan)',
        boxShadow: '0 0 50px rgba(6, 182, 212, 0.25)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Window Control Header */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.95)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <Terminal size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                SOAR Execution Terminal • Log ID: {log.id}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Terminal Area */}
        <div style={{ padding: '1.25rem' }}>
          <div className="terminal-window" style={{ minHeight: '280px', maxHeight: '420px', overflowY: 'auto' }}>
            <div className="terminal-header">
              <span>Executing Officer: <strong>{log.actionBy}</strong></span>
              <span>Execution Latency: <strong style={{ color: 'var(--accent-cyan)' }}>{log.executionTimeMs}ms</strong></span>
            </div>

            <div style={{ color: 'var(--text-muted)', marginBottom: '0.4rem', fontSize: '0.775rem' }}>
              Target Alert: <strong style={{ color: '#fff' }}>{log.alertId}</strong> ({log.alertTitle})
            </div>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.85rem', fontSize: '0.775rem' }}>
              Automation Step: <strong>{log.stepTitle}</strong>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              padding: '0.75rem 0.9rem',
              borderRadius: '6px',
              borderLeft: '3px solid var(--accent-blue)',
              marginBottom: '1rem',
              color: '#38bdf8'
            }}>
              $ {log.commandExecuted}
            </div>

            <div style={{ whiteSpace: 'pre-wrap', color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              {log.output}
            </div>
          </div>

          {/* Footer Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.825rem' }}>
              <CheckCircle2 size={16} />
              <span>Mitigation Step Executed & SIEM Audit Trail Updated</span>
            </div>

            <button className="btn-primary" onClick={onClose}>
              Done & Return to Triage Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
