import React, { useState } from 'react';
import { Play, Send, CheckCircle2, Code2, Flame, Heart, XCircle } from 'lucide-react';

export default function ApiSimulatorView() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('swipe');
  const [apiLogs, setApiLogs] = useState([]);
  const [swipeResult, setSwipeResult] = useState(null);

  const endpoints = [
    {
      id: 'signup',
      method: 'POST',
      path: '/api/v1/user/signup',
      service: 'Profile Service',
      desc: 'Creates a new user profile account and returns auth JWT token.',
      payload: { name: 'Alex Johnson', age: 26, gender: 'Male', latitude: 37.7749, longitude: -122.4194 }
    },
    {
      id: 'recommendation',
      method: 'GET',
      path: '/api/v1/recommendation',
      service: 'Recommendation Engine',
      desc: 'Fetches candidate profile recommendations based on geohash location & preferences.',
      payload: { lat: 37.7749, lon: -122.4194, radius_km: 25, min_age: 22, max_age: 30 }
    },
    {
      id: 'swipe',
      method: 'POST',
      path: '/api/v1/swipe',
      service: 'Matcher Service',
      desc: 'Records user swipe event (LIKE / PASS) and evaluates mutual match condition.',
      payload: { target_user_id: 'usr_88392', action: 'LIKE' }
    },
    {
      id: 'session',
      method: 'POST',
      path: '/api/v1/session/connection',
      service: 'Session Service',
      desc: 'Registers XMPP / WebSocket socket connection stream for real-time chat routing.',
      payload: { user_id_1: 'usr_10203', user_id_2: 'usr_88392', socket_node: 'xmpp-node-04.tinder.internal' }
    }
  ];

  const currentEp = endpoints.find(e => e.id === selectedEndpoint);

  const runSimulatedCall = (actionOverride = null) => {
    const action = actionOverride || (currentEp.payload.action || 'LIKE');
    const isMatch = action === 'LIKE' && Math.random() > 0.4;

    let mockResponse = {};
    if (selectedEndpoint === 'signup') {
      mockResponse = {
        status: 201,
        message: 'User account created successfully',
        data: {
          user_id: `usr_${Math.floor(10000 + Math.random() * 90000)}`,
          auth_token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ name: 'Alex' }))}.signature`
        }
      };
    } else if (selectedEndpoint === 'recommendation') {
      mockResponse = {
        status: 200,
        count: 3,
        candidates: [
          { user_id: 'usr_88392', name: 'Sophia', age: 25, distance_km: 3.2, photos: ['https://cdn.tinder.com/p1.jpg'] },
          { user_id: 'usr_74921', name: 'Emma', age: 24, distance_km: 5.1, photos: ['https://cdn.tinder.com/p2.jpg'] },
          { user_id: 'usr_66310', name: 'Olivia', age: 27, distance_km: 8.4, photos: ['https://cdn.tinder.com/p3.jpg'] }
        ]
      };
    } else if (selectedEndpoint === 'swipe') {
      mockResponse = {
        status: 200,
        swipe_action: action,
        target_user_id: currentEp.payload.target_user_id,
        is_mutual_match: isMatch,
        match_details: isMatch ? {
          match_id: `mtch_${Math.floor(100000 + Math.random() * 900000)}`,
          created_at: new Date().toISOString(),
          xmpp_channel: `xmpp-chat-${Math.floor(Math.random() * 1000)}@chat.tinder.internal`
        } : null
      };
      setSwipeResult(mockResponse);
    } else {
      mockResponse = {
        status: 200,
        connection_id: `conn_${Math.floor(100000 + Math.random() * 900000)}`,
        status_message: 'XMPP socket channel active'
      };
    }

    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      method: currentEp.method,
      path: currentEp.path,
      response: mockResponse
    };

    setApiLogs(prev => [logEntry, ...prev]);
  };

  return (
    <div className="api-container">
      <div className="card">
        <h2 className="card-title">
          <Code2 size={24} style={{ color: 'var(--tinder-pink)' }} />
          Interactive API Endpoint Simulator
        </h2>
        <p className="card-desc">
          Test the RESTful API endpoints powering Tinder's Profile, Matcher, Recommendation, and Session microservices.
        </p>

        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              SELECT API ENDPOINT
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {endpoints.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: selectedEndpoint === ep.id ? 'var(--tinder-pink)' : 'var(--border-color)',
                    background: selectedEndpoint === ep.id ? 'var(--gradient-glow)' : 'var(--bg-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="pill pill-pink" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>{ep.method}</span>
                      <code style={{ fontSize: '0.85rem', fontWeight: '600' }}>{ep.path}</code>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ep.service}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--tinder-orange)' }}>
                  REQUEST PAYLOAD
                </span>
                <button 
                  onClick={() => runSimulatedCall()} 
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  <Play size={14} /> Send Request
                </button>
              </div>

              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#9CA3AF' }}>
                {JSON.stringify(currentEp.payload, null, 2)}
              </pre>

              {selectedEndpoint === 'swipe' && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    SIMULATE SWIPE INTERACTION
                  </div>
                  <div className="sim-swipe-buttons" style={{ marginTop: '0.5rem', gap: '1rem' }}>
                    <button 
                      onClick={() => runSimulatedCall('PASS')} 
                      className="swipe-btn swipe-btn-pass"
                      title="Pass / Left Swipe"
                    >
                      <XCircle size={28} />
                    </button>
                    <button 
                      onClick={() => runSimulatedCall('LIKE')} 
                      className="swipe-btn swipe-btn-like"
                      title="Like / Right Swipe"
                    >
                      <Heart size={28} style={{ fill: 'currentColor' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {apiLogs.length > 0 && (
        <div className="card">
          <h3 className="card-title">
            <CheckCircle2 style={{ color: 'var(--success)' }} />
            API Execution Log History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {apiLogs.map((log) => (
              <div key={log.id} style={{ background: 'var(--code-bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="pill pill-green" style={{ fontSize: '0.7rem' }}>200 OK</span>
                    <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{log.method} {log.path}</code>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                </div>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#10B981' }}>
                  {JSON.stringify(log.response, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
