'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const SplatViewer = dynamic(() => import('../components/SplatViewer'), {
  ssr: false,
  loading: () => null,
});

const TICKER_ITEMS = [
  '<span>A <b>DePIN</b> for reality</span>',
  '<span>Gaussian <b>splats</b></span>',
  '<span>Large <b>Geospatial</b> Models</span>',
  '<span>Visual <b>Positioning</b> · VPS</span>',
  '<span><b>Physical AI</b> training data</span>',
  '<span>Centimeter <b>pose</b></span>',
  '<span>Photogrammetric <b>mesh</b></span>',
  '<span><b>Digital</b> twins</span>',
  '<span><b>Sim</b>-to-real robotics</span>',
  '<span>Pose-aligned <b>video</b></span>',
  '<span>Fresh <b>every week</b></span>',
  '<span>Global by <b>design</b></span>',
];

export default function Page() {
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const wordmarkRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  useEffect(() => {
    document.body.classList.toggle('nav-open', navOpen);
    return () => document.body.classList.remove('nav-open');
  }, [navOpen]);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const cur = document.getElementById('cursor');
    if (!cur) return;
    const onMove = (e) => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    };
    document.addEventListener('mousemove', onMove);
    const targets = document.querySelectorAll('a, .card, .step, .use, .who');
    const enter = () => cur.classList.add('big');
    const leave = () => cur.classList.remove('big');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });
    return () => {
      document.removeEventListener('mousemove', onMove);
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const hero = heroRef.current;
    if (!nav || !hero) return;
    const io = new IntersectionObserver(
      ([e]) => nav.classList.toggle('light', !e.isIntersecting),
      { threshold: 0.08 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = document.getElementById('ticker');
    if (el) el.innerHTML = TICKER_ITEMS.join('') + TICKER_ITEMS.join('');
  }, []);

  useEffect(() => {
    const hw = wordmarkRef.current;
    if (!hw) return;
    const letters = [...hw.querySelectorAll('span')];
    let t = 0;
    const id = setInterval(() => {
      t++;
      letters.forEach((l) => l.classList.remove('hot'));
      letters[t % letters.length].classList.add('hot');
    }, 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const words = [...document.querySelectorAll('.manifesto__block .w')];
    const check = () => {
      const vh = window.innerHeight;
      for (const w of words) {
        const r = w.getBoundingClientRect();
        if (r.top < vh * 0.8) w.classList.add('on');
        else w.classList.remove('on');
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll-linked walk animation (desktop only; mobile uses CSS keyframes)
  useEffect(() => {
    if (window.matchMedia('(max-width: 1020px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = document.getElementById('walk');
    const man = section?.querySelector('.walk__man');
    if (!section || !man) return;
    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height - vh;
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, travel)));
      const tx = -15 + p * 130; // -15vw (off-left) to 115vw (off-right)
      man.style.setProperty('--walk', tx.toFixed(2) + 'vw');
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.querySelectorAll('[data-viz]').forEach((el, i) => {
      const kind = el.dataset.viz;
      const w = 320, h = 120;
      let svg = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;">`;
      svg += `<defs><linearGradient id="g${i}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="rgba(47,216,216,0.3)"/><stop offset="1" stop-color="rgba(47,216,216,0)"/></linearGradient></defs>`;
      svg += `<rect width="${w}" height="${h}" fill="#0C1F22"/>`;
      for (let x = 0; x < w; x += 20) svg += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="rgba(47,216,216,0.08)"/>`;
      for (let y = 0; y < h; y += 20) svg += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="rgba(47,216,216,0.08)"/>`;
      if (kind === 'capture') {
        svg += `<path d="M20 90 Q80 30 160 70 T300 40" stroke="#2FD8D8" stroke-width="2" fill="none"/>`;
        const dots = [[40, 78], [100, 50], [180, 66], [240, 58], [290, 42]];
        dots.forEach(([x, y], k) => {
          svg += `<circle cx="${x}" cy="${y}" r="4" fill="#FFDC64"/>`;
          svg += `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="rgba(255,220,100,0.4)"><animate attributeName="r" values="6;14;6" dur="2s" begin="${k * 0.3}s" repeatCount="indefinite"/></circle>`;
        });
      } else if (kind === 'upload') {
        for (let b = 0; b < 18; b++) {
          const bh = 20 + Math.random() * 70;
          svg += `<rect x="${10 + b * 17}" y="${h - bh}" width="10" height="${bh}" fill="url(#g${i})" stroke="#2FD8D8" stroke-width="0.5"/>`;
        }
      } else if (kind === 'mesh') {
        const pts = [];
        for (let y = 1; y < 5; y++) for (let x = 1; x < 10; x++) pts.push([x * 32, y * 22 + (x % 2) * 4]);
        pts.forEach((p) => (svg += `<circle cx="${p[0]}" cy="${p[1]}" r="1.5" fill="#2FD8D8"/>`));
        for (let y = 1; y < 5; y++) for (let x = 1; x < 9; x++) {
          const a = pts[(y - 1) * 9 + (x - 1)], b = pts[(y - 1) * 9 + x];
          svg += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="rgba(47,216,216,0.5)"/>`;
        }
        for (let y = 1; y < 4; y++) for (let x = 1; x < 10; x++) {
          const a = pts[(y - 1) * 9 + (x - 1)], b = pts[y * 9 + (x - 1)];
          svg += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="rgba(47,216,216,0.5)"/>`;
        }
      } else if (kind === 'serve') {
        const labels = ['MESH', 'SPLAT', 'POINTS', 'VIDEO'];
        for (let k = 0; k < 4; k++) {
          const y = 20 + k * 24;
          svg += `<line x1="20" y1="${y}" x2="280" y2="${y}" stroke="rgba(47,216,216,0.3)" stroke-dasharray="3 4"/>`;
          svg += `<polygon points="280,${y - 4} 290,${y} 280,${y + 4}" fill="#2FD8D8"/>`;
          svg += `<text x="24" y="${y - 4}" font-family="JetBrains Mono" font-size="9" fill="rgba(47,216,216,0.9)">${labels[k]}</text>`;
        }
      }
      svg += `</svg>`;
      el.innerHTML = svg;
    });
  }, []);

  useEffect(() => {
    const box = document.getElementById('sensorviz');
    if (!box) return;
    const w = 560, h = 220;
    box.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><g id="grid"></g><g id="edges"></g><g id="dots"></g></svg>`;
    const grid = box.querySelector('#grid');
    const edges = box.querySelector('#edges');
    const dots = box.querySelector('#dots');
    for (let x = 0; x < w; x += 40) grid.innerHTML += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="rgba(47,216,216,0.08)"/>`;
    for (let y = 0; y < h; y += 40) grid.innerHTML += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="rgba(47,216,216,0.08)"/>`;
    const N = 18;
    const pts = Array.from({ length: N }, (_, i) => ({
      x: 40 + Math.random() * (w - 80),
      y: 30 + Math.random() * (h - 60),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hot: i < 2,
    }));
    let raf;
    const tick = () => {
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 30 || p.x > w - 30) p.vx *= -1;
        if (p.y < 20 || p.y > h - 20) p.vy *= -1;
      }
      let e = '';
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 100) {
          const a = (1 - d / 100) * 0.5;
          e += `<line class="sensor-edge" x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[j].x}" y2="${pts[j].y}" style="opacity:${a.toFixed(2)}"/>`;
        }
      }
      edges.innerHTML = e;
      dots.innerHTML = pts
        .map((p) => {
          if (p.hot) return `<circle fill="#FFDC64" cx="${p.x}" cy="${p.y}" r="4" style="filter: drop-shadow(0 0 6px rgba(255,220,100,0.7))"/>`;
          return `<circle class="sensor-dot" cx="${p.x}" cy="${p.y}" r="2.5"/>`;
        })
        .join('');
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const c = document.getElementById('showcaseCanvas');
    if (!c) return;
    const g = c.getContext('2d');
    let W = 0, H = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = c.getBoundingClientRect();
      W = r.width; H = r.height;
      c.width = W * DPR; c.height = H * DPR;
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const GW = 6, GD = 6;
    const buildings = [];
    for (let i = 0; i < GW; i++) for (let j = 0; j < GD; j++) {
      buildings.push({ gx: i - GW / 2 + 0.5, gz: j - GD / 2 + 0.5, h: 0.3 + Math.random() * 1.4 });
    }
    const project = (x, y, z, cx, cy, s, yaw) => {
      const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
      const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);
      const px = cx + x1 * s;
      const py = cy + y * s * -0.7 + z1 * s * 0.45;
      return [px, py, z1];
    };

    const t0 = performance.now();
    let raf;
    const frame = (now) => {
      const t = (now - t0) / 1000;
      g.fillStyle = '#0C1F22'; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(47,216,216,0.1)'; g.lineWidth = 1;
      for (let x = 0; x < W; x += 30) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = 0; y < H; y += 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }

      const cx = W / 2, cy = H * 0.6;
      const s = Math.min(W, H) / 10;
      const yaw = t * 0.22;

      g.strokeStyle = 'rgba(47,216,216,0.25)';
      for (let i = -GW / 2; i <= GW / 2; i++) {
        const [a, b] = project(i, 0, -GD / 2, cx, cy, s, yaw);
        const [c2, d2] = project(i, 0, GD / 2, cx, cy, s, yaw);
        g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d2); g.stroke();
      }
      for (let j = -GD / 2; j <= GD / 2; j++) {
        const [a, b] = project(-GW / 2, 0, j, cx, cy, s, yaw);
        const [c2, d2] = project(GW / 2, 0, j, cx, cy, s, yaw);
        g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d2); g.stroke();
      }

      const withZ = buildings
        .map((b) => {
          const [px, py, pz] = project(b.gx, 0, b.gz, cx, cy, s, yaw);
          return { b, px, py, pz };
        })
        .sort((a, b) => a.pz - b.pz);

      for (const bld of withZ) {
        const { b } = bld;
        const h = b.h;
        const corners = [];
        for (const dy of [0, h]) for (const dz of [-0.45, 0.45]) for (const dx of [-0.45, 0.45]) {
          corners.push(project(b.gx + dx, dy, b.gz + dz, cx, cy, s, yaw));
        }
        const [bl, br, fl, fr, blu, bru, flu, fru] = corners;
        const scanY = (Math.sin(t * 0.8 + b.gx * 0.2) + 1) * 0.5;
        const scanInside = Math.abs(scanY - (h / 2)) < 0.2;
        g.strokeStyle = scanInside ? 'rgba(255, 220, 100, 0.95)' : 'rgba(47,216,216,0.65)';
        g.lineWidth = scanInside ? 1.5 : 1;
        g.beginPath(); g.moveTo(bl[0], bl[1]); g.lineTo(br[0], br[1]); g.lineTo(fr[0], fr[1]); g.lineTo(fl[0], fl[1]); g.closePath(); g.stroke();
        g.beginPath(); g.moveTo(blu[0], blu[1]); g.lineTo(bru[0], bru[1]); g.lineTo(fru[0], fru[1]); g.lineTo(flu[0], flu[1]); g.closePath(); g.stroke();
        [[bl, blu], [br, bru], [fl, flu], [fr, fru]].forEach(([a, bb]) => { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(bb[0], bb[1]); g.stroke(); });
        g.fillStyle = 'rgba(47,216,216,0.8)';
        corners.forEach((cc) => { g.beginPath(); g.arc(cc[0], cc[1], 1.5, 0, Math.PI * 2); g.fill(); });
      }

      const scanAt = (Math.sin(t * 0.5) + 1) * 0.5;
      const [px0, py0] = project(-GW / 2, scanAt * 1.4, -GD / 2, cx, cy, s, yaw);
      const [px1, py1] = project(GW / 2, scanAt * 1.4, -GD / 2, cx, cy, s, yaw);
      const [px2, py2] = project(GW / 2, scanAt * 1.4, GD / 2, cx, cy, s, yaw);
      const [px3, py3] = project(-GW / 2, scanAt * 1.4, GD / 2, cx, cy, s, yaw);
      g.fillStyle = 'rgba(255,220,100,0.1)'; g.strokeStyle = 'rgba(255,220,100,0.5)';
      g.beginPath(); g.moveTo(px0, py0); g.lineTo(px1, py1); g.lineTo(px2, py2); g.lineTo(px3, py3); g.closePath(); g.fill(); g.stroke();

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor" />

      <nav className="nav" id="nav" ref={navRef}>
        <div className="nav__brand">DAITA</div>
        <div className="nav__links">
          <a href="#manifesto">What</a>
          <a href="#how">How</a>
          <a href="#capabilities">Platform</a>
          <a href="#uses">Use cases</a>
          <a href="#contrib">Contribute</a>
        </div>
        <button
          className={`nav__burger${navOpen ? ' is-open' : ''}`}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
        <a className="nav__cta" href="#final" onClick={closeNav}><span className="dot" />Join the beta</a>
      </nav>

      <div className={`nav__mobile${navOpen ? ' is-open' : ''}`} onClick={closeNav}>
        <a href="#manifesto">What</a>
        <a href="#how">How</a>
        <a href="#capabilities">Platform</a>
        <a href="#uses">Use cases</a>
        <a href="#contrib">Contribute</a>
        <a href="#final" className="nav__mobile-cta">Join the beta →</a>
      </div>

      <header className="hero" ref={heroRef}>
        <video
          className="hero__video"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero__veil" />

        <div className="hero__inner">
          <div className="hero__meta">
            <span>Network<strong>14,200+ contributors</strong></span>
            <span>Coverage<strong>48 cities · 12 countries</strong></span>
            <span>Dataset<strong>2.4M km captured</strong></span>
            <span>Status <strong style={{ color: 'var(--teal-glow)' }}>◉ In Beta</strong></span>
          </div>

          <h1 className="hero__wordmark" id="hw" ref={wordmarkRef}>
            <span>D</span><span>A</span><span>I</span><span>T</span><span>A</span>
          </h1>

          <div className="hero__bot">
            <div className="hero__lede">
              The <em>DoorDash</em> for 3D data — a decentralized network turning
              everyday real-world movement into spatial data for AI, simulation,
              robotics and digital twins.
            </div>
            <div className="hero__cta">
              <a href="#manifesto">See how it works →</a>
              <small>05 sections · live network</small>
            </div>
          </div>
        </div>
      </header>

      <div className="ticker">
        <div className="ticker__track" id="ticker" />
      </div>

      <section className="walk" id="walk">
        <div className="walk__inner">
          <div className="walk__caption">
            <small><span>The network, walking</span></small>
            <h2>Every <em>mover</em> a mapper.</h2>
          </div>
          <div className="walk__horizon" />
          <img
            className="walk__man"
            src="/images/mascot.webp"
            alt="A DAITA contributor in teal suit walking with a 360° camera"
          />
        </div>
      </section>

      <section className="manifesto" id="manifesto">
        <div className="manifesto__block">
          <p>The world is <em className="w em">already</em> being walked,</p>
          <p><span className="w">driven</span>, <span className="w">delivered</span> <span className="w">and</span> <span className="w">ridden</span> <span className="w">through</span></p>
          <p><span className="w">every</span> <span className="w">single</span> <span className="w">day.</span></p>
          <p><span className="w em">We turn</span> <span className="w em">that motion</span></p>
          <p><span className="w">into</span> <span className="w">3D{'\u00A0'}data.</span></p>
        </div>

        <div className="manifesto__footnote">
          <p>
            Physical AI needs real-world 3D — constantly refreshed, globally
            diverse, rights-clean. Today it comes from centralized fleets,
            one-off lidar scans and bespoke licensing deals. That stack
            doesn&apos;t scale to the geography the next generation of{' '}
            <b>Large Geospatial Models, robotics and digital twins</b> is
            asking for.
          </p>
          <p>
            DAITA is a <b>DePIN for reality</b>. A distributed network of
            couriers, drivers and cyclists — running the right capture rig —
            becomes the collection layer. We reconstruct their video into
            meshes, Gaussian splats, labelled point clouds and pose-aligned
            sequences, and serve them as training data, HD maps and a{' '}
            <b>visual positioning system</b>. Infrastructure for real-world
            3D: always up to date, global by design.
          </p>
        </div>
      </section>

      <section className="how" id="how">
        <div className="how__head">
          <div>
            <h2>From motion to <em>mesh</em>,<br />in four steps.</h2>
          </div>
          <small>04 stages · end-to-end</small>
        </div>
        <div className="how__steps">
          <div className="step reveal">
            <div className="step__n">01 <em>Capture</em></div>
            <div className="step__viz step__viz--photo" style={{ backgroundImage: 'url(/images/capture.webp)' }} />
            <div className="step__body">
              <h3>Every trip is a capture.</h3>
              <p>Couriers, drivers and riders record passively as they move — no detour, no extra time. A block captured, a block refreshed.</p>
            </div>
          </div>
          <div className="step reveal">
            <div className="step__n">02 <em>Upload &amp; earn</em></div>
            <div className="step__viz" data-viz="upload" />
            <div className="step__body">
              <h3>Footage lands, contributors earn.</h3>
              <p>Video streams in pose- and route-tagged; the network pays on every verified kilometre. Redundant passes strengthen coverage.</p>
            </div>
          </div>
          <div className="step reveal">
            <div className="step__n">03 <em>Reconstruct</em></div>
            <div className="step__viz" data-viz="mesh" />
            <div className="step__body">
              <h3>Raw video becomes 3D.</h3>
              <p>Structure-from-motion, 3D Gaussian Splatting and semantic labelling turn video into meshes, splats, labelled point clouds and precise camera poses.</p>
            </div>
          </div>
          <div className="step reveal">
            <div className="step__n">04 <em>Deliver</em></div>
            <div className="step__viz" data-viz="serve" />
            <div className="step__body">
              <h3>Customers pull by API.</h3>
              <p>Geospatial AI teams, robotics and AV platforms, simulation studios and digital-twin operators pull fresh geometry, HD maps and VPS anchors on demand.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="caps" id="capabilities">
        <div className="caps__head">
          <div>
            <h2>A living map of <em>the real world</em>.</h2>
          </div>
          <small>06 modules · 01 stack</small>
        </div>

        <div className="caps__grid">
          <div className="card huge reveal">
            <div className="card__idx">
              <span>01 / NETWORK</span>
              <span className="card__pill"><span className="dot" />Live</span>
            </div>
            <h3 className="card__title">A DePIN for real-world 3D.</h3>
            <p className="card__body">
              A decentralized physical infrastructure network: tens of thousands of
              everyday contributors running the right capture rig. Coverage grows
              with the cities people already move through, not with the fleet we
              can afford.
            </p>
            <div className="sensorviz" id="sensorviz" />
          </div>

          <div className="card tall reveal">
            <div className="card__idx"><span>02 / SCALE</span></div>
            <h3 className="card__title">Crowd-scale, not fleet-scale.</h3>
            <p className="card__body">Every extra contributor is extra coverage. Growth compounds; reality refreshes.</p>
            <div className="card__fig">14.2<sup>k</sup></div>
          </div>

          <div className="card reveal">
            <div className="card__idx"><span>03 / FRESHNESS</span></div>
            <h3 className="card__title">Weekly refresh, not yearly.</h3>
            <p className="card__body">Same streets, re-captured — your data ages in weeks, not years.</p>
            <div className="card__fig">7<sup>days</sup></div>
          </div>

          <div className="card reveal">
            <div className="card__idx"><span>04 / PRECISION</span></div>
            <h3 className="card__title">Centimeter-scale pose.</h3>
            <p className="card__body">Every clip ships with a precise camera pose. Powers visual positioning, AR anchoring and robotics localization.</p>
            <div className="card__fig">±1<sup>cm</sup></div>
          </div>

          <div className="card wide reveal">
            <div className="card__idx"><span>05 / OUTPUT</span></div>
            <h3 className="card__title">Meshes, splats, pose &amp; VPS anchors.</h3>
            <p className="card__body">
              Photogrammetric meshes, Gaussian splats, labelled point clouds, VPS
              anchors and pose-aligned video. Whatever format your pipeline expects —
              pulled by API, SDK or bulk.
            </p>
            <div className="card__pill" style={{ alignSelf: 'flex-start' }}><span className="dot" />API · SDK · Bulk</div>
          </div>

          <div className="card wide reveal">
            <div className="card__idx"><span>06 / GLOBAL</span></div>
            <h3 className="card__title">Global by{'\u00A0'}design.</h3>
            <p className="card__body">
              Launch a new city by onboarding its couriers, not by shipping a fleet.
              The network is already there — at a fraction of the per-km² cost of a
              bespoke scan.
            </p>
            <div className="card__pill" style={{ alignSelf: 'flex-start' }}><span className="dot" />Beta · 48 pilot cities targeted</div>
          </div>
        </div>
      </section>

      <section className="showcase" id="showcase">
        <div className="showcase__viz">
          <div className="showcase__label tl">◉ Contributor scan · pilot capture</div>
          <div className="showcase__label br">SPLAT · drag to orbit</div>
          <div className="showcase__splat"><SplatViewer /></div>
        </div>
        <div className="showcase__txt">
          <h3>One capture. <em>Every</em> reality format.</h3>
          <p>
            DAITA&apos;s reconstruction engine ingests contributor video and outputs
            a calibrated, semantically labelled, version-tracked 3D scene. Pull the
            format your pipeline expects — training data, HD maps, VPS anchors — by
            API.
          </p>
          <ul>
            <li><b>01</b> <i>Photogrammetric mesh</i> <u>OBJ · GLB · USD</u></li>
            <li><b>02</b> <i>Gaussian splats</i> <u>PLY · SPLAT</u></li>
            <li><b>03</b> <i>Labelled point cloud</i> <u>LAS · E57</u></li>
            <li><b>04</b> <i>VPS anchors &amp; pose</i> <u>JSON · protobuf</u></li>
          </ul>
        </div>
      </section>

      <section className="uses" id="uses">
        <div className="uses__head">
          <div>
            <h2>Built for teams who need the <em>real world</em>, fast.</h2>
          </div>
          <small>06 verticals · and counting</small>
        </div>
        <div className="uses__grid">
          <div className="use">
            <div className="use__tag"><span>01 / FOUNDATION</span><span>LGMs</span></div>
            <h3>Large Geospatial Models.</h3>
            <p>Train foundation models on geometry that actually matches the world people move through — constantly refreshed, geographically diverse, rights-clean.</p>
            <div className="use__examples"><span>LGM</span><span>WFM</span><span>VLA</span></div>
          </div>
          <div className="use">
            <div className="use__tag"><span>02 / ROBOTICS</span><span>nav + VPS</span></div>
            <h3>Robotics &amp; VPS.</h3>
            <p>Replicas of real streets, warehouses and campuses plus centimeter-precise visual positioning — navigation that works indoor, outdoor and GPS-denied.</p>
            <div className="use__examples"><span>delivery bots</span><span>AMRs</span><span>humanoids</span></div>
          </div>
          <div className="use">
            <div className="use__tag"><span>03 / MAPPING</span><span>HD</span></div>
            <h3>HD mapping, kept current.</h3>
            <p>Refresh HD maps in days, not quarters. Every new road sign, cone and construction zone flows in with the next capture pass.</p>
            <div className="use__examples"><span>AV stack</span><span>ADAS</span><span>logistics</span></div>
          </div>
          <div className="use">
            <div className="use__tag"><span>04 / SIMULATION</span><span>WFMs</span></div>
            <h3>Simulation &amp; virtual worlds.</h3>
            <p>Drop real city blocks into any simulator. Train World Foundation Models, stress-test autonomy, prototype games on geometry that exists.</p>
            <div className="use__examples"><span>AV sim</span><span>Cosmos / WFM</span><span>game worlds</span></div>
          </div>
          <div className="use">
            <div className="use__tag"><span>05 / AR + XR</span><span>anchored</span></div>
            <h3>AR &amp; XR content.</h3>
            <p>Real-world 3D as ground truth for immersive experiences. Anchor XR content against a centimeter-aligned map of where users actually walk.</p>
            <div className="use__examples"><span>location AR</span><span>XR retail</span><span>spatial games</span></div>
          </div>
          <div className="use">
            <div className="use__tag"><span>06 / INFRA + ISR</span><span>twins</span></div>
            <h3>Digital twins &amp; ISR.</h3>
            <p>Ports, campuses, cities and contested urban environments, kept in-sync with their physical state. Measure change, don&apos;t guess at it.</p>
            <div className="use__examples"><span>ports</span><span>utilities</span><span>defense ops</span></div>
          </div>
        </div>
      </section>

      <section className="partners">
        <div className="partners__kicker"><span>Built for teams like</span></div>
        <div className="partners__grid">
          <div className="partners__logo">Waymo<small>AV stack</small></div>
          <div className="partners__logo">Mapbox<small>HD mapping</small></div>
          <div className="partners__logo">Niantic<small>Spatial / VPS</small></div>
          <div className="partners__logo">Boston Dynamics<small>Robotics</small></div>
          <div className="partners__logo">Cruise<small>AV sim</small></div>
          <div className="partners__logo">Magic Leap<small>XR anchoring</small></div>
          <div className="partners__logo">TomTom<small>Map refresh</small></div>
          <div className="partners__logo">Nvidia Cosmos<small>WFMs</small></div>
        </div>
      </section>

      <section className="stacker">
        <div className="stacker__row">
          <span>CAPTURE</span><span>REFRESH</span><span>DELIVER</span><em>·</em>
          <span>CAPTURE</span><span>REFRESH</span><span>DELIVER</span><em>·</em>
        </div>
        <div className="stacker__row">
          MESH <em>·</em> SPLAT <em>·</em> POSE <em>·</em> VPS <em>·</em>
          MESH <em>·</em> SPLAT <em>·</em> POSE <em>·</em> VPS <em>·</em>
        </div>
      </section>

      <section className="contrib" id="contrib">
        <div className="contrib__l">
          <h3>If you <em>move</em>, you can map.</h3>
          <p>
            The network is open to anyone already out in the world. A courier
            delivering lunches, a rider crossing town, a driver running a daily
            route — with the right capture rig, every trip becomes coverage. We
            ship the hardware, handle the processing, and pay out on every
            verified kilometre captured.
          </p>
          <a className="nav__cta" href="mailto:join@daita.eu" style={{ marginTop: 28 }}>
            <span className="dot" />Join the network
          </a>

          <div className="rig">
            <div className="rig__title">The rig · shipped free</div>
            <ul>
              <li><b>Camera</b>360° · 8K · stabilised</li>
              <li><b>GPS</b>RTK-ready, ±30 cm baseline</li>
              <li><b>App</b>auto-upload, privacy on-device</li>
              <li><b>Mount</b>helmet · handlebar · roof</li>
            </ul>
          </div>
        </div>
        <div className="contrib__r">
          <div className="who">
            <div className="who__num">01</div>
            <h4>Couriers &amp; riders</h4>
            <p>Food and parcel couriers on bikes, scooters and e-bikes. Dense urban coverage, every day.</p>
          </div>
          <div className="who">
            <div className="who__num">02</div>
            <h4>Rideshare &amp; taxi</h4>
            <p>Drivers who already cover thousands of km a week across a city&apos;s full graph.</p>
          </div>
          <div className="who">
            <div className="who__num">03</div>
            <h4>Logistics &amp; fleet</h4>
            <p>Delivery vans and regional fleets running repeatable routes across regions.</p>
          </div>
          <div className="who">
            <div className="who__num">04</div>
            <h4>Commuters &amp; cyclists</h4>
            <p>Daily commuters on bikes and cars who can capture a familiar stretch without changing their day.</p>
          </div>
        </div>
      </section>

      <section className="final" id="final">
        <h2>Real world,<br /><em>really</em> in 3D.</h2>
        <div className="final__row">
          <p>
            DAITA is in private beta with pilot cities, partner fleets and
            founding contributors. Get on the list — whether you want to license
            the data, run a fleet or capture a block at a time, we&apos;ll reach out
            as seats open.
          </p>
          <div className="final__cta">
            <a className="big" href="mailto:hello@daita.eu">
              hello@daita.eu
              <span className="arrow">→</span>
            </a>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="ghost" href="#how">How it works</a>
              <a className="ghost" href="#contrib">Become a contributor</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot">
          <div className="foot__brand">DA<em>IT</em>A</div>
          <div className="foot__col">
            <h4>Platform</h4>
            <a href="#capabilities">Network</a>
            <a href="#capabilities">Reconstruction</a>
            <a href="#showcase">Formats</a>
            <a href="#how">Pipeline</a>
          </div>
          <div className="foot__col">
            <h4>Company</h4>
            <a href="#">Team</a>
            <a href="#">Press</a>
            <a href="#">Careers</a>
          </div>
          <div className="foot__col">
            <h4>Contact</h4>
            <a href="mailto:hello@daita.eu">hello@daita.eu</a>
            <a href="mailto:join@daita.eu">join@daita.eu</a>
            <a href="#">Partner with us →</a>
          </div>
        </div>
        <div className="foot__bot">
          <span>© 2026 DAITA Labs · Private beta</span>
          <span>The DoorDash for 3D data</span>
        </div>
      </footer>
    </>
  );
}
