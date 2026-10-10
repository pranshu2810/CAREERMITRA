// CareerMitra Main Application Orchestrator

import { CareerGalaxy } from './galaxy.js';
import { RoadmapRenderer } from './roadmap.js';
import { SkillPanelController } from './skillPanel.js';
import { CareerComparisonManager } from './comparison.js';
import { PersistenceManager } from './persistence.js';

class CareerMitraApp {
  constructor() {
    this.careers = [];
    this.clusters = [];
    this.currentRoadmap = null;
    this.selectedGalaxyNode = null;

    // Managers
    this.persistence = new PersistenceManager();
    this.comparison = new CareerComparisonManager();

    this.init();
  }

  async init() {
    this.initGalaxy();
    this.initRoadmap();
    this.initSkillDrawer();
    this.initNavigation();
    this.initModals();
    this.initSearchAndFilters();
    this.initExporters();

    // Load initial careers dataset from API
    await this.fetchCareers();

    // Check URL hash for shared roadmap or resume last role
    this.handleInitialState();

    this.persistence.updateUI();
  }

  // --- Galaxy Initialization ---
  initGalaxy() {
    const hoverCard = document.getElementById('hoverCard');
    const hoverTitle = document.getElementById('hoverTitle');
    const hoverCluster = document.getElementById('hoverCluster');
    const hoverIcon = document.getElementById('hoverIcon');
    const hoverSalary = document.getElementById('hoverSalary');
    const hoverDemand = document.getElementById('hoverDemand');

    this.galaxy = new CareerGalaxy(
      'galaxyCanvas',
      'galaxyViewport',
      // On Node Click
      (node) => this.openRoleInspector(node),
      // On Node Hover
      (node, screenPos) => {
        if (node && screenPos) {
          hoverTitle.textContent = node.title;
          hoverCluster.textContent = node.clusterName || 'System';
          hoverIcon.textContent = node.icon || '🪐';
          hoverSalary.textContent = node.salaryRange || 'Competitive';
          hoverDemand.textContent = node.demand || 'High';

          hoverCard.style.left = `${Math.min(window.innerWidth - 310, Math.max(10, screenPos.x + 20))}px`;
          hoverCard.style.top = `${Math.min(window.innerHeight - 180, Math.max(80, screenPos.y - 40))}px`;
          hoverCard.classList.add('visible');
        } else {
          hoverCard.classList.remove('visible');
        }
      }
    );

    // Zoom & Reset buttons
    document.getElementById('btnZoomIn')?.addEventListener('click', () => this.galaxy.zoom(0.2));
    document.getElementById('btnZoomOut')?.addEventListener('click', () => this.galaxy.zoom(-0.2));
    document.getElementById('btnResetView')?.addEventListener('click', () => this.galaxy.resetView());
  }

