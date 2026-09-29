import React, { useState } from 'react';
import { 
  Shield, Activity, FileText, Terminal, AlertTriangle, 
  Sun, Moon, Zap, UserCheck, Menu, X, Layers, Clock
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  metrics, 
  onSimulateAlert, 
  onOpenCopilot,
  theme, 
  toggleTheme 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)'
    }}>
      {/* Live Operational Ticker */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.14) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(168, 85, 247, 0.14) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0.35rem 1.25rem',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pulse-dot red"></span>
          <strong style={{ color: '#ef4444', letterSpacing: '0.04em' }}>LIVE SOC THREAT FEED:</strong>
          <span style={{ color: 'var(--text-secondary)' }}>
            LockBit 3.0 Ransomware attempt on FIN-SRV-04 • RAG Intel Engine: <strong style={{ color: 'var(--accent-emerald)' }}>SYNCED</strong>
          </span>
        </div>

        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.725rem' }}>
          <span><strong>MTTM Target SLA:</strong> &lt; 45 Seconds</span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>v2.4.0 Enterprise</span>
        </div>
      </div>

      {/* Main Header Navbar */}
      <div style={{
        maxWidth: '1680px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            padding: '0.5rem',
            borderRadius: '10px',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={22} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                AEGIS<span style={{ color: 'var(--accent-cyan)' }}>OPS</span>
              </h1>
              <span className="badge badge-low" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem' }}>
                RAPID MITIGATION
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Threat Intel & Incident Runbook Acceleration Hub
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="nav-desktop" style={{ 
          display: 'flex', 
          gap: '0.35rem', 
          background: 'var(--bg-surface)', 
          padding: '0.25rem', 
          borderRadius: '10px', 
          border: '1px solid var(--border-color)' 
        }}>
          <button 
            className={`nav-tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <Activity size={15} />
            <span>Active Triage & Response</span>
            {metrics?.unmitigatedAlerts > 0 && (
              <span style={{
                background: 'var(--accent-crimson)',
                color: '#fff',
                padding: '0.05rem 0.45rem',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {metrics.unmitigatedAlerts}
              </span>
            )}
          </button>

          <button 
            className={`nav-tab ${activeTab === 'runbooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('runbooks')}
          >
            <FileText size={15} />
            <span>Threat Intel & Runbooks</span>
          </button>

          <button 
            className={`nav-tab ${activeTab === 'mitre' ? 'active' : ''}`}
            onClick={() => setActiveTab('mitre')}
          >
            <Layers size={15} />
            <span>MITRE ATT&CK Matrix</span>
          </button>

          <button 
            className={`nav-tab ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <Clock size={15} />
            <span>Audit Trail & SLA</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Theme Button */}
          <button 
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.45rem 0.7rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              fontWeight: 600
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#06b6d4" />}
            <span className="hide-on-mobile">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <button 
            className="btn-secondary hide-on-mobile" 
            onClick={onSimulateAlert}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            <AlertTriangle size={14} color="var(--accent-amber)" />
            <span>+ Simulate Alert</span>
          </button>

          <button 
            className="btn-primary"
            onClick={onOpenCopilot}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
          >
            <Terminal size={15} />
            <span className="hide-on-mobile">AI Copilot</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <button 
            className={`sidebar-link ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('alerts'); setMobileMenuOpen(false); }}
          >
            <Activity size={16} />
            <span>Active Triage & Response</span>
          </button>

          <button 
            className={`sidebar-link ${activeTab === 'runbooks' ? 'active' : ''}`}
            onClick={() => { setActiveTab('runbooks'); setMobileMenuOpen(false); }}
          >
            <FileText size={16} />
            <span>Threat Intel & Runbooks</span>
          </button>

          <button 
            className={`sidebar-link ${activeTab === 'mitre' ? 'active' : ''}`}
            onClick={() => { setActiveTab('mitre'); setMobileMenuOpen(false); }}
          >
            <Layers size={16} />
            <span>MITRE ATT&CK Matrix</span>
          </button>

          <button 
            className={`sidebar-link ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => { setActiveTab('audit'); setMobileMenuOpen(false); }}
          >
            <Clock size={16} />
            <span>Audit Trail & SLA</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => { onSimulateAlert(); setMobileMenuOpen(false); }}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            <AlertTriangle size={14} color="var(--accent-amber)" />
            <span>+ Simulate SIEM Alert</span>
          </button>
        </div>
      )}
    </header>
  );
}
