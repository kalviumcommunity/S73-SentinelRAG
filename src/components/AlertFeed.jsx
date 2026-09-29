import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, Server, Filter, X } from 'lucide-react';

export default function AlertFeed({ 
  alerts, 
  selectedAlertId, 
  onSelectAlert, 
  searchQuery, 
  setSearchQuery,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter
}) {
  const [platformFilter, setPlatformFilter] = useState('ALL');

  const filteredAlerts = alerts.filter(alert => {
    if (platformFilter === 'Windows' && !alert.host.toLowerCase().includes('srv') && !alert.host.toLowerCase().includes('fin') && !alert.host.toLowerCase().includes('build')) return false;
    if (platformFilter === 'Linux' && !alert.host.toLowerCase().includes('payment') && !alert.host.toLowerCase().includes('gw')) return false;
    if (platformFilter === 'Cloud AWS' && !alert.host.toLowerCase().includes('aws')) return false;
    if (platformFilter === 'Network Appliance' && !alert.host.toLowerCase().includes('vpn')) return false;
    return true;
  });

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 240px)', minHeight: '580px' }}>
      {/* Header Bar */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <ShieldAlert size={17} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '0.925rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Active Incident Queue & SIEM Telemetry
            </h2>
          </div>
          <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
            {filteredAlerts.length} Events
          </span>
        </div>

        {/* Search Bar with Clear Button */}
        <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-cyber"
            placeholder="Filter Host, IP, CVE ID, or Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.2rem', paddingRight: searchQuery ? '2rem' : '1rem', fontSize: '0.825rem' }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Severity & Status Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <select 
            className="input-cyber" 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>

          <select 
            className="input-cyber" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="UNMITIGATED">Unmitigated</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CONTAINED">Contained</option>
          </select>
        </div>

        {/* OS / Platform Filter Chips */}
        <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', paddingBottom: '0.1rem' }}>
          {['ALL', 'Windows', 'Linux', 'Cloud AWS', 'Network Appliance'].map(plat => (
            <button 
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              style={{
                background: platformFilter === plat ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                border: platformFilter === plat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                color: platformFilter === plat ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.675rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List Queue */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
            <ShieldAlert size={36} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.825rem' }}>No incident telemetry matches current filters.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isSelected = alert.id === selectedAlertId;
            const isContained = alert.status === 'CONTAINED';
            const severityColor = alert.severity === 'CRITICAL' 
              ? 'var(--accent-crimson)' 
              : alert.severity === 'HIGH' 
                ? 'var(--accent-amber)' 
                : 'var(--accent-cyan)';

            // Mock risk score (80 - 99 for high priority)
            const riskScore = alert.severity === 'CRITICAL' ? 98 : alert.severity === 'HIGH' ? 88 : 72;

            return (
              <div 
                key={alert.id}
                onClick={() => onSelectAlert(alert.id)}
                style={{
                  background: isSelected 
                    ? 'rgba(56, 189, 248, 0.08)' 
                    : 'var(--bg-card)',
                  border: isSelected 
                    ? '1px solid var(--accent-cyan)' 
                    : '1px solid var(--border-color)',
                  borderLeft: `4px solid ${severityColor}`,
                  borderRadius: '8px',
                  padding: '0.85rem',
                  marginBottom: '0.65rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Severity & ID */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {alert.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Score: <strong style={{ color: severityColor }}>{riskScore}</strong>
                    </span>
                    <span className={`badge status-${alert.status.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                      {isContained && <CheckCircle2 size={10} />}
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  marginBottom: '0.35rem',
                  lineHeight: 1.35
                }}>
                  {alert.title}
                </h3>

                {/* Target info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Server size={12} color="var(--accent-cyan)" />
                    <strong style={{ color: 'var(--text-secondary)' }}>{alert.host}</strong>
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                    {alert.ip}
                  </span>
                </div>

                {/* MITRE Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                  {alert.mitreTTPs.map(ttp => (
                    <span 
                      key={ttp.id} 
                      style={{
                        background: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--accent-cyan)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {ttp.id}
                    </span>
                  ))}
                  {alert.matchedRunbookId && (
                    <span style={{
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: 'var(--accent-purple)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontStyle: 'italic',
                      marginLeft: 'auto'
                    }}>
                      Runbook Matched
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
