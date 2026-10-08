const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  margin: 40,
  size: 'A4',
  bufferPages: true
});

const outputPath = path.join(__dirname, 'Tinder_System_Design.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Color Palette
const PRIMARY = '#E94057'; // Tinder Coral/Pink
const SECONDARY = '#2B2D42'; // Dark Navy/Slate
const ACCENT = '#8D99AE';
const BG_LIGHT = '#F8F9FA';
const TEXT_DARK = '#1A1A1A';

// Helper functions for PDF layout
function drawHeader(title, subtitle) {
  doc.rect(0, 0, 595.28, 90).fill(PRIMARY);
  doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text(title, 40, 25);
  doc.fontSize(11).font('Helvetica').text(subtitle, 40, 55);
  doc.y = 110;
}

function drawSectionHeader(title) {
  if (doc.y > 700) doc.addPage();
  doc.moveDown(0.8);
  doc.fillColor(PRIMARY).fontSize(15).font('Helvetica-Bold').text(title);
  doc.moveDown(0.2);
  doc.strokeColor(PRIMARY).lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fillColor(TEXT_DARK);
}

function drawSubSection(title) {
  if (doc.y > 720) doc.addPage();
  doc.moveDown(0.5);
  doc.fillColor(SECONDARY).fontSize(12).font('Helvetica-Bold').text(title);
  doc.moveDown(0.3);
  doc.fillColor(TEXT_DARK).fontSize(10).font('Helvetica');
}

function drawBox(text, bg = BG_LIGHT) {
  if (doc.y > 680) doc.addPage();
  const startY = doc.y;
  doc.font('Helvetica-Oblique').fontSize(9.5);
  const textHeight = doc.heightOfString(text, { width: 495 });
  doc.rect(40, startY, 515, textHeight + 16).fillAndStroke(bg, ACCENT);
  doc.fillColor(TEXT_DARK).text(text, 50, startY + 8, { width: 495 });
  doc.y = startY + textHeight + 24;
}

function drawCodeBlock(code) {
  if (doc.y > 680) doc.addPage();
  const startY = doc.y;
  doc.font('Courier').fontSize(8.5);
  const textHeight = doc.heightOfString(code, { width: 495 });
  doc.rect(40, startY, 515, textHeight + 14).fillAndStroke('#2B2D42', '#1A1A1A');
  doc.fillColor('#F8F9FA').text(code, 48, startY + 7, { width: 495 });
  doc.y = startY + textHeight + 20;
}

// ------------------- DOCUMENT GENERATION ------------------- //

// Header
drawHeader('TINDER SYSTEM DESIGN ARCHITECTURE', 'Scalable Location-Based Recommendation, Match Engine & Chat System');

// Introduction / Overview
doc.font('Helvetica').fontSize(10).fillColor(TEXT_DARK);
doc.text('This document presents the high-level system design architecture for a large-scale dating application like Tinder, handling 10 Million Daily Active Users (DAU), real-time location matching, image storage, and low-latency 1-on-1 direct messaging.');

drawBox('Credits & Reference: Derived from System Design concepts by Rajneesh Verma, Avash Mitra, and Gaurav Sen (InterviewReady).');

// Section 1: System Requirements
drawSectionHeader('1. System Requirements & Scope');

drawSubSection('Prioritized Functional Requirements');
doc.list([
  'Profile Management: Store user metadata (name, age, gender, location, bio) and up to 5 profile images.',
  'Location-Based Recommendations: Recommend candidate profiles based on geographical proximity, age/gender preferences, and past swipe choices.',
  'Match Engine: Store mutual right-swipes as match records.',
  'Real-Time 1-on-1 Chat: Allow direct messaging between two users if and only if they have matched.'
], { bulletRadius: 2, textIndent: 10 });

doc.moveDown(0.5);
drawSubSection('Requirements Not In Scope');
doc.list([
  'Profile moderation and automated content filtering.',
  'Payment subscriptions (Tinder Gold/Platinum).',
  'Enforcing daily swipe limits on free tier accounts.'
], { bulletRadius: 2, textIndent: 10 });

// Section 2: Capacity Estimations
drawSectionHeader('2. Capacity & Scale Estimations');

const capText = 
`• Active Users (DAU): 10,000,000 (10 Million users daily)
• Profile Photos: 5 photos per user @ 2 MB average file size
• Total Image Storage: 10M × 5 × 2 MB = 100 Terabytes (TB)
• Daily Matches: 0.1% of DAU = 1,000,000 matches/day (~1,000 matches/sec peak)
• Concurrent Chat Sockets: ~2,000,000 active persistent XMPP socket connections`;
drawBox(capText, '#FFF0F3');

// Section 3: High-Level Architecture
drawSectionHeader('3. High-Level Architecture Components');

drawSubSection('Core Microservices & Subsystems');
doc.text('1. API Gateway Service: Handles load balancing, auth token validation (JWT), TLS termination, and rate limiting across internal services.');
doc.moveDown(0.3);
doc.text('2. Distributed File System & CDN: Stores 5 profile images per user in Object Storage (S3/GCS) and serves them via edge CDN nodes for sub-100ms loading speeds.');
doc.moveDown(0.3);
doc.text('3. Relational User DB (Geo-Sharded): Stores user metadata sharded horizontally by location with Master-Slave replication for failover.');
doc.moveDown(0.3);
doc.text('4. Matcher Service & Database: Evaluates right-swipe events and records mutual matches in indexed tables.');
doc.moveDown(0.3);
doc.text('5. Session Service & Redis Cache: Maps UserID to ConnectionID in Redis cache for instantaneous XMPP socket routing.');
doc.moveDown(0.3);
doc.text('6. Recommendation Engine: Generates real-time candidate profile feeds based on location spatial indexes and age/gender filtering.');

// Section 4: Architectural Trade-Off Analysis
drawSectionHeader('4. Architectural Trade-Off Analysis');

drawSubSection('Trade-Off 1: Image Storage (DFS + CDN vs Database BLOBs)');
doc.text('Storing images as BLOBs in relational databases offers mutability, transaction guarantees, and indexing. However, static image files do not need these features. Storing images in a Distributed File System (S3/GCS) backed by a CDN is significantly cheaper, faster, and highly scalable.');

drawSubSection('Trade-Off 2: Real-time Chat (XMPP Protocol vs HTTP Polling)');
doc.text('HTTP Polling requires clients to constantly send requests to check for new messages, draining battery and overwhelming servers. XMPP / WebSockets provide persistent peer-to-peer TCP channels, allowing server-pushed instantaneous messages with minimal overhead.');

drawSubSection('Trade-Off 3: Match Details (Server-Side DB vs Client-Side Storage)');
doc.text('Storing match records on the client saves server disk space, but match history is lost upon app reinstallation or cache clearance. Server-side relational database storage ensures an immutable, tamper-proof single source of truth.');

// Section 5: Database Schema
drawSectionHeader('5. Database Schema & Indexing');

drawSubSection('User Profiles Table (Location Sharded)');
drawCodeBlock(
`CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_location ON users (latitude, longitude);`
);

drawSubSection('Match Engine Table');
drawCodeBlock(
`CREATE TABLE matches (
    match_id VARCHAR(36) PRIMARY KEY,
    user_id_1 VARCHAR(36) NOT NULL,
    user_id_2 VARCHAR(36) NOT NULL,
    is_matched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_pair UNIQUE (user_id_1, user_id_2)
);
CREATE INDEX idx_user_matches ON matches (user_id_1, is_matched);`
);

// Section 6: API Interface Specifications
drawSectionHeader('6. API Interface Specifications');

const apiSpec = 
`Profile Service:
  POST /user/signup          -> Creates new user account & returns auth token
  GET  /user/login           -> Authenticates user & issues session JWT
  GET  /user/:userID         -> Gets target user profile details
  PUT  /user/:userID         -> Updates location coordinates & bio

Matcher & Recommendation Service:
  GET  /recommendation       -> Returns ranked candidates feed
  POST /swipe                -> Records user swipe action (LIKE / PASS)
  GET  /match                -> Returns active mutual matches for logged-in user

Session & Chat Service:
  POST /session/connection   -> Establishes persistent socket mapping
  GET  /session/users/:id    -> Resolves connected user pair metadata`;

drawBox(apiSpec, '#F0F7FF');

// Page Numbering Footer
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
  doc.switchToPage(i);
  doc.fillColor(ACCENT).fontSize(8).text(
    `Tinder System Design Document | Page ${i + 1} of ${pages.count}`,
    40,
    810,
    { align: 'center', width: 515 }
  );
}

doc.end();

stream.on('finish', () => {
  console.log('PDF generated successfully at:', outputPath);
});
