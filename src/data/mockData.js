// AegisOps Threat Intelligence, Runbooks & Knowledge Corpus Data Store

export const INITIAL_DOCUMENTS = [
  {
    id: "DOC-REPORT-001",
    title: "APT29 (Cozy Bear) Supply Chain & Cloud Token Abuse Campaign Analysis",
    type: "report",
    severity: "critical",
    uploaded_by: "Threat Intel Lead (S. Vance)",
    uploaded_at: "2026-09-24T14:30:00Z",
    tags: ["APT29", "supply-chain", "cloud-token", "OAuth-abuse", "LSASS"],
    affected_products: ["Windows Server 2022", "Azure AD / Entra ID", "SolarWinds Orion", "AWS STS"],
    cve_ids: ["CVE-2024-38077", "CVE-2026-2091"],
    threat_actors: ["APT29", "Cozy Bear", "NOBELIUM"],
    summary: "Detailed actor profile and TTP breakdown for recent APT29 campaign targeting cloud identity tokens and DLL side-loading vectors.",
    content: `# APT29 Supply Chain & Cloud Token Abuse Campaign Analysis

## 1. Executive Summary
During Q3 2026, Threat Intelligence detected a sophisticated campaign attributed to **APT29 (Cozy Bear)**. The threat actor leveraged compromised CI/CD pipelines to execute DLL side-loading on target build servers, followed by memory credential dumping via LSASS process handles.

## 2. Technical Analysis & Attack Vector
- **Initial Ingress**: Exploitation of unpatched Windows Remote Licensing service (**CVE-2024-38077**) and SSL-VPN authentication bypass.
- **Privilege Escalation**: DLL side-loading using unsigned \`SolarWinds.BusinessLayerHost.dll\` replacement.
- **Credential Theft**: Direct memory read invocation against \`lsass.exe\` process memory space to harvest Kerberos TGT tokens.
- **Cloud Persistence**: Stolen AWS STS temporary security credentials to attach \`AdministratorAccess\` policies.

## 3. Mitigation & Remediation Procedures
### Section 3.1: Host Isolation & Memory Dumping Mitigation
1. Immediately isolate the host from the network using EDR isolation rules while preserving the EDR agent management channel to prevent lateral movement.
2. Terminate parent processes \`powershell.exe\` and spawning binary \`rundll32.exe\` using force process termination.
3. Flush Active Directory TGT tickets and force password reset for affected administrator service accounts (\`SVC_FIN_ADMIN\`).

### Section 3.2: Perimeter & Cloud Containment
1. Add remote C2 IP address \`185.220.101.45\` to perimeter firewall ingress and egress drop rules.
2. Attach explicit Deny-All inline policy to compromised AWS IAM roles to invalidate active STS session tokens.
3. Enforce FIDO2 hardware key Multi-Factor Authentication across all VPN access groups.`
  },
  {
    id: "DOC-RUNBOOK-001",
    title: "Ransomware Pre-Cursor & LSASS Credential Dumping Isolation Runbook",
    type: "runbook",
    severity: "critical",
    uploaded_by: "Incident Response Lead (M. Ross)",
    uploaded_at: "2026-09-25T09:15:00Z",
    tags: ["ransomware", "LSASS", "credential-dumping", "containment", "isolation"],
    affected_products: ["Windows Server", "Active Directory", "CrowdStrike EDR", "Palo Alto Firewall"],
    cve_ids: ["CVE-2024-38077"],
    threat_actors: ["LockBit 3.0", "BlackCat", "APT29"],
    summary: "Step-by-step rapid response procedure for containing active host memory credential dumping and pre-cursor ransomware deployment.",
    content: `# Ransomware Pre-Cursor & LSASS Credential Dumping Isolation Runbook

## Section 1: Phase I - Immediate Host Containment
When memory access anomalies or LSASS access flags trigger on a production server, complete the following containment steps immediately.

### Step 1: Network Isolation via EDR
**Instruction**: Sever all external and internal host network interface bindings using EDR strict isolation mode.
**Expected Outcome**: Host status changes to Isolated; network traffic blocked except EDR telemetry agent.

### Step 2: Terminate Suspicious Process Tree
**Instruction**: Execute process kill order for spawning PowerShell scripts and memory injection binaries (\`powershell.exe\`, \`rundll32.exe\`).
**Expected Outcome**: Malicious process PIDs are terminated, clearing memory execution loops.

### Step 3: Revoke Kerberos TGT & AD Credentials
**Instruction**: Invalidate Kerberos session tickets and perform emergency credential rotation for affected service accounts.
**Expected Outcome**: Pass-the-Ticket lateral movement vector is neutralized across domain controllers.

## Section 2: Phase II - Network & Perimeter Block
### Step 4: Block Command & Control (C2) IP Address
**Instruction**: Push malicious IP address (\`185.220.101.45\`) to perimeter firewall dynamic block lists.
**Expected Outcome**: Inbound/outbound traffic to the attacker infrastructure dropped at gateway.

### Step 5: Verify Volume Shadow Copy Integrity
**Instruction**: Execute volume shadow copy check to ensure VSS snapshots are intact and enforce snapshot immutability.
**Expected Outcome**: Shadow copy backup points verified intact, shielding system against ransomware encryption.`
  },
  {
    id: "DOC-ADV-001",
    title: "CISA Advisory: Apache ActiveMQ OpenWire Deserialization RCE (CVE-2026-9821)",
    type: "advisory",
    severity: "critical",
    uploaded_by: "Vulnerability Manager (A. Patel)",
    uploaded_at: "2026-09-27T11:00:00Z",
    tags: ["Apache", "ActiveMQ", "deserialization", "RCE", "zero-day", "CVE-2026-9821"],
    affected_products: ["Apache ActiveMQ 5.18.0 - 5.18.2", "Linux Enterprise Server"],
    cve_ids: ["CVE-2026-9821"],
    threat_actors: ["Kinsing", "Lazarus Group"],
    summary: "Critical unauthenticated remote code execution vulnerability in Apache ActiveMQ OpenWire transport layer.",
    content: `# Vulnerability Advisory: Apache ActiveMQ Deserialization RCE (CVE-2026-9821)

## 1. Vulnerability Overview
**CVE ID**: CVE-2026-9821
**CVSS v3.1 Score**: 9.8 (CRITICAL)
**Affected Software**: Apache ActiveMQ version 5.18.2 and earlier.

## 2. Technical Details
Unauthenticated remote attackers can instantiate arbitrary Java classes via crafted \`ClassPathXmlApplicationContext\` marshaled objects delivered over OpenWire protocol (TCP port 61616). Successful exploitation leads to unauthenticated root shell access on the host node.

## 3. Mandatory Mitigation & Patch Instructions
### Section 3.1: ActiveMQ Configuration Hardening
1. Modify \`activemq.xml\` to configure strict \`ClassFilter\` rules, explicitly restricting un-marshaling to trusted package prefixes.
2. Block inbound public access to TCP port 61616 on cloud WAF and perimeter firewalls.
3. Audit the \`/opt/activemq/webapps/\` directory for webshell artifacts (\`*.jsp\`, \`*.war\`) uploaded during exploitation attempts.
4. Upgrade Apache ActiveMQ to version 5.18.3 or apply vendor emergency hotfix patch.`
  },
  {
    id: "DOC-RUNBOOK-002",
    title: "Perimeter SSL-VPN Compromise & Account Isolation Runbook",
    type: "runbook",
    severity: "high",
    uploaded_by: "SOC Lead (R. Kumar)",
    uploaded_at: "2026-09-20T16:20:00Z",
    tags: ["VPN", "credential-stuffing", "Okta", "identity", "FIDO2"],
    affected_products: ["Cisco SSL-VPN", "Okta Identity Engine", "Palo Alto GlobalProtect"],
    cve_ids: ["CVE-2026-2091"],
    threat_actors: ["Scattered Spider", "UNC3944"],
    summary: "Standard operating procedure for responding to perimeter SSL-VPN credential stuffing, session hijacking, and unapproved geo-logins.",
    content: `# Perimeter SSL-VPN Compromise & Account Isolation Runbook

## 1. Trigger Criteria
This runbook triggers when SIEM or Identity Provider detects over 1,000 automated login failures within 5 minutes or successful VPN access from unapproved ASN locations.

## 2. Execution Steps
### Step 1: Terminate Compromised User Session
**Instruction**: Instantly terminate active SSL-VPN tunnel sessions and clear active web tokens for the user account.
**Expected Outcome**: User disconnects immediately from internal network.

### Step 2: Enforce Step-Up Hardware Token (FIDO2) MFA
**Instruction**: Re-configure user account in Identity Provider (Okta/Entra ID) to mandate FIDO2 hardware security key authentication.
**Expected Outcome**: Legacy OTP and push notification factors are disabled for target account.

### Step 3: Apply Geo-IP & Tor Exit Node Block Rules
**Instruction**: Update perimeter firewall and VPN gateway rules to drop connection attempts from Tor exit nodes and suspicious ASN ranges.
**Expected Outcome**: Inbound brute force traffic drops to zero.`
  },
  {
    id: "DOC-REPORT-002",
    title: "Threat Intel Digest: SolarWinds Build Pipeline Tampering & Side-Loading",
    type: "report",
    severity: "high",
    uploaded_by: "Threat Intel Analyst (K. Zhang)",
    uploaded_at: "2026-09-22T08:45:00Z",
    tags: ["supply-chain", "SolarWinds", "DLL-side-loading", "build-pipeline"],
    affected_products: ["SolarWinds Orion", "Jenkins CI/CD", "Windows Server 2019"],
    cve_ids: [],
    threat_actors: ["APT29", "UNC2452"],
    summary: "Comprehensive report detailing DLL side-loading techniques observed in build cluster environments.",
    content: `# Threat Intel Digest: SolarWinds Build Pipeline Tampering

## 1. Background
Threat actors continue targeting software build infrastructure to inject malicious code into trusted signed installer packages.

## 2. Technical Findings
In recent incidents, attackers gained access to build agent nodes and replaced original binary \`SolarWinds.BusinessLayerHost.dll\` with an unsigned version containing a persistent backdoor callback.

## 3. Recommended Remediation
1. Freeze automated release pipeline jobs in Jenkins/GitHub Actions immediately upon detection.
2. Replace untrusted binaries with cryptographically verified copies from cold storage repositories.
3. Run specialized YARA rules (\`apt29_backdoor.yar\`) across all build agent disks.`
  },
  {
    id: "DOC-RUNBOOK-003",
    title: "AWS Cloud Temporary STS Token Revocation Runbook",
    type: "runbook",
    severity: "medium",
    uploaded_by: "Cloud Security Specialist (D. Chen)",
    uploaded_at: "2026-09-18T13:10:00Z",
    tags: ["AWS", "IAM", "STS-token", "cloud-security", "privilege-escalation"],
    affected_products: ["AWS IAM", "AWS STS", "AWS GuardDuty"],
    cve_ids: [],
    threat_actors: ["FIN7", "Cloud-Rogue"],
    summary: "Immediate steps to revoke compromised temporary AWS STS security credentials and enforce policy restrictions.",
    content: `# AWS Cloud Temporary STS Token Revocation Runbook

## 1. Overview
When AWS GuardDuty alerts on anomalous STS token usage or privilege escalation attempt, perform emergency AWS role containment.

## 2. Mitigation Steps
### Step 1: Attach Deny-All Inline Policy to Compromised IAM Role
**Instruction**: Apply inline IAM policy with \`DateLessThan\` condition on \`aws:TokenIssueTime\` to invalidate all prior temporary STS credentials.
**Expected Outcome**: Attacker calls using stolen STS tokens immediately return \`AccessDenied\`.

### Step 2: Attach Emergency Service Control Policy (SCP)
**Instruction**: Attach restrictive SCP at the AWS Organization level to block cross-region API modifications.
**Expected Outcome**: AWS account privileges locked to read-only security monitoring.`
  },
  {
    id: "DOC-ADV-002",
    title: "Vulnerability Advisory: VMware vCenter Server Remote Code Execution (CVE-2024-38077)",
    type: "advisory",
    severity: "critical",
    uploaded_by: "SecOps Team",
    uploaded_at: "2026-09-26T15:00:00Z",
    tags: ["VMware", "vCenter", "heap-overflow", "RCE", "CVE-2024-38077"],
    affected_products: ["VMware vCenter Server 8.0", "VMware ESXi"],
    cve_ids: ["CVE-2024-38077"],
    threat_actors: ["RansomHub", "Akira Ransomware"],
    summary: "Critical heap overflow in DCERPC implementation allowing unauthenticated remote attackers to execute arbitrary commands.",
    content: `# Vulnerability Advisory: VMware vCenter Server RCE (CVE-2024-38077)

## 1. Severity & Impact
**CVSS Score**: 9.8 (CRITICAL)
Exploitation grants root level access to VMware vCenter Server infrastructure, enabling virtual machine snapshot encryption.

## 2. Recommended Action Steps
1. Isolate management network interfaces bound to port 445 / 135.
2. Disable unnecessary DCERPC service bindings.
3. Apply VMware ESXi emergency patch release ESXi_8.0U2-2026.`
  }
];

