import React, { useState } from 'react';
import { Server, Database, Cloud, ShieldCheck, Zap, MessageSquare, Flame, CheckCircle, ArrowRight } from 'lucide-react';

export default function ArchitectureView() {
  const [selectedNode, setSelectedNode] = useState('gateway');

  const nodes = [
    {
      id: 'gateway',
      name: 'API Gateway Service',
      badge: 'Edge Layer',
      icon: ShieldCheck,
      color: '#3B82F6',
      description: 'Acts as the single entry point for all client requests. Terminates TLS, validates OAuth2/JWT tokens, enforces rate limiting, and routes requests to microservices.',
      tech: 'Envoy / Kong / Custom Gateway',
      metrics: 'Handles 100k+ QPS at peak'
    },
    {
      id: 'profile',
      name: 'Profile & Storage Service',
      badge: 'Core Service',
      icon: Server,
      color: '#FD3A73',
      description: 'Manages user profile metadata (Name, Age, Gender, Bio, Geo-coordinates) and coordinates photo upload pipelines with the Distributed File System.',
      tech: 'Node.js / Go + S3 / Cloudflare CDN',
      metrics: '5 Photos per user (~100 TB total)'
    },
    {
      id: 'recommendation',
      name: 'Recommendation Engine',
      badge: 'Spatial Feed',
      icon: Zap,
      color: '#F59E0B',
      description: 'Generates candidate profile feeds for users based on geographical location, age bounds, target gender, and prior swipe history.',
      tech: 'Geo-Sharded MySQL / Postgres + Redis',
      metrics: 'Sub-50ms Feed Latency'
    },
    {
      id: 'matcher',
      name: 'Matcher Service',
      badge: 'Match Engine',
      icon: Flame,
      color: '#EC4899',
      description: 'Records swipe interactions (LIKE / PASS) and detects mutual right-swipes. Triggers match notifications and connects matched pairs.',
      tech: 'Kafka + Relational Match DB',
      metrics: '~1,000 Matches/sec peak'
    },
    {
      id: 'session',
      name: 'Session & XMPP Chat Service',
      badge: 'Real-Time Stream',
      icon: MessageSquare,
      color: '#10B981',
      description: 'Maintains persistent peer-to-peer connection state via XMPP / WebSockets. Uses Redis cache for fast connection ID lookup.',
      tech: 'Ejabberd / XMPP Cluster + Redis',
      metrics: '2M Concurrent Socket Streams'
    }
  ];

  const currentNode = nodes.find(n => n.id === selectedNode);

  return (
    <div className="architecture-container">
      <div className="card">
        <h2 className="card-title">
          <Flame className="text-pink" size={24} style={{ color: '#FD3A73' }} />
          Tinder High-Level Architecture Topology
        </h2>
        <p className="card-desc">
          Click on any architectural node below to inspect its detailed responsibilities, technology stack, and capacity metrics.
        </p>

        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`architecture-node ${isSelected ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="node-header">
                  <Icon size={22} style={{ color: node.color }} />
                  <span className="node-badge">{node.badge}</span>
                </div>
                <div className="node-title">{node.name}</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  {node.metrics}
                </p>
              </div>
            );
          })}
        </div>

        {currentNode && (
          <div className="card" style={{ background: '#0D1117', borderColor: 'var(--tinder-pink)', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <currentNode.icon size={26} style={{ color: currentNode.color }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{currentNode.name}</h3>
              </div>
              <span className="pill pill-pink">{currentNode.badge}</span>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#E5E7EB', marginBottom: '1rem' }}>
              {currentNode.description}
            </p>

            <div className="grid-2">
              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>
                  RECOMMENDED TECH STACK
                </div>
                <div style={{ fontWeight: '600', color: 'var(--tinder-orange)' }}>
                  {currentNode.tech}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>
                  KEY OPERATIONAL METRICS
                </div>
                <div style={{ fontWeight: '600', color: 'var(--success)' }}>
                  {currentNode.metrics}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">
          <ArrowRight style={{ color: 'var(--tinder-pink)' }} />
          End-to-End User Flow & Data Path
        </h3>
        <div className="code-block" style={{ fontSize: '0.85rem' }}>
{`1. Client Login      : Mobile App -> API Gateway (Auth Token Issued)
2. Fetch Feed        : Mobile App -> API Gateway -> Recommendation Engine -> Geo-Sharded User DB
3. Load Profile Pics : Mobile App -> Cloudflare CDN -> Distributed Object Storage (S3)
4. Record Swipe      : Mobile App -> API Gateway -> Matcher Service -> Match Database
5. Trigger Match     : Matcher Service detects mutual right-swipe -> Emits Match Event to Session Service
6. Send Message      : User A -> XMPP Persistent Socket -> Session Service -> Redis Connection Lookup -> User B Socket`}
        </div>
      </div>
    </div>
  );
}
