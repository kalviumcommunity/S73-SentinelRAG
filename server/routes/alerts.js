import express from 'express';
import { initialAlerts, initialRunbooks, initialAuditLogs } from '../db/data.js';

const router = express.Router();

// In-memory data store
export let alertsStore = [...initialAlerts];
export let auditLogsStore = [...initialAuditLogs];

// Get all alerts
router.get('/', (req, res) => {
  const { severity, status, search } = req.query;
  let filtered = [...alertsStore];

  if (severity && severity !== 'ALL') {
    filtered = filtered.filter(a => a.severity.toUpperCase() === severity.toUpperCase());
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter(a => a.status.toUpperCase() === status.toUpperCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.host.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      (a.iocs.c2Ip && a.iocs.c2Ip.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: filtered.length, alerts: filtered });
});

// Get alert details by ID (with matched runbook)
router.get('/:id', (req, res) => {
  const alert = alertsStore.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }

  const matchedRunbook = initialRunbooks.find(r => r.id === alert.matchedRunbookId) || null;

  res.json({
    success: true,
    alert,
    matchedRunbook
  });
});

// Trigger execution of a mitigation step for an alert
router.post('/:id/mitigate', (req, res) => {
  const alertIndex = alertsStore.findIndex(a => a.id === req.params.id);
  if (alertIndex === -1) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }

  const { stepId, analystName } = req.body;
  const alert = alertsStore[alertIndex];
  const matchedRunbook = initialRunbooks.find(r => r.id === alert.matchedRunbookId);

  const step = matchedRunbook ? matchedRunbook.mitigationSteps.find(s => s.stepId === stepId) : null;

  // Substitute variables in command
  let executedCmd = step ? step.automatedCommand : 'N/A';
  executedCmd = executedCmd
    .replace(/{{host}}/g, alert.host)
    .replace(/{{pid1}}/g, '4892')
    .replace(/{{pid2}}/g, '8102')
    .replace(/{{c2Ip}}/g, alert.iocs.c2Ip || '185.220.101.45');

  // Update alert status
  alertsStore[alertIndex].status = 'CONTAINED';

  // Create audit log entry
  const logEntry = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    alertId: alert.id,
    alertTitle: alert.title,
    stepTitle: step ? step.title : 'Manual Containment Trigger',
    actionBy: analystName || 'Analyst N. Sharma (SOC L2)',
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    executionTimeMs: Math.floor(200 + Math.random() * 400),
    commandExecuted: executedCmd,
    output: `[SOAR ENGINE]: Command executed successfully on target ${alert.ip} (${alert.host}).\nResult: 200 OK. Process terminated & security policy committed.\nHost Isolation Status: ACTIVE.\nAudit Log Synced to SIEM.`
  };

  auditLogsStore.unshift(logEntry);

  res.json({
    success: true,
    message: `Mitigation step '${step ? step.title : 'Action'}' executed successfully. Alert updated to CONTAINED.`,
    updatedAlert: alertsStore[alertIndex],
    auditLog: logEntry
  });
});

// Create new simulated SIEM/EDR alert
router.post('/', (req, res) => {
  const { title, host, ip, severity, sourceSIEM, description, c2Ip, domain, mitreTTPs } = req.body;

  const newAlert = {
    id: `ALT-2026-${Math.floor(9000 + Math.random() * 999)}`,
    title: title || 'Simulated Suspicious Process Execution',
    host: host || 'WK-PROD-99.corp.internal',
    ip: ip || '10.140.50.88',
    severity: severity || 'HIGH',
    status: 'UNMITIGATED',
    timestamp: new Date().toISOString(),
    sourceSIEM: sourceSIEM || 'Simulated EDR Stream',
    mitreTTPs: mitreTTPs || [{ id: 'T1059.001', name: 'PowerShell Execution' }],
    iocs: {
      hashes: ['f4b2a19828c891e847120349b1029c'],
      c2Ip: c2Ip || '198.51.100.22',
      domain: domain || 'malicious-domain-sim.org',
      process: 'powershell.exe -> cmd.exe'
    },
    matchedRunbookId: 'RB-2026-088',
    description: description || 'High frequency network outbound traffic to unverified IP.'
  };

  alertsStore.unshift(newAlert);

  res.json({
    success: true,
    message: 'New alert ingested into AegisOps engine.',
    alert: newAlert
  });
});

export default router;
