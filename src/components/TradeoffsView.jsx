import React from 'react';
import { Scale, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';

export default function TradeoffsView() {
  const tradeoffs = [
    {
      id: 1,
      title: 'Image Storage: Distributed File System (DFS) + CDN vs. DB BLOBs',
      summary: 'Storing images as files in S3/GCS served by a CDN wins overwhelmingly over DB BLOBs due to lower cost, static caching, and faster edge access.',
      chosen: 'Distributed File System (S3/GCS) + Edge CDN',
      rejected: 'Relational Database BLOB Storage',
      comparison: [
        { feature: 'Mutability', optionA: 'High overhead for byte updates; useless for static images', optionB: 'Images are immutable static files; replaced by new file uploads' },
        { feature: 'Transaction Guarantees', optionA: 'ACID guarantees provided (unnecessary for images)', optionB: 'Decoupled from DB transaction log bottlenecks' },
        { feature: 'Content Indexing', optionA: 'Cannot index binary file content effectively', optionB: 'Indexed by fast S3 image URL strings in DB' },
        { feature: 'Cost & Performance', optionA: 'Bloats DB size; makes backups slow and costly', optionB: 'Substantially cheaper; served globally via CDN' }
      ]
    },
    {
      id: 2,
      title: 'Real-Time Messaging: XMPP / WebSockets vs. HTTP Polling',
      summary: 'XMPP / WebSocket persistent sockets win over HTTP polling by eliminating battery drain and server overhead from constant poll requests.',
      chosen: 'XMPP / Persistent WebSockets (Peer-to-Peer)',
      rejected: 'HTTP Short / Long Polling',
      comparison: [
        { feature: 'Connection Overhead', optionA: 'Repeated HTTP request-response headers every few seconds', optionB: 'Single long-lived TCP connection stream' },
        { feature: 'Latency', optionA: 'High latency (bounded by polling interval)', optionB: 'Instantaneous push delivery (<50ms)' },
        { feature: 'Mobile Battery Life', optionA: 'High battery drain due to continuous radio wakeups', optionB: 'Minimal battery drain during idle states' },
        { feature: 'State Tracking', optionA: 'Stateless on server; high DB polling traffic', optionB: 'Session Service maps UserID -> ConnectionID in Redis' }
      ]
    },
    {
      id: 3,
      title: 'Match Details: Server-Side Database vs. Client-Side Local Storage',
      summary: 'Storing match records on the server ensures an immutable single source of truth, avoiding match data loss and preventing client-side spoofing.',
      chosen: 'Server-Side Relational Match Database',
      rejected: 'Client-Side Local Storage',
      comparison: [
        { feature: 'Data Durability', optionA: 'Match data lost if user clears cache or reinstalls app', optionB: 'Persistent single source of truth across devices' },
        { feature: 'Security & Anti-Cheat', optionA: 'Vulnerable to client-side reverse engineering and spoofing', optionB: 'Enforced at API Gateway & Matcher Service level' },
        { feature: 'Storage Footprint', optionA: 'Saves minimal server storage (negligible ~64 bytes/match)', optionB: 'Easily managed via relational table indexing' }
      ]
    }
  ];

  return (
    <div className="tradeoffs-container">
      <div className="card">
        <h2 className="card-title">
          <Scale size={24} style={{ color: 'var(--tinder-pink)' }} />
          System Design Trade-Off Matrix
        </h2>
        <p className="card-desc">
          Critical architectural trade-offs evaluated for the Tinder system design, comparing performance, durability, complexity, and cost.
        </p>
      </div>

      {tradeoffs.map((item) => (
        <div key={item.id} className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span className="pill pill-pink">Trade-Off #{item.id}</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{item.title}</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            {item.summary}
          </p>

          <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <CheckCircle2 size={18} />
                CHOSEN SOLUTION: {item.chosen}
              </div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <XCircle size={18} />
                REJECTED OPTION: {item.rejected}
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>Feature / Dimension</th>
                  <th style={{ padding: '0.75rem', color: '#EF4444' }}>{item.rejected}</th>
                  <th style={{ padding: '0.75rem', color: 'var(--success)' }}>{item.chosen}</th>
                </tr>
              </thead>
              <tbody>
                {item.comparison.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>{row.feature}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{row.optionA}</td>
                    <td style={{ padding: '0.75rem', color: '#E5E7EB', fontWeight: '500' }}>{row.optionB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
