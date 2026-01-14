# Nusantara Mount Tracker — README

This repo contains a full-stack mobile application (Expo React Native) + backend (Node.js + SQLite) for Nusantara Mount Tracker.

Features
- Offline-first mountain database (cache on device)
- Interactive map with routes, basecamp, checkpoints
- NPC virtual guide walking route (with ETA, remaining distance, elevation gain)
- Distance measurement tools and altimeter simulation
- Auth + user profile + premium system (manual upgrade via WhatsApp)
- Backend to manage users and mountain data

Quick start (frontend)
1. Install dependencies:
   - npm install -g expo-cli
   - cd app
   - npm install
   - expo start

2. Run on device (recommended) or simulator. Grant location permissions.

Quick start (backend)
1. cd server
2. npm install
3. node index.js
4. The server runs on http://localhost:4000 (adjust in app/src/services/api.js)

Admin: to mark a user Premium:
- Use POST /admin/upgrade with JSON { "email": "user@example.com" }
- This simulates manual confirmation after user sends the WhatsApp message.

Data
- assets/mountains.json includes the mountain DB; it's loaded into local SQLite on first app boot.

Notes
- Start backend first (server), then Expo app. For device to reach backend, set API_BASE to your machine LAN IP if required.

README
