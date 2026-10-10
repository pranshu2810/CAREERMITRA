// Roadmap Graph & Phase Swimlanes Rendering Engine

export class RoadmapRenderer {
  constructor(containerId, onSkillSelect) {
    this.container = document.getElementById(containerId);
    this.onSkillSelect = onSkillSelect;
    this.currentRoadmap = null;
    this.activeFilter = 'all';
  }

  setRoadmap(roadmap) {
    this.currentRoadmap = roadmap;
    this.render();
    this.updateHUD();
  }

  setFilter(filter) {
    this.activeFilter = filter;
    this.render();
  }

  updateHUD() {
    if (!this.currentRoadmap) return;

    const r = this.currentRoadmap;
    let totalSkills = 0;
    let completedCount = 0;
    let exemptCount = 0;
    let totalHours = 0;
    let remainingHours = 0;

    r.skillsTree.forEach(phase => {
      phase.skills.forEach(skill => {
        totalSkills++;
        const hours = skill.estHours || 20;
        totalHours += hours;

        if (skill.status === 'completed') {
          completedCount++;
        } else if (skill.status === 'exempt') {
          exemptCount++;
        } else {
          remainingHours += hours;
        }
      });
    });

    const progressPercent = totalSkills > 0 ? Math.round(((completedCount + exemptCount) / totalSkills) * 100) : 0;
    const earnedXp = (completedCount * 250) + (exemptCount * 50);

    // Update HUD DOM
    const hudRoleTitle = document.getElementById('hudRoleTitle');
    const hudRoleIcon = document.getElementById('hudRoleIcon');
    const hudRoleTagline = document.getElementById('hudRoleTagline');
    const hudProgressValue = document.getElementById('hudProgressValue');
    const hudProgressFill = document.getElementById('hudProgressFill');
    const hudHoursLeft = document.getElementById('hudHoursLeft');
    const hudEstDate = document.getElementById('hudEstDate');
    const hudEarnedXp = document.getElementById('hudEarnedXp');

    if (hudRoleTitle) hudRoleTitle.innerHTML = `${r.title} <span class="brand-badge">${r.clusterName || 'Engineered'}</span>`;
    if (hudRoleIcon) hudRoleIcon.textContent = r.icon || '🧭';
    if (hudRoleTagline) hudRoleTagline.textContent = r.tagline || 'Master your engineering trajectory.';
    if (hudProgressValue) hudProgressValue.textContent = `${progressPercent}%`;

    if (hudProgressFill) {
      const circumference = 2 * Math.PI * 18; // ~113.097
      const offset = circumference - (progressPercent / 100) * circumference;
      hudProgressFill.style.strokeDashoffset = offset;
    }

    if (hudHoursLeft) hudHoursLeft.textContent = `${remainingHours}h`;
    if (hudEarnedXp) hudEarnedXp.textContent = `+${earnedXp} XP`;

    // Calculate completion date based on pace (default 15h/week)
    const weeksRemaining = Math.ceil(remainingHours / 15);
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + (weeksRemaining * 7));
    if (hudEstDate) {
      hudEstDate.textContent = remainingHours === 0 ? 'Goal Achieved! 🏆' : estDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  render() {
    if (!this.container || !this.currentRoadmap) return;
    this.container.innerHTML = '';

    const phases = this.currentRoadmap.skillsTree || [];

    phases.forEach((phase, phaseIdx) => {
      // Filter skills
      const filteredSkills = phase.skills.filter(s => {
        if (this.activeFilter === 'all') return true;
        return s.status === this.activeFilter;
      });

      if (filteredSkills.length === 0 && this.activeFilter !== 'all') {
        return; // Skip phase if no skills match filter
      }

      const phaseCard = document.createElement('div');
      phaseCard.className = 'phase-swimlane';

      const phaseHeader = document.createElement('div');
      phaseHeader.className = 'phase-header';
      phaseHeader.innerHTML = `
        <div class="phase-title-group">
          <span class="phase-number-badge">PHASE ${phase.phaseId || (phaseIdx + 1)}</span>
          <div>
            <div class="phase-title-text">${phase.phaseTitle}</div>
            <div class="phase-desc-text">${phase.phaseDesc || ''}</div>
          </div>
        </div>
        <div style="font-size: 12px; color: var(--text-dim); font-family: var(--font-mono);">
          ${filteredSkills.length} Competenc${filteredSkills.length === 1 ? 'y' : 'ies'}
        </div>
      `;
      phaseCard.appendChild(phaseHeader);

      const skillsGrid = document.createElement('div');
      skillsGrid.className = 'skills-grid';

      filteredSkills.forEach(skill => {
        const skillCard = document.createElement('div');
        const statusClass = `status-${skill.status || 'available'}`;
        skillCard.className = `skill-card ${statusClass}`;

        const statusTagLabel = {
          'completed': '✅ Mastered',
          'available': '🔓 Available',
          'in_progress': '⏳ In Progress',
          'exempt': '⏭️ Prior Knowledge',
          'locked': '🔒 Locked'
        }[skill.status || 'available'] || 'Available';

        const statusTagClass = {
          'completed': 'tag-completed',
          'available': 'tag-available',
          'in_progress': 'tag-available',
          'exempt': 'tag-exempt',
          'locked': 'tag-locked'
        }[skill.status || 'available'] || 'tag-available';

        const tagsHtml = (skill.tags || []).map(t => `<span class="skill-tag">${t}</span>`).join('');

        skillCard.innerHTML = `
          <div class="skill-card-header">
            <h3 class="skill-card-title">${skill.title}</h3>
            <span class="skill-status-tag ${statusTagClass}">${statusTagLabel}</span>
          </div>

          <p class="skill-card-desc">${skill.description}</p>

          <div class="skill-tags-row">
            ${tagsHtml}
          </div>

          <div class="skill-card-footer">
            <div class="skill-hours-info">
              <span>⏱️ ${skill.estHours || 20} hrs</span>
              <span>•</span>
              <span>${skill.level || 'Intermediate'}</span>
            </div>
            <div class="skill-interactive-hint">
              <span>Inspect Lab & Quiz</span>
              <span>➔</span>
            </div>
          </div>
        `;

        skillCard.addEventListener('click', () => {
          if (this.onSkillSelect) {
            this.onSkillSelect(skill, phase);
          }
        });

        skillsGrid.appendChild(skillCard);
      });

      phaseCard.appendChild(skillsGrid);
      this.container.appendChild(phaseCard);
    });

    if (this.container.children.length === 0) {
      this.container.innerHTML = `
        <div class="glass-panel" style="padding: 40px; text-align: center; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
          <h3>No skills found matching "${this.activeFilter}"</h3>
          <p style="font-size: 13px; margin-top: 6px;">Switch filter to "All Skills" to view the complete roadmap.</p>
        </div>
      `;
    }
  }
}
