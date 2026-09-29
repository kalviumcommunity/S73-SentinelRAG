import React, { useState } from 'react';
import { Terminal, X, Zap, Copy, Check, Sparkles, Code, ArrowRight } from 'lucide-react';

export default function CyberCopilotDrawer({ 
  isOpen, 
  onClose, 
  contextAlertId, 
  onSynthesize, 
  onExecuteCommand 
}) {
  const [query, setQuery] = useState('');
  const [targetFormat, setTargetFormat] = useState('PowerShell');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const presets = [
    "Isolate host & terminate powershell PID 4892",
    "Remediate ActiveMQ CVE-2026-9821 vulnerability",
    "Block malicious C2 IP address 185.220.101.45 on firewall",
    "Revoke AWS STS IAM token for role SOC-Admin"
  ];

  const handleQuerySubmit = async (customQuery) => {
    const q = customQuery || query;
    if (!q) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await onSynthesize(q, contextAlertId, targetFormat);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.generatedScript) {
      navigator.clipboard.writeText(result.generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0,
      width: '580px',
      maxWidth: '92vw',
      background: '#070a11',
      borderLeft: '1px solid var(--accent-cyan)',
      boxShadow: '-12px 0 50px rgba(0, 0, 0, 0.8)',
      zIndex: 220,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.1rem 1.35rem',
        background: 'rgba(17, 24, 39, 0.95)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={20} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              AegisOps AI Cyber Copilot
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Natural Language Script & Command Synthesizer
            </span>
          </div>
        </div>

        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Body Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
        {/* Preset Prompt Badges */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.55rem', letterSpacing: '0.04em' }}>
            Quick Incident Presets
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {presets.map((p, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleQuerySubmit(p);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                + {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Target Format */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Command Target Format</label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['PowerShell', 'Bash', 'CrowdStrike API'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  style={{
                    background: targetFormat === fmt ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: targetFormat === fmt ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    color: targetFormat === fmt ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input-cyber"
              placeholder="Ask Copilot e.g., 'Isolate workstation WK-8492 & drop C2 IP'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
              style={{ fontSize: '0.85rem' }}
            />
            <button className="btn-primary" onClick={() => handleQuerySubmit()} disabled={loading} style={{ padding: '0.6rem 1rem' }}>
              <Zap size={15} />
              <span>{loading ? 'Synthesizing...' : 'Synthesize'}</span>
            </button>
          </div>
        </div>

        {/* Output Window */}
        {result && (
          <div style={{ background: 'rgba(11, 15, 25, 0.95)', border: '1px solid var(--accent-cyan)', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.55rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Code size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                  {result.synthesisTitle}
                </span>
              </div>
              <button 
                onClick={handleCopy}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}
              >
                {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre style={{
              background: '#060911',
              padding: '0.9rem',
              borderRadius: '6px',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap',
              maxHeight: '280px',
              overflowY: 'auto'
            }}>
              {result.generatedScript}
            </pre>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>
              {result.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
