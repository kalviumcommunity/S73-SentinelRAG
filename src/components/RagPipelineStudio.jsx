import React, { useState, useEffect } from 'react';
import { 
  Database, Cpu, Sliders, Layers, Search, Sparkles, FileText, 
  Zap, ArrowRight, CheckCircle2, RefreshCw, DollarSign, Terminal, ShieldCheck
} from 'lucide-react';

export default function RagPipelineStudio() {
  const [subTab, setSubTab] = useState('search'); // 'search', 'chunker', 'cost', 'prompts'

  // Vector Search State
  const [searchQuery, setSearchQuery] = useState('LockBit 3.0 Ransomware PowerShell memory dumping isolation');
  const [topK, setTopK] = useState(3);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.60);
  const [enableReRanking, setEnableReRanking] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Document Chunking State
  const [docText, setDocText] = useState(`CISA Emergency Directive 22-02. Apache ActiveMQ OpenWire deserialization flaw (CVE-2026-9821) allows unauthenticated remote code execution. Step 1: Set allowImplicitSsl="true" in activemq.xml configuration file. Step 2: Add iptables drop rule for remote C2 IP address 91.240.118.12 at Cloud WAF. Step 3: Scan /opt/activemq/webapps directory for newly created .jsp web shell artifacts and quarantine immediately.`);
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [chunkResults, setChunkResults] = useState(null);
  const [chunking, setChunking] = useState(false);

  // Token Cost Estimator State
  const [systemPrompt, setSystemPrompt] = useState(`You are AegisOps AI Cyber Incident Responder. Extract actionable mitigation steps and return valid JSON.`);
  const [userPrompt, setUserPrompt] = useState(`Active Threat: LockBit 3.0 Ransomware on host FIN-SRV-04 (10.140.82.44). Synthesize PowerShell isolation script.`);
  const [tokenMetrics, setTokenMetrics] = useState(null);
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);

  // Execute Vector Search
  const runVectorSearch = async () => {
    setSearching(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryText: searchQuery,
          topK: Number(topK),
          similarityThreshold: Number(similarityThreshold),
          enableReRanking
        })
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // Execute Text Chunking
  const runTextChunker = async () => {
    setChunking(true);
    try {
      const res = await fetch('/api/rag/chunk-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          chunkSize: Number(chunkSize),
          chunkOverlap: Number(chunkOverlap),
          filename: 'CISA_Advisory_ActiveMQ.txt'
        })
      });
      const data = await res.json();
      if (data.success) {
        setChunkResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChunking(false);
    }
  };

  // Calculate Token Cost Estimation
  const calculateCostMetrics = async () => {
    try {
      const res = await fetch('/api/rag/estimate-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          contextChunks: searchResults?.results || []
        })
      });
      const data = await res.json();
      if (data.success) {
        setTokenMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runVectorSearch();
    runTextChunker();
  }, []);

  useEffect(() => {
    calculateCostMetrics();
  }, [systemPrompt, userPrompt, searchResults]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner & Sub-Tabs */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <Database size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              RAG Pipeline & Vector DB Embeddings Studio
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Inspect vector embeddings, HNSW indexing, token-aware chunking, cosine similarity, and LLM context cost estimation.
          </p>
        </div>

        {/* Sub Navigation Bar */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`nav-tab ${subTab === 'search' ? 'active' : ''}`}
            onClick={() => setSubTab('search')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            <Search size={14} />
            <span>Vector Search & Re-Ranker</span>
          </button>

          <button 
            className={`nav-tab ${subTab === 'chunker' ? 'active' : ''}`}
            onClick={() => setSubTab('chunker')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            <FileText size={14} />
            <span>Chunking Visualizer</span>
          </button>

          <button 
            className={`nav-tab ${subTab === 'prompts' ? 'active' : ''}`}
            onClick={() => setSubTab('prompts')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            <Sliders size={14} />
            <span>Prompt & Model Tuner</span>
          </button>

          <button 
            className={`nav-tab ${subTab === 'cost' ? 'active' : ''}`}
            onClick={() => setSubTab('cost')}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            <DollarSign size={14} />
            <span>Tokens & Cost Estimator</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: VECTOR SEARCH & RE-RANKER */}
      {subTab === 'search' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.25rem' }}>
          {/* Controls Panel */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={16} color="var(--accent-cyan)" />
              <span>Retrieval Parameter Controls</span>
            </h3>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Query Input Vector String
              </label>
              <textarea 
                className="input-cyber" 
                rows={3} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.825rem' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Top-K Retrieval Candidate Limit</span>
                <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>Top-{topK}</strong>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={topK} 
                onChange={(e) => setTopK(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cosine Similarity Cutoff Threshold</span>
                <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{similarityThreshold}</strong>
              </div>
              <input 
                type="range" 
                min="0.30" 
                max="0.90" 
                step="0.05"
                value={similarityThreshold} 
                onChange={(e) => setSimilarityThreshold(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Cross-Encoder Re-Ranker</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sharpen top candidate chunk order</div>
              </div>
              <input 
                type="checkbox" 
                checked={enableReRanking} 
                onChange={(e) => setEnableReRanking(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <button className="btn-primary" onClick={runVectorSearch} disabled={searching} style={{ width: '100%', justifyContent: 'center' }}>
              <Zap size={15} />
              <span>{searching ? 'Querying HNSW Index...' : 'Run Vector Similarity Search'}</span>
            </button>
          </div>

          {/* Results Area */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  HNSW Top-K Retrieved Context Chunks
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Vector Store Index: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>768-Dim Cosine Distance</strong>
                </span>
              </div>

              {searchResults && (
                <span className="badge badge-medium" style={{ fontSize: '0.7rem' }}>
                  {searchResults.resultsCount} Chunks Retrieved ({searchResults.queryTokens} Query Tokens)
                </span>
              )}
            </div>

            {searchResults?.results?.map((res, idx) => (
              <div key={res.chunkId} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: 'var(--accent-cyan)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      Rank #{idx + 1}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', fontWeight: 700 }}>
                      {res.chunkId}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Source: {res.sourceFile} ({res.lineRange})
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cosine: <strong style={{ color: 'var(--accent-cyan)' }}>{res.cosineSimilarityScore}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Re-Rank Score: <strong style={{ color: 'var(--accent-emerald)' }}>{res.reRankScore}</strong></span>
                  </div>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-canvas)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.65rem' }}>
                  "{res.text}"
                </p>

                {/* Embedding 8-dim preview vector */}
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Embedding Sample Vector: [{res.embeddingSample.join(', ')}]
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CHUNKING VISUALIZER */}
      {subTab === 'chunker' && (
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Chunking Strategy Configurator
            </h3>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Target Chunk Size (Tokens)</label>
              <select className="input-cyber" value={chunkSize} onChange={(e) => setChunkSize(e.target.value)}>
                <option value="256">256 Tokens (Fine-Grained)</option>
                <option value="512">512 Tokens (Standard Optimal)</option>
                <option value="1024">1024 Tokens (Broad Context)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Token Boundary Overlap</label>
              <select className="input-cyber" value={chunkOverlap} onChange={(e) => setChunkOverlap(e.target.value)}>
                <option value="25">25 Tokens Overlap</option>
                <option value="50">50 Tokens Overlap (Recommended)</option>
                <option value="100">100 Tokens Overlap</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Raw Advisory Text</label>
              <textarea 
                className="input-cyber" 
                rows={8} 
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              />
            </div>

            <button className="btn-primary" onClick={runTextChunker} disabled={chunking} style={{ justifyContent: 'center' }}>
              <Zap size={15} />
              <span>{chunking ? 'Chunking Document...' : 'Run Token-Aware Chunker'}</span>
            </button>
          </div>

          {/* Chunk Output Cards */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Generated Document Chunks ({chunkResults?.generatedChunksCount || 0} Chunks)
              </h3>
              {chunkResults && (
                <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                  Total Document: {chunkResults.totalDocumentTokens} Tokens
                </span>
              )}
            </div>

            {chunkResults?.chunks?.map((c) => (
              <div key={c.chunkId} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', fontWeight: 700 }}>
                    {c.chunkId}
                  </span>
                  <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.725rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>Tokens: {c.tokenCount}</span>
                    <span style={{ color: 'var(--text-dim)' }}>Words: {c.startWordIdx}-{c.endWordIdx}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', background: 'var(--bg-canvas)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROMPTS & MODEL PARAMETER TUNER */}
      {subTab === 'prompts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              System Role & Prompt Template Studio
            </h3>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>System Role Prompt</label>
              <textarea 
                className="input-cyber" 
                rows={4} 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>User Context Injection Prompt</label>
              <textarea 
                className="input-cyber" 
                rows={4} 
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              LLM Inference Hyperparameter Controls
            </h3>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Temperature (Randomness vs Precision)</span>
                <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{temperature}</strong>
              </div>
              <input 
                type="range" min="0.0" max="1.0" step="0.05"
                value={temperature} onChange={(e) => setTemperature(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Max Tokens Output Limit</span>
                <strong style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>{maxTokens} Tokens</strong>
              </div>
              <input 
                type="range" min="256" max="4096" step="256"
                value={maxTokens} onChange={(e) => setMaxTokens(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
              />
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.3rem' }}>✓ Structured JSON Schema Enforcement</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Strictly enforces JSON response structure for mitigation commands and risk levels.</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TOKENS & COST ESTIMATOR */}
      {subTab === 'cost' && tokenMetrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Input Tokens</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                {tokenMetrics.totalInputTokens}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                System ({tokenMetrics.systemTokens}) + Context ({tokenMetrics.contextTokens})
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Output Tokens</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '0.2rem' }}>
                {tokenMetrics.estimatedOutputTokens}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Command & Execution JSON Payload
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Context Window Utilization</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
                {tokenMetrics.contextUtilizationPct}%
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {tokenMetrics.totalInputTokens} / {tokenMetrics.maxContextWindow} Tokens
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-amber)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Cost per Query</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
                ${tokenMetrics.totalCostUsd} USD
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Based on GPT-4o / Claude 3.5 Sonnet Rates
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
