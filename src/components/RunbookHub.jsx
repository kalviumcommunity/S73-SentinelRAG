import React, { useState } from 'react';
import { FileText, Search, Plus, Upload, CheckCircle2, ChevronRight, Layers, ShieldCheck, Zap, X, Sparkles } from 'lucide-react';

export default function RunbookHub({ runbooks, onIngestRunbook }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedRunbookId, setSelectedRunbookId] = useState(runbooks[0]?.id || null);
  const [showIngestModal, setShowIngestModal] = useState(false);

  // Ingest form state
  const [advisoryTitle, setAdvisoryTitle] = useState('');
  const [advisoryCve, setAdvisoryCve] = useState('');
  const [advisoryType, setAdvisoryType] = useState('Vulnerability Advisory');
  const [rawText, setRawText] = useState('');
  const [ingesting, setIngesting] = useState(false);

  // Sample CISA Advisory Presets
  const sampleAdvisories = [
    {
      title: "CISA Alert AA26-102: Log4j Remote Code Execution Hardening",
      cve: "CVE-2021-44228",
      type: "Vulnerability Advisory",
      text: "CISA Emergency Directive 22-02. Log4j JNDI lookup vulnerability allows unauthenticated remote execution. Step 1: Set LOG4J_FORMAT_MSG_NO_LOOKUPS=true in system properties. Step 2: Block egress connection to ldap:// and rmi:// protocol endpoints. Step 3: Update Log4j version to 2.17.1+."
    },
    {
      title: "LockBit 3.0 Ransomware Lateral Movement & Encrypted Snapshot Runbook",
      cve: "N/A (TTP-Based)",
      type: "Incident Runbook",
      text: "LockBit 3.0 Ransomware technical runbook. Step 1: Execute Set-EDRHostIsolation to sever compromised host from AD Domain Controller. Step 2: Stop VSS wiping process vssadmin.exe. Step 3: Revoke Kerberos admin session tokens and issue AD password reset."
    }
  ];

  const loadPreset = (preset) => {
    setAdvisoryTitle(preset.title);
    setAdvisoryCve(preset.cve);
    setAdvisoryType(preset.type);
    setRawText(preset.text);
  };

  const filtered = runbooks.filter(r => {
    const matchesType = typeFilter === 'ALL' || r.type.toLowerCase().includes(typeFilter.toLowerCase());
    const q = search.toLowerCase();
    const matchesSearch = !search || 
      r.title.toLowerCase().includes(q) || 
      r.id.toLowerCase().includes(q) || 
      r.cve.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const selectedRunbook = runbooks.find(r => r.id === selectedRunbookId) || runbooks[0];

  const handleIngestSubmit = async (e) => {
    e.preventDefault();
    setIngesting(true);
    await onIngestRunbook({
      title: advisoryTitle,
      cve: advisoryCve,
      type: advisoryType,
      rawText
    });
    setIngesting(false);
    setShowIngestModal(false);
    setAdvisoryTitle('');
    setAdvisoryCve('');
    setRawText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Threat Intelligence & Advisory Runbook Library
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Repository of CISA Emergency Advisories, vendor security bulletins, and standardized containment procedures.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowIngestModal(true)}>
          <Plus size={16} />
          <span>Ingest New Advisory / Runbook</span>
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.25rem' }}>
        {/* Selector List */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', maxHeight: '740px' }}>
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-cyber" 
                placeholder="Search runbook title, CVE..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.2rem', fontSize: '0.8rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['ALL', 'Runbook', 'Advisory', 'Threat Intel'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setTypeFilter(t)}
                  style={{
                    flex: 1,
                    background: typeFilter === t ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-surface)',
                    border: typeFilter === t ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    color: typeFilter === t ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    padding: '0.35rem 0.2rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filtered.map(r => {
              const isSelected = r.id === selectedRunbookId;
              return (
                <div 
                  key={r.id}
                  onClick={() => setSelectedRunbookId(r.id)}
                  style={{
                    background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-card)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', fontWeight: 700 }}>
                      {r.id}
                    </span>
                    <span style={{ fontSize: '0.65rem', background: 'var(--bg-surface)', padding: '0.1rem 0.45rem', borderRadius: '4px', color: 'var(--text-dim)' }}>
                      {r.cve !== 'N/A' ? r.cve : r.type}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {r.title}
                  </h4>

                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={12} color="var(--accent-cyan)" />
                    <span>{r.mitigationSteps?.length || 0} Extracted Mitigation Steps</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Runbook Reader */}
        {selectedRunbook ? (
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
                <span className="badge badge-medium">{selectedRunbook.type}</span>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  CVE Reference: {selectedRunbook.cve}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                  Last Indexed: {selectedRunbook.updatedAt}
                </span>
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
                {selectedRunbook.title}
              </h2>

              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                background: 'var(--bg-card)',
                padding: '0.9rem 1rem',
                borderRadius: '8px',
                borderLeft: '3px solid var(--accent-purple)'
              }}>
                {selectedRunbook.summary}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  AUTHOR & SOURCE ADVISORY
                </span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                  {selectedRunbook.author} ({selectedRunbook.sourceAdvisory})
                </div>
              </div>

              <div style={{ marginLeft: 'auto' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.675rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  MAPPED MITRE TTPs
                </span>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                  {selectedRunbook.mitreTechniques.map(t => (
                    <span key={t} style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', padding: '0.1rem 0.45rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} color="var(--accent-cyan)" />
                <span>Extracted Action Commands</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {selectedRunbook.mitigationSteps.map((step) => (
                  <div key={step.stepId} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        Step {step.stepId}: {step.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {step.commandType}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.55rem' }}>
                      {step.description}
                    </p>
                    <div style={{ background: 'var(--code-bg)', padding: '0.6rem 0.85rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#38bdf8' }}>
                      $ {step.automatedCommand}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* INGEST ADVISORY MODAL */}
      {showIngestModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 250,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '680px', width: '100%', padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Ingest Advisory or Threat Intel</h3>
              </div>
              <button onClick={() => setShowIngestModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Advisory Sample Presets */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Quick Advisory Presets (Click to Auto-fill)
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {sampleAdvisories.map((preset, idx) => (
                  <button 
                    key={idx} 
                    type="button"
                    onClick={() => loadPreset(preset)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    + {preset.title.slice(0, 35)}...
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleIngestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Advisory Title</label>
                <input 
                  type="text" 
                  className="input-cyber" 
                  placeholder="e.g. CISA Alert AA26-102: Log4j Remote Code Execution" 
                  value={advisoryTitle}
                  onChange={(e) => setAdvisoryTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>CVE ID (Optional)</label>
                  <input 
                    type="text" 
                    className="input-cyber" 
                    placeholder="e.g. CVE-2026-9821" 
                    value={advisoryCve}
                    onChange={(e) => setAdvisoryCve(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Advisory Document Type</label>
                  <select 
                    className="input-cyber" 
                    value={advisoryType} 
                    onChange={(e) => setAdvisoryType(e.target.value)}
                  >
                    <option value="Vulnerability Advisory">Vulnerability Advisory</option>
                    <option value="Incident Runbook">Incident Runbook</option>
                    <option value="Threat Intelligence Report">Threat Intelligence Report</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Raw Advisory Text / PDF Excerpt (RAG Engine extracts mitigation commands)
                </label>
                <textarea 
                  className="input-cyber" 
                  rows={5}
                  placeholder="Paste CISA advisory content, mitigation commands, or vendor security bulletin text here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowIngestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={ingesting}>
                  <Zap size={16} />
                  <span>{ingesting ? 'Parsing & Indexing...' : 'Parse & Index Advisory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
