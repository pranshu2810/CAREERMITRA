// Career Galaxy Engine - Canvas Starfield, Solar Systems & Clickable Nodes

export class CareerGalaxy {
  constructor(canvasId, containerId, onNodeSelect, onNodeHover) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById(containerId);
    this.onNodeSelect = onNodeSelect;
    this.onNodeHover = onNodeHover;

    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Camera transform
    this.scale = 1;
    this.targetScale = 1;
    this.panX = 0;
    this.panY = 0;
    this.targetPanX = 0;
    this.targetPanY = 0;

    // Mouse / Interaction
    this.mouseX = 0;
    this.mouseY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.hoveredNode = null;

    // Cosmic Objects
    this.stars = [];
    this.clusters = [];
    this.careerNodes = [];
    this.nebulaClouds = [];
    this.activeClusterFilter = 'all';

    this.animationId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.initStarfield();
    this.initNebulae();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    if (this.clusters.length > 0) {
      this.layoutSystems();
    }
  }

  initStarfield() {
    this.stars = [];
    const count = 320;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 3200,
        y: (Math.random() - 0.5) * 2400,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: ['#ffffff', '#c4b5fd', '#38bdf8', '#fed7aa'][Math.floor(Math.random() * 4)]
      });
    }
  }

  initNebulae() {
    this.nebulaClouds = [
      { x: -350, y: -200, radius: 450, color: 'rgba(139, 92, 246, 0.08)' },
      { x: 380, y: -180, radius: 480, color: 'rgba(6, 182, 212, 0.08)' },
      { x: 280, y: 320, radius: 420, color: 'rgba(236, 72, 153, 0.07)' },
      { x: -320, y: 300, radius: 460, color: 'rgba(16, 185, 129, 0.07)' },
      { x: 0, y: 0, radius: 520, color: 'rgba(59, 130, 246, 0.09)' }
    ];
  }

  loadData(clusters, careers) {
    this.clusters = clusters;
    this.careerNodes = careers.map((career, idx) => ({
      ...career,
      angle: (idx * (Math.PI * 2 / careers.length)),
      orbitSpeed: 0.0012 + (idx % 3) * 0.0006,
      radius: 32,
      pulse: 0
    }));

    this.layoutSystems();
  }

  layoutSystems() {
    const clusterPositions = {
      'ai-data': { x: -340, y: -220 },
      'fullstack': { x: 340, y: -220 },
      'cloud-devops': { x: 420, y: 160 },
      'cybersecurity': { x: -420, y: 160 },
      'product-design': { x: 0, y: 340 },
      'fintech-web3': { x: 0, y: -360 }
    };

    this.clusters.forEach(cluster => {
      const pos = clusterPositions[cluster.id] || { x: 0, y: 0 };
      cluster.x = pos.x;
      cluster.y = pos.y;
      cluster.radius = 65;
    });

    // Assign career nodes around their cluster center or in orbits
    this.careerNodes.forEach(node => {
      const cluster = this.clusters.find(c => c.id === node.cluster);
      if (cluster) {
        node.clusterX = cluster.x;
        node.clusterY = cluster.y;
        node.orbitDist = 110;
      } else {
        node.clusterX = 0;
        node.clusterY = 0;
        node.orbitDist = 160;
      }
    });
  }

  setFilter(clusterId) {
    this.activeClusterFilter = clusterId;
    if (clusterId !== 'all') {
      const cluster = this.clusters.find(c => c.id === clusterId);
      if (cluster) {
        this.targetPanX = -cluster.x * this.targetScale;
        this.targetPanY = -cluster.y * this.targetScale;
        this.targetScale = 1.35;
      }
    } else {
      this.targetPanX = 0;
      this.targetPanY = 0;
      this.targetScale = 1;
    }
  }

  zoom(delta) {
    this.targetScale = Math.min(2.5, Math.max(0.6, this.targetScale + delta));
  }

  resetView() {
    this.targetScale = 1;
    this.targetPanX = 0;
    this.targetPanY = 0;
    this.activeClusterFilter = 'all';
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        this.targetPanX = this.panX;
        this.targetPanY = this.panY;
      } else {
        this.checkHover();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
      this.zoom(zoomFactor);
    }, { passive: false });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredNode && this.onNodeSelect) {
        this.onNodeSelect(this.hoveredNode);
      }
    });
  }

  screenToWorld(sx, sy) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const wx = (sx - cx - this.panX) / this.scale;
    const wy = (sy - cy - this.panY) / this.scale;
    return { x: wx, y: wy };
  }

  worldToScreen(wx, wy) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const sx = cx + this.panX + wx * this.scale;
    const sy = cy + this.panY + wy * this.scale;
    return { x: sx, y: sy };
  }

  checkHover() {
    const worldPos = this.screenToWorld(this.mouseX, this.mouseY);
    let found = null;

    for (const node of this.careerNodes) {
      if (this.activeClusterFilter !== 'all' && node.cluster !== this.activeClusterFilter) {
        continue;
      }
      const dx = worldPos.x - node.x;
      const dy = worldPos.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= node.radius + 8) {
        found = node;
        break;
      }
    }

    if (found !== this.hoveredNode) {
      this.hoveredNode = found;
      this.canvas.style.cursor = found ? 'pointer' : 'grab';
      if (this.onNodeHover) {
        const screenPos = found ? this.worldToScreen(found.x, found.y) : null;
        this.onNodeHover(found, screenPos);
      }
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Smooth camera damping
    this.scale += (this.targetScale - this.scale) * 0.08;
    this.panX += (this.targetPanX - this.panX) * 0.08;
    this.panY += (this.targetPanY - this.panY) * 0.08;

    this.render();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;

    ctx.save();
    ctx.translate(cx + this.panX, cy + this.panY);
    ctx.scale(this.scale, this.scale);

    // 1. Render Nebula Glows
    this.nebulaClouds.forEach(nebula => {
      const grad = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
      grad.addColorStop(0, nebula.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Render Starfield with subtle mouse parallax
    this.stars.forEach(star => {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 1 || star.alpha < 0.2) star.twinkleSpeed = -star.twinkleSpeed;

      ctx.save();
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 3. Render Cluster Solar Systems (Centers & Constellation Orbits)
    this.clusters.forEach(cluster => {
      const isDimmed = this.activeClusterFilter !== 'all' && this.activeClusterFilter !== cluster.id;
      ctx.save();
      ctx.globalAlpha = isDimmed ? 0.2 : 1;

      // Outer Gravitational Orbit Ring
      ctx.strokeStyle = cluster.glow || 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Star System Core Sun
      const sunGrad = ctx.createRadialGradient(cluster.x, cluster.y, 10, cluster.x, cluster.y, cluster.radius);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, cluster.color);
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, cluster.radius, 0, Math.PI * 2);
      ctx.fill();

      // Cluster Label
      ctx.font = '600 13px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(cluster.name, cluster.x, cluster.y + cluster.radius + 18);

      ctx.restore();
    });

    // 4. Update and Render Orbital Career Planetary Nodes
    this.careerNodes.forEach(node => {
      node.angle += node.orbitSpeed;
      node.x = node.clusterX + Math.cos(node.angle) * node.orbitDist;
      node.y = node.clusterY + Math.sin(node.angle) * node.orbitDist;

      const isHovered = this.hoveredNode === node;
      const isDimmed = this.activeClusterFilter !== 'all' && this.activeClusterFilter !== node.cluster;

      ctx.save();
      ctx.globalAlpha = isDimmed ? 0.25 : 1;

      // Connecting Orbital Tether Line to Sun
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(node.clusterX, node.clusterY);
      ctx.lineTo(node.x, node.y);
      ctx.stroke();

      // Outer Halo Pulse on Hover
      if (isHovered) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planetary Sphere
      const clusterObj = this.clusters.find(c => c.id === node.cluster);
      const planetColor = clusterObj ? clusterObj.color : '#8b5cf6';

      const planetGrad = ctx.createRadialGradient(
        node.x - node.radius * 0.3, node.y - node.radius * 0.3, 2,
        node.x, node.y, node.radius
      );
      planetGrad.addColorStop(0, '#ffffff');
      planetGrad.addColorStop(0.3, planetColor);
      planetGrad.addColorStop(1, '#0b0f24');

      ctx.fillStyle = planetGrad;
      ctx.shadowColor = planetColor;
      ctx.shadowBlur = isHovered ? 25 : 12;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Planet Icon
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.icon || '🪐', node.x, node.y);

      // Node Title Label
      ctx.font = isHovered ? '700 13px Plus Jakarta Sans' : '600 12px Plus Jakarta Sans';
      ctx.fillStyle = isHovered ? '#38bdf8' : '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText(node.title, node.x, node.y + node.radius + 16);

      ctx.restore();
    });

    ctx.restore();
  }
}
