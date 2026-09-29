import express from 'express';
import { initialRunbooks } from '../db/data.js';

const router = express.Router();

export let runbooksStore = [...initialRunbooks];

// Get all runbooks and advisories
router.get('/', (req, res) => {
  const { type, search } = req.query;
  let filtered = [...runbooksStore];

  if (type && type !== 'ALL') {
    filtered = filtered.filter(r => r.type.toLowerCase().includes(type.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.cve.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: filtered.length, runbooks: filtered });
});

// Get single runbook by ID
router.get('/:id', (req, res) => {
  const runbook = runbooksStore.find(r => r.id === req.params.id);
  if (!runbook) {
    return res.status(404).json({ success: false, message: 'Runbook not found' });
  }
  res.json({ success: true, runbook });
});

// Ingest new Threat Intel Advisory / Runbook (with auto mitigation extractor)
router.post('/ingest', (req, res) => {
  const { rawText, title, type, cve, author, sourceAdvisory } = req.body;

  if (!rawText && !title) {
    return res.status(400).json({ success: false, message: 'Advisory text or title required.' });
  }

  // Simulated AI Parsing Engine: Extracts CVE, MITRE TTPs, and actionable steps
  const extractedCve = cve || (rawText && rawText.match(/CVE-\d{4}-\d+/i) ? rawText.match(/CVE-\d{4}-\d+/i)[0] : 'N/A');
  
  const newRunbookId = `ADV-2026-${Math.floor(200 + Math.random() * 800)}`;
  
  const generatedSteps = [
    {
      stepId: 1,
      title: "Isolate Suspected Host & Quarantine Traffic",
      description: "Block ingress/egress network connections for target host identified in report.",
      automatedCommand: `Set-EDRHostIsolation -Hostname {{host}} -Strict`,
      commandType: "PowerShell / EDR API",
      riskLevel: "HIGH",
      estimatedTimeSec: 8
    },
    {
      stepId: 2,
      title: "Apply Patch / Configuration Lockdown",
      description: "Enforce advisory configuration changes and revoke unauthorized privileges.",
      automatedCommand: `Invoke-SecurityLockdown -AdvisoryID "${newRunbookId}" -Scope LocalHost`,
      commandType: "CLI Script",
      riskLevel: "MEDIUM",
      estimatedTimeSec: 15
    },
    {
      stepId: 3,
      title: "Block Inbound Indicator IPs on Perimeter",
      description: "Egress/Ingress blocking for suspicious IOC addresses.",
      automatedCommand: `firewall-cmd --add-rich-rule='rule family="ipv4" source address="{{c2Ip}}" drop'`,
      commandType: "Linux Firewall CLI",
      riskLevel: "LOW",
      estimatedTimeSec: 5
    }
  ];

  const newRunbook = {
    id: newRunbookId,
    title: title || `Advisory Ingestion: ${extractedCve}`,
    type: type || 'Vulnerability Advisory',
    cve: extractedCve,
    mitreTechniques: ["T1190", "T1059.001"],
    updatedAt: new Date().toISOString().split('T')[0],
    author: author || 'SOC CTI Parser Engine',
    sourceAdvisory: sourceAdvisory || 'Ingested File Document',
    summary: rawText ? rawText.slice(0, 250) + '...' : 'Extracted rapid mitigation procedures from uploaded threat intelligence document.',
    mitigationSteps: generatedSteps
  };

  runbooksStore.unshift(newRunbook);

  res.json({
    success: true,
    message: `Threat Advisory '${newRunbook.title}' successfully ingested and indexed with 3 rapid mitigation steps.`,
    runbook: newRunbook
  });
});

export default router;
