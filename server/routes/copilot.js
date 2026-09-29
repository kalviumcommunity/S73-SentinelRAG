import express from 'express';
import { initialRunbooks } from '../db/data.js';
import { alertsStore } from './alerts.js';

const router = express.Router();

// AI Copilot Query & Instant Script Synthesizer
router.post('/query', (req, res) => {
  const { query, alertId, targetFormat } = req.body;

  if (!query && !alertId) {
    return res.status(400).json({ success: false, message: 'Query or Alert ID is required' });
  }

  let contextualAlert = alertId ? alertsStore.find(a => a.id === alertId) : null;
  let contextualRunbook = contextualAlert ? initialRunbooks.find(r => r.id === contextualAlert.matchedRunbookId) : null;

  const targetHost = contextualAlert ? contextualAlert.host : 'TARGET-HOST-01';
  const targetIp = contextualAlert ? contextualAlert.ip : '10.140.82.44';
  const c2Ip = contextualAlert?.iocs?.c2Ip || '185.220.101.45';

  let generatedScript = '';
  let synthesisTitle = '';
  let format = targetFormat || 'PowerShell';

  if (query.toLowerCase().includes('isolate') || query.toLowerCase().includes('contain')) {
    synthesisTitle = `Host Isolation & Perimeter Drop Script (${format})`;
    if (format === 'PowerShell') {
      generatedScript = `# AegisOps Rapid Mitigation Script - Host Isolation
# Target: ${targetHost} (${targetIp})
# Active Threat: ${contextualAlert ? contextualAlert.title : 'Active Malware Attack'}

Write-Host "[+] Initiating Rapid Network Isolation on ${targetHost}..." -ForegroundColor Yellow
Set-EDRHostIsolation -Hostname "${targetHost}" -IsolationMode Strict -AllowSOCOnly $true

Write-Host "[+] Terminating malicious process handles..." -ForegroundColor Yellow
Stop-Process -Name "powershell" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "rundll32" -Force -ErrorAction SilentlyContinue

Write-Host "[+] Blocking C2 IP Address ${c2Ip} on perimeter..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "AegisOps-Block-C2" -Direction Outbound -RemoteAddress "${c2Ip}" -Action Block

Write-Host "[SUCCESS] Containment sequence completed on ${targetHost} in 4.2 seconds." -ForegroundColor Green`;
    } else if (format === 'Bash') {
      generatedScript = `#!/bin/bash
# AegisOps Rapid Mitigation Script (Linux/Bash)
# Target: ${targetHost} (${targetIp})

echo "[+] Terminating malicious sockets..."
fuser -k -9 61616/tcp

echo "[+] Applying Emergency iptables Drop Rule for C2 ${c2Ip}..."
iptables -A OUTPUT -d ${c2Ip} -j DROP
iptables -A INPUT -s ${c2Ip} -j DROP

echo "[+] Quarantining WebShell Artifacts..."
find /tmp /var/tmp -name "*.jsp" -type f -exec chmod 000 {} \\;

echo "[+] Containment Verified."`;
    } else if (format === 'CrowdStrike API') {
      generatedScript = `# CrowdStrike Falcon Py API Script
from falconpy import HostContainment

falcon = HostContainment(client_id="YOUR_CLIENT_ID", client_secret="YOUR_CLIENT_SECRET")
response = falcon.contain_host(id="${targetHost}")

print(f"[+] CrowdStrike EDR Host Containment Status: {response['status_code']}")`;
    } else {
      generatedScript = `aws iam put-role-policy --role-name SOC-Admin --policy-name DenyAllSTS --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}'`;
    }
  } else if (query.toLowerCase().includes('patch') || query.toLowerCase().includes('cve') || query.toLowerCase().includes('vulnerability')) {
    synthesisTitle = `Vulnerability Patch & Config Remediation (${format})`;
    generatedScript = `# AegisOps CVE Remediation Helper
# Vulnerability: ${contextualRunbook ? contextualRunbook.cve : 'CVE-2026-9821'}

# 1. Update service configuration
sed -i 's/allowImplicitSsl="false"/allowImplicitSsl="true"/g' /etc/config/activemq.xml

# 2. Restart target daemon safely
systemctl restart activemq
echo "[+] ActiveMQ configuration hardened according to advisory ${contextualRunbook ? contextualRunbook.id : 'ADV-2026-042'}"`;
  } else {
    synthesisTitle = `Rapid Security Incident Command Synthesis (${format})`;
    generatedScript = `# AegisOps Security Synthesis
# Prompt: "${query}"
# Target Host: ${targetHost}

# Step 1: Query active TCP connections
Get-NetTCPConnection -State Established | Where-Object {$_.RemoteAddress -eq "${c2Ip}"}

# Step 2: Flush DNS cache to eliminate poisoned resolutions
Clear-DnsClientCache

# Step 3: Trigger full Endpoint Anti-Malware Scan
Start-MpScan -ScanType FullScan`;
  }

  res.json({
    success: true,
    synthesisTitle,
    format,
    targetHost,
    targetIp,
    c2Ip,
    generatedScript,
    explanation: `Extracted mitigation parameters from ${contextualRunbook ? contextualRunbook.id : 'Threat Intelligence Database'} and compiled into execution-ready ${format} commands.`
  });
});

export default router;
