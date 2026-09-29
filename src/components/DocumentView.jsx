import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Download,
  Copy,
  Play,
  FileText,
  Shield,
  Clock,
  Tag,
  Check,
  Bookmark,
  Sparkles
} from 'lucide-react';

export default function DocumentView() {
  const {
    documents,
    selectedDocId,
    setCurrentView,
    highlightedTargetPassage,
    startRunbookExecution,
    addToast
  } = useApp();

  const [copiedLink, setCopiedLink] = React.useState(false);
  const highlightedRef = useRef(null);

  const doc = documents.find((d) => d.id === selectedDocId) || documents[0];

  useEffect(() => {
    if (highlightedTargetPassage && highlightedRef.current) {
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [highlightedTargetPassage, selectedDocId]);

  if (!doc) {
    return (
      <div className="doc-viewer-empty">
        <p>Document not found.</p>
        <button className="btn-secondary" onClick={() => setCurrentView('knowledge')}>
          Back to Knowledge Base
        </button>
      </div>
    );
  }

  // Generate Table of Contents from headings in doc.content
  const lines = doc.content.split('\n');
  const tocSections = [];
  lines.forEach((line, idx) => {
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      const level = line.startsWith('# ') ? 1 : line.startsWith('## ') ? 2 : 3;
      const title = line.replace(/^#+\s*/, '').trim();
      const sectionId = `sec-${idx}`;
      tocSections.push({ id: sectionId, title, level, lineIndex: idx });
    }
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    addToast('Link Copied', 'Document reference URL copied to clipboard.', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.id}_${doc.title.replace(/\s+/g, '_')}.md`;
    a.click();
    addToast('Document Downloaded', `Saved ${doc.id} markdown file locally.`, 'success');
  };

  const scrollToSection = (secId) => {
    const el = document.getElementById(secId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="doc-viewer-container">
      {/* Top Header Controls Bar */}
      <div className="doc-viewer-topbar">
        <button className="btn-secondary-xs" onClick={() => setCurrentView('knowledge')}>
          <ArrowLeft size={14} /> Back to Knowledge Base
        </button>

        <div className="flex items-center gap-2">
          <button className="btn-secondary-xs" onClick={handleDownload} title="Download Markdown Document">
            <Download size={14} /> Download
          </button>

          <button className="btn-secondary-xs" onClick={handleCopyLink} title="Copy Citation Link">
            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copiedLink ? 'Copied' : 'Copy Citation'}
          </button>

          {doc.type === 'runbook' && (
            <button className="btn-primary-xs" onClick={() => startRunbookExecution(doc.id)}>
              <Play size={12} /> Start Runbook Execution
            </button>
          )}
        </div>
      </div>

      {/* Document Meta Banner */}
      <div className="doc-meta-banner">
        <div className="flex items-center gap-2 mb-2">
          <span className={`type-badge type-${doc.type}`}>{doc.type.toUpperCase()}</span>
          <span className={`badge badge-${doc.severity}`}>{doc.severity}</span>
          <span className="font-mono text-xs text-slate-400">ID: {doc.id}</span>
        </div>

        <h1 className="doc-title-text">{doc.title}</h1>
        <p className="doc-summary-text">{doc.summary}</p>

        <div className="doc-meta-footer mt-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Uploaded by: <strong className="text-slate-200">{doc.uploaded_by}</strong></span>
            <span>Date: {new Date(doc.uploaded_at).toLocaleDateString()}</span>
          </div>

          <div className="doc-tags-row">
            {doc.tags?.map((tag) => (
              <span key={tag} className="tag-chip font-mono">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Sticky TOC + Right Rendered Body */}
      <div className="doc-body-grid">
        {/* Sticky Table of Contents Sidebar */}
        <aside className="doc-toc-sidebar">
          <div className="toc-card">
            <div className="toc-header">
              <Bookmark size={14} className="text-cyan-400" /> Table of Contents
            </div>
            <nav className="toc-nav">
              {tocSections.map((sec) => (
                <button
                  key={sec.id}
                  className={`toc-link level-${sec.level}`}
                  onClick={() => scrollToSection(sec.id)}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Rendered Document Body */}
        <main className="doc-content-body">
          {lines.map((line, idx) => {
            const secId = `sec-${idx}`;
            const isHeading1 = line.startsWith('# ');
            const isHeading2 = line.startsWith('## ');
            const isHeading3 = line.startsWith('### ');

            const isTargetHighlight =
              highlightedTargetPassage &&
              line.toLowerCase().includes(highlightedTargetPassage.toLowerCase());

            if (isHeading1) {
              return (
                <h1 key={idx} id={secId} className="doc-h1">
                  {line.replace('# ', '')}
                </h1>
              );
            }
            if (isHeading2) {
              return (
                <h2 key={idx} id={secId} className="doc-h2">
                  {line.replace('## ', '')}
                </h2>
              );
            }
            if (isHeading3) {
              const headingText = line.replace('### ', '');
              return (
                <div
                  key={idx}
                  id={secId}
                  ref={isTargetHighlight ? highlightedRef : null}
                  className={`doc-h3-container ${isTargetHighlight ? 'target-passage-highlight' : ''}`}
                >
                  {isTargetHighlight && (
                    <div className="passage-badge-pulse">
                      <Sparkles size={14} /> Highlighted Citation Target Passage
                    </div>
                  )}
                  <h3 className="doc-h3">{headingText}</h3>
                </div>
              );
            }

            if (line.startsWith('**Instruction**:') || line.startsWith('**Expected Outcome**:')) {
              return (
                <p key={idx} className="doc-bold-p">
                  {line}
                </p>
              );
            }

            if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('- ')) {
              return (
                <div key={idx} className="doc-list-item">
                  {line}
                </div>
              );
            }

            if (line.trim() === '') return <div key={idx} className="h-2"></div>;

            return (
              <p
                key={idx}
                className={`doc-p ${isTargetHighlight ? 'target-passage-highlight-p' : ''}`}
                ref={isTargetHighlight ? highlightedRef : null}
              >
                {line}
              </p>
            );
          })}
        </main>
      </div>
    </div>
  );
}
