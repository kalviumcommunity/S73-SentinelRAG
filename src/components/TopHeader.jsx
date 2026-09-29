import React from 'react';
import { Search, Zap, AlertTriangle, Terminal, ChevronRight, Sun, Moon, ShieldCheck, Activity } from 'lucide-react';

export default function TopHeader({ 
  activeTab, 
  metrics, 
  onSimulateAlert, 
  onOpenCopilot, 
  selectedAlertTitle,
  theme,
  toggleTheme
}) {
  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'alerts': return 'Incident Triage & Response Workspace';
      case 'runbooks': return 'Threat Intelligence Advisory Library';
      case 'mitre': return 'MITRE ATT&CK Matrix Coverage Map';
      case 'audit': return 'SLA Audit Trail & Executive Analytics';
      default: return 'Incident Command';
    }
  };

  return (
    <header style={{
      height: '64px',
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 80
    }}>
      {/* Left Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SOC Operations</span>
        <ChevronRight size={14} color="var(--text-dim)" />
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{getTabBreadcrumb()}</span>
        {selectedAlertTitle && activeTab === 'alerts' && (
          <>
            <ChevronRight size={14} color="var(--text-dim)" />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedAlertTitle}
            </span>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Theme Button */}
        <button 
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.775rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#0891b2" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Speed SLA Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '0.35rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <Zap size={15} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              MTTM Latency
            </div>
            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {metrics?.avgTimeSeconds || 38}s <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 500 }}>(SLA Passed)</span>
            </div>
          </div>
        </div>

        <button 
          className="btn-secondary" 
          onClick={onSimulateAlert}
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
        >
          <AlertTriangle size={14} color="var(--accent-amber)" />
          <span>+ Simulate Alert</span>
        </button>

        <button 
          className="btn-primary"
          onClick={onOpenCopilot}
          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
        >
          <Terminal size={15} />
          <span>AI Cyber Copilot</span>
        </button>
      </div>
    </header>
  );
}
