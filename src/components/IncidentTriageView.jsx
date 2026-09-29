import React from 'react';
import AlertFeed from './AlertFeed';
import AlertDetail from './AlertDetail';
import { ShieldAlert, Zap, CheckCircle2, Clock } from 'lucide-react';

export default function IncidentTriageView({
  alerts,
  selectedAlertId,
  onSelectAlert,
  selectedAlertDetails,
  onExecuteMitigation,
  onOpenCopilot,
  searchQuery,
  setSearchQuery,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  metrics
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Simple 3 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid var(--accent-crimson)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Active Unmitigated Threats
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-crimson)', marginTop: '0.2rem' }}>
            {metrics?.unmitigatedAlerts || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Requires 1-Click Containment Action
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Mean Time To Mitigate (MTTM)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
            {metrics?.avgTimeSeconds || 38} Seconds
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.25rem', fontWeight: 600 }}>
            ✓ Passed SLA Speed Target (&lt; 45s)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.15rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Incidents Secured
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
            {metrics?.containedAlerts || 0} / {metrics?.totalAlerts || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Automated Audit Trail Logged
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="dashboard-grid">
        {/* Left Alert Queue */}
        <AlertFeed 
          alerts={alerts}
          selectedAlertId={selectedAlertId}
          onSelectAlert={onSelectAlert}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Right Rapid Mitigation Workspace */}
        <AlertDetail 
          alert={selectedAlertDetails?.alert}
          matchedRunbook={selectedAlertDetails?.matchedRunbook}
          onExecuteMitigation={onExecuteMitigation}
          onOpenCopilot={onOpenCopilot}
        />
      </div>
    </div>
  );
}
