import React, { useState } from 'react';
import { 
  Terminal, Play, Copy, Check, ExternalLink, Cpu, Lock, Server, 
  FileText, Zap, ShieldAlert, CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function AlertDetail({ 
  alert, 
  matchedRunbook, 
  onExecuteMitigation, 
  onOpenCopilot 
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [executingStepId, setExecutingStepId] = useState(null);

  if (!alert) {
    return (
      <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
        <ShieldAlert size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
        <h3 style={{ color: '#fff', fontWeight: 700 }}>Select an Active Alert to Launch Rapid Mitigation</h3>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
          AegisOps automatically correlates SIEM alert indicators with indexed Threat Intelligence Runbooks.
        </p>
      </div>
    );
  }

  const handleCopyCommand = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunStep = async (stepId) => {
    setExecutingStepId(stepId);
    await onExecuteMitigation(alert.id, stepId);
    setExecutingStepId(null);
  };

  const isContained = alert.status === 'CONTAINED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Alert Header Summary Panel */}
      <div className="glass-panel" style={{
        padding: '1.35rem',
        borderLeft: `4px solid ${isContained ? 'var(--accent-emerald)' : alert.severity === 'CRITICAL' ? 'var(--accent-crimson)' : 'var(--accent-amber)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                {alert.severity} SEVERITY
              </span>
              <span className={`badge status-${alert.status.toLowerCase()}`}>
                {isContained && <CheckCircle2 size={11} />}
                {alert.status}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                INCIDENT ID: {alert.id}
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {alert.title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-secondary" 
              onClick={() => onOpenCopilot(alert.id)}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <Terminal size={14} color="var(--accent-cyan)" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>

        {/* Technical Description */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '1rem',
          background: 'rgba(0,0,0,0.3)',
          padding: '0.75rem 0.9rem',
          borderRadius: '8px',
          borderLeft: '3px solid var(--accent-cyan)',
          lineHeight: 1.55
        }}>
          {alert.description}
        </p>

        {/* IOC Metadata Specs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.85rem',
          fontSize: '0.8rem',
          background: 'rgba(11, 15, 25, 0.7)',
          padding: '0.85rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Target Host & IP
            </span>
            <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              {alert.host} <span style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>({alert.ip})</span>
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Malicious C2 Egress Indicator
            </span>
            <div style={{ color: 'var(--accent-crimson)', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
              {alert.iocs?.c2Ip || 'N/A'} {alert.iocs?.domain ? `(${alert.iocs.domain})` : ''}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Process Lineage
            </span>
            <div style={{ color: 'var(--accent-amber)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
              {alert.iocs?.process || 'Unknown Process'}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Ingested SIEM Source
            </span>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '0.15rem' }}>
              {alert.sourceSIEM}
            </div>
          </div>
        </div>
      </div>

      {/* MATCHED RAPID MITIGATION WORKSPACE PANEL */}
      <div className="glass-panel" style={{ padding: '1.35rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.1rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.85rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                Extracted Rapid Mitigation Sequence
              </h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Sub-second RAG extraction from indexed runbook <strong style={{ color: 'var(--accent-purple)' }}>{matchedRunbook ? matchedRunbook.id : 'RB-2026-088'}</strong>
            </p>
          </div>

          {matchedRunbook && (
            <span style={{
              fontSize: '0.725rem',
              color: 'var(--accent-cyan)',
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontFamily: 'var(--font-mono)'
            }}>
              Ref: {matchedRunbook.sourceAdvisory}
            </span>
          )}
        </div>

        {/* Steps List */}
        {!matchedRunbook ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No pre-indexed runbook found for this exact alert vector. Use the AI Copilot to synthesize custom mitigation scripts.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matchedRunbook.mitigationSteps.map((step, idx) => {
              let cmdDisplay = step.automatedCommand
                .replace(/{{host}}/g, alert.host)
                .replace(/{{pid1}}/g, '4892')
                .replace(/{{pid2}}/g, '8102')
                .replace(/{{c2Ip}}/g, alert.iocs.c2Ip || '185.220.101.45');

              const isExecuting = executingStepId === step.stepId;

              return (
                <div 
                  key={step.stepId}
                  style={{
                    background: 'rgba(11, 15, 25, 0.75)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1.1rem',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  {/* Step Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                        color: '#ffffff',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)'
                      }}>
                        {step.stepId}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                        {step.title}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        Est Latency: {step.estimatedTimeSec}s
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: step.riskLevel.includes('HIGH') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: step.riskLevel.includes('HIGH') ? '#fca5a5' : '#6ee7b7',
                        border: step.riskLevel.includes('HIGH') ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)'
                      }}>
                        {step.riskLevel}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    {step.description}
                  </p>

                  {/* Code Shell Command Container */}
                  <div style={{
                    background: '#060911',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    marginBottom: '0.85rem',
                    color: '#38bdf8'
                  }}>
                    <div style={{ flex: 1, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--text-dim)', marginRight: '0.6rem' }}>[{step.commandType}]</span>
                      <span>{cmdDisplay}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleCopyCommand(cmdDisplay, idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.25rem 0.45rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Copy CLI command"
                    >
                      {copiedIndex === idx ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                    </button>
                  </div>

                  {/* Trigger Action Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      className={isContained ? "btn-secondary" : "btn-danger"}
                      onClick={() => handleRunStep(step.stepId)}
                      disabled={isExecuting}
                      style={{ padding: '0.5rem 1.1rem', fontSize: '0.8rem' }}
                    >
                      <Play size={13} />
                      <span>
                        {isExecuting 
                          ? 'Executing Automation Command...' 
                          : isContained 
                            ? 'Re-Run Containment Step' 
                            : `Execute Mitigation Step ${step.stepId}`}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Threat Intel Citation Reference Box */}
      {matchedRunbook && (
        <div className="glass-panel" style={{ padding: '1.1rem', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#c084fc' }}>
            <FileText size={16} />
            <strong style={{ fontSize: '0.85rem' }}>Threat Intelligence Advisory Cross-Reference Excerpt</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            "{matchedRunbook.summary}"
          </p>
        </div>
      )}
    </div>
  );
}
