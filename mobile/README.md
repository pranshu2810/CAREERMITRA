# CareerMitra Mobile 📱🌌

> Cross-platform React Native companion app for CareerMitra — connecting to the same unified Express AI backend.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure your backend server is running in the root directory:
```bash
# In the root CareerMitra directory:
node server.js
# Or
npm run dev:server
# → Server orbits on http://localhost:3000
```

### 2. Run the Mobile App
From the `mobile/` directory:
```bash
cd mobile
npm install
npm start
```

Press:
- **`a`** to open in Android Emulator
- **`i`** to open in iOS Simulator (macOS)
- **`w`** to open in Web Browser
- Or scan the QR code with **Expo Go** on your physical Android or iPhone!

---

## 📡 Connecting Physical Device (Expo Go)
When running on a physical phone via Expo Go, update `BASE_URL` in [`src/api/config.js`](./src/api/config.js) with your computer's local Wi-Fi IP address:
```javascript
export const BASE_URL = 'http://192.168.1.X:3000';
```

---

## 📱 Features Included
- **Cosmic Landing Screen**: High-impact introduction, feature pillars, and quick exploration triggers.
- **Unified Authentication**: Sign In, Register, 1-Click Demo credentials, and instant Guest Access powered by the shared backend `/api/auth/*` endpoints.
- **Career Galaxy Browser**: Search and filter 10+ career constellations by cluster, growth rate, and salary range.
- **Interactive Roadmap Screen**: Progressive milestones, prerequisite checklist, and mastery progress percentage tracking.
