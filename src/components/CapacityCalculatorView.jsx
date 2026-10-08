import React, { useState } from 'react';
import { Calculator, HardDrive, Zap, Users, Flame } from 'lucide-react';

export default function CapacityCalculatorView() {
  const [dau, setDau] = useState(10); // Millions
  const [photosPerUser, setPhotosPerUser] = useState(5);
  const [photoMb, setPhotoMb] = useState(2); // MB
  const [matchRatePercent, setMatchRatePercent] = useState(0.1); // %

  // Calculations
  const totalUsers = dau * 1_000_000;
  const totalStorageTB = (totalUsers * photosPerUser * photoMb) / (1024 * 1024); // TB
  const dailyMatches = totalUsers * (matchRatePercent / 100);
  const peakMatchQps = Math.round(dailyMatches / 86400 * 2.5); // Peak 2.5x multiplier

  return (
    <div className="capacity-container">
      <div className="card">
        <h2 className="card-title">
          <Calculator size={24} style={{ color: 'var(--tinder-pink)' }} />
          Interactive Capacity & Scale Estimator
        </h2>
        <p className="card-desc">
          Adjust scale parameters in real-time to observe how active user footprint impacts cloud media storage, database match velocity, and throughput.
        </p>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Daily Active Users (DAU): <span style={{ color: 'var(--tinder-pink)' }}>{dau} Million</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={dau} 
              onChange={(e) => setDau(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--tinder-pink)' }}
            />
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Photos per User: <span style={{ color: 'var(--tinder-pink)' }}>{photosPerUser} Photos</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={photosPerUser} 
              onChange={(e) => setPhotosPerUser(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--tinder-pink)' }}
            />
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Average Photo Size: <span style={{ color: 'var(--tinder-pink)' }}>{photoMb} MB</span>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.5"
              value={photoMb} 
              onChange={(e) => setPhotoMb(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--tinder-pink)' }}
            />
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              Daily Match Conversion Rate: <span style={{ color: 'var(--tinder-pink)' }}>{matchRatePercent}%</span>
            </label>
            <input 
              type="range" 
              min="0.01" 
              max="1" 
              step="0.01"
              value={matchRatePercent} 
              onChange={(e) => setMatchRatePercent(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--tinder-pink)' }}
            />
          </div>
        </div>

        <div className="grid-3">
          <div style={{ background: 'var(--gradient-glow)', border: '1px solid rgba(253, 58, 115, 0.3)', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
            <HardDrive size={32} style={{ color: 'var(--tinder-pink)', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {totalStorageTB.toFixed(1)} TB
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              TOTAL DFS / S3 MEDIA STORAGE
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
            <Flame size={32} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {Math.round(dailyMatches).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              DAILY MATCHES PROCESSED
            </div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
            <Zap size={32} style={{ color: 'var(--warning)', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {peakMatchQps.toLocaleString()} QPS
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              PEAK MATCH WRITE THROUGHPUT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
