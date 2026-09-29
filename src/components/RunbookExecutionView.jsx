import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  CheckCircle2,
  Clock,
  User,
  Shield,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export default function RunbookExecutionView() {
  const { activeRunbookRun, setCurrentView, addToast, addActivityLog } = useApp();

  const [completedSteps, setCompletedSteps] = useState([]);
  const [notes, setNotes] = useState({});
  const [targetHost, setTargetHost] = useState('FIN-SRV-04.corp.internal');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const doc = activeRunbookRun?.doc;

  // Extract steps from markdown content or mitigation steps
  const stepsList = [];
  if (doc) {
    const lines = doc.content.split('\n');
    let currentStep = null;

    lines.forEach((line) => {
      if (line.startsWith('### Step ') || line.match(/^### Section \d+/)) {
        if (currentStep) stepsList.push(currentStep);
        currentStep = {
          number: stepsList.length + 1,
          title: line.replace(/^###\s*/, '').trim(),
          instruction: '',
          expectedOutcome: ''
        };
      } else if (currentStep) {
        if (line.startsWith('**Instruction**:')) {
          currentStep.instruction = line.replace('**Instruction**:', '').trim();
        } else if (line.startsWith('**Expected Outcome**:')) {
          currentStep.expectedOutcome = line.replace('**Expected Outcome**:', '').trim();
        } else if (line.trim().length > 0 && !currentStep.instruction) {
          currentStep.instruction += ' ' + line.trim();
        }
      }
    });
    if (currentStep) stepsList.push(currentStep);
  }

  // Timer loop
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  if (!doc) {
    return (
      <div className="runbook-run-empty">
        <p>No active runbook execution session.</p>
        <button className="btn-secondary" onClick={() => setCurrentView('triage')}>
          Return to Alert Triage
        </button>
      </div>
    );
  }

  const toggleStep = (stepNumber) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepNumber)) {
        return prev.filter((s) => s !== stepNumber);
      } else {
        const next = [...prev, stepNumber];
        addToast('Step Checked', `Step ${stepNumber} completed successfully.`, 'success');
        return next;
      }
    });
  };

  const handleNotesChange = (stepNumber, text) => {
    setNotes((prev) => ({ ...prev, [stepNumber]: text }));
  };

  const progressPercent =
    stepsList.length > 0 ? Math.round((completedSteps.length / stepsList.length) * 100) : 0;

  const handleCompleteRunbook = () => {
    setIsFinished(true);
    const durationFormatted = `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;

    addToast('Runbook Completed!', `Successfully executed runbook for ${targetHost} in ${durationFormatted}.`, 'success');
    addActivityLog(
      'runbook_completed',
      `Executed runbook "${doc.title}" on host ${targetHost}. Completed ${completedSteps.length}/${stepsList.length} steps in ${durationFormatted}.`,
      'COMPLETED'
    );
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="runbook-run-container">
      {/* Top Controls Header */}
      <div className="doc-viewer-topbar mb-4">
        <button className="btn-secondary-xs" onClick={() => setCurrentView('triage')}>
          <ArrowLeft size={14} /> Exit Runbook Mode
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-800/50">
            <Clock size={14} /> Duration: {formatTimer(elapsedSeconds)}
          </div>
          <span className="text-xs text-slate-400">Analyst: <strong className="text-slate-200">N. Sharma (SOC L2)</strong></span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="doc-meta-banner">
        <div className="flex items-center justify-between mb-2">
          <span className="badge badge-high">Active Execution Run</span>
          <span className="text-xs text-slate-400 font-mono">Run ID: {activeRunbookRun?.id}</span>
        </div>

        <h1 className="doc-title-text">{doc.title}</h1>

        <div className="target-host-box mt-3">
          <label className="text-xs text-slate-400 mr-2 font-semibold">Target Host / Infrastructure:</label>
          <input
            type="text"
            className="input-cyber input-sm inline-input font-mono"
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
          />
        </div>

        {/* Progress Bar Container */}
        <div className="progress-section mt-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-300">Runbook Progress</span>
            <span className="text-cyan-400">
              {completedSteps.length} of {stepsList.length} Steps Completed ({progressPercent}%)
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Checklist Steps Cards */}
      <div className="steps-checklist-wrapper mt-6">
        {stepsList.map((step) => {
          const isChecked = completedSteps.includes(step.number);

          return (
            <div key={step.number} className={`step-check-card ${isChecked ? 'step-checked' : ''}`}>
              <div className="step-card-header">
                <button className="step-checkbox-btn" onClick={() => toggleStep(step.number)}>
                  {isChecked ? (
                    <CheckCircle2 size={22} className="text-emerald-400" />
                  ) : (
                    <div className="checkbox-empty"></div>
                  )}
                  <span className="step-number-tag">Step {step.number}</span>
                </button>
                <h3 className="step-card-title">{step.title}</h3>
              </div>

              <div className="step-card-body pl-9">
                {step.instruction && (
                  <div className="step-instruction-box">
                    <strong>Instruction:</strong> {step.instruction}
                  </div>
                )}

                {step.expectedOutcome && (
                  <div className="step-outcome-box mt-2">
                    <strong>Expected Outcome:</strong> {step.expectedOutcome}
                  </div>
                )}

                {/* Analyst Notes Field */}
                <div className="notes-box mt-3">
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">
                    Analyst Notes & Audit Evidence:
                  </label>
                  <textarea
                    rows={2}
                    className="input-cyber font-mono text-xs"
                    placeholder="Enter command execution logs, output hashes, or notes..."
                    value={notes[step.number] || ''}
                    onChange={(e) => handleNotesChange(step.number, e.target.value)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Completion Action Bar */}
      <div className="complete-action-bar mt-6">
        <button
          className="btn-primary btn-lg w-full justify-center"
          onClick={handleCompleteRunbook}
          disabled={isFinished}
        >
          <CheckCircle2 size={18} /> Finish & Log Completed Runbook
        </button>
      </div>

      {/* Completion Summary Overlay */}
      {isFinished && (
        <div className="modal-backdrop">
          <div className="completion-modal">
            <div className="completion-icon-wrapper">
              <Award size={48} className="text-emerald-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-100 text-center mt-3">Runbook Execution Complete!</h2>
            <p className="text-xs text-slate-400 text-center mt-1">
              All response steps verified and logged into SOC activity records.
            </p>

            <div className="completion-stats-grid mt-4">
              <div className="stat-box">
                <span className="stat-label">Total Duration</span>
                <span className="stat-val text-cyan-400">{formatTimer(elapsedSeconds)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Steps Verified</span>
                <span className="stat-val text-emerald-400">{completedSteps.length}/{stepsList.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Target Host</span>
                <span className="stat-val font-mono text-xs text-slate-200">{targetHost}</span>
              </div>
            </div>

            <button
              className="btn-primary w-full justify-center mt-6"
              onClick={() => setCurrentView('activity')}
            >
              Go to Activity Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