export const INITIAL_ALERTS = [
  {
    id: "ALT-2026-9041",
    title: "LockBit 3.0 Ransomware Pre-Cursor Execution & LSASS Memory Dumping",
    source: "CrowdStrike EDR / Microsoft Sentinel",
    severity: "critical",
    created_at: "2026-09-28T09:42:15Z",
    raw_text: `ALERT ID: ALT-2026-9041
TIMESTAMP: 2026-09-28 09:42:15 UTC
SOURCE: CrowdStrike EDR Agent v7.12
HOST: FIN-SRV-04.corp.internal (IP: 10.140.82.44)
SEVERITY: CRITICAL

DETECTION SUMMARY:
Process powershell.exe (PID: 4892) executed base64 encoded command string attempting memory read against lsass.exe (PID: 672). Spawning child process rundll32.exe (PID: 8102) with command line connecting to C2 IP 185.220.101.45.
VSS shadow deletion attempt detected: "vssadmin delete shadows /all /quiet".

ENTITIES DETECTED:
- CVE: CVE-2024-38077
- Threat Actor: LockBit 3.0, APT29
- Malware: Cobalt Strike
- Products: Windows Server 2022, Active Directory
- Techniques: T1059.001, T1003.001, T1490`,
    extracted_entities: {
      cves: ["CVE-2024-38077"],
      actors: ["LockBit 3.0", "APT29"],
      malware: ["Cobalt Strike"],
      products: ["Windows Server 2022", "Active Directory"],
      techniques: ["T1059.001", "T1003.001", "T1490"]
    }
  },
  {
    id: "ALT-2026-9042",
    title: "Apache ActiveMQ Deserialization Remote Code Execution (CVE-2026-9821)",
    source: "Palo Alto WAF / Suricata IDS",
    severity: "critical",
    created_at: "2026-09-28T09:35:00Z",
    raw_text: `ALERT ID: ALT-2026-9042
TIMESTAMP: 2026-09-28 09:35:00 UTC
SOURCE: Palo Alto Next-Gen WAF
HOST: PAYMENT-GW-01.prod.internal (IP: 172.16.4.12)
SEVERITY: CRITICAL

DETECTION SUMMARY:
Malicious OpenWire protocol packet delivered to TCP port 61616 containing ClassPathXmlApplicationContext payload. Process java.exe (PID: 1204) spawned /bin/sh reverse shell connecting to 91.240.118.12.

ENTITIES DETECTED:
- CVE: CVE-2026-9821
- Threat Actor: Kinsing
- Malware: OpenWire Exploit
- Products: Apache ActiveMQ 5.18.2
- Techniques: T1190, T1071.001`,
    extracted_entities: {
      cves: ["CVE-2026-9821"],
      actors: ["Kinsing"],
      malware: ["OpenWire Payload"],
      products: ["Apache ActiveMQ 5.18.2", "Linux Enterprise Server"],
      techniques: ["T1190", "T1071.001"]
    }
  },
  {
    id: "ALT-2026-9043",
    title: "Perimeter SSL-VPN Credential Stuffing & Session Hijack",
    source: "Cisco Duo / Okta Identity Protection",
    severity: "high",
    created_at: "2026-09-28T08:50:11Z",
    raw_text: `ALERT ID: ALT-2026-9043
TIMESTAMP: 2026-09-28 08:50:11 UTC
SOURCE: Okta Identity Protection Service
HOST: VPN-EDGE-EU.gateway.net (IP: 194.26.29.11)
SEVERITY: HIGH

DETECTION SUMMARY:
Over 4,500 automated login failures detected within 120s followed by successful authentication for account j.doe@corp.com from Tor exit node IP 198.51.100.77.

ENTITIES DETECTED:
- CVE: CVE-2026-2091
- Threat Actor: Scattered Spider
- Malware: Credential Stuffing Botnet
- Products: Cisco SSL-VPN, Okta Identity Engine
- Techniques: T1110.004, T1556`,
    extracted_entities: {
      cves: ["CVE-2026-2091"],
      actors: ["Scattered Spider"],
      malware: ["Credential Botnet"],
      products: ["Cisco SSL-VPN", "Okta Identity Engine"],
      techniques: ["T1110.004", "T1556"]
    }
  },
  {
    id: "ALT-2026-9044",
    title: "SolarWinds Supply Chain Unsigned DLL Side-Loading Anomaly",
    source: "Defender for Endpoint / Sysmon",
    severity: "high",
    created_at: "2026-09-28T07:15:40Z",
    raw_text: `ALERT ID: ALT-2026-9044
TIMESTAMP: 2026-09-28 07:15:40 UTC
SOURCE: Microsoft Defender for Endpoint
HOST: BUILD-PIPELINE-02.corp.internal (IP: 10.200.15.8)
SEVERITY: HIGH

DETECTION SUMMARY:
Unsigned DLL replacement detected in SolarWinds application directory. SolarWinds.BusinessLayerHost.exe failed signature verification.

ENTITIES DETECTED:
- CVE: None
- Threat Actor: APT29, NOBELIUM
- Malware: SolarWinds Backdoor
- Products: SolarWinds Orion, Jenkins CI/CD
- Techniques: T1195.002, T1574.002`,
    extracted_entities: {
      cves: [],
      actors: ["APT29", "NOBELIUM"],
      malware: ["SolarWinds Backdoor"],
      products: ["SolarWinds Orion", "Jenkins CI/CD"],
      techniques: ["T1195.002", "T1574.002"]
    }
  },
  {
    id: "ALT-2026-9045",
    title: "AWS IAM STS Temporary Token Abuse & Admin Escalation",
    source: "AWS GuardDuty / CloudTrail Log Anomaly",
    severity: "medium",
    created_at: "2026-09-28T06:00:22Z",
    raw_text: `ALERT ID: ALT-2026-9045
TIMESTAMP: 2026-09-28 06:00:22 UTC
SOURCE: AWS GuardDuty CloudTrail Anomaly
HOST: AWS-ACC-9482-1029 (Cloud AWS us-east-1)
SEVERITY: MEDIUM

DETECTION SUMMARY:
Temporary credentials requested via sts:AssumeRole from non-corporate IP 185.191.171.12 followed immediately by AttachUserPolicy call attaching AdministratorAccess.

ENTITIES DETECTED:
- CVE: None
- Threat Actor: FIN7
- Malware: AWS STS Abuse Script
- Products: AWS IAM, AWS STS
- Techniques: T1078.004, T1098`,
    extracted_entities: {
      cves: [],
      actors: ["FIN7"],
      malware: ["STS Exploit"],
      products: ["AWS IAM", "AWS STS"],
      techniques: ["T1078.004", "T1098"]
    }
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "ACT-8901",
    timestamp: "2026-09-28T09:44:00Z",
    analyst: "N. Sharma (SOC L2)",
    action_type: "step_applied",
    details: "Applied mitigation step: 'Network Isolation via EDR' on host FIN-SRV-04.corp.internal for alert ALT-2026-9041.",
    status: "SUCCESS"
  },
  {
    id: "ACT-8902",
    timestamp: "2026-09-28T09:40:12Z",
    analyst: "N. Sharma (SOC L2)",
    action_type: "search",
    details: "Analyzed raw SIEM alert for LockBit 3.0 / LSASS memory dumping. Extracted 5 entities.",
    status: "COMPLETED"
  },
  {
    id: "ACT-8903",
    timestamp: "2026-09-27T11:05:30Z",
    analyst: "A. Patel (Vulnerability Mgr)",
    action_type: "document_uploaded",
    details: "Uploaded and published vulnerability advisory: 'CISA Advisory: Apache ActiveMQ OpenWire Deserialization RCE (CVE-2026-9821)'",
    status: "SUCCESS"
  },
  {
    id: "ACT-8904",
    timestamp: "2026-09-25T09:30:00Z",
    analyst: "M. Ross (IR Lead)",
    action_type: "runbook_completed",
    details: "Executed and completed runbook: 'Ransomware Pre-Cursor & LSASS Credential Dumping Isolation Runbook' (5/5 steps verified).",
    status: "COMPLETED"
  }
];

