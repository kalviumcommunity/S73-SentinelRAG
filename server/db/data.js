// AegisOps Threat Intelligence, Runbooks & Active Alert Knowledge Base

export const initialAlerts = [
  {
    id: "ALT-2026-9041",
    title: "LockBit 3.0 Ransomware Pre-Cursor Execution & LSASS Memory Dumping",
    host: "FIN-SRV-04.corp.internal",
    ip: "10.140.82.44",
    severity: "CRITICAL",
    status: "UNMITIGATED", // UNMITIGATED, IN_PROGRESS, CONTAINED
    timestamp: "2026-09-28T09:42:15Z",
    sourceSIEM: "CrowdStrike EDR / Microsoft Sentinel",
    mitreTTPs: [
      { id: "T1059.001", name: "PowerShell Execution" },
      { id: "T1003.001", name: "LSASS Memory Credential Dumping" },
      { id: "T1490", name: "Inhibit System Recovery (VSS Wipe)" }
    ],
    iocs: {
      hashes: ["a6f7b1928c891e847120349b1029c", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
      c2Ip: "185.220.101.45",
      domain: "update-cdn-auth.com",
      process: "powershell.exe (PID 4892) -> rundll32.exe (PID 8102)"
    },
    matchedRunbookId: "RB-2026-088",
    description: "Detected encoded PowerShell downloading secondary payload into memory, followed by memory read access to lsass.exe process handle and vssadmin delete shadows command attempt."
  },
  {
    id: "ALT-2026-9042",
    title: "Apache ActiveMQ Deserialization Remote Code Execution (CVE-2026-9821)",
    host: "PAYMENT-GW-01.prod.internal",
    ip: "172.16.4.12",
    severity: "CRITICAL",
    status: "UNMITIGATED",
    timestamp: "2026-09-28T09:35:00Z",
    sourceSIEM: "Palo Alto WAF / Suricata IDS",
    mitreTTPs: [
      { id: "T1190", name: "Exploit Public-Facing Application" },
      { id: "T1071.001", name: "Web Protocols Command & Control" }
    ],
    iocs: {
      hashes: ["c81923d8f1023a94821a0029b"],
      c2Ip: "91.240.118.12",
      domain: "raw-git-storage.net",
      process: "java.exe (PID 1204) spawning /bin/sh"
    },
    matchedRunbookId: "ADV-2026-042",
    description: "Malicious OpenWire protocol packet delivered to TCP port 61616 resulting in unauthenticated remote command execution and reverse shell connection."
  },
  {
    id: "ALT-2026-9043",
    title: "Perimeter SSL-VPN Credential Stuffing & Session Hijack",
    host: "VPN-EDGE-EU.gateway.net",
    ip: "194.26.29.11",
    severity: "HIGH",
    status: "IN_PROGRESS",
    timestamp: "2026-09-28T08:50:11Z",
    sourceSIEM: "Cisco Duo / Okta Identity Protection",
    mitreTTPs: [
      { id: "T1110.004", name: "Credential Stuffing" },
      { id: "T1556", name: "Modify Authentication Process" }
    ],
    iocs: {
      hashes: [],
      c2Ip: "198.51.100.77",
      domain: "anon-tor-node.org",
      process: "sslvpnd (PID 882)"
    },
    matchedRunbookId: "RB-2026-014",
    description: "Over 4,500 automated login attempts detected within 120 seconds. Account 'j.doe@corp.com' successfully authenticated from high-risk ASN located in unapproved geographical region."
  },
  {
    id: "ALT-2026-9044",
    title: "SolarWinds Supply Chain Unsigned DLL Side-Loading Anomaly",
    host: "BUILD-PIPELINE-02.corp.internal",
    ip: "10.200.15.8",
    severity: "HIGH",
    status: "UNMITIGATED",
    timestamp: "2026-09-28T07:15:40Z",
    sourceSIEM: "Defender for Endpoint / Sysmon",
    mitreTTPs: [
      { id: "T1195.002", name: "Supply Chain Compromise" },
      { id: "T1574.002", name: "DLL Side-Loading" }
    ],
    iocs: {
      hashes: ["9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"],
      c2Ip: "45.142.120.9",
      domain: "solarwinds-telemetry-update.com",
      process: "SolarWinds.BusinessLayerHost.exe"
    },
    matchedRunbookId: "ADV-2026-104",
    description: "Unsigned DLL library replaced inside legitimate SolarWinds application directory. DLL signature verification failed during execution."
  },
  {
    id: "ALT-2026-9045",
    title: "AWS IAMSTS Temporary Token Abuse & Admin Escalation",
    host: "AWS-ACC-9482-1029",
    ip: "Cloud AWS us-east-1",
    severity: "MEDIUM",
    status: "CONTAINED",
    timestamp: "2026-09-28T06:00:22Z",
    sourceSIEM: "AWS GuardDuty / CloudTrail Log Anomaly",
    mitreTTPs: [
      { id: "T1078.004", name: "Cloud Accounts Abuse" },
      { id: "T1098", name: "Account Privilege Escalation" }
    ],
    iocs: {
      hashes: [],
      c2Ip: "185.191.171.12",
      domain: "aws-sts-proxy.io",
      process: "aws-cli / boto3 API script"
    },
    matchedRunbookId: "RB-2026-033",
    description: "Temporary security credentials requested via sts:AssumeRole from non-corporate IP address followed by immediate call to IAM AttachUserPolicy with AdministratorAccess."
  }
];

export const initialRunbooks = [
  {
    id: "RB-2026-088",
    title: "Ransomware Pre-Cursor & LSASS Memory Dumping Rapid Isolation Runbook",
    type: "Incident Runbook",
    cve: "N/A (TTP-Based)",
    mitreTechniques: ["T1059.001", "T1003.001", "T1490"],
    updatedAt: "2026-09-25",
    author: "Global SOC Incident Response Team",
    sourceAdvisory: "CISA Alert AA23-325A / LockBit 3.0 Technical Advisory",
    summary: "Immediate containment procedure for active host experiencing memory credential dumping and automated ransomware deployment vectors.",
    mitigationSteps: [
      {
        stepId: 1,
        title: "Isolate Target Host via EDR",
        description: "Sever all network connections except EDR management channel to prevent lateral movement to domain controllers.",
        automatedCommand: "Set-EDRHostIsolation -Hostname {{host}} -IsolationMode Strict -AllowSOCOnly $true",
        commandType: "PowerShell / CrowdStrike API",
        riskLevel: "HIGH (Restricts network traffic)",
        estimatedTimeSec: 10
      },
      {
        stepId: 2,
        title: "Kill Malicious Process Tree",
        description: "Terminate spawning parent PowerShell and child rundll32.exe binaries before encryption routines trigger.",
        automatedCommand: "Stop-Process -Id {{pid1}},{{pid2}} -Force; Get-WmiObject Win32_Process -Filter \"name='powershell.exe'\" | ForEach-Object {$_.Terminate()}",
        commandType: "PowerShell CLI",
        riskLevel: "MEDIUM",
        estimatedTimeSec: 5
      },
      {
        stepId: 3,
        title: "Revoke Kerberos TGT & Active Directory Credentials",
        description: "Invalidate session tokens for compromised admin/service accounts to block Pass-The-Ticket attacks.",
        automatedCommand: "Revoke-ADUserSession -Identity \"SVC_FIN_ADMIN\" -FlushTGT; Reset-ADAccountPassword -Identity \"SVC_FIN_ADMIN\" -GenerateComplex",
        commandType: "Active Directory Module",
        riskLevel: "HIGH",
        estimatedTimeSec: 15
      },
      {
        stepId: 4,
        title: "Perimeter Block Command & Control (C2) IP",
        description: "Push malicious egress IP address to perimeter firewall dynamic blocklist.",
        automatedCommand: "New-PaloAltoRule -Name \"BLOCK-LOCKBIT-C2\" -SourceAny -DestinationIP \"{{c2Ip}}\" -Action Drop -Commit",
        commandType: "Firewall API / CLI",
        riskLevel: "LOW",
        estimatedTimeSec: 8
      },
      {
        stepId: 5,
        title: "Verify Volume Shadow Copy Integrity",
        description: "Check shadow copy status and enforce volume snapshot immutability.",
        automatedCommand: "vssadmin list shadows; Get-VssSnapshot -Volume C:",
        commandType: "Cmd / PowerShell",
        riskLevel: "LOW",
        estimatedTimeSec: 5
      }
    ]
  },
  {
    id: "ADV-2026-042",
    title: "CISA Emergency Advisory: Apache ActiveMQ Deserialization RCE (CVE-2026-9821)",
    type: "Vulnerability Advisory",
    cve: "CVE-2026-9821",
    mitreTechniques: ["T1190", "T1071.001"],
    updatedAt: "2026-09-27",
    author: "CISA Cybersecurity Division / Apache Security Team",
    sourceAdvisory: "CISA Alert KEV-2026-9821",
    summary: "Critical unauthenticated RCE flaw in Apache ActiveMQ OpenWire protocol implementation allowing remote execution of arbitrary Java code via ClassPathXmlApplicationContext payload.",
    mitigationSteps: [
      {
        stepId: 1,
        title: "Apply Immediate Configuration Mitigation in activemq.xml",
        description: "Disable untrusted class instantiation by configuring ClassFilter properties in activemq.xml file.",
        automatedCommand: "sed -i 's/<broker /<broker allowImplicitSsl=\"true\" classFilter=\"java.lang.*,org.apache.activemq.*\" /g' /opt/activemq/conf/activemq.xml",
        commandType: "Bash Script",
        riskLevel: "MEDIUM (Requires activemq restart)",
        estimatedTimeSec: 12
      },
      {
        stepId: 2,
        title: "Block Malicious Inbound IP at Cloud WAF",
        description: "Quarantine attacking IP on edge web application firewall.",
        automatedCommand: "cloudflare-cli rules add --zone prod.internal --mode block --ip {{c2Ip}} --notes \"CVE-2026-9821 Exploit Origin\"",
        commandType: "Cloudflare WAF CLI",
        riskLevel: "LOW",
        estimatedTimeSec: 6
      },
      {
        stepId: 3,
        title: "Scan & Remove Dropped Web Shells",
        description: "Search activemq webapps directory for newly created .jsp or .war files.",
        automatedCommand: "find /opt/activemq/webapps/ -name \"*.jsp\" -ctime -1 -exec rm -f {} \\; -print",
        commandType: "Linux Shell",
        riskLevel: "MEDIUM",
        estimatedTimeSec: 10
      },
      {
        stepId: 4,
        title: "Restart ActiveMQ Service Container",
        description: "Reboot activemq daemon to load updated configuration.",
        automatedCommand: "systemctl restart activemq || docker restart activemq-prod-01",
        commandType: "Systemd / Docker",
        riskLevel: "HIGH (Brief service interruption)",
        estimatedTimeSec: 15
      }
    ]
  },
  {
    id: "RB-2026-014",
    title: "Perimeter SSL-VPN Compromise & Identity Isolation Runbook",
    type: "Incident Runbook",
    cve: "CVE-2026-2091",
    mitreTechniques: ["T1110.004", "T1556"],
    updatedAt: "2026-09-20",
    author: "Identity & Access Management Response Lead",
    sourceAdvisory: "Internal Threat Intel / Okta Threat Intelligence",
    summary: "Response runbook for large-scale VPN brute forcing, credential stuffing, and session token theft.",
    mitigationSteps: [
      {
        stepId: 1,
        title: "Force Terminate Compromised User Session",
        description: "Immediately invalidate current VPN web socket and active tunnel for user account.",
        automatedCommand: "cisco-asa-cli clear vpn-session db username \"j.doe@corp.com\"",
        commandType: "Network Appliance CLI",
        riskLevel: "MEDIUM",
        estimatedTimeSec: 5
      },
      {
        stepId: 2,
        title: "Enforce Step-Up Hardware Token (FIDO2) MFA",
        description: "Require WebAuthn / YubiKey authentication for user group.",
        automatedCommand: "okta-cli user update \"j.doe@corp.com\" --require-mfa --factor-type hardware_key",
        commandType: "Identity Provider API",
        riskLevel: "LOW",
        estimatedTimeSec: 8
      },
      {
        stepId: 3,
        title: "Apply ASN & Geo-IP Block on SSL-VPN Listener",
        description: "Drop inbound connections from high-risk ASN ranges associated with Tor exit nodes and proxies.",
        automatedCommand: "iptables -A INPUT -p tcp --dport 443 -m set --match-set tor_exit_nodes src -j DROP",
        commandType: "Linux iptables",
        riskLevel: "LOW",
        estimatedTimeSec: 4
      }
    ]
  },
  {
    id: "ADV-2026-104",
    title: "Supply Chain Software DLL Integrity & Compromise Remediation",
    type: "Threat Intelligence Report",
    cve: "N/A (APT29 TTP)",
    mitreTechniques: ["T1195.002", "T1574.002"],
    updatedAt: "2026-09-22",
    author: "Cyber Threat Intelligence (CTI) Unit",
    sourceAdvisory: "FireEye / Mandiant Advisory APT29-SC",
    summary: "Protocol for detecting and neutralizing untrusted, tampered, or side-loaded binaries within automated build environments.",
    mitigationSteps: [
      {
        stepId: 1,
        title: "Halt CI/CD Deployment Pipeline Jobs",
        description: "Freeze all automated release pipelines to prevent pushing infected artifacts to production.",
        automatedCommand: "jenkins-cli disable-job --all-builds --reason \"Security Containment ALT-2026-9044\"",
        commandType: "Jenkins / GitHub Actions CLI",
        riskLevel: "HIGH",
        estimatedTimeSec: 10
      },
      {
        stepId: 2,
        title: "Restore Authenticated Binary from Golden Repository",
        description: "Replace compromised binary with cryptographically verified build artifact.",
        automatedCommand: "Copy-Item -Path \"\\\\golden-repo\\signed\\SolarWinds.BusinessLayerHost.dll\" -Destination \"C:\\Program Files\\SolarWinds\\Orion\\\" -Force",
        commandType: "PowerShell",
        riskLevel: "MEDIUM",
        estimatedTimeSec: 12
      },
      {
        stepId: 3,
        title: "Execute YARA Rules Across Build Cluster",
        description: "Scan local storage for backdoor signatures.",
        automatedCommand: "yara64.exe -r C:\\Rules\\apt29_backdoor.yar C:\\BuildAgent\\",
        commandType: "YARA Engine",
        riskLevel: "LOW",
        estimatedTimeSec: 20
      }
    ]
  },
  {
    id: "RB-2026-033",
    title: "Cloud AWS IAM Token Abuse & Instant Role Revocation Runbook",
    type: "Incident Runbook",
    cve: "N/A (Cloud TTP)",
    mitreTechniques: ["T1078.004", "T1098"],
    updatedAt: "2026-09-18",
    author: "Cloud Infrastructure Security Team",
    sourceAdvisory: "AWS Security Incident Response Guide",
    summary: "Step-by-step mitigation when stolen or leaked AWS temporary STS tokens are used to gain privilege escalation in AWS accounts.",
    mitigationSteps: [
      {
        stepId: 1,
        title: "Attach Deny-All Policy to Compromised IAM Role",
        description: "Immediately block all API actions attempted using the compromised role.",
        automatedCommand: "aws iam put-role-policy --role-name SOC-Admin --policy-name RevokeOlderSessions --policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Deny\",\"Action\":\"*\",\"Resource\":\"*\",\"Condition\":{\"DateLessThan\":{\"aws:TokenIssueTime\":\"2026-09-28T09:50:00Z\"}}}]}'",
        commandType: "AWS CLI",
        riskLevel: "HIGH",
        estimatedTimeSec: 6
      },
      {
        stepId: 2,
        title: "Attach Emergency Service Control Policy (SCP) to AWS Account",
        description: "Lock down cloud region and restrict external network egress.",
        automatedCommand: "aws organizations attach-policy --policy-id p-emergency-lockdown --target-id 948210294481",
        commandType: "AWS CLI Organizations",
        riskLevel: "HIGH",
        estimatedTimeSec: 10
      }
    ]
  }
];

export const mitreMatrix = [
  {
    tactic: "Initial Access",
    techniques: [
      { id: "T1190", name: "Exploit Public-Facing App", status: "COVERED", runbookId: "ADV-2026-042" },
      { id: "T1566", name: "Phishing via Malicious Attachment", status: "GAP", runbookId: null },
      { id: "T1195.002", name: "Supply Chain Compromise", status: "COVERED", runbookId: "ADV-2026-104" }
    ]
  },
  {
    tactic: "Execution",
    techniques: [
      { id: "T1059.001", name: "PowerShell Scripting", status: "COVERED", runbookId: "RB-2026-088" },
      { id: "T1059.003", name: "Windows Command Shell", status: "GAP", runbookId: null },
      { id: "T1204", name: "User Execution", status: "GAP", runbookId: null }
    ]
  },
  {
    tactic: "Credential Access",
    techniques: [
      { id: "T1003.001", name: "LSASS Memory Dumping", status: "COVERED", runbookId: "RB-2026-088" },
      { id: "T1110.004", name: "Credential Stuffing", status: "COVERED", runbookId: "RB-2026-014" },
      { id: "T1555", name: "Credentials from Password Stores", status: "GAP", runbookId: null }
    ]
  },
  {
    tactic: "Privilege Escalation",
    techniques: [
      { id: "T1098", name: "Account Privilege Escalation", status: "COVERED", runbookId: "RB-2026-033" },
      { id: "T1574.002", name: "DLL Side-Loading", status: "COVERED", runbookId: "ADV-2026-104" }
    ]
  },
  {
    tactic: "Command & Control",
    techniques: [
      { id: "T1071.001", name: "Web Protocols (HTTP/S)", status: "COVERED", runbookId: "ADV-2026-042" },
      { id: "T1573", name: "Encrypted Channel", status: "GAP", runbookId: null }
    ]
  },
  {
    tactic: "Impact",
    techniques: [
      { id: "T1490", name: "Inhibit System Recovery", status: "COVERED", runbookId: "RB-2026-088" },
      { id: "T1486", name: "Data Encrypted for Impact", status: "GAP", runbookId: null }
    ]
  }
];

export const initialAuditLogs = [
  {
    id: "LOG-1092",
    alertId: "ALT-2026-9045",
    alertTitle: "AWS IAMSTS Temporary Token Abuse & Admin Escalation",
    stepTitle: "Attach Deny-All Policy to Compromised IAM Role",
    actionBy: "Analyst N. Sharma (SOC L2)",
    timestamp: "2026-09-28T06:05:12Z",
    status: "SUCCESS",
    executionTimeMs: 420,
    commandExecuted: "aws iam put-role-policy --role-name SOC-Admin...",
    output: "STATUS: 200 OK. Role Policy 'RevokeOlderSessions' attached successfully. Active sessions invalidated."
  }
];
