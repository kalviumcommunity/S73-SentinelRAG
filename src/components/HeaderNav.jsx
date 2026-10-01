import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Search, BookOpen, Upload, Activity, Command, ShieldAlert, Cpu } from 'lucide-react';

/**
 * HeaderNav Component
 * Top navigation bar providing view switching, command palette triggers (Cmd+K),
 * logo branding, and user profile status display.
 */
export default function HeaderNav() {
  const { currentView, setCurrentView, setIsCommandPaletteOpen } = useApp();

  const navItems = [
    { id: 'triage', label: 'Alert Triage', icon: ShieldAlert },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'activity', label: 'Activity Log', icon: Activity }
  ];

  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        {/* Logo */}
        <div className="logo-brand" onClick={() => setCurrentView('triage')}>
          <div className="logo-icon-glow">
            <Shield size={22} className="text-cyan-400" />
          </div>
          <div className="logo-text">
            <span className="brand-name">AEGIS<span className="brand-accent">INTEL</span></span>
            <span className="brand-subtitle">Threat Retrieval Assistant</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="header-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (currentView === 'doc-viewer' && item.id === 'knowledge') || (currentView === 'runbook-run' && item.id === 'triage');
            return (
              <button
                key={item.id}
                className={`nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions & User Profile */}
        <div className="header-actions">
          {/* Command Palette Trigger */}
          <button
            className="cmd-palette-trigger-btn"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Open Command Palette (Cmd+K)"
          >
            <Search size={14} className="text-cyan-400" />
            <span className="cmd-text">Quick Search...</span>
            <span className="cmd-badge">
              <Command size={10} /> K
            </span>
          </button>

          {/* User Profile Avatar */}
          <div className="user-profile-badge">
            <div className="user-avatar">
              <span>NS</span>
              <span className="status-indicator-dot"></span>
            </div>
            <div className="user-info hide-mobile">
              <span className="user-name">N. Sharma</span>
              <span className="user-role">SOC L2 Analyst</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
