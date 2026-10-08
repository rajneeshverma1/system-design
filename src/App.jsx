import React, { useState } from 'react';
import Header from './components/Header';
import ArchitectureView from './components/ArchitectureView';
import TradeoffsView from './components/TradeoffsView';
import DatabaseSchemaView from './components/DatabaseSchemaView';
import ApiSimulatorView from './components/ApiSimulatorView';
import CapacityCalculatorView from './components/CapacityCalculatorView';
import MediumExportView from './components/MediumExportView';
import { Network, Scale, Database, Code2, Calculator, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: 'Architecture Topology', icon: Network },
    { id: 'tradeoffs', label: 'Trade-Off Matrix', icon: Scale },
    { id: 'database', label: 'Database & Schemas', icon: Database },
    { id: 'api', label: 'API Simulator', icon: Code2 },
    { id: 'capacity', label: 'Capacity Calculator', icon: Calculator },
    { id: 'medium', label: 'Medium Article', icon: BookOpen }
  ];

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <nav className="nav-tabs">
        <div className="tabs-wrapper">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'tradeoffs' && <TradeoffsView />}
        {activeTab === 'database' && <DatabaseSchemaView />}
        {activeTab === 'api' && <ApiSimulatorView />}
        {activeTab === 'capacity' && <CapacityCalculatorView />}
        {activeTab === 'medium' && <MediumExportView />}
      </main>

      <footer className="footer">
        <div>
          Tinder High Level System Design Architecture • Inspired by Rajneesh Verma, Avash Mitra & Gaurav Sen (InterviewReady)
        </div>
      </footer>
    </div>
  );
}
