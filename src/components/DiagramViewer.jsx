import React from 'react';

export default function DiagramViewer() {
  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#4d94ff', marginBottom: '10px' }}>📐 Architecture Topology Diagram Overview</h3>
      <p style={{ color: '#aaa', fontSize: '14px' }}>
        Interactive representation of Tinder's end-to-end matching pipeline, from client swipe events down to geo-sharded databases and real-time socket connections.
      </p>

      <div style={{
        margin: '15px 0',
        padding: '15px',
        background: '#121212',
        borderRadius: '8px',
        border: '1px stroke #333'
      }}>
        <img 
          src="/tinder-architecture.svg" 
          alt="Tinder Architecture SVG Diagram" 
          style={{ width: '100%', height: 'auto', borderRadius: '6px' }}
        />
      </div>
    </div>
  );
}
