import React from 'react';
import './Page.css';

function About() {
  return (
    <div className="page-content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">AGENT DOSSIER</h1>
          <p className="page-subtitle">CLASSIFIED PERSONNEL FILES</p>
        </div>

        <div className="agents-grid">
          {/* Placeholder for agent cards */}
          <div className="agent-card">
            <div className="agent-header">
              <span className="meta-label">FILE #:</span>
              <span className="meta-value">001</span>
            </div>
            <div className="agent-profile">
              <div className="profile-placeholder"></div>
            </div>
            <div className="agent-body">
              <h2 className="agent-name">CLASSIFIED</h2>
              <p className="agent-description">Information pending classification...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

