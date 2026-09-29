import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DOCUMENTS, INITIAL_ALERTS, INITIAL_ACTIVITY_LOGS, analyzeAlertAndGetResults } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation View: 'triage' | 'knowledge' | 'doc-viewer' | 'runbook-run' | 'upload' | 'activity'
  const [currentView, setCurrentView] = useState('triage');

  // Corpus Data
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('aegis_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('aegis_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('aegis_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // State for Alert Triage Hero Flow
  const [activeAlertText, setActiveAlertText] = useState(INITIAL_ALERTS[0].raw_text);
  const [selectedAlertId, setSelectedAlertId] = useState(INITIAL_ALERTS[0].id);

  // Applied Steps tracker
  const [appliedStepIds, setAppliedStepIds] = useState(new Set());

  // Document Viewer target
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [highlightedTargetPassage, setHighlightedTargetPassage] = useState(null);

  // Active Runbook Execution
  const [activeRunbookRun, setActiveRunbookRun] = useState(null);

  // Command Palette & Shortcuts
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState([]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aegis_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('aegis_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Global Keyboard Shortcuts (Cmd+K for Command Palette, / for Focus Alert Text)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (title, message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivityLog = (action_type, details, status = 'SUCCESS', analyst = 'N. Sharma (SOC L2)') => {
    const newLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      analyst,
      action_type,
      details,
      status
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const openDocumentViewer = (docId, targetPassage = null) => {
    setSelectedDocId(docId);
    setHighlightedTargetPassage(targetPassage);
    setCurrentView('doc-viewer');
  };

  const startRunbookExecution = (runbookId) => {
    const doc = documents.find((d) => d.id === runbookId);
    if (!doc) return;

    setActiveRunbookRun({
      id: `RUN-${Date.now().toString().slice(-4)}`,
      runbook_id: doc.id,
      runbook_title: doc.title,
      analyst: 'N. Sharma (SOC L2)',
      started_at: new Date().toISOString(),
      completed_at: null,
      steps_completed: [],
      notes: {},
      doc
    });
    setCurrentView('runbook-run');
    addToast('Runbook Started', `Execution mode initialized for ${doc.title}`, 'info');
  };

  const markStepApplied = (stepId, stepText) => {
    setAppliedStepIds((prev) => new Set([...prev, stepId]));
    addToast('Mitigation Step Applied', `Step recorded in SOC incident log: "${stepText.slice(0, 45)}..."`, 'success');
    addActivityLog(
      'step_applied',
      `Applied mitigation step: "${stepText.slice(0, 60)}..." on active alert.`,
      'SUCCESS'
    );
  };

  const publishNewDocument = (docData) => {
    const newDoc = {
      id: `DOC-${docData.type.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      uploaded_by: 'Threat Intel Lead (S. Vance)',
      uploaded_at: new Date().toISOString(),
      ...docData
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addToast('Document Published', `"${newDoc.title}" is now searchable across Knowledge Base.`, 'success');
    addActivityLog(
      'document_uploaded',
      `Uploaded and published new ${docData.type}: "${newDoc.title}".`,
      'SUCCESS'
    );
  };

  const selectRecentAlert = (alertObj) => {
    setSelectedAlertId(alertObj.id);
    setActiveAlertText(alertObj.raw_text);
    addToast('Alert Loaded', `Loaded raw text for ${alertObj.id}: ${alertObj.title}`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        documents,
        alerts,
        activityLogs,
        activeAlertText,
        setActiveAlertText,
        selectedAlertId,
        setSelectedAlertId,
        selectRecentAlert,
        appliedStepIds,
        markStepApplied,
        selectedDocId,
        openDocumentViewer,
        highlightedTargetPassage,
        activeRunbookRun,
        setActiveRunbookRun,
        startRunbookExecution,
        publishNewDocument,
        addActivityLog,
        toasts,
        addToast,
        removeToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
