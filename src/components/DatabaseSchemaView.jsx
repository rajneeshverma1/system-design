import React from 'react';
import { Database, Key, Layers, Server } from 'lucide-react';

export default function DatabaseSchemaView() {
  const schemas = [
    {
      name: 'users (Location-Sharded Relational Table)',
      desc: 'Stores normalized user metadata. Partitioned horizontally across DB shards based on geohash / location regions.',
      sql: `CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    target_gender VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fast Spatial / Location Radius Query Index
CREATE INDEX idx_user_location ON users (latitude, longitude);`
    },
    {
      name: 'matches (Mutual Right-Swipe Engine Table)',
      desc: 'Persists swipe pair records. Enforces unique compound constraints to avoid duplicate match entries.',
      sql: `CREATE TABLE matches (
    match_id VARCHAR(36) PRIMARY KEY,
    user_id_1 VARCHAR(36) NOT NULL,
    user_id_2 VARCHAR(36) NOT NULL,
    is_matched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_pair UNIQUE (user_id_1, user_id_2)
);

-- Compound index for fast lookup of a user's matches
CREATE INDEX idx_user_matches ON matches (user_id_1, is_matched);`
    },
    {
      name: 'user_sessions (XMPP / WebSocket Routing Table)',
      desc: 'Links user IDs with server connection endpoints. Mirror-cached in Redis for sub-millisecond lookup speeds.',
      sql: `CREATE TABLE user_sessions (
    connection_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    server_node_ip VARCHAR(45) NOT NULL,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fast reverse lookup index
CREATE INDEX idx_session_user ON user_sessions (user_id);`
    }
  ];

  return (
    <div className="database-container">
      <div className="card">
        <h2 className="card-title">
          <Database size={24} style={{ color: 'var(--tinder-pink)' }} />
          Database Schema & Geo-Sharding Strategy
        </h2>
        <p className="card-desc">
          Relational SQL schema definitions, spatial indexing strategies, master-slave replication models, and geographical partitioning.
        </p>

        <div className="grid-3" style={{ marginTop: '1rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--tinder-pink)' }}>
              <Layers size={18} />
              Geographical Sharding
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Databases are sharded horizontally using location geohashes (e.g. US-East, EU-Central, AP-South) so recommendation queries hit local shard nodes.
            </p>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--warning)' }}>
              <Server size={18} />
              Master-Slave Replication
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Each shard runs 1 Primary Master (Writes) and 3 Read Slaves (95% read traffic for candidate recommendations feed), ensuring read availability.
            </p>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--success)' }}>
              <Key size={18} />
              Spatial Indexes
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Compound B-Tree spatial indexes on <code>(latitude, longitude)</code> allow range queries like <code>WHERE latitude BETWEEN x1 AND x2</code> in under 5ms.
            </p>
          </div>
        </div>
      </div>

      {schemas.map((table, idx) => (
        <div key={idx} className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{table.name}</h3>
            <span className="pill pill-pink">SQL Schema</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {table.desc}
          </p>

          <pre className="code-block">
            {table.sql}
          </pre>
        </div>
      ))}
    </div>
  );
}