  // --- Roadmap Initialization ---
  initRoadmap() {
    this.roadmapRenderer = new RoadmapRenderer('roadmapPhasesContainer', (skill, phase) => {
      this.skillDrawer.open(skill, phase);
    });

    // Roadmap filter buttons
    const filterBtns = document.querySelectorAll('#roadmapStatusFilters .rf-pill');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.roadmapRenderer.setFilter(btn.dataset.filter);
      });
    });

    // Dynamic Replan Button in HUD
    document.getElementById('btnDynamicReplan')?.addEventListener('click', () => {
      this.triggerDynamicReplan();
    });

    // Replanner Alert Banner triggers
    document.getElementById('btnTriggerReplannerBanner')?.addEventListener('click', () => {
      this.triggerDynamicReplan();
    });

    // Back to Galaxy
    document.getElementById('btnBackToGalaxy')?.addEventListener('click', () => {
      this.switchView('galaxyView');
    });
  }

  // --- Actionable Skill Drawer Initialization ---
  initSkillDrawer() {
    this.skillDrawer = new SkillPanelController(
      'skillDrawer',
      // On Status Change
      (skill, status) => {
        this.persistence.setSkillStatus(skill.id, status);
        this.showToast(`Updated "${skill.title}" to ${status.replace('_', ' ').toUpperCase()}`, 'info');
        
        // Show replanner alert suggestion
        const alertBar = document.getElementById('replannerAlertBar');
        if (alertBar) alertBar.style.display = 'flex';

        this.roadmapRenderer.updateHUD();
      },
      // On Trigger Replan
      () => {
        this.triggerDynamicReplan();
      }
    );
  }

  // --- Search & Filters ---
  initSearchAndFilters() {
    const searchInput = document.getElementById('galaxySearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) return;

        const matched = this.careers.find(c => 
          c.title.toLowerCase().includes(query) ||
          c.clusterName.toLowerCase().includes(query)
        );

        if (matched) {
          this.galaxy.setFilter(matched.cluster);
        }
      });
    }

    const clusterPills = document.querySelectorAll('#clusterFilterRow .cluster-pill-btn');
    clusterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        clusterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.galaxy.setFilter(pill.dataset.cluster);
      });
    });
  }

  // --- Navigation & View Switching ---
  initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab-btn');
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        if (target === 'compareModal') {
          this.openModal('compareModal');
          return;
        }
        if (target === 'missionModal') {
          this.openModal('missionModal');
          return;
        }

        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.switchView(target);
      });
    });

    document.getElementById('brandNav')?.addEventListener('click', () => {
      this.switchView('galaxyView');
    });

    document.getElementById('xpPill')?.addEventListener('click', () => {
      this.openModal('missionModal');
    });
  }

  switchView(viewId) {
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }

    // Update nav tab highlight
    document.querySelectorAll('.nav-tab-btn').forEach(t => {
      if (t.dataset.target === viewId) t.classList.add('active');
      else if (t.dataset.target !== 'compareModal' && t.dataset.target !== 'missionModal') t.classList.remove('active');
    });

    if (viewId === 'galaxyView') {
      this.galaxy.resize();
    }
  }

  // --- Modals Controller ---
  initModals() {
    // Modal close triggers
    document.querySelectorAll('.modal-overlay .modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const overlay = e.target.closest('.modal-overlay');
        if (overlay) overlay.classList.remove('active');
      });
    });

    // Backdrop click close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // Launch New Path Modal
    document.getElementById('btnLaunchNew')?.addEventListener('click', () => {
      this.openModal('generateModal');
    });

    // Settings Modal
    document.getElementById('btnOpenSettings')?.addEventListener('click', () => {
      const apiKeyInput = document.getElementById('geminiApiKeyInput');
      if (apiKeyInput) apiKeyInput.value = this.persistence.state.geminiApiKey || '';
      this.openModal('settingsModal');
    });

    document.getElementById('btnSaveSettings')?.addEventListener('click', () => {
      const apiKeyInput = document.getElementById('geminiApiKeyInput');
      if (apiKeyInput) {
        this.persistence.state.geminiApiKey = apiKeyInput.value.trim();
        this.persistence.saveState();
        this.showToast('AI Settings and API Key saved locally.', 'success');
      }
      this.closeModal('settingsModal');
    });

    document.getElementById('btnClearStorage')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all progress, XP, and badges?')) {
        localStorage.clear();
        window.location.reload();
      }
    });

    // Submit Custom AI Roadmap Generation
    document.getElementById('btnSubmitGenerate')?.addEventListener('click', async () => {
      const roleTitle = document.getElementById('genRoleInput').value.trim();
      const backgroundSkills = document.getElementById('genSkillsInput').value.trim();
      const targetMonths = parseInt(document.getElementById('genTimelineSelect').value, 10);
      const hoursPerWeek = parseInt(document.getElementById('genHoursSelect').value, 10);

      this.closeModal('generateModal');
      await this.generateRoadmap({
        customRoleTitle: roleTitle,
        backgroundSkills,
        targetMonths,
        hoursPerWeek,
        apiKey: this.persistence.state.geminiApiKey
      });
    });

    // Close preview drawer in galaxy
    document.getElementById('btnClosePreview')?.addEventListener('click', () => {
      document.getElementById('rolePreviewDrawer')?.classList.remove('open');
    });

    // Launch Roadmap from galaxy preview drawer
    document.getElementById('btnLaunchRoadmapFromDrawer')?.addEventListener('click', async () => {
      document.getElementById('rolePreviewDrawer')?.classList.remove('open');
      if (this.selectedGalaxyNode) {
        await this.loadCareerRoadmap(this.selectedGalaxyNode.id);
      }
    });

    document.getElementById('btnCompareFromDrawer')?.addEventListener('click', () => {
      document.getElementById('rolePreviewDrawer')?.classList.remove('open');
      this.openModal('compareModal');
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  // --- Exporters ---
  initExporters() {
    document.getElementById('btnExportShare')?.addEventListener('click', () => {
      this.openModal('exportModal');
    });

    document.getElementById('btnExportMarkdown')?.addEventListener('click', () => {
      if (this.currentRoadmap) {
        this.persistence.exportMarkdown(this.currentRoadmap);
        this.showToast('Markdown guide downloaded successfully!', 'success');
      }
    });

    document.getElementById('btnExportJson')?.addEventListener('click', () => {
      if (this.currentRoadmap) {
        this.persistence.exportJson(this.currentRoadmap);
        this.showToast('JSON state backup downloaded!', 'success');
      }
    });

    document.getElementById('btnCopyShareUrl')?.addEventListener('click', () => {
      if (this.currentRoadmap) {
        const url = this.persistence.generateShareUrl(this.currentRoadmap);
        navigator.clipboard.writeText(url).then(() => {
          this.showToast('Shareable roadmap link copied to clipboard!', 'success');
        });
      }
    });

    document.getElementById('btnPrintRoadmap')?.addEventListener('click', () => {
      window.print();
    });
  }

  // --- API Fetching ---
  async fetchCareers() {
    try {
      const res = await fetch('/api/careers');
      const data = await res.json();
      if (data.success) {
        this.clusters = data.clusters;
        this.careers = data.careers;

        this.galaxy.loadData(this.clusters, this.careers);
        this.comparison.setCareers(this.careers);

        const countBadge = document.getElementById('galaxyRoleCountBadge');
        if (countBadge) countBadge.textContent = `ROLES: ${this.careers.length} ORBITS`;
      }
    } catch (err) {
      console.error('Failed to fetch careers:', err);
      this.showToast('Error connecting to CareerMitra API server', 'warn');
    }
  }

  openRoleInspector(node) {
    this.selectedGalaxyNode = node;
    const drawer = document.getElementById('rolePreviewDrawer');
    if (!drawer) return;

    document.getElementById('drawerClusterTag').textContent = node.clusterName || 'System';
    document.getElementById('drawerRoleTitle').textContent = `${node.icon || '🪐'} ${node.title}`;
    document.getElementById('drawerTagline').textContent = node.tagline || 'Master this engineering trajectory.';
    document.getElementById('drawerSalary').textContent = node.salaryRange || 'Competitive';
    document.getElementById('drawerGrowth').textContent = node.growthRate || 'High Demand';
    document.getElementById('drawerDifficulty').textContent = node.difficulty || 'Advanced';
    document.getElementById('drawerMonths').textContent = `~${node.avgMonths || 6} Months`;

    const skillsPreview = document.getElementById('drawerSkillsPreviewList');
    skillsPreview.innerHTML = `
      <span class="skill-tag">Neural Systems</span>
      <span class="skill-tag">Distributed Design</span>
      <span class="skill-tag">Production Capstone</span>
      <span class="skill-tag">Industry Certification</span>
    `;

    drawer.classList.add('open');
  }

  async loadCareerRoadmap(roleId) {
    this.showToast('Synthesizing career trajectory...', 'info');
    try {
      const res = await fetch(`/api/career/${roleId}`);
      const data = await res.json();
      if (data.success) {
        this.applyRoadmap(data.career);
        this.switchView('roadmapView');
        this.showToast(`Orbiting into ${data.career.title}!`, 'success');
      }
    } catch (err) {
      console.error('Failed to load career:', err);
    }
  }

  async generateRoadmap(payload) {
    this.showToast('Synthesizing custom AI curriculum...', 'info');
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        this.applyRoadmap(data.roadmap);
        this.switchView('roadmapView');
        this.showToast(`Custom AI Roadmap Generated (${data.source})!`, 'success');
      }
    } catch (err) {
      console.error('Roadmap generation failed:', err);
      this.showToast(`Generation failed: ${err.message}`, 'warn');
    }
  }

  applyRoadmap(roadmap) {
    this.currentRoadmap = roadmap;
    this.persistence.state.activeRoleId = roadmap.id;

    // Synchronize statuses with persistence state
    const compSet = new Set(this.persistence.state.completedSkills);
    const exemptSet = new Set(this.persistence.state.exemptSkills);

    roadmap.skillsTree.forEach(phase => {
      phase.skills.forEach(skill => {
        if (compSet.has(skill.id)) {
          skill.status = 'completed';
        } else if (exemptSet.has(skill.id)) {
          skill.status = 'exempt';
        } else if (!skill.status) {
          skill.status = 'available';
        }
      });
    });

    this.roadmapRenderer.setRoadmap(roadmap);
    this.persistence.saveState();
  }

  // --- Dynamic Replanning Engine ---
  async triggerDynamicReplan() {
    if (!this.currentRoadmap) return;
    this.showToast('Calculating optimal prerequisite paths...', 'info');

    try {
      const res = await fetch('/api/roadmap/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmap: this.currentRoadmap,
          completedSkills: this.persistence.state.completedSkills,
          exemptSkills: this.persistence.state.exemptSkills,
          hoursPerWeek: 15
        })
      });

      const data = await res.json();
      if (data.success) {
        this.currentRoadmap = data.roadmap;
        this.roadmapRenderer.setRoadmap(data.roadmap);

        // Hide replanner alert banner
        const alertBar = document.getElementById('replannerAlertBar');
        if (alertBar) alertBar.style.display = 'none';

        this.showToast(`Dynamic Replanning Complete! Path adjusted with ${data.metrics.remainingHours}h remaining.`, 'success');
      }
    } catch (err) {
      console.error('Replanning error:', err);
      this.showToast('Failed to dynamic replan', 'warn');
    }
  }

  handleInitialState() {
    // Check hash for share link
    const hash = window.location.hash;
    if (hash && hash.startsWith('#share=')) {
      try {
        const raw = atob(hash.replace('#share=', ''));
        const shareData = JSON.parse(raw);
        if (shareData.roleId) {
          this.loadCareerRoadmap(shareData.roleId);
          return;
        }
      } catch (e) {
        console.warn('Invalid share link in hash.');
      }
    }

    // Default: load default AI Engineer roadmap
    this.loadCareerRoadmap(this.persistence.state.activeRoleId || 'ai-engineer');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = { 'success': '✅', 'info': 'ℹ️', 'warn': '⚠️' }[type] || '✨';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CareerMitraApp();
});
