import React from 'react';
import { Flame, FileText, Download, FileCode, BookOpen } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-group">
          <div className="logo-badge">
            <Flame size={24} />
          </div>
          <div>
            <div className="logo-title">Tinder System Design</div>
            <div className="logo-subtitle">Distributed Architecture • InterviewReady • Medium Guide</div>
          </div>
        </div>

        <div className="action-buttons">
          <a 
            href="/Tinder_System_Design.pdf" 
            download 
            className="btn btn-primary"
            title="Download PDF Version"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </a>
          
          <a 
            href="/TINDER_SYSTEM_DESIGN.txt" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            title="View Raw TXT File"
          >
            <FileText size={16} />
            <span>Raw TXT</span>
          </a>

          <a 
            href="/README.md" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
            title="View README.md"
          >
            <FileCode size={16} />
            <span>README.md</span>
          </a>
        </div>
      </div>
    </header>
  );
}
