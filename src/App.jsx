import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HeaderNav from './components/HeaderNav';
import AlertTriageView from './components/AlertTriageView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import DocumentView from './components/DocumentView';
import RunbookExecutionView from './components/RunbookExecutionView';
import DocumentUploadView from './components/DocumentUploadView';
import ActivityLogView from './components/ActivityLogView';
import CommandPaletteModal from './components/CommandPaletteModal';
import ToastContainer from './components/ToastContainer';

function MainContent() {
  const { currentView } = useApp();

  return (
    <main className="main-viewport">
      {currentView === 'triage' && <AlertTriageView />}
      {currentView === 'knowledge' && <KnowledgeBaseView />}
      {currentView === 'doc-viewer' && <DocumentView />}
      {currentView === 'runbook-run' && <RunbookExecutionView />}
      {currentView === 'upload' && <DocumentUploadView />}
      {currentView === 'activity' && <ActivityLogView />}
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <HeaderNav />
        <MainContent />
        <CommandPaletteModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
