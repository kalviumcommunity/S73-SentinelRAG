import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, FileText, BookOpen, ShieldAlert, Upload, Activity, X, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function CommandPaletteModal() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    documents,
    alerts,
    setCurrentView,
    openDocumentViewer,
    startRunbookExecution,
    selectRecentAlert
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter items
  const docResults = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
      d.cve_ids.some((c) => c.toLowerCase().includes(query.toLowerCase()))
  );

  const alertResults = alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.id.toLowerCase().includes(query.toLowerCase())
  );

  const navigationItems = [
    { label: 'Go to Alert Triage (Home)', view: 'triage', icon: ShieldAlert },
    { label: 'Go to Knowledge Base', view: 'knowledge', icon: BookOpen },
    { label: 'Go to Upload / Ingestion', view: 'upload', icon: Upload },
    { label: 'Go to Activity Log', view: 'activity', icon: Activity }
  ].filter((nav) => nav.label.toLowerCase().includes(query.toLowerCase()));

  const allResults = [
    ...navigationItems.map((nav) => ({ type: 'nav', item: nav })),
    ...docResults.map((doc) => ({ type: 'doc', item: doc })),
    ...alertResults.map((alt) => ({ type: 'alert', item: alt }))
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        executeResult(allResults[selectedIndex]);
      }
    }
  };

  const executeResult = (res) => {
    setIsCommandPaletteOpen(false);
    if (res.type === 'nav') {
      setCurrentView(res.item.view);
    } else if (res.type === 'doc') {
      if (res.item.type === 'runbook') {
        openDocumentViewer(res.item.id);
      } else {
        openDocumentViewer(res.item.id);
      }
    } else if (res.type === 'alert') {
      selectRecentAlert(res.item);
      setCurrentView('triage');
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCommandPaletteOpen(false)}>
      <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="command-input-wrapper">
          <Search size={18} className="text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder="Search documents, CVEs, threat actors, runbooks or navigate screens..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="kbd-shortcut-tag">ESC to close</span>
        </div>

        <div className="command-results-list">
          {allResults.length === 0 ? (
            <div className="command-empty">No matching documents, alerts, or screens found.</div>
          ) : (
            allResults.map((res, idx) => {
              const isSelected = idx === selectedIndex;
              if (res.type === 'nav') {
                const IconComponent = res.item.icon;
                return (
                  <div
                    key={`nav-${res.item.view}`}
                    className={`command-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => executeResult(res)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <IconComponent size={16} className="text-cyan-400 mr-2" />
                    <span className="flex-1 font-semibold">{res.item.label}</span>
                    <span className="command-type-badge">Navigation</span>
                  </div>
                );
              }

              if (res.type === 'doc') {
                return (
                  <div
                    key={`doc-${res.item.id}`}
                    className={`command-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => executeResult(res)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <FileText size={16} className="text-purple-400 mr-2" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-100 truncate">{res.item.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className={`badge badge-${res.item.severity}`}>{res.item.severity}</span>
                        <span>{res.item.id}</span>
                        <span>• {res.item.type.toUpperCase()}</span>
                      </div>
                    </div>
                    <CornerDownLeft size={14} className="text-slate-500" />
                  </div>
                );
              }

              if (res.type === 'alert') {
                return (
                  <div
                    key={`alert-${res.item.id}`}
                    className={`command-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => executeResult(res)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <ShieldAlert size={16} className="text-red-400 mr-2" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-100 truncate">{res.item.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className={`badge badge-${res.item.severity}`}>{res.item.severity}</span>
                        <span>{res.item.id}</span>
                        <span>• SIEM ALERT</span>
                      </div>
                    </div>
                    <CornerDownLeft size={14} className="text-slate-500" />
                  </div>
                );
              }

              return null;
            })
          )}
        </div>

        <div className="command-palette-footer">
          <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span>Use <kbd>↵</kbd> to select</span>
        </div>
      </div>
    </div>
  );
}