// Helper: Entity Extractor Engine
export function extractEntitiesFromAlert(rawText) {
  if (!rawText) return { cves: [], actors: [], malware: [], products: [], techniques: [] };

  const text = rawText.toUpperCase();
  
  // Regex for CVEs
  const cveMatches = Array.from(rawText.matchAll(/CVE-\d{4}-\d+/gi)).map(m => m[0].toUpperCase());
  const uniqueCves = [...new Set(cveMatches)];

  // Regex for MITRE ATT&CK techniques
  const mitreMatches = Array.from(rawText.matchAll(/T\d{4}(?:\.\d{3})?/gi)).map(m => m[0].toUpperCase());
  const uniqueTechniques = [...new Set(mitreMatches)];

  // Known dictionary lookups
  const knownActors = ["APT29", "LOCKBIT 3.0", "LOCKBIT", "COZY BEAR", "NOBELIUM", "SCATTERED SPIDER", "FIN7", "KINSING", "LAZARUS GROUP"];
  const knownMalware = ["COBALT STRIKE", "OPENWIRE PAYLOAD", "BEACON", "MIMIKATZ", "YARA", "REVERSE SHELL"];
  const knownProducts = ["WINDOWS SERVER", "ACTIVE DIRECTORY", "APACHE ACTIVEMQ", "CISCO SSL-VPN", "OKTA", "SOLARWINDS ORION", "AWS IAM", "AWS STS", "VMWARE VCENTER"];

  const matchedActors = knownActors.filter(a => text.includes(a));
  const matchedMalware = knownMalware.filter(m => text.includes(m));
  const matchedProducts = knownProducts.filter(p => text.includes(p));

  return {
    cves: uniqueCves,
    actors: matchedActors,
    malware: matchedMalware,
    products: matchedProducts,
    techniques: uniqueTechniques
  };
}

