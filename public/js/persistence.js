// Persistence, XP/Levels, Gamification Badges & Export/Share Engine

export class PersistenceManager {
  constructor() {
    this.STORAGE_KEY = 'careermitra_state_v1';
    this.state = this.loadState();

    this.badges = [
      { id: 'first_login', title: 'Cosmic Voyager', icon: '🌌', desc: 'Entered CareerMitra galaxy.', check: () => true },
      { id: 'skill_master', title: 'First Mastery', icon: '⚡', desc: 'Mastered your first skill node.', check: (s) => s.completedSkills.length >= 1 },
      { id: 'trio_sprint', title: 'Velocity Sprinter', icon: '🚀', desc: 'Mastered 3 engineering skills.', check: (s) => s.completedSkills.length >= 3 },
      { id: 'prior_knowledge', title: 'Prodigy Bypass', icon: '💡', desc: 'Exempted a skill with prior knowledge.', check: (s) => s.exemptSkills.length >= 1 },
      { id: 'quiz_ace', title: 'Knowledge Marksman', icon: '🎯', desc: 'Scored 100% on a technical quiz.', check: (s) => s.quizAced === true },
      { id: 'level_two', title: 'Nebula Explorer', icon: '🪐', desc: 'Reached Level 2 in your career log.', check: (s) => s.level >= 2 },
      { id: 'level_three', title: 'Constellation Architect', icon: '👑', desc: 'Reached Level 3 milestone.', check: (s) => s.level >= 3 },
      { id: 'capstone_ship', title: 'Ship It!', icon: '🛠️', desc: 'Completed a real-world portfolio project.', check: (s) => s.completedProjects >= 1 }
    ];
  }

  loadState() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Failed to parse state from localStorage, resetting.');
      }
    }
    return {
      activeRoleId: 'ai-engineer',
      completedSkills: [],
      exemptSkills: [],
      xp: 0,
      level: 1,
      unlockedBadges: ['first_login'],
      completedProjects: 0,
      quizAced: false,
      geminiApiKey: ''
    };
  }

  saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    this.updateUI();
  }

  setSkillStatus(skillId, status) {
    this.state.completedSkills = this.state.completedSkills.filter(id => id !== skillId);
    this.state.exemptSkills = this.state.exemptSkills.filter(id => id !== skillId);

    if (status === 'completed') {
      this.state.completedSkills.push(skillId);
    } else if (status === 'exempt') {
      this.state.exemptSkills.push(skillId);
    }

    this.recalculateXP();
    this.checkBadges();
    this.saveState();
  }

  recalculateXP() {
    const completedXp = this.state.completedSkills.length * 250;
    const exemptXp = this.state.exemptSkills.length * 60;
    this.state.xp = completedXp + exemptXp;

    // Calculate level
    if (this.state.xp >= 2800) this.state.level = 5;
    else if (this.state.xp >= 1600) this.state.level = 4;
    else if (this.state.xp >= 800) this.state.level = 3;
    else if (this.state.xp >= 300) this.state.level = 2;
    else this.state.level = 1;
  }

  checkBadges() {
    this.badges.forEach(badge => {
      if (!this.state.unlockedBadges.includes(badge.id)) {
        if (badge.check(this.state)) {
          this.state.unlockedBadges.push(badge.id);
        }
      }
    });
  }

  updateUI() {
    const xpDisplays = [document.getElementById('headerXpDisplay')];
    xpDisplays.forEach(el => {
      if (el) el.textContent = `${this.state.xp} XP`;
    });

    const levelDisplays = [document.getElementById('headerLevelDisplay')];
    levelDisplays.forEach(el => {
      if (el) el.textContent = `LVL ${this.state.level}`;
    });

    const missionTitle = document.getElementById('missionLevelTitle');
    const missionSummary = document.getElementById('missionXpSummary');
    const missionRankBadge = document.getElementById('missionRankBadge');

    const rankTitles = {
      1: { name: 'Level 1: Starlight Cadet', rank: 'CADET' },
      2: { name: 'Level 2: Nebula Explorer', rank: 'EXPLORER' },
      3: { name: 'Level 3: Constellation Engineer', rank: 'ENGINEER' },
      4: { name: 'Level 4: Quantum Architect', rank: 'ARCHITECT' },
      5: { name: 'Level 5: Cosmic Principal', rank: 'PRINCIPAL' }
    };

    const currentRank = rankTitles[this.state.level] || rankTitles[1];
    if (missionTitle) missionTitle.textContent = currentRank.name;
    if (missionRankBadge) missionRankBadge.textContent = currentRank.rank;
    if (missionSummary) {
      missionSummary.textContent = `${this.state.xp} XP Earned • ${this.state.completedSkills.length} Mastered • ${this.state.exemptSkills.length} Prior Knowledge`;
    }

    this.renderBadges();
  }

  renderBadges() {
    const container = document.getElementById('badgesContainer');
    if (!container) return;
    container.innerHTML = '';

    this.badges.forEach(b => {
      const isUnlocked = this.state.unlockedBadges.includes(b.id);
      const card = document.createElement('div');
      card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div>
          <div class="badge-title">${b.title}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // --- Exporters ---
  exportMarkdown(roadmap) {
    if (!roadmap) return;
    let md = `# 🌌 CareerMitra Study Roadmap: ${roadmap.title}\n\n`;
    md += `> **Domain:** ${roadmap.clusterName || 'Engineering'}\n`;
    md += `> **Market Demand:** ${roadmap.demand || 'High'} | **Salary:** ${roadmap.salaryRange || 'Competitive'}\n\n`;
    md += `### Overview\n${roadmap.tagline || ''}\n\n---\n\n`;

    (roadmap.skillsTree || []).forEach(phase => {
      md += `## ${phase.phaseTitle}\n*${phase.phaseDesc || ''}*\n\n`;
      phase.skills.forEach(s => {
        const check = this.state.completedSkills.includes(s.id) ? '[x]' : '[ ]';
        const exemptTag = this.state.exemptSkills.includes(s.id) ? ' *(Prior Knowledge)*' : '';
        md += `- ${check} **${s.title}** (${s.estHours} hrs, ${s.level})${exemptTag}\n`;
        md += `  - *Focus:* ${s.description}\n`;
        if (s.project) {
          md += `  - *Capstone Project:* ${s.project.title}\n`;
        }
      });
      md += `\n`;
    });

    md += `---\n*Generated by CareerMitra - Cosmic AI Career Navigator on ${new Date().toLocaleDateString()}*\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_roadmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportJson(roadmap) {
    if (!roadmap) return;
    const payload = {
      roadmap,
      progressState: this.state,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careermitra_${roadmap.id || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  generateShareUrl(roadmap) {
    if (!roadmap) return window.location.href;
    const sharePayload = {
      roleId: roadmap.id,
      completed: this.state.completedSkills,
      exempt: this.state.exemptSkills
    };
    const b64 = btoa(JSON.stringify(sharePayload));
    return `${window.location.origin}${window.location.pathname}#share=${b64}`;
  }
}
