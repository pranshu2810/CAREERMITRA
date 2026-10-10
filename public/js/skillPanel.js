// Actionable Skill Drawer & Interactive Quiz Controller

export class SkillPanelController {
  constructor(drawerId, onStatusChange, onTriggerReplan) {
    this.drawer = document.getElementById(drawerId);
    this.onStatusChange = onStatusChange;
    this.onTriggerReplan = onTriggerReplan;

    this.currentSkill = null;
    this.currentPhase = null;

    this.initEvents();
  }

  initEvents() {
    // Close Drawer
    const btnClose = document.getElementById('btnCloseSkillDrawer');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    // Tabs inside drawer
    const tabButtons = this.drawer.querySelectorAll('.drawer-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        document.getElementById('paneOverview').style.display = tab === 'overview' ? 'flex' : 'none';
        document.getElementById('paneProject').style.display = tab === 'project' ? 'flex' : 'none';
        document.getElementById('paneQuiz').style.display = tab === 'quiz' ? 'flex' : 'none';
      });
    });

    // Status Buttons
    const statusBtns = this.drawer.querySelectorAll('.btn-status-toggle');
    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const newStatus = btn.dataset.status;
        this.updateSkillStatus(newStatus);
      });
    });

    // Quick Replan Button in Drawer
    const btnQuickReplan = document.getElementById('btnDrawerQuickReplan');
    if (btnQuickReplan) {
      btnQuickReplan.addEventListener('click', () => {
        if (this.onTriggerReplan) {
          this.onTriggerReplan();
        }
      });
    }
  }

  open(skill, phase) {
    this.currentSkill = skill;
    this.currentPhase = phase;

    // Fill Header
    document.getElementById('drawerSkillTitle').textContent = skill.title;
    document.getElementById('drawerSkillPhaseBadge').textContent = phase ? phase.phaseTitle : 'Competency';
    document.getElementById('drawerSkillMeta').textContent = `Est: ${skill.estHours || 20} hrs • Level: ${skill.level || 'Intermediate'}`;
    document.getElementById('drawerSkillDesc').textContent = skill.description;

    // Highlight active status button
    this.syncStatusButtons(skill.status || 'available');

    // Populate Resources
    const resourcesList = document.getElementById('drawerResourcesList');
    resourcesList.innerHTML = '';
    (skill.resources || []).forEach(res => {
      const card = document.createElement('a');
      card.className = 'resource-card';
      card.href = res.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.innerHTML = `
        <div class="resource-meta">
          <span class="resource-type-badge">${res.type || 'guide'}</span>
          <span style="font-size: 13.5px; font-weight: 600;">${res.title}</span>
        </div>
        <span style="color: #38bdf8; font-size: 13px;">↗</span>
      `;
      resourcesList.appendChild(card);
    });

    if (!skill.resources || skill.resources.length === 0) {
      resourcesList.innerHTML = `<div style="font-size: 13px; color: var(--text-dim);">Curated reference materials available upon roadmap synchronization.</div>`;
    }

    // Populate Project Challenge
    const projectTitle = document.getElementById('drawerProjectTitle');
    const projectBrief = document.getElementById('drawerProjectBrief');
    const deliverablesList = document.getElementById('drawerDeliverablesList');

    if (skill.project) {
      projectTitle.textContent = skill.project.title;
      projectBrief.textContent = skill.project.brief;
      deliverablesList.innerHTML = '';

      (skill.project.deliverables || []).forEach((deliv, idx) => {
        const li = document.createElement('li');
        const checkedKey = `deliv_${skill.id}_${idx}`;
        const isChecked = localStorage.getItem(checkedKey) === 'true';

        li.innerHTML = `
          <input type="checkbox" id="${checkedKey}" ${isChecked ? 'checked' : ''}>
          <label for="${checkedKey}">${deliv}</label>
        `;

        li.querySelector('input').addEventListener('change', (e) => {
          localStorage.setItem(checkedKey, e.target.checked);
        });

        deliverablesList.appendChild(li);
      });
    } else {
      projectTitle.textContent = 'Portfolio Capstone Practice';
      projectBrief.textContent = 'Implement a standalone production module demonstrating this skill.';
      deliverablesList.innerHTML = '<li>Zero compile errors and unit test coverage >= 80%</li>';
    }

    // Populate Quiz
    this.renderQuiz(skill);

    // Reset to Overview tab
    const firstTab = this.drawer.querySelector('.drawer-tab-btn[data-tab="overview"]');
    if (firstTab) firstTab.click();

    this.drawer.classList.add('open');
  }

  close() {
    this.drawer.classList.remove('open');
  }

  syncStatusButtons(currentStatus) {
    const statusBtns = this.drawer.querySelectorAll('.btn-status-toggle');
    statusBtns.forEach(b => {
      b.className = 'btn-status-toggle';
      if (b.dataset.status === currentStatus) {
        if (currentStatus === 'completed') b.classList.add('active-mastered');
        else if (currentStatus === 'exempt') b.classList.add('active-exempt');
        else if (currentStatus === 'in_progress') b.classList.add('active-progress');
        else b.classList.add('active-not-started');
      }
    });
  }

  updateSkillStatus(newStatus) {
    if (!this.currentSkill) return;
    this.currentSkill.status = newStatus;
    this.syncStatusButtons(newStatus);

    if (this.onStatusChange) {
      this.onStatusChange(this.currentSkill, newStatus);
    }
  }

  renderQuiz(skill) {
    const container = document.getElementById('drawerQuizContainer');
    container.innerHTML = '';

    const questions = skill.quiz || [];
    if (questions.length === 0) {
      container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; text-align: center; color: var(--text-muted);">
          <span>🧪 Complete the project challenge to solidify your understanding.</span>
        </div>
      `;
      return;
    }

    questions.forEach((q, qIdx) => {
      const qCard = document.createElement('div');
      qCard.className = 'quiz-card';

      qCard.innerHTML = `
        <div class="quiz-question-text">
          <span style="color: #a78bfa; font-weight: 800;">Q${qIdx + 1}:</span> ${q.question}
        </div>
        <div class="quiz-options-list">
          ${q.options.map((opt, optIdx) => `
            <button class="quiz-option-btn" data-qidx="${qIdx}" data-optidx="${optIdx}">
              ${String.fromCharCode(65 + optIdx)}. ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback" style="display: none;" id="feedback_${skill.id}_${qIdx}"></div>
      `;

      const optionBtns = qCard.querySelectorAll('.quiz-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedIdx = parseInt(btn.dataset.optidx, 10);
          const feedbackEl = qCard.querySelector(`#feedback_${skill.id}_${qIdx}`);

          // Disable further clicks on this question
          optionBtns.forEach(b => b.style.pointerEvents = 'none');

          if (selectedIdx === q.correctIndex) {
            btn.classList.add('correct');
            feedbackEl.className = 'quiz-feedback success';
            feedbackEl.innerHTML = `<strong>Correct!</strong> ${q.explanation || ''}`;
          } else {
            btn.classList.add('wrong');
            optionBtns[q.correctIndex].classList.add('correct');
            feedbackEl.className = 'quiz-feedback failure';
            feedbackEl.innerHTML = `<strong>Incorrect.</strong> ${q.explanation || ''}`;
          }
          feedbackEl.style.display = 'block';
        });
      });

      container.appendChild(qCard);
    });
  }
}
