import React from 'react';
import { 
  Shield, Activity, FileText, Layers, Clock, Terminal, 
  Sun, Moon, UserCheck, Zap, Database, Sliders 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  metrics, 
  onOpenCopilot, 
  theme, 
  toggleTheme 
}) {
  return (
    <aside className="sidebar-container">
      {/* Top Brand Banner */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              padding: '0.55rem',
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
                <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  AEGIS<span style={{ color: 'var(--accent-cyan)' }}>OPS</span>
                </h1>
                <span className="badge badge-low" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                  PRO
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Threat Intel Acceleration
              </p>
            </div>
          </div>

          <button 
            onClick={toggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#06b6d4" />}
          </button>
        </div>

        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '6px',
          padding: '0.35rem 0.65rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.725rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="pulse-dot red"></span>
            <span style={{ color: '#f87171', fontWeight: 800 }}>DEFCON 3 • ELEVATED</span>
          </div>
          <span style={{ color: '#cbd5e1', fontSize: '0.65rem', fontWeight: 600 }}>SOC L2</span>
        </div>
      </div>

      {/* Nav Menu */}
      <div style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, paddingLeft: '0.5rem', marginBottom: '0.25rem', letterSpacing: '0.04em' }}>
          Incident Operations
        </div>

        <button 
          className={`sidebar-link ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <Activity size={17} color={activeTab === 'alerts' ? 'var(--accent-cyan)' : '#94a3b8'} />
          <span>Incident Triage</span>
          {metrics?.unmitigatedAlerts > 0 && (
            <span style={{
              marginLeft: 'auto',
              background: 'var(--accent-crimson)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.05rem 0.45rem',
              borderRadius: '10px'
            }}>
              {metrics.unmitigatedAlerts}
            </span>
          )}
        </button>

        <button 
          className={`sidebar-link ${activeTab === 'runbooks' ? 'active' : ''}`}
          onClick={() => setActiveTab('runbooks')}
        >
          <FileText size={17} color={activeTab === 'runbooks' ? 'var(--accent-purple)' : '#94a3b8'} />
          <span>Threat Intel Library</span>
        </button>

        <button 
          className={`sidebar-link ${activeTab === 'rag' ? 'active' : ''}`}
          onClick={() => setActiveTab('rag')}
        >
          <Database size={17} color={activeTab === 'rag' ? 'var(--accent-cyan)' : '#94a3b8'} />
          <span>RAG Pipeline Studio</span>
        </button>

        <button 
          className={`sidebar-link ${activeTab === 'mitre' ? 'active' : ''}`}
          onClick={() => setActiveTab('mitre')}
        >
          <Layers size={17} color={activeTab === 'mitre' ? 'var(--accent-cyan)' : '#94a3b8'} />
          <span>MITRE ATT&CK Matrix</span>
        </button>

        <button 
          className={`sidebar-link ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <Clock size={17} color={activeTab === 'audit' ? 'var(--accent-emerald)' : '#94a3b8'} />
          <span>SLA & Audit Log</span>
        </button>

        <div style={{ marginTop: '1.25rem', fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, paddingLeft: '0.5rem', marginBottom: '0.25rem', letterSpacing: '0.04em' }}>
          Intelligence Assistance
        </div>

        <button 
          className="sidebar-link"
          onClick={() => onOpenCopilot()}
          style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)' }}
        >
          <Terminal size={17} color="var(--accent-cyan)" />
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>AI Cyber Copilot</span>
        </button>
      </div>

      {/* Bottom Analyst Card */}
      <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.8rem'
          }}>
            NS
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              N. Sharma
            </div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
              SOC Lead (L2 Incident Response)
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