// Helper: Search and Match Mitigation Steps
export function analyzeAlertAndGetResults(rawText, documents = INITIAL_DOCUMENTS) {
  const entities = extractEntitiesFromAlert(rawText);
  const textLower = rawText.toLowerCase();

  const mitigationSteps = [];
  const matchingRunbooks = [];
  const relatedAdvisories = [];

  documents.forEach(doc => {
    // Check relevance score
    let score = 0;
    
    // Check CVE match
    doc.cve_ids?.forEach(cve => {
      if (textLower.includes(cve.toLowerCase())) score += 50;
    });

    // Check Threat Actor match
    doc.threat_actors?.forEach(actor => {
      if (textLower.includes(actor.toLowerCase())) score += 30;
    });

    // Check Tag or Product match
    doc.affected_products?.forEach(prod => {
      if (textLower.includes(prod.toLowerCase())) score += 20;
    });

    doc.tags?.forEach(tag => {
      if (textLower.includes(tag.toLowerCase())) score += 15;
    });

    // Full-text keyword matches
    const keywords = ["lsass", "powershell", "activemq", "vpn", "c2", "isolation", "shadow", "sts", "token", "dll", "cve", "ransomware"];
    keywords.forEach(kw => {
      if (textLower.includes(kw) && doc.content.toLowerCase().includes(kw)) {
        score += 8;
      }
    });

    if (score > 10 || doc.type === 'runbook' || doc.type === 'advisory' || doc.type === 'report') {
      // Extract specific mitigation steps from document content
      const lines = doc.content.split('\n');
      let currentSection = "General Procedures";
      let stepCounter = 1;

      lines.forEach((line) => {
        if (line.startsWith('## ') || line.startsWith('### ')) {
          currentSection = line.replace(/^#+\s*/, '').trim();
        }

        // Detect step patterns
        if (line.match(/^(\d+\.|Step \d+:|\*\*Step \d+\*\*|- Step)/i) || (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.'))) {
          const stepText = line.replace(/^(\d+\.|Step \d+:|\*\*Step \d+\*\*|- Step)\s*/i, '').trim();
          if (stepText.length > 10) {
            mitigationSteps.push({
              id: `STEP-${doc.id}-${stepCounter}`,
              document_id: doc.id,
              document_title: doc.title,
              document_type: doc.type,
              section: currentSection,
              step_text: stepText,
              order: stepCounter,
              confidence: Math.min(99, Math.max(72, score + Math.floor(Math.random() * 10))),
              severity: doc.severity
            });
            stepCounter++;
          }
        }
      });

      if (doc.type === 'runbook') {
        matchingRunbooks.push({
          ...doc,
          matchConfidence: Math.min(98, score > 0 ? score + 40 : 80)
        });
      } else if (doc.type === 'advisory') {
        relatedAdvisories.push({
          ...doc,
          matchConfidence: Math.min(98, score > 0 ? score + 35 : 75)
        });
      }
    }
  });

  // Sort mitigation steps by confidence descending
  mitigationSteps.sort((a, b) => b.confidence - a.confidence);
  matchingRunbooks.sort((a, b) => b.matchConfidence - a.matchConfidence);
  relatedAdvisories.sort((a, b) => b.matchConfidence - a.matchConfidence);

  return {
    extracted_entities: entities,
    mitigation_steps: mitigationSteps.slice(0, 10),
    matching_runbooks: matchingRunbooks,
    related_advisories: relatedAdvisories
  };
}
