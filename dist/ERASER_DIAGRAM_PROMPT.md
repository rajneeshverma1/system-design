# Eraser.io Prompts & Syntax for Tinder Architecture Diagram

This file provides ready-to-use prompts and syntax for generating dark-mode system design diagrams on [Eraser.io](https://eraser.io).

---

## 🤖 Eraser AI Natural Language Prompt

Paste this into Eraser's **AI Diagram Generator**:

```text
Create a left-to-right horizontal system design architecture diagram for Tinder on a dark black background in hand-drawn sketch style.

The flow has 6 sequential stages connected by arrows:
1. "Tinder Mobile Apps" (Clients: Swipes, Chat, Profiles) on the far left.
2. "API Gateway" (Auth Token Validation & Load Balancer).
3. "Pub/Sub Swipe Queue" (Kafka / Redis Streams for async swipes).
4. "Matcher Workers" (Group box containing Worker 1, Worker 2, and Worker N).
5. "Geo-Sharded DBs" (Group box containing Shard 1 Geohash, Shard 2 Geohash, Shard N Geohash).
6. "Storage & Realtime Clusters" (Group box containing Cell 1: Match DB & Redis Session Cache, and Cell 2: 100+ TB S3 Media & CDN Edge Nodes).

Use colored outlines for each section: Red for Gateway, Orange for Queue, Blue for Workers, Green for Geo Shards, Purple for Storage. Hand-drawn dark mode theme.
```

---

## 💻 Eraser Diagram-as-Code Syntax

Paste this into Eraser's **Code Editor** tab:

```text
// Tinder System Architecture Diagram
Tinder Mobile Apps [color: white] > API Gateway [color: red]
API Gateway > Pub/Sub Swipe Queue [color: orange]
Pub/Sub Swipe Queue > Matcher Workers [color: blue]

// Matcher Workers Group
Matcher Workers [color: blue] {
  Worker 1
  Worker 2
  Worker N
}

Matcher Workers > Geo-Sharded DBs [color: green]

// Geo-Sharded DBs Group
Geo-Sharded DBs [color: green] {
  Shard 1 (Geohash)
  Shard 2 (Geohash)
  Shard N (Geohash)
}

Geo-Sharded DBs > Storage & Realtime Clusters [color: purple]

// Storage Clusters Group
Storage & Realtime Clusters [color: purple] {
  Cell 1: Match DB & Redis Session Cache
  Cell 2: S3 Media Storage & CDN Edge Nodes
}
```
