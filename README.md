# CareerMitra 🌌

> **Navigate Your Career Galaxy** — An AI-powered career path navigator with interactive galaxy visualization, personalized roadmaps, skill tracking, and career comparison.

![CareerMitra Hero](public/assets/career_galaxy_hero.jpg)

---

## 🚀 Features

### Phase 1 · Career Galaxy UI
- **Interactive SVG Galaxy** — 10+ career constellations rendered as animated, glowing nodes connected by strength-weighted edges
- **Clickable Career Nodes** — Hover for tooltips (salary, demand, skills), click to open rich detail modal
- **Career Cards Grid** — Below the galaxy, filterable cards with skill chips and salary data
- **Filter & Search** — Filter by category (Engineering, Data & AI, Design, Product, Security) or search by skills
- **Career Detail Modal** — Phases preview, resources, stats, compare toggle, and roadmap CTA

### Phase 2 · AI Roadmap API & Interactive Graph
- **AI Roadmap Generation** — Skill-match analysis, personalized phase durations, task prioritization
- **Phase Accordion** — Expandable roadmap phases with task checklist, progress ring, and resources
- **AI Insights Card** — Personalized summary, recommendations, and alternative paths
- **Weekly Schedule** — Breakdown of weekly learning focus and hours
- **Alternative Paths** — Adjacent career suggestions based on skill overlap

### Phase 3 · Skill Panels & Dynamic Replanning  
- **Task Checkboxes** — Click any task to mark complete; synced to global store
- **Priority Labels** — AI labels tasks as `learn` or `review` based on your existing skills
- **Dynamic Replan** — Slide to adjust timeline; AI regenerates remaining phases
- **Notes Panel** — Persistent markdown-style notes per career path

### Phase 4 · Persistence, Progress, Comparison & Export
- **localStorage Persistence** — All progress, profiles, saved roadmaps, and notes survive page refresh via Zustand `persist`
- **Progress Dashboard** — Radial bar chart, weekly activity line chart, per-career phase breakdowns
- **Career Comparison** — Radar chart (skill profiles), salary bar chart, skill overlap analysis for up to 3 careers
- **PDF Export** — Themed PDF with AI summary, phase checklists, recommendations via jsPDF
- **Share** — Native `navigator.share` or clipboard fallback
- **User Profile** — Name, role, experience, skill tags, target career, timeline slider, learning style

### Phase 5 · Quality & Documentation
- ✅ Build passes: 3100 modules, zero errors
- 🎨 Premium dark cosmic design with glassmorphism
- ✨ Micro-animations via Framer Motion throughout
- 🌟 Canvas starfield with shooting stars
- ♿ Semantic HTML, unique IDs on all interactive elements
- 📱 Responsive layout (mobile-friendly)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Vanilla CSS (custom design system) |
| Animations | Framer Motion 14 |
| State | Zustand 5 (with `persist`) |
| Charts | Recharts 3 |
| Export | jsPDF 4, html2canvas |
| Icons | Lucide React |
| Toasts | react-hot-toast 2 |
| Routing | react-router-dom 7 (view-based) |

---

## 🔧 Setup

```bash
# Install dependencies
npm install

# Start frontend dev server (Vite)
npm run dev

# Start backend API server (Express - optional)
npm run dev:server

# Production build
npm run build

# Preview production build
npm run preview
```

The frontend runs at **http://localhost:5173**  
The backend API runs at **http://localhost:3000**

---

## 📁 Project Structure

```
CareerMitra/
├── src/
│   ├── components/
│   │   ├── CareerGalaxy.jsx      # SVG galaxy + career cards
│   │   ├── CareerDetailModal.jsx # Career detail overlay
│   │   ├── Navbar.jsx            # Animated top navigation
│   │   └── StarField.jsx         # Canvas starfield background
│   ├── pages/
│   │   ├── RoadmapView.jsx       # AI roadmap + task tracking
│   │   ├── CompareView.jsx       # Career comparison charts
│   │   ├── ProgressView.jsx      # Progress dashboard
│   │   └── ProfileView.jsx       # User profile + saved roadmaps
│   ├── store/
│   │   └── useStore.js           # Zustand global state (persisted)
│   ├── data/
│   │   └── careers.js            # Career nodes, edges, metadata
│   ├── utils/
│   │   ├── roadmapAPI.js         # AI roadmap generation logic
│   │   └── exportUtils.js        # PDF export, share utilities
│   ├── App.jsx                   # Root component, view routing
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global design system (800+ lines)
├── public/
│   └── assets/
│       ├── career_galaxy_hero.jpg
│       └── favicon.svg
├── server.js                     # Express backend API (pre-existing)
├── vite.config.js
└── package.json
```

---

## 🎨 Design System

The app uses a custom CSS design system in `index.css` with:

- **Colors**: Deep space (`#04030d`) → Violet (`#7c3aed`) → Cyan (`#06b6d4`) palette
- **Typography**: Outfit (display) + Inter (body) + JetBrains Mono (code)
- **Components**: Glass cards, gradient buttons, progress bars, badges, modals
- **Animations**: Float, pulse-glow, shimmer, nodeAppear, edgeDraw, spring transitions

---

## 🤖 AI Roadmap Engine

The `roadmapAPI.js` simulates an AI model that:

1. **Computes skill match** — Compares user skills to career skill requirements (0–90% match)
2. **Adjusts phase durations** — Compresses early phases for experienced learners
3. **Prioritizes tasks** — Labels known skills as `review`, unknown as `learn`
4. **Generates personalized summary** — Contextual AI description with match percentage
5. **Creates weekly plan** — Maps phases to week ranges with hour targets
6. **Suggests alternative paths** — Based on skill overlap with related careers
7. **Dynamic replanning** — Adjusts remaining phases when timeline or skills change

> **Production Integration**: Replace `delay()` in `roadmapAPI.js` with a real Gemini API call (`generateContent`) for live AI-powered roadmaps.

---

## 📄 License

MIT © CareerMitra / Antigravity
