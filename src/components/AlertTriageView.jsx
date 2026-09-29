import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeAlertAndGetResults } from '../data/mockData';
import {
  ShieldAlert,
  Search,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Play,
  FileText,
  AlertTriangle,
  Layers,
  Cpu,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Zap
} from 'lucide-react';

export default function AlertTriageView() {
  const {
    alerts,
    documents,
    activeAlertText,
    setActiveAlertText,
    selectedAlertId,
    selectRecentAlert,
    markStepApplied,
    appliedStepIds,
    openDocumentViewer,
    startRunbookExecution,
    addToast,
    addActivityLog
  } = useApp();

  const [activeTab, setActiveTab] = useState('mitigations'); // 'mitigations' | 'runbooks' | 'advisories'
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [copiedStepId, setCopiedStepId] = useState(null);
  const [results, setResults] = useState(null);

  const textareaRef = useRef(null);

  // Focus textarea when '/' key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== textareaRef.current) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunAnalysis();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAlertText]);

  // Initial analysis on load
  useEffect(() => {
    if (activeAlertText) {
      runAnalysis(activeAlertText);
    }
  }, [activeAlertText, documents]);

  const runAnalysis = (text) => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      try {
        const res = analyzeAlertAndGetResults(text, documents);
        setResults(res);
        setIsLoading(false);
      } catch (err) {
        setIsError(true);
        setIsLoading(false);
      }
    }, 400);
  };

  const handleRunAnalysis = () => {
    if (!activeAlertText.trim()) return;
    runAnalysis(activeAlertText);
    addToast('Alert Analysis Complete', 'Extracted entities and correlated mitigation steps from Knowledge Base.', 'success');
    addActivityLog('search', `Analyzed alert text (${activeAlertText.length} chars). Extracted mitigation steps.`, 'COMPLETED');
  };

  const handleCopyStep = (step) => {
    const textToCopy = `[MITIGATION STEP] ${step.step_text}\nSource: ${step.document_title} (Section: ${step.section})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedStepId(step.id);
    addToast('Copied to Clipboard', 'Mitigation step text copied to clipboard.', 'success');
    setTimeout(() => setCopiedStepId(null), 2000);
  };

  const hasEntities =
    results &&
    (results.extracted_entities.cves.length > 0 ||
      results.extracted_entities.actors.length > 0 ||
      results.extracted_entities.malware.length > 0 ||
      results.extracted_entities.products.length > 0 ||
      results.extracted_entities.techniques.length > 0);

  return (
    <div className="triage-container">
      {/* Page Header */}
      <div className="view-page-header">
        <div>
          <h1 className="view-title">
            <ShieldAlert size={22} className="text-cyan-400" />
            Alert Triage & Mitigation Engine
          </h1>
          <p className="view-description">
            Paste raw SIEM/EDR alert telemetry to instantly extract threat entities and match verified mitigation steps, runbooks, and advisories.
          </p>
        </div>
        <div className="header-meta-chips">
          <span className="meta-chip"><Cpu size={14} className="text-cyan-400" /> Corpus: {documents.length} Docs</span>
          <span className="meta-chip"><Zap size={14} className="text-emerald-400" /> Sub-Second Matching</span>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="triage-grid">
        {/* LEFT COLUMN: Alert Input & Recent Alerts */}
        <div className="triage-left-col">
          {/* Raw Text Input Card */}
          <div className="cyber-card">
            <div className="card-header justify-between">
              <span className="card-title">
                <FileText size={16} className="text-cyan-400" /> Raw Alert Telemetry
              </span>
              <div className="flex items-center gap-2">
                <span className="char-count">{activeAlertText.length} chars</span>
                <span className="kbd-shortcut-tag hide-mobile">Press / to focus</span>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="alert-textarea font-mono"
              rows={8}
              placeholder="Paste SIEM alert, EDR detection log, or raw security report snippet here... (e.g. LSASS access, CVE-2024-38077, LockBit 3.0)"
              value={activeAlertText}
              onChange={(e) => setActiveAlertText(e.target.value)}
            />

            <div className="card-actions-bar">
              <button
                className="btn-primary flex-1 justify-center"
                onClick={handleRunAnalysis}
                disabled={isLoading || !activeAlertText.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-sm mr-1"></span> Analyzing Telemetry...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Analyze Alert & Retrieve Mitigations
                    <span className="btn-kbd-hint">Ctrl+Enter</span>
                  </>
                )}
              </button>

              <button
                className="btn-secondary"
                onClick={() => setActiveAlertText('')}
                title="Clear Textarea"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Recent Alerts List */}
          <div className="cyber-card mt-4">
            <div className="card-header justify-between">
              <span className="card-title">
                <Clock size={16} className="text-cyan-400" /> Recent SIEM / EDR Alerts
              </span>
              <span className="badge badge-info">{alerts.length} Sample Alerts</span>
            </div>

            <div className="recent-alerts-list">
              {alerts.map((alt) => {
                const isSelected = selectedAlertId === alt.id && activeAlertText === alt.raw_text;
                return (
                  <div
                    key={alt.id}
                    className={`recent-alert-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectRecentAlert(alt)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="recent-alert-id font-mono">{alt.id}</span>
                      <span className={`badge badge-${alt.severity}`}>{alt.severity}</span>
                    </div>
                    <div className="recent-alert-title">{alt.title}</div>
                    <div className="recent-alert-footer">
                      <span>Source: {alt.source}</span>
                      <span>{new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Entities */}
        <div className="triage-right-col">
          {/* Extracted Entities Bar */}
          <div className="cyber-card mb-4">
            <div className="card-header justify-between mb-2">
              <span className="card-title text-sm">
                <Layers size={16} className="text-cyan-400" /> Extracted Entities
              </span>
              {hasEntities ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> Auto-Classified
                </span>
              ) : (
                <span className="text-xs text-slate-500">No entities extracted yet</span>
              )}
            </div>

            <div className="entities-chips-wrapper">
              {results?.extracted_entities.cves.map((cve) => (
                <span key={cve} className="entity-chip chip-cve font-mono">
                  CVE: {cve}
                </span>
              ))}
              {results?.extracted_entities.actors.map((actor) => (
                <span key={actor} className="entity-chip chip-actor">
                  Actor: {actor}
                </span>
              ))}
              {results?.extracted_entities.malware.map((malware) => (
                <span key={malware} className="entity-chip chip-malware">
                  Malware: {malware}
                </span>
              ))}
              {results?.extracted_entities.products.map((prod) => (
                <span key={prod} className="entity-chip chip-product">
                  Product: {prod}
                </span>
              ))}
              {results?.extracted_entities.techniques.map((ttp) => (
                <span key={ttp} className="entity-chip chip-technique font-mono">
                  MITRE: {ttp}
                </span>
              ))}

              {!hasEntities && (
                <span className="text-xs text-slate-400 italic">
                  Paste alert text with CVE IDs, threat actors, or malware families to view extracted entity chips.
                </span>
              )}
            </div>
          </div>

          {/* Results Tabbed Panel */}
          <div className="cyber-card flex-1 min-h-[500px]">
            {/* Tab Headers */}
            <div className="results-tabs-header">
              <button
                className={`tab-btn ${activeTab === 'mitigations' ? 'active' : ''}`}
                onClick={() => setActiveTab('mitigations')}
              >
                Mitigation Steps
                <span className="tab-count">{results?.mitigation_steps.length || 0}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'runbooks' ? 'active' : ''}`}
                onClick={() => setActiveTab('runbooks')}
              >
                Matching Runbooks
                <span className="tab-count">{results?.matching_runbooks.length || 0}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'advisories' ? 'active' : ''}`}
                onClick={() => setActiveTab('advisories')}
              >
                Related Advisories
                <span className="tab-count">{results?.related_advisories.length || 0}</span>
              </button>
            </div>

            {/* Tab Content Container */}
            <div className="results-tab-body">
              {/* LOADING STATE */}
              {isLoading && (
                <div className="results-loading-state">
                  <div className="spinner-lg"></div>
                  <div className="text-slate-300 font-semibold mt-3">Correlating Knowledge Corpus & Matching Steps...</div>
                  <div className="text-xs text-slate-500 mt-1">Scanning Threat Reports, Incident Runbooks, and Vulnerability Advisories</div>
                </div>
              )}

              {/* ERROR STATE */}
              {isError && (
                <div className="results-error-state">
                  <AlertTriangle size={32} className="text-red-400 mb-2" />
                  <div className="text-slate-200 font-bold">Analysis Anomaly Detected</div>
                  <div className="text-xs text-slate-400 mt-1 mb-3">Unable to process the current alert telemetry. Please try broadening your query.</div>
                  <button className="btn-secondary text-xs" onClick={handleRunAnalysis}>
                    <RotateCcw size={14} /> Retry Analysis
                  </button>
                </div>
              )}

              {/* NO RESULTS STATE */}
              {!isLoading && !isError && results && results.mitigation_steps.length === 0 && (
                <div className="results-empty-state">
                  <ShieldAlert size={36} className="text-slate-600 mb-2" />
                  <div className="text-slate-300 font-bold">No Exact Mitigation Steps Found</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-md text-center">
                    No verified mitigation steps matched the pasted text. Try broadening the alert text or pasting CVE identifiers (e.g. CVE-2024-38077).
                  </div>
                </div>
              )}

              {/* MITIGATION STEPS TAB */}
              {!isLoading && !isError && activeTab === 'mitigations' && results && results.mitigation_steps.length > 0 && (
                <div className="mitigations-list">
                  {results.mitigation_steps.map((step) => {
                    const isApplied = appliedStepIds.has(step.id);
                    return (
                      <div key={step.id} className={`mitigation-card ${isApplied ? 'applied-card' : ''}`}>
                        <div className="mitigation-header">
                          <div className="flex items-center gap-2">
                            <span className="confidence-pill">{step.confidence}% Confidence</span>
                            <span className={`badge badge-${step.severity}`}>{step.severity}</span>
                          </div>
                          <span className="doc-section-tag font-mono">
                            {step.document_title} • {step.section}
                          </span>
                        </div>

                        <div className="mitigation-body-text">{step.step_text}</div>

                        <div className="mitigation-actions">
                          {/* View in Source */}
                          <button
                            className="btn-link"
                            onClick={() => openDocumentViewer(step.document_id, step.section)}
                          >
                            <ExternalLink size={14} /> View in Source Citation
                          </button>

                          <div className="flex items-center gap-2">
                            {/* Copy button */}
                            <button
                              className="btn-secondary-xs"
                              onClick={() => handleCopyStep(step)}
                              title="Copy Step Text"
                            >
                              {copiedStepId === step.id ? (
                                <>
                                  <Check size={14} className="text-emerald-400" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={14} /> Copy
                                </>
                              )}
                            </button>

                            {/* Mark Applied button */}
                            <button
                              className={`btn-action-xs ${isApplied ? 'btn-applied' : ''}`}
                              onClick={() => markStepApplied(step.id, step.step_text)}
                              disabled={isApplied}
                            >
                              {isApplied ? (
                                <>
                                  <Check size={14} /> Applied
                                </>
                              ) : (
                                <>Mark Applied</>
                              )}
                            </button>

                            {/* Escalate to Runbook */}
                            {step.document_type === 'runbook' && (
                              <button
                                className="btn-primary-xs"
                                onClick={() => startRunbookExecution(step.document_id)}
                              >
                                <Play size={12} /> Runbook
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MATCHING RUNBOOKS TAB */}
              {!isLoading && !isError && activeTab === 'runbooks' && results && (
                <div className="runbooks-tab-grid">
                  {results.matching_runbooks.length === 0 ? (
                    <div className="results-empty-state">No matching runbooks found for this alert.</div>
                  ) : (
                    results.matching_runbooks.map((rb) => (
                      <div key={rb.id} className="runbook-match-card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="badge badge-high">Runbook • {rb.severity}</span>
                          <span className="text-xs text-cyan-400 font-bold">{rb.matchConfidence}% Match</span>
                        </div>
                        <h4 className="runbook-match-title">{rb.title}</h4>
                        <p className="runbook-match-summary">{rb.summary}</p>
                        <div className="runbook-match-footer">
                          <span className="text-xs text-slate-400 font-mono">ID: {rb.id}</span>
                          <button
                            className="btn-primary-xs"
                            onClick={() => startRunbookExecution(rb.id)}
                          >
                            <Play size={14} /> Start Runbook
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* RELATED ADVISORIES TAB */}
              {!isLoading && !isError && activeTab === 'advisories' && results && (
                <div className="advisories-tab-grid">
                  {results.related_advisories.length === 0 ? (
                    <div className="results-empty-state">No related vulnerability advisories found.</div>
                  ) : (
                    results.related_advisories.map((adv) => (
                      <div key={adv.id} className="advisory-match-card">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`badge badge-${adv.severity}`}>Advisory • {adv.severity}</span>
                          <span className="text-xs text-slate-400 font-mono">
                            {adv.cve_ids.join(', ') || 'CVE Advisory'}
                          </span>
                        </div>
                        <h4 className="advisory-match-title">{adv.title}</h4>
                        <p className="advisory-match-summary">{adv.summary}</p>
                        <div className="advisory-tags-list mt-2">
                          {adv.affected_products.map((prod) => (
                            <span key={prod} className="advisory-product-tag">
                              {prod}
                            </span>
                          ))}
                        </div>
                        <div className="advisory-match-footer mt-3">
                          <span className="text-xs text-slate-400">{new Date(adv.uploaded_at).toLocaleDateString()}</span>
                          <button
                            className="btn-secondary-xs"
                            onClick={() => openDocumentViewer(adv.id)}
                          >
                            <ExternalLink size={14} /> View Advisory
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
