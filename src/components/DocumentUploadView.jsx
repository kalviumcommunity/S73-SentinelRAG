import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { extractEntitiesFromAlert } from '../data/mockData';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  FilePlus,
  RefreshCw
} from 'lucide-react';

export default function DocumentUploadView() {
  const { publishNewDocument, setCurrentView, openDocumentViewer } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [fileStatus, setFileStatus] = useState('idle'); // 'idle' | 'parsing' | 'classifying' | 'ready'

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('report'); // 'report' | 'runbook' | 'advisory'
  const [severity, setSeverity] = useState('high');
  const [tagsInput, setTagsInput] = useState('zero-day, CVE-2026-8812, remote-execution');
  const [productsInput, setProductsInput] = useState('Linux Server, Apache OpenSSL');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [extractedCves, setExtractedCves] = useState([]);
  const [extractedActors, setExtractedActors] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFileText = (fileName, text) => {
    setFileStatus('parsing');

    setTimeout(() => {
      setFileStatus('classifying');

      // Auto-extract entities & metadata
      const entities = extractEntitiesFromAlert(text);
      setExtractedCves(entities.cves);
      setExtractedActors(entities.actors);

      setTimeout(() => {
        setTitle(fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
        setContent(text);

        // Auto-detect type
        if (fileName.toLowerCase().includes('runbook') || text.toLowerCase().includes('runbook')) {
          setType('runbook');
        } else if (fileName.toLowerCase().includes('advisory') || text.toLowerCase().includes('cve')) {
          setType('advisory');
        } else {
          setType('report');
        }

        setSummary(`Auto-extracted threat intelligence document containing ${entities.cves.length} CVE references.`);
        setFileStatus('ready');
      }, 500);
    }, 400);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        processFileText(file.name, evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const loadSampleFile = (sampleType) => {
    if (sampleType === 'sample1') {
      const sampleText = `# Threat Report: APT28 Zero-Day Ingress via OpenSSL Buffer Overflow (CVE-2026-8812)

## 1. Executive Summary
During threat hunting operations, Threat Intel discovered active exploitation by **APT28 (Fancy Bear)** targeting Linux Web Gateway servers.

## 2. Technical Details
Exploitation occurs via crafted SSL handshake packets bypassing memory protections.

## 3. Mitigation Steps
1. Isolate infected gateway node from internal network segment immediately.
2. Upgrade OpenSSL library package to 3.2.1-patch2.
3. Block external C2 IP \`185.191.171.99\` at firewall gateway.`;

      processFileText('APT28_ZeroDay_OpenSSL_Analysis.md', sampleText);
    } else {
      const sampleText = `# Vulnerability Advisory: VMware ESXi Kernel Memory Disclosure (CVE-2026-4401)

## 1. Overview
Critical memory leak in VMware ESXi hypervisor kernel allowing virtual machine privilege escalation.

## 2. Mitigation Steps
1. Apply VMware emergency VMSA patch VMSA-2026-009.
2. Restrict vCenter administrative console access to trusted SOC IP range.`;

      processFileText('CISA_Advisory_VMware_ESXi_CVE-2026-4401.md', sampleText);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const productsArray = productsInput.split(',').map((p) => p.trim()).filter(Boolean);

    publishNewDocument({
      title,
      type,
      severity,
      tags: tagsArray,
      affected_products: productsArray,
      cve_ids: extractedCves,
      threat_actors: extractedActors,
      summary,
      content
    });

    setCurrentView('knowledge');
  };

  return (
    <div className="upload-container">
      {/* Header */}
      <div className="view-page-header">
        <div>
          <h1 className="view-title">
            <Upload size={22} className="text-cyan-400" />
            Document Ingestion & Metadata Classifier
          </h1>
          <p className="view-description">
            Ingest threat reports, incident runbooks, and vulnerability advisories. Automatic metadata classification extracts CVEs, actors, and mitigation steps.
          </p>
        </div>
      </div>

      <div className="upload-grid">
        {/* Dropzone & Quick Samples */}
        <div className="upload-left-col">
          <div
            className={`dropzone-card ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={40} className="text-cyan-400 mb-3" />
            <h3 className="text-slate-100 font-bold text-base">Drag & Drop Documents Here</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4 text-center">
              Supports Markdown (.md), Plain Text (.txt), and PDF threat report exports.
            </p>

            <label className="btn-primary text-xs cursor-pointer">
              <FilePlus size={14} /> Browse Files
              <input
                type="file"
                accept=".md,.txt,.json,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const f = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (evt) => processFileText(f.name, evt.target.result);
                    reader.readAsText(f);
                  }
                }}
              />
            </label>
          </div>

          {/* Quick Demo Sample Files */}
          <div className="cyber-card mt-4">
            <span className="card-title text-sm mb-3 block">Quick Sample Ingestion:</span>
            <div className="flex flex-col gap-2">
              <button className="btn-secondary text-xs justify-start" onClick={() => loadSampleFile('sample1')}>
                <FileText size={14} className="text-purple-400" /> Ingest Sample APT28 Intel Report (.md)
              </button>
              <button className="btn-secondary text-xs justify-start" onClick={() => loadSampleFile('sample2')}>
                <Shield size={14} className="text-amber-400" /> Ingest Sample CVE-2026 Advisory (.md)
              </button>
            </div>
          </div>
        </div>

        {/* Processing State & Confirmation Form */}
        <div className="upload-right-col">
          <div className="cyber-card min-h-[550px]">
            {fileStatus === 'idle' && (
              <div className="upload-idle-placeholder">
                <FileText size={48} className="text-slate-600 mb-2" />
                <h3 className="text-slate-300 font-bold">No Document Selected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">
                  Drag and drop a threat intelligence file or click one of the quick sample buttons to begin ingestion.
                </p>
              </div>
            )}

            {(fileStatus === 'parsing' || fileStatus === 'classifying') && (
              <div className="upload-processing-state">
                <div className="spinner-lg mb-3"></div>
                <div className="font-bold text-slate-200">
                  {fileStatus === 'parsing' ? 'Parsing Document Structure...' : 'Auto-Classifying Metadata & CVEs...'}
                </div>
                <div className="text-xs text-slate-400 mt-1">Extracting MITRE ATT&CK TTPs and entity chips</div>
              </div>
            )}

            {fileStatus === 'ready' && (
              <form onSubmit={handlePublish} className="metadata-form">
                <div className="form-header justify-between mb-4">
                  <span className="card-title text-sm">
                    <CheckCircle2 size={16} className="text-emerald-400 mr-1" /> Document Metadata Confirmation
                  </span>
                  <span className="badge badge-emerald">Ready to Publish</span>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Document Title</label>
                  <input
                    type="text"
                    className="input-cyber"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="form-label">Document Type</label>
                    <select
                      className="input-cyber"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="report">Threat Intel Report</option>
                      <option value="runbook">Incident Runbook</option>
                      <option value="advisory">Vulnerability Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Severity Level</label>
                    <select
                      className="input-cyber"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                    >
                      <option value="critical">CRITICAL</option>
                      <option value="high">HIGH</option>
                      <option value="medium">MEDIUM</option>
                      <option value="low">LOW</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="input-cyber font-mono text-xs"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Affected Products</label>
                  <input
                    type="text"
                    className="input-cyber text-xs"
                    value={productsInput}
                    onChange={(e) => setProductsInput(e.target.value)}
                  />
                </div>

                {extractedCves.length > 0 && (
                  <div className="form-group mb-3">
                    <label className="form-label">Auto-Detected CVEs</label>
                    <div className="flex gap-2">
                      {extractedCves.map((cve) => (
                        <span key={cve} className="entity-chip chip-cve font-mono text-xs">
                          {cve}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group mb-4">
                  <label className="form-label">Document Body Content (Markdown)</label>
                  <textarea
                    rows={6}
                    className="input-cyber font-mono text-xs"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  <Sparkles size={16} /> Publish to Knowledge Base
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
