import React, { useState } from 'react';

export default function LinkedInPostView() {
  const [copied, setCopied] = useState(false);

  const postContent = `I've always been fascinated by Tinder engineering.

One app handles millions of swipes, location-based recommendations, instant mutual matching, and real-time 1-on-1 chats for over 10 million daily active users at once.

So I read their engineering blogs on how they process swipes and match people in real-time, and drew the flow to understand it.

Here is how Tinder handles it:

1) Profile data & candidate pools are sharded by geographical location, so recommendation searches query locally, not globally.
2) Every swipe action goes into a high-throughput queue (Pub/Sub), ensuring zero lag for the user even during peak traffic.
3) Matcher workers pick up right-swipes asynchronously and check an indexed cache/database for a mutual right-swipe.
4) When a mutual swipe is detected, a Match Event immediately triggers push notifications and unlocks the chat.
5) Real-time 1-on-1 messaging runs on persistent sockets (XMPP/WebSockets) with a Redis session cache mapping UserID -> ConnectionID to eliminate HTTP polling.
6) Profile pictures (100+ TBs) are stored in cloud object storage (S3) and served via edge CDNs, offloading static media traffic completely from core databases.

I made this diagram from my own understanding of their engineering architecture.

Blog: https://medium.com/@rajneeshverma/tinder-system-design

#Tinder #SystemDesign #DistributedSystems #Backend #SoftwareArchitecture #Tech`;

  const handleCopy = () => {
    navigator.clipboard.writeText(postContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tab-container">
      <div className="view-header">
        <h2>🚀 LinkedIn System Design Post Generator</h2>
        <p>Pre-formatted copy matching Discord's viral architecture post format, with SVG & Excalidraw diagram templates.</p>
      </div>

      <div className="grid-2col" style={{ marginTop: '20px' }}>
        {/* Left Column: Post Copy & Copy Button */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-[#fff]', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#ff4d4d' }}>📋 LinkedIn Post Copy</h3>
            <button 
              onClick={handleCopy} 
              className="btn btn-primary"
              style={{ padding: '6px 16px', fontSize: '13px' }}
            >
              {copied ? '✓ Copied to Clipboard!' : 'Copy Post Text'}
            </button>
          </div>
          <pre style={{
            background: '#121212',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #333',
            color: '#e0e0e0',
            whiteSpace: 'pre-wrap',
            fontSize: '13.5px',
            lineHeight: '1.6',
            fontFamily: 'inherit'
          }}>
            {postContent}
          </pre>
        </div>

        {/* Right Column: Diagram Tools & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3 style={{ color: '#4d94ff', marginTop: 0 }}>🎨 Architectural Diagram Assets</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#ccc' }}>
              <li>
                <strong>Vector SVG Diagram:</strong> <code style={{ background: '#222', padding: '2px 6px', borderRadius: '4px' }}>tinder-architecture.svg</code>
              </li>
              <li>
                <strong>Excalidraw Scene JSON:</strong> <code style={{ background: '#222', padding: '2px 6px', borderRadius: '4px' }}>tinder-excalidraw.json</code>
              </li>
              <li>
                <strong>Eraser.io Prompts:</strong> <code style={{ background: '#222', padding: '2px 6px', borderRadius: '4px' }}>ERASER_DIAGRAM_PROMPT.md</code>
              </li>
            </ul>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #4dff88' }}>
            <h3 style={{ color: '#4dff88', marginTop: 0 }}>🛠️ How to Edit on Excalidraw</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.7', color: '#bbb', fontSize: '14px' }}>
              <li>Open <strong>Excalidraw.com</strong> in your browser.</li>
              <li>Click Menu → <strong>Open</strong>.</li>
              <li>Select <code>tinder-excalidraw.json</code> from this project folder.</li>
              <li>Edit shapes, lines, or export as Dark PNG!</li>
            </ol>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #b366ff' }}>
            <h3 style={{ color: '#b366ff', marginTop: 0 }}>🤖 How to Generate in Eraser.io</h3>
            <p style={{ color: '#bbb', fontSize: '13.5px', lineHeight: '1.6' }}>
              Open <strong>Eraser.io</strong>, click <strong>AI Generator</strong>, and paste the prompt from <code>ERASER_DIAGRAM_PROMPT.md</code> to automatically render dark-mode hand-drawn flowcharts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
