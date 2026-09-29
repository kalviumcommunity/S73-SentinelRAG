import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  CheckCircle2,
  Search,
  Upload,
  Play,
  Filter,
  Clock,
  User,
  ShieldAlert
} from 'lucide-react';

export default function ActivityLogView() {
  const { activityLogs } = useApp();

  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Count metrics
  const searchCount = activityLogs.filter((l) => l.action_type === 'search').length;
  const stepCount = activityLogs.filter((l) => l.action_type === 'step_applied').length;
  const runbookCount = activityLogs.filter((l) => l.action_type === 'runbook_completed').length;
  const docCount = activityLogs.filter((l) => l.action_type === 'document_uploaded').length;

  const filteredLogs = activityLogs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action_type !== actionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const detailsMatch = log.details.toLowerCase().includes(q);
      const analystMatch = log.analyst.toLowerCase().includes(q);
      return detailsMatch || analystMatch;
    }
    return true;
  });

  return (
    <div className="activity-container">
      {/* Header */}
      <div className="view-page-header">
        <div>
          <h1 className="view-title">
            <Activity size={22} className="text-cyan-400" />
            SOC Audit & Activity Log
          </h1>
          <p className="view-description">
            Complete audit trail of all analyst triage searches, mitigation steps applied, runbooks executed, and ingested documents.
          </p>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="activity-metrics-grid mb-6">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Alert Searches</span>
            <Search size={18} className="text-cyan-400" />
          </div>
          <div className="metric-value text-cyan-400">{searchCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Mitigations Applied</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div className="metric-value text-emerald-400">{stepCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Runbooks Executed</span>
            <Play size={18} className="text-purple-400" />
          </div>
          <div className="metric-value text-purple-400">{runbookCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Documents Uploaded</span>
            <Upload size={18} className="text-amber-400" />
          </div>
          <div className="metric-value text-amber-400">{docCount}</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="cyber-card">
        {/* Table Filters Bar */}
        <div className="table-filter-bar">
          <div className="flex items-center gap-2 flex-1">
            <div className="kb-search-box max-w-md">
              <Search size={16} className="search-icon text-slate-400" />
              <input
                type="text"
                className="kb-search-input text-xs"
                placeholder="Search audit details or analyst name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Action Type:</label>
            <select
              className="input-cyber select-sm"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="ALL">All Actions</option>
              <option value="search">Search</option>
              <option value="step_applied">Step Applied</option>
              <option value="runbook_completed">Runbook Completed</option>
              <option value="document_uploaded">Document Uploaded</option>
            </select>
          </div>
        </div>

        {/* Activity Table */}
        <div className="activity-table-wrapper overflow-x-auto">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Analyst</th>
                <th>Action Type</th>
                <th>Event Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No activity log records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="font-semibold text-slate-200 text-xs">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-slate-400" /> {log.analyst}
                      </div>
                    </td>
                    <td>
                      <span className={`action-badge action-${log.action_type}`}>
                        {log.action_type === 'search' && <Search size={10} />}
                        {log.action_type === 'step_applied' && <CheckCircle2 size={10} />}
                        {log.action_type === 'runbook_completed' && <Play size={10} />}
                        {log.action_type === 'document_uploaded' && <Upload size={10} />}
                        {log.action_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="text-slate-300 text-xs max-w-md truncate">{log.details}</td>
                    <td>
                      <span className="badge badge-low text-[10px]">{log.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
