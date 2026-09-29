import express from 'express';
import { initialRunbooks } from '../db/data.js';

const router = express.Router();

// Mock Vector Store Collections Data
export let vectorStoreCollection = [
  {
    chunkId: "CHK-2026-001",
    runbookId: "RB-2026-088",
    sourceFile: "LockBit_3.0_Ransomware_Advisory.pdf",
    lineRange: "L12-L34",
    tokenCount: 184,
    text: "Set-EDRHostIsolation -Hostname {{host}} -IsolationMode Strict. Sever network connections except EDR management channel to prevent lateral movement to Active Directory Domain Controllers.",
    embeddingSample: [0.042, -0.192, 0.881, 0.312, -0.054, 0.419, 0.129, -0.732],
    metadata: { cve: "N/A", tactic: "Execution", technique: "T1059.001" }
  },
  {
    chunkId: "CHK-2026-002",
    runbookId: "ADV-2026-042",
    sourceFile: "CISA_Alert_ActiveMQ_Deserialization.md",
    lineRange: "L45-L89",
    tokenCount: 210,
    text: "Update activemq.xml to set allowImplicitSsl=\"true\" and classFilter=\"java.lang.*\". Quarantine inbound traffic from C2 IP at Cloud WAF.",
    embeddingSample: [-0.112, 0.428, 0.612, -0.089, 0.314, -0.221, 0.512, 0.041],
    metadata: { cve: "CVE-2026-9821", tactic: "Initial Access", technique: "T1190" }
  },
  {
    chunkId: "CHK-2026-003",
    runbookId: "RB-2026-014",
    sourceFile: "Okta_VPN_Credential_Stuffing_Runbook.json",
    lineRange: "L01-L22",
    tokenCount: 145,
    text: "Execute cisco-asa-cli clear vpn-session db username. Force terminate compromised VPN session and enforce step-up hardware token (FIDO2) MFA.",
    embeddingSample: [0.312, 0.089, -0.142, 0.771, -0.421, 0.112, -0.088, 0.651],
    metadata: { cve: "CVE-2026-2091", tactic: "Credential Access", technique: "T1110.004" }
  }
];

// Helper: Calculate Cosine Similarity between 2 vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return Number((dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4));
}

// 1. Get RAG Vector Collection & Indexing Statistics (Module 3.30, 3.31)
router.get('/collection', (req, res) => {
  const totalChunks = vectorStoreCollection.length;
  const totalTokens = vectorStoreCollection.reduce((acc, c) => acc + c.tokenCount, 0);
  const avgChunkSize = Math.round(totalTokens / totalChunks);

  res.json({
    success: true,
    stats: {
      vectorDimension: 768,
      distanceMetric: "Cosine Similarity",
      indexAlgorithm: "HNSW (Hierarchical Navigable Small World)",
      totalChunks,
      totalTokens,
      avgChunkSizeTokens: avgChunkSize,
      chunkOverlapTokens: 50
    },
    collection: vectorStoreCollection
  });
});

// 2. Perform Vector Search & Re-Ranking Query (Module 3.32, 3.33, 3.35)
router.post('/search', (req, res) => {
  const { queryText, topK = 3, similarityThreshold = 0.6, enableReRanking = true } = req.body;

  if (!queryText) {
    return res.status(400).json({ success: false, message: 'Query text required' });
  }

  // Simulated Query Vector Embedding (Module 3.26)
  const queryEmbedding = [0.038, -0.181, 0.852, 0.295, -0.041, 0.398, 0.115, -0.710];

  // Calculate similarity scores
  const rawResults = vectorStoreCollection.map(chunk => {
    const score = cosineSimilarity(queryEmbedding, chunk.embeddingSample);
    const reRankScore = enableReRanking ? Number((score * 1.12 - Math.random() * 0.05).toFixed(4)) : score;
    return {
      ...chunk,
      cosineSimilarityScore: score,
      reRankScore: Math.min(0.9999, reRankScore)
    };
  });

  // Filter & Sort by Re-Rank Score
  const filtered = rawResults.filter(r => r.cosineSimilarityScore >= similarityThreshold);
  filtered.sort((a, b) => b.reRankScore - a.reRankScore);

  const topKResults = filtered.slice(0, topK);

  res.json({
    success: true,
    queryText,
    topK,
    similarityThreshold,
    queryTokens: Math.ceil(queryText.length / 4),
    resultsCount: topKResults.length,
    results: topKResults
  });
});

// 3. Document Chunking & Token Inspector (Module 3.21, 3.23, 3.24)
router.post('/chunk-text', (req, res) => {
  const { documentText, chunkSize = 512, chunkOverlap = 50, filename } = req.body;

  if (!documentText) {
    return res.status(400).json({ success: false, message: 'Document text required' });
  }

  const words = documentText.split(/\s+/);
  const wordsPerChunk = Math.ceil(chunkSize / 1.3);
  const overlapWords = Math.ceil(chunkOverlap / 1.3);

  const chunks = [];
  let chunkIdx = 1;

  for (let i = 0; i < words.length; i += (wordsPerChunk - overlapWords)) {
    const chunkWords = words.slice(i, i + wordsPerChunk);
    if (chunkWords.length === 0) break;

    const chunkContent = chunkWords.join(' ');
    const tokenEst = Math.ceil(chunkContent.length / 4);

    chunks.push({
      chunkId: `CHK-PARSE-${chunkIdx}`,
      sourceFile: filename || 'Ingested_Advisory.txt',
      tokenCount: tokenEst,
      charCount: chunkContent.length,
      startWordIdx: i,
      endWordIdx: i + chunkWords.length,
      text: chunkContent,
      embeddingSample: Array.from({ length: 8 }, () => Number((Math.random() * 2 - 1).toFixed(3)))
    });
    chunkIdx++;
  }

  res.json({
    success: true,
    totalDocumentWords: words.length,
    totalDocumentTokens: Math.ceil(documentText.length / 4),
    generatedChunksCount: chunks.length,
    chunks
  });
});

// 4. Token & Cost Estimator Endpoint (Module 3.14, 3.15)
router.post('/estimate-tokens', (req, res) => {
  const { systemPrompt, userPrompt, contextChunks } = req.body;

  const systemTokens = systemPrompt ? Math.ceil(systemPrompt.length / 4) : 120;
  const userTokens = userPrompt ? Math.ceil(userPrompt.length / 4) : 80;
  const contextTokens = contextChunks ? contextChunks.reduce((acc, c) => acc + (c.tokenCount || 150), 0) : 450;

  const totalInputTokens = systemTokens + userTokens + contextTokens;
  const estimatedOutputTokens = 350;

  // Cost calculation (e.g. $0.0015 / 1K input tokens, $0.002 / 1K output tokens)
  const inputCost = (totalInputTokens / 1000) * 0.0015;
  const outputCost = (estimatedOutputTokens / 1000) * 0.0020;
  const totalCostUsd = Number((inputCost + outputCost).toFixed(5));

  const maxContextWindow = 128000;
  const contextUtilizationPct = Number(((totalInputTokens / maxContextWindow) * 100).toFixed(2));

  res.json({
    success: true,
    metrics: {
      systemTokens,
      userTokens,
      contextTokens,
      totalInputTokens,
      estimatedOutputTokens,
      totalCostUsd,
      maxContextWindow,
      contextUtilizationPct
    }
  });
});

export default router;
