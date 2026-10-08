# Designing Tinder: High-Level System Design of a Scalable Dating Platform

*By Rajneesh Verma | Based on System Design Concepts by Avash Mitra & Gaurav Sen (InterviewReady)*

---

How does an app like **Tinder** serve **10 million daily active users**, process millions of swipes, deliver real-time location-based recommendations, and handle instantaneous 1-on-1 chats without collapsing under load? 

In this comprehensive guide, we will break down the **High-Level System Design of Tinder**. We’ll analyze system requirements, estimate storage and traffic requirements, design resilient database schemas and APIs, and evaluate key architectural trade-offs.

---

## 🚀 1. The Core Requirements

When designing a high-scale dating app, we must separate essential core features from secondary capabilities.

### Functional Requirements
1. **Profile & Media Management**: Users must be able to sign up, manage profile metadata (name, age, bio, location), and upload up to 5 profile photos.
2. **Geographical Recommendations**: Users receive a stream of candidate profiles nearby, matching their age and gender preferences.
3. **Real-time Match Processing**: The system records swipes and immediately detects when a mutual right-swipe (match) occurs.
4. **Peer-to-Peer Chat**: Once matched, two users can send direct messages to each other in real-time.

### What We Are Explicitly Excluding
- Paid subscriptions (Tinder Gold/Platinum).
- Daily swipe limit enforcement.
- Admin profile moderation and automated image filtering.

---

## 📊 2. Capacity Estimations & Scale

Let's establish baseline numbers to guide our architectural choices:

- **Daily Active Users (DAU)**: `10,000,000` (10 Million users).
- **Profile Photos**: `5 photos per user` at ~2MB each.
- **Media Storage Required**: `10M × 5 × 2MB = 100 Terabytes (TB)`.
- **Match Events**: Assuming a 0.1% match rate, the system handles ~1,000,000 matches daily (~1,000 match transactions/sec peak).

---

## 🏗️ 3. High-Level Architecture Overview

Here is the high-level architecture connecting our client devices, API Gateway, core microservices, and storage subsystems:

```
[ Mobile Client ]
       |
       +---> (HTTPS / APIs) ---> [ API Gateway ]
       |                               |
       |                +--------------+--------------+------------------+
       |                |                             |                  |
       v                v                             v                  v
 [ CDN ] ---> [ Profile Service ]             [ Matcher Service ] [ Session / Chat Service ]
   |                    |                             |                  |
   v                    v                             v                  v
[ S3 / DFS ]  [ Geo-Sharded User DB ]          [ Match DB ]      [ Redis Connection Cache ]
```

### Key Components:
1. **API Gateway**: Handles TLS termination, token validation, rate-limiting, and load balancing across internal microservices.
2. **Profile Service**: Manages user metadata and handles media upload pipelines.
3. **Recommendation Engine**: Queries location-sharded databases to serve candidate feeds.
4. **Matcher Service**: Evaluates incoming swipe events and manages state transitions for mutual matches.
5. **Session & Chat Service**: Maintains persistent peer-to-peer connection state via XMPP/WebSockets and Redis.

---

## 💡 4. Architectural Deep Dive & Trade-Offs

System design interviews heavily test your ability to weigh trade-offs between competing architecture decisions. Let's analyze the 3 biggest design decisions in Tinder.

---

### Trade-Off #1: Image Storage — Relational DB BLOBs vs. Distributed File System + CDN

When storing profile pictures, you have two primary options:

#### Option A: Database BLOBs
- *Pros*: Single point of storage, transaction guarantees.
- *Cons*: High database size bloat, poor performance for large file reads, costly backups.

#### Option B: Distributed File System (S3/GCS) + CDN (CHOSEN)
- *Why it wins*: Images are static files. Storing them in a Distributed File System (DFS) like S3 and caching them on edge CDNs provides:
  1. **Ultra-fast global latency** for mobile clients.
  2. **Substantially lower cost**.
  3. **High horizontal scalability**.

---

### Trade-Off #2: Real-time Messaging — HTTP Polling vs. XMPP / WebSockets

To enable 1-on-1 messaging after a match occurs, how should clients communicate?

#### Option A: HTTP Short/Long Polling
- Clients repeatedly poll the server asking: *"Do I have new messages?"*
- *Problem*: Causes tremendous server load, high mobile battery drain, and redundant requests when no messages are pending.

#### Option B: XMPP / WebSockets (CHOSEN)
- **Extensible Messaging and Presence Protocol (XMPP)** establishes persistent TCP streams between client and server.
- *Why it wins*: Peer-to-peer bidirectional delivery ensures messages arrive in **real-time** without polling overhead. A **Redis Cache** maps `UserID -> ConnectionID` to route messages instantaneously.

---

### Trade-Off #3: Match Data — Client-Side vs. Server-Side Storage

Where should mutual match details be stored?

#### Option A: Client-Side Storage
- Saves server storage, but data is completely lost if the user uninstalls the app or clears local storage.

#### Option B: Server-Side Storage (CHOSEN)
- Mutually matched user pair IDs (`user_id_1`, `user_id_2`) are persisted in a **Relational Match Database** with unique indexes.
- *Why it wins*: Serves as the immutable **single source of truth**, preventing fraud or local data tampering.

---

## 🗄️ 5. Database Schema & Indexing

To handle high query velocity, relational tables are sharded by geographical location.

### 1. User Profiles (`users`)
```sql
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fast location-based lookup index
CREATE INDEX idx_user_location ON users (latitude, longitude);
```

### 2. Match Records (`matches`)
```sql
CREATE TABLE matches (
    match_id VARCHAR(36) PRIMARY KEY,
    user_id_1 VARCHAR(36) NOT NULL,
    user_id_2 VARCHAR(36) NOT NULL,
    is_matched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_pair UNIQUE (user_id_1, user_id_2)
);

CREATE INDEX idx_user_matches ON matches (user_id_1, is_matched);
```

---

## ⚡ 6. API Interface Design

Here are the primary RESTful endpoints powering the application:

### Profile Service
- `POST /user/signup` — Create user profile
- `GET /user/login` — Obtain authentication token
- `GET /user/:userID` — Fetch profile metadata
- `PUT /user/:userID` — Update user location & preferences

### Session Service
- `POST /session/connection/:userID1/:userID2` — Link connection ID for matched users
- `GET /session/users/:connectionID` — Resolve connected user pair

### Matcher Service
- `GET /match` — Retrieve match list for logged-in user
- `DELETE /match/:userID` — Remove match

### Recommendation Service
- `GET /recommendation` — Retrieve curated candidate profiles feed

---

## 🎯 Summary Checklist for System Design Interviews

1. **Leverage CDNs & S3** for static media assets instead of relational DBs.
2. **Use XMPP / WebSockets** for real-time peer-to-peer 1-on-1 chat.
3. **Partition relational databases horizontally** based on geographical location.
4. **Use Master-Slave DB replicas** to separate read-heavy recommendation queries from write-heavy swipe events.

---
*Published on Medium | System Design Architecture Series*
