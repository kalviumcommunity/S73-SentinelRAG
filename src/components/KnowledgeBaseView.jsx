import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Shield,
  AlertTriangle,
  Play,
  ExternalLink,
  Tag,
  Clock,
  RotateCcw,
  Sliders
} from 'lucide-react';

/**
 * KnowledgeBaseView Component
 * Renders full-text searchable cybersecurity knowledge corpus, multi-faceted
 * document filtering (Type, Severity, Affected Product), and document cards.
 */
export default function KnowledgeBaseView() {
  const { documents, openDocumentViewer, startRunbookExecution } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'report' | 'runbook' | 'advisory'
  const [severityFilter, setSeverityFilter] = useState('ALL'); // 'ALL' | 'critical' | 'high' | 'medium' | 'low'
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'relevance' | 'severity'

  // Extract all unique products across documents
  const allProducts = Array.from(
    new Set(documents.flatMap((doc) => doc.affected_products || []))
  );

  // Filter documents
  let filteredDocs = documents.filter((doc) => {
    // Type Filter
    if (typeFilter !== 'ALL' && doc.type !== typeFilter) return false;

    // Severity Filter
    if (severityFilter !== 'ALL' && doc.severity !== severityFilter) return false;

    // Product Filter
    if (selectedProduct !== 'ALL' && !doc.affected_products?.includes(selectedProduct))
      return false;

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = doc.title.toLowerCase().includes(q);
      const summaryMatch = doc.summary?.toLowerCase().includes(q);
      const contentMatch = doc.content.toLowerCase().includes(q);
      const cveMatch = doc.cve_ids?.some((cve) => cve.toLowerCase().includes(q));
      const tagMatch = doc.tags?.some((t) => t.toLowerCase().includes(q));

      return titleMatch || summaryMatch || contentMatch || cveMatch || tagMatch;
    }

    return true;
  });

  // Sort Documents
  filteredDocs.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.uploaded_at) - new Date(a.uploaded_at);
    }
    if (sortBy === 'severity') {
      const order = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    }
    return 0; // relevance preserves natural search order
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setSeverityFilter('ALL');
    setSelectedProduct('ALL');
    setSortBy('newest');
  };

  // Helper: Highlight query terms in snippet text
  const renderSnippetWithHighlight = (text, query) => {
    if (!text) return null;
    if (!query || !query.trim()) return text.slice(0, 160) + '...';

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text.slice(0, 160) + '...';

    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + query.length + 80);
    const snippet = text.slice(start, end);

    const parts = snippet.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {start > 0 && '...'}
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-400/30 text-amber-200 px-1 rounded font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
        {end < text.length && '...'}
      </span>
    );
  };

  return (
    <div className="kb-container">
      {/* View Header */}
      <div className="view-page-header">
        <div>
          <h1 className="view-title">
            <BookOpen size={22} className="text-purple-400" />
            Cybersecurity Knowledge Base
          </h1>
          <p className="view-description">
            Search, filter, and inspect verified Threat Intelligence Reports, Incident Runbooks, and Vulnerability Advisories.
          </p>
        </div>
        <div className="header-meta-chips">
          <span className="meta-chip">Total Documents: {documents.length}</span>
          <span className="meta-chip text-cyan-400">Showing: {filteredDocs.length}</span>
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar + Right Search & Document Cards */}
      <div className="kb-layout-grid">
        {/* FILTER SIDEBAR */}
        <aside className="kb-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <span className="sidebar-title">
                <Sliders size={16} className="text-cyan-400" /> Filters
              </span>
              <button
                className="btn-link text-xs text-slate-400 hover:text-slate-200"
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>

            {/* Document Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Document Type</label>
              <div className="filter-btn-stack">
                <button
                  className={`filter-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('ALL')}
                >
                  All Types ({documents.length})
                </button>
                <button
                  className={`filter-btn ${typeFilter === 'report' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('report')}
                >
                  Threat Intel Reports ({documents.filter((d) => d.type === 'report').length})
                </button>
                <button
                  className={`filter-btn ${typeFilter === 'runbook' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('runbook')}
                >
                  Incident Runbooks ({documents.filter((d) => d.type === 'runbook').length})
                </button>
                <button
                  className={`filter-btn ${typeFilter === 'advisory' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('advisory')}
                >
                  Vulnerability Advisories ({documents.filter((d) => d.type === 'advisory').length})
                </button>
              </div>
            </div>

            {/* Severity Filter */}
            <div className="filter-group mt-4">
              <label className="filter-label">Severity Level</label>
              <div className="filter-btn-grid">
                {['ALL', 'critical', 'high', 'medium', 'low'].map((sev) => (
                  <button
                    key={sev}
                    className={`sev-filter-btn ${severityFilter === sev ? 'active' : ''}`}
                    onClick={() => setSeverityFilter(sev)}
                  >
                    {sev.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Filter */}
            <div className="filter-group mt-4">
              <label className="filter-label">Affected Product</label>
              <select
                className="input-cyber"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="ALL">All Products & Systems</option>
                {allProducts.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN AREA */}
        <main className="kb-main-area">
          {/* Top Bar: Search Bar & Sort Dropdown */}
          <div className="kb-top-bar">
            <div className="kb-search-box">
              <Search size={18} className="search-icon text-cyan-400" />
              <input
                type="text"
                className="kb-search-input"
                placeholder="Full-text search knowledge base by keyword, CVE, threat actor, or technique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>

            <div className="kb-sort-box">
              <label className="text-xs text-slate-400 mr-2">Sort by:</label>
              <select
                className="input-cyber select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest Uploads</option>
                <option value="severity">Highest Severity</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>

          {/* Document Cards Grid */}
          <div className="kb-cards-grid">
            {filteredDocs.length === 0 ? (
              <div className="kb-empty-results">
                <Search size={40} className="text-slate-600 mb-2" />
                <h3 className="text-slate-200 font-bold text-lg">No Matching Documents Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                  No documents in the knowledge base match your search parameters. Try resetting your filters or search term.
                </p>
                <button className="btn-secondary text-xs mt-4" onClick={handleResetFilters}>
                  <RotateCcw size={14} /> Reset All Filters
                </button>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isRunbook = doc.type === 'runbook';
                const isAdvisory = doc.type === 'advisory';

                return (
                  <div key={doc.id} className="doc-card">
                    {/* Card Header */}
                    <div className="doc-card-header">
                      <div className="flex items-center gap-2">
                        <span className={`type-badge type-${doc.type}`}>
                          {doc.type === 'report' && <FileText size={12} />}
                          {doc.type === 'runbook' && <Play size={12} />}
                          {doc.type === 'advisory' && <Shield size={12} />}
                          {doc.type.toUpperCase()}
                        </span>
                        <span className={`badge badge-${doc.severity}`}>{doc.severity}</span>
                      </div>
                      <span className="doc-id font-mono">{doc.id}</span>
                    </div>

                    {/* Title & Summary */}
                    <h3 className="doc-card-title">{doc.title}</h3>
                    <p className="doc-card-snippet">
                      {renderSnippetWithHighlight(doc.summary || doc.content, searchQuery)}
                    </p>

                    {/* Meta & Tags */}
                    <div className="doc-card-meta">
                      <div className="doc-tags">
                        {doc.tags?.slice(0, 4).map((tag) => (
                          <span key={tag} className="tag-chip font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {doc.cve_ids?.length > 0 && (
                        <div className="cve-chips font-mono text-xs text-cyan-400 mt-1">
                          {doc.cve_ids.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="doc-card-footer">
                      <div className="uploader-info">
                        <Clock size={12} className="text-slate-500" />
                        <span>{doc.uploaded_by} • {new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>

                      <div className="card-actions flex items-center gap-2">
                        <button
                          className="btn-secondary-xs"
                          onClick={() => openDocumentViewer(doc.id)}
                        >
                          <ExternalLink size={13} /> View Document
                        </button>

                        {isRunbook && (
                          <button
                            className="btn-primary-xs"
                            onClick={() => startRunbookExecution(doc.id)}
                          >
                            <Play size={12} /> Start Runbook
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
