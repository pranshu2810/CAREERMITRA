// Career Comparison Matrix & Multi-Axis Radar Chart Engine

export class CareerComparisonManager {
  constructor() {
    this.canvas = document.getElementById('radarCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.careerList = [];
    this.currentA = null;
    this.currentB = null;

    this.initElements();
  }

  initElements() {
    this.selectA = document.getElementById('selectCareerA');
    this.selectB = document.getElementById('selectCareerB');

    if (this.selectA && this.selectB) {
      this.selectA.addEventListener('change', () => this.handleSelectionChange());
      this.selectB.addEventListener('change', () => this.handleSelectionChange());
    }
  }

  setCareers(careers) {
    this.careerList = careers;
    if (!this.selectA || !this.selectB) return;

    this.selectA.innerHTML = '';
    this.selectB.innerHTML = '';

    careers.forEach((c, idx) => {
      const optA = document.createElement('option');
      optA.value = c.id;
      optA.textContent = `${c.icon || '🪐'} ${c.title}`;
      if (idx === 0) optA.selected = true;
      this.selectA.appendChild(optA);

      const optB = document.createElement('option');
      optB.value = c.id;
      optB.textContent = `${c.icon || '🪐'} ${c.title}`;
      if (idx === 1 || idx === 0) optB.selected = true;
      this.selectB.appendChild(optB);
    });

    this.handleSelectionChange();
  }

  async handleSelectionChange() {
    const roleIdA = this.selectA.value;
    const roleIdB = this.selectB.value;

    try {
      const res = await fetch('/api/career/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleIdA, roleIdB })
      });

      const data = await res.json();
      if (data.success) {
        this.renderComparison(data.comparison);
      }
    } catch (err) {
      console.error('Failed to load career comparison:', err);
    }
  }

  renderComparison(comparison) {
    const a = comparison.careerA;
    const b = comparison.careerB;
    const m = comparison.metrics;

    // Headers
    document.getElementById('compHeaderA').textContent = a.title;
    document.getElementById('compHeaderB').textContent = b.title;

    // Table rows
    const tbody = document.getElementById('compMetricsTableBody');
    tbody.innerHTML = `
      <tr>
        <td>Domain Sector</td>
        <td style="color: #38bdf8; font-weight: 600;">${a.cluster}</td>
        <td style="color: #c084fc; font-weight: 600;">${b.cluster}</td>
      </tr>
      <tr>
        <td>Annual Salary</td>
        <td style="color: #34d399; font-weight: 700;">${a.salaryRange}</td>
        <td style="color: #34d399; font-weight: 700;">${b.salaryRange}</td>
      </tr>
      <tr>
        <td>Market Demand</td>
        <td style="font-weight: 700;">${a.demand}</td>
        <td style="font-weight: 700;">${b.demand}</td>
      </tr>
      <tr>
        <td>Growth Forecast</td>
        <td style="color: #38bdf8;">${a.growthRate}</td>
        <td style="color: #c084fc;">${b.growthRate}</td>
      </tr>
      <tr>
        <td>Average Ramp-up</td>
        <td>~${a.avgMonths} Months</td>
        <td>~${b.avgMonths} Months</td>
      </tr>
    `;

    // Overlap badge & Venn lists
    document.getElementById('overlapPercentageBadge').textContent = `${m.overlapPercent}% Skill Overlap`;

    const vennShared = document.getElementById('vennSharedPills');
    vennShared.innerHTML = m.commonSkills.map(s => `<span class="venn-pill venn-shared">${s}</span>`).join('') || '<span style="color: var(--text-dim); font-size: 11px;">Unique specialized focus</span>';

    document.getElementById('vennLabelA').textContent = `Unique to ${a.title}:`;
    const vennA = document.getElementById('vennUniqueAPills');
    vennA.innerHTML = m.uniqueToA.map(s => `<span class="venn-pill venn-unique-a">${s}</span>`).join('');

    document.getElementById('vennLabelB').textContent = `Unique to ${b.title}:`;
    const vennB = document.getElementById('vennUniqueBPills');
    vennB.innerHTML = m.uniqueToB.map(s => `<span class="venn-pill venn-unique-b">${s}</span>`).join('');

    // Draw Radar Chart
    this.drawRadar(a.radarStats, b.radarStats);
  }

  drawRadar(statsA = {}, statsB = {}) {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38;

    const axes = [
      { key: 'math', label: 'Math & Logic' },
      { key: 'coding', label: 'Coding / DSA' },
      { key: 'systems', label: 'Systems Arch' },
      { key: 'mlCore', label: 'AI & Data' },
      { key: 'cloud', label: 'Cloud / DevOps' },
      { key: 'product', label: 'Product / UX' }
    ];

    const count = axes.length;

    // Draw Concentric Background Polygons
    const levels = 4;
    for (let lvl = 1; lvl <= levels; lvl++) {
      const r = (radius / levels) * lvl;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI / count) - (Math.PI / 2);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw Axis Rays & Labels
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI / count) - (Math.PI / 2);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Label text
      const lx = cx + (radius + 20) * Math.cos(angle);
      const ly = cy + (radius + 20) * Math.sin(angle);
      ctx.font = '600 10.5px Plus Jakarta Sans';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axes[i].label, lx, ly);
    }

    // Draw Polygon for Career A (Cyan)
    this.drawDataPolygon(axes, statsA, cx, cy, radius, 'rgba(6, 182, 212, 0.25)', '#06b6d4');

    // Draw Polygon for Career B (Purple)
    this.drawDataPolygon(axes, statsB, cx, cy, radius, 'rgba(139, 92, 246, 0.25)', '#8b5cf6');
  }

  drawDataPolygon(axes, stats, cx, cy, radius, fillColor, strokeColor) {
    const ctx = this.ctx;
    const count = axes.length;

    ctx.beginPath();
    axes.forEach((axis, idx) => {
      const val = (stats[axis.key] || 50) / 100;
      const r = radius * val;
      const angle = (idx * 2 * Math.PI / count) - (Math.PI / 2);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Vertices dots
    axes.forEach((axis, idx) => {
      const val = (stats[axis.key] || 50) / 100;
      const r = radius * val;
      const angle = (idx * 2 * Math.PI / count) - (Math.PI / 2);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
    });
  }
}
