import React, { useState } from 'react';
import { BookOpen, Copy, Check, FileText } from 'lucide-react';

export default function MediumExportView() {
  const [copied, setCopied] = useState(false);

  const mediumArticleMarkdown = `# Designing Tinder: High-Level System Design of a Scalable Dating Platform

*By Rajneesh Verma | Based on System Design Concepts by Avash Mitra & Gaurav Sen (InterviewReady)*

---

How does an app like **Tinder** serve **10 million daily active users**, process millions of swipes, deliver real-time location-based recommendations, and handle instantaneous 1-on-1 chats without collapsing under load? 

In this comprehensive guide, we will break down the **High-Level System Design of Tinder**. We’ll analyze system requirements, estimate storage and traffic requirements, design resilient database schemas and APIs, and evaluate key architectural trade-offs.

---

## 🚀 1. The Core Requirements

### Functional Requirements
1. **Profile & Media Management**: Users sign up, manage profile metadata (name, age, bio, location), and upload up to 5 profile photos.
2. **Geographical Recommendations**: Users receive candidate profiles nearby matching their age and gender preferences.
3. **Real-time Match Processing**: The system records swipes and detects mutual right-swipes immediately.
4. **Peer-to-Peer Chat**: Once matched, two users send direct messages in real-time.

---

## 📊 2. Capacity Estimations & Scale

- **Daily Active Users (DAU)**: 10,000,000 (10 Million users).
- **Profile Photos**: 5 photos per user at ~2MB each.
- **Media Storage Required**: 10M × 5 × 2MB = 100 Terabytes (TB).
- **Match Events**: ~1,000,000 matches daily (~1,000 peak matches/sec).

---

## 🏗️ 3. High-Level Architecture Overview

- **API Gateway**: TLS termination, JWT validation, rate-limiting, load balancing.
- **Profile Service**: Manages metadata and orchestrates photo uploads to Object Storage.
- **Recommendation Engine**: Queries location-sharded databases to serve candidate feeds.
- **Matcher Service**: Evaluates swipe actions and persists mutual match records.
- **Session Service**: Maintains persistent peer-to-peer XMPP socket streams.

---

## 💡 4. Architectural Trade-Off Analysis

### Trade-Off #1: Image Storage — Relational DB BLOBs vs. Distributed File System + CDN
- **Chosen**: Distributed File System (S3/GCS) + Cloudflare CDN.
- **Why**: Static image files benefit from cheap cloud storage and edge caching. DB BLOBs cause massive database size bloat.

### Trade-Off #2: Real-time Messaging — HTTP Polling vs. XMPP / WebSockets
- **Chosen**: XMPP / WebSockets.
- **Why**: Persistent TCP channels enable real-time bidirectional push messages, avoiding mobile battery drain and polling overhead.

### Trade-Off #3: Match Data — Client-Side vs. Server-Side Storage
- **Chosen**: Server-Side Relational Match Database.
- **Why**: Single source of truth that survives app reinstalls and prevents local data tampering.

---

## 🗄️ 5. Database Schema & Indexing

\`\`\`sql
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_location ON users (latitude, longitude);
\`\`\`

---

## ⚡ 6. Summary Checklist for System Design Interviews

1. **Leverage CDNs & S3** for static media assets instead of relational DBs.
2. **Use XMPP / WebSockets** for real-time peer-to-peer 1-on-1 chat.
3. **Partition relational databases horizontally** based on geographical location.
4. **Use Master-Slave DB replicas** to separate read-heavy recommendation queries from write-heavy swipe events.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mediumArticleMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="medium-container">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h2 className="card-title">
            <BookOpen size={24} style={{ color: 'var(--tinder-pink)' }} />
            Medium Article Publishing Ready Format
          </h2>
          <button onClick={copyToClipboard} className="btn btn-primary">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Article Markdown'}</span>
          </button>
        </div>
        <p className="card-desc">
          Ready to publish directly to Medium. Includes structured headers, high-impact bullet points, code snippets, and architectural summaries.
        </p>

        <pre className="code-block" style={{ fontSize: '0.85rem', maxHeight: '500px', overflowY: 'auto' }}>
          {mediumArticleMarkdown}
        </pre>
      </div>
    </div>
  );
}
