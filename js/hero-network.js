/**
 * hero-network.js
 * Lightweight HTML5 Canvas 2D animation layer for the landing page background.
 * Creates an abstract computational and spatial network overlay atop digital_earth_network_glow.png.
 *
 * Performance & Architecture:
 * - Page-level canvas (#home-network-canvas) with fixed viewport positioning.
 * - Dynamic projection matching background-size: cover (1672x941 aspect ratio).
 * - requestAnimationFrame loop with automatic pause via Page Visibility API.
 * - DevicePixelRatio capped at 2.
 * - Precomputed node and path vectors (zero GC allocations per frame).
 * - Respects prefers-reduced-motion (stops animation, renders calm static topology).
 */

(function () {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
    // 16:9 Artwork reference dimensions (images/digital_earth_network_glow.png)
    artWidth: 1672,
    artHeight: 941,
    artRatio: 1672 / 941,

    // Palette: Navy / cool blue / icy cyan with very sparse amber accents
    cyanGlow: 'rgba(100, 210, 255, ',
    cyanCore: 'rgba(220, 245, 255, ',
    amberGlow: 'rgba(235, 185, 105, ',
    amberCore: 'rgba(255, 240, 205, ',
    lineColor: 'rgba(110, 200, 235, ',

    // Timing (milliseconds) — 2x speed adjustment
    nodeSpeedMultiplier: 2.0,
    minTravelDuration: 3000,
    maxTravelDuration: 5500,
    pulseDelayMin: 750,
    pulseDelayRange: 1500,

    // Concurrency limits
    maxDesktopPulses: 2,
    maxMobilePulses: 1
  };

  // Real luminous nodes detected in digital_earth_network_glow.png.
  // Coordinates are normalized (0 to 1) against the 1672x941 artwork.
  // The left-central area (x: ~0.15–0.48, y: ~0.15–0.60) is kept tranquil
  // to ensure complete contrast and readability behind hero portrait and text.
  const NODES = [
    // Top-left boundary
    { id: 0,  x: 0.080, y: 0.080, r: 1.4, type: 'cyan',  period: 4200, phase: 0.2 },
    { id: 1,  x: 0.160, y: 0.050, r: 1.5, type: 'cyan',  period: 5800, phase: 1.7 },

    // Lower-left & southern perimeter
    { id: 2,  x: 0.093, y: 0.642, r: 1.6, type: 'cyan',  period: 4900, phase: 4.5 },
    { id: 3,  x: 0.165, y: 0.701, r: 1.5, type: 'cyan',  period: 6100, phase: 1.1 },
    { id: 4,  x: 0.261, y: 0.846, r: 1.4, type: 'cyan',  period: 5200, phase: 2.3 },
    { id: 5,  x: 0.538, y: 0.778, r: 1.5, type: 'cyan',  period: 6600, phase: 0.8 },
    { id: 6,  x: 0.605, y: 0.727, r: 1.6, type: 'cyan',  period: 4500, phase: 5.2 },

    // Upper bridge & northern hemisphere
    { id: 7,  x: 0.557, y: 0.149, r: 1.5, type: 'cyan',  period: 5400, phase: 3.8 },
    { id: 8,  x: 0.596, y: 0.123, r: 1.7, type: 'cyan',  period: 4000, phase: 0.0 },
    { id: 9,  x: 0.667, y: 0.106, r: 1.6, type: 'cyan',  period: 5700, phase: 2.9 },
    { id: 10, x: 0.711, y: 0.072, r: 1.4, type: 'cyan',  period: 6300, phase: 3.1 },
    { id: 11, x: 0.801, y: 0.064, r: 1.5, type: 'cyan',  period: 4800, phase: 1.9 },

    // Outer East / Amber Network Route
    { id: 12, x: 0.931, y: 0.191, r: 1.7, type: 'amber', period: 5100, phase: 1.5 }, // amber node
    { id: 13, x: 0.945, y: 0.242, r: 1.8, type: 'amber', period: 5900, phase: 3.4 }, // amber node
    { id: 14, x: 0.950, y: 0.259, r: 1.6, type: 'amber', period: 6700, phase: 4.8 }, // amber node

    // Dense Right Computational Cluster
    { id: 15, x: 0.696, y: 0.140, r: 1.5, type: 'cyan',  period: 6400, phase: 4.1 },
    { id: 16, x: 0.629, y: 0.200, r: 1.4, type: 'cyan',  period: 5300, phase: 2.0 },
    { id: 17, x: 0.711, y: 0.234, r: 1.5, type: 'cyan',  period: 7000, phase: 5.6 },
    { id: 18, x: 0.782, y: 0.353, r: 1.7, type: 'cyan',  period: 6200, phase: 0.5 },
    { id: 19, x: 0.830, y: 0.421, r: 1.6, type: 'cyan',  period: 4600, phase: 5.0 },
    { id: 20, x: 0.888, y: 0.429, r: 1.5, type: 'cyan',  period: 6000, phase: 2.7 },
    { id: 21, x: 0.945, y: 0.353, r: 1.6, type: 'cyan',  period: 5500, phase: 0.4 },

    // Central-Right Major Hubs
    { id: 22, x: 0.744, y: 0.523, r: 1.9, type: 'cyan',  period: 4300, phase: 1.3 }, // bright cyan hub
    { id: 23, x: 0.811, y: 0.557, r: 1.6, type: 'cyan',  period: 5000, phase: 4.8 },
    { id: 24, x: 0.854, y: 0.446, r: 1.5, type: 'cyan',  period: 6500, phase: 2.1 },
    { id: 25, x: 0.907, y: 0.497, r: 1.6, type: 'cyan',  period: 5700, phase: 0.7 },
    { id: 26, x: 0.931, y: 0.548, r: 1.5, type: 'amber', period: 4900, phase: 3.6 }, // amber accent

    // Lower-Right Network Nodes
    { id: 27, x: 0.653, y: 0.616, r: 1.5, type: 'cyan',  period: 6100, phase: 2.5 },
    { id: 28, x: 0.744, y: 0.680, r: 1.6, type: 'cyan',  period: 5200, phase: 1.4 },
    { id: 29, x: 0.921, y: 0.676, r: 1.4, type: 'cyan',  period: 5800, phase: 3.9 },
    { id: 30, x: 0.691, y: 0.778, r: 1.5, type: 'cyan',  period: 4700, phase: 0.6 },
    { id: 31, x: 0.754, y: 0.820, r: 1.7, type: 'cyan',  period: 6300, phase: 5.1 },
    { id: 32, x: 0.854, y: 0.829, r: 1.6, type: 'cyan',  period: 5500, phase: 1.8 },
    { id: 33, x: 0.902, y: 0.778, r: 1.5, type: 'amber', period: 6800, phase: 4.2 }, // amber accent
    { id: 34, x: 0.763, y: 0.854, r: 1.4, type: 'amber', period: 4500, phase: 2.8 },
    { id: 35, x: 0.792, y: 0.897, r: 1.5, type: 'cyan',  period: 6600, phase: 0.3 },
    { id: 36, x: 0.888, y: 0.905, r: 1.4, type: 'cyan',  period: 5300, phase: 3.2 }
  ];

  // Abstract network pathways connecting node clusters
  const PATHS = [
    { nodes: [0, 1],                type: 'cyan' },
    { nodes: [2, 3, 4],             type: 'cyan' },
    { nodes: [4, 5, 6],             type: 'cyan' },
    { nodes: [7, 8, 9, 10, 11],     type: 'cyan' },
    { nodes: [11, 12, 13, 14],      type: 'amber' }, // Outer east amber route
    { nodes: [9, 15, 17, 18],       type: 'cyan' },
    { nodes: [18, 19, 20, 21],      type: 'cyan' },
    { nodes: [14, 21, 25, 26],      type: 'amber' }, // Connecting amber route
    { nodes: [17, 22, 23, 24],      type: 'cyan' },
    { nodes: [22, 27, 28, 30],      type: 'cyan' },
    { nodes: [28, 31, 34, 35],      type: 'cyan' },
    { nodes: [25, 29, 33, 32],      type: 'cyan' },
    { nodes: [31, 32, 36],          type: 'cyan' }
  ];

  // Runtime state
  let canvas = null;
  let ctx = null;
  let animId = null;
  let isRunning = false;
  let reducedMotion = false;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Background-size: cover projection metrics
  let renderW = 0;
  let renderH = 0;
  let offsetX = 0;
  let offsetY = 0;

  const travelingPulses = [];

  function updateProjection() {
    const screenRatio = width / height;
    if (screenRatio > CONFIG.artRatio) {
      renderW = width;
      renderH = width / CONFIG.artRatio;
      offsetX = 0;
      offsetY = (height - renderH) / 2;
    } else {
      renderH = height;
      renderW = height * CONFIG.artRatio;
      offsetX = (width - renderW) / 2;
      offsetY = 0;
    }
  }

  function getScreenCoords(normX, normY) {
    return {
      x: offsetX + normX * renderW,
      y: offsetY + normY * renderH
    };
  }

  function initPulse(pulse, now) {
    const pathIdx = Math.floor(Math.random() * PATHS.length);
    const path = PATHS[pathIdx];
    const duration = CONFIG.minTravelDuration + Math.random() * (CONFIG.maxTravelDuration - CONFIG.minTravelDuration);
    const forward = Math.random() > 0.5;

    pulse.path = path;
    pulse.forward = forward;
    pulse.duration = duration;
    pulse.startTime = now + Math.random() * 1000;
    pulse.type = path.type;
    pulse.active = true;
  }

  function setupCanvas() {
    canvas = document.getElementById('home-network-canvas');
    if (!canvas) return false;

    ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return false;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', function (e) {
      reducedMotion = e.matches;
      if (reducedMotion) {
        stopLoop();
        drawStatic();
      } else {
        startLoop();
      }
    });

    handleResize();

    window.addEventListener('resize', handleResize);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopLoop();
      } else if (!reducedMotion) {
        startLoop();
      }
    });

    return true;
  }

  function handleResize() {
    if (!canvas) return;

    width = Math.round(window.innerWidth);
    height = Math.round(window.innerHeight);

    if (width === 0 || height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    updateProjection();

    if (reducedMotion) {
      drawStatic();
    }
  }

  function getPathPoint(pathNodes, t, forward) {
    const totalSegments = pathNodes.length - 1;
    const progress = forward ? t : (1 - t);
    const scaled = progress * totalSegments;
    const segIndex = Math.min(Math.floor(scaled), totalSegments - 1);
    const segT = scaled - segIndex;

    const n1 = NODES[pathNodes[segIndex]];
    const n2 = NODES[pathNodes[segIndex + 1]];

    const pt1 = getScreenCoords(n1.x, n1.y);
    const pt2 = getScreenCoords(n2.x, n2.y);

    return {
      x: pt1.x + (pt2.x - pt1.x) * segT,
      y: pt1.y + (pt2.y - pt1.y) * segT
    };
  }

  function drawStatic() {
    if (!ctx || width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 0.75;
    ctx.strokeStyle = CONFIG.lineColor + '0.07)';
    ctx.beginPath();
    for (let i = 0; i < PATHS.length; i++) {
      const p = PATHS[i];
      for (let j = 0; j < p.nodes.length - 1; j++) {
        const pt1 = getScreenCoords(NODES[p.nodes[j]].x, NODES[p.nodes[j]].y);
        const pt2 = getScreenCoords(NODES[p.nodes[j + 1]].x, NODES[p.nodes[j + 1]].y);
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
      }
    }
    ctx.stroke();

    for (let i = 0; i < NODES.length; i++) {
      const node = NODES[i];
      const pt = getScreenCoords(node.x, node.y);
      if (pt.x < -10 || pt.x > width + 10 || pt.y < -10 || pt.y > height + 10) continue;

      const isAmber = (node.type === 'amber');
      const coreColor = isAmber ? CONFIG.amberCore : CONFIG.cyanCore;

      ctx.fillStyle = coreColor + '0.25)';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function render(now) {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Subtle network lines
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = CONFIG.lineColor + '0.09)';
    ctx.beginPath();
    for (let i = 0; i < PATHS.length; i++) {
      const p = PATHS[i];
      for (let j = 0; j < p.nodes.length - 1; j++) {
        const pt1 = getScreenCoords(NODES[p.nodes[j]].x, NODES[p.nodes[j]].y);
        const pt2 = getScreenCoords(NODES[p.nodes[j + 1]].x, NODES[p.nodes[j + 1]].y);
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
      }
    }
    ctx.stroke();

    // 2. Breathing nodes
    const isMobile = (width < 600);
    for (let i = 0; i < NODES.length; i++) {
      const node = NODES[i];
      const pt = getScreenCoords(node.x, node.y);
      if (pt.x < -10 || pt.x > width + 10 || pt.y < -10 || pt.y > height + 10) continue;

      const isAmber = (node.type === 'amber');
      const wave = 0.5 + 0.5 * Math.sin(((now * CONFIG.nodeSpeedMultiplier) / node.period) * Math.PI * 2 + node.phase);

      const alphaGlow = 0.08 + 0.32 * wave;
      const alphaCore = 0.20 + 0.45 * wave;
      const scaleFactor = isMobile ? 0.8 : 1.0;
      const glowR = node.r * (1.8 + 1.2 * wave) * scaleFactor;

      const glowPrefix = isAmber ? CONFIG.amberGlow : CONFIG.cyanGlow;
      const corePrefix = isAmber ? CONFIG.amberCore : CONFIG.cyanCore;

      const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowR);
      grad.addColorStop(0, glowPrefix + alphaGlow + ')');
      grad.addColorStop(1, glowPrefix + '0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = corePrefix + alphaCore + ')';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, node.r * 0.85 * scaleFactor, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Traveling pulses (2x speed)
    const maxPulses = isMobile ? CONFIG.maxMobilePulses : CONFIG.maxDesktopPulses;
    while (travelingPulses.length < maxPulses) {
      const newPulse = {};
      initPulse(newPulse, now);
      travelingPulses.push(newPulse);
    }

    for (let i = 0; i < travelingPulses.length; i++) {
      const pulse = travelingPulses[i];
      if (now < pulse.startTime) continue;

      const elapsed = now - pulse.startTime;
      const t = elapsed / pulse.duration;

      if (t >= 1) {
        initPulse(pulse, now + CONFIG.pulseDelayMin + Math.random() * CONFIG.pulseDelayRange);
        continue;
      }

      let alpha = 1;
      if (t < 0.15) {
        alpha = t / 0.15;
      } else if (t > 0.85) {
        alpha = (1 - t) / 0.15;
      }

      const pt = getPathPoint(pulse.path.nodes, t, pulse.forward);
      if (pt.x < -10 || pt.x > width + 10 || pt.y < -10 || pt.y > height + 10) continue;

      const isAmber = (pulse.type === 'amber');
      const glowPrefix = isAmber ? CONFIG.amberGlow : CONFIG.cyanGlow;
      const corePrefix = isAmber ? CONFIG.amberCore : CONFIG.cyanCore;

      const pulseGlowR = isMobile ? 3.0 : 4.0;
      const pGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pulseGlowR);
      pGrad.addColorStop(0, glowPrefix + (0.45 * alpha) + ')');
      pGrad.addColorStop(1, glowPrefix + '0)');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pulseGlowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = corePrefix + (0.75 * alpha) + ')';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isMobile ? 1.0 : 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(render);
  }

  function startLoop() {
    if (isRunning) return;
    isRunning = true;
    animId = requestAnimationFrame(render);
  }

  function stopLoop() {
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (setupCanvas()) {
        if (!reducedMotion) startLoop();
        else drawStatic();
      }
    });
  } else {
    if (setupCanvas()) {
      if (!reducedMotion) startLoop();
      else drawStatic();
    }
  }
})();
