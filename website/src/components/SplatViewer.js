'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/*
 * SplatViewer â Interactive 3D Gaussian Splat viewer
 *
 * SETUP INSTRUCTIONS:
 * 1. Download a .splat or .ply file from:
 *    - https://superspl.at/ (SuperSplat â browse free splats)
 *    - https://poly.cam/tools/gaussian-splatting (Polycam)
 *    - https://huggingface.co/datasets/Voxel51/gaussian_splatting
 *
 * 2. Place it in /public/splats/scene.splat
 *
 * 3. Set USE_REAL_SPLAT = true below
 *
 * 4. npm install @mkkellogg/gaussian-splats-3d
 *
 * The component falls back to a beautiful procedural "splat-like" 3D scene
 * when no real .splat file is available.
 */

const USE_REAL_SPLAT = true;
const SPLAT_PATH = '/splats/scene.splat';

// ââ Procedural Gaussian Splat Scene (placeholder) ââ
function ProceduralSplatScene({ container }) {
  const w = container.clientWidth;
  const h = container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A0A10');

  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
  camera.position.set(8, 4, 12);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // ââ Generate a "building/city" scene made of splats ââ
  const splatCount = 12000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(splatCount * 3);
  const colors = new Float32Array(splatCount * 3);
  const splatSizes = new Float32Array(splatCount);

  const palette = [
    new THREE.Color('#C4A265'), // gold
    new THREE.Color('#D4B87A'), // light gold
    new THREE.Color('#E8D5A8'), // muted gold
    new THREE.Color('#888888'), // grey
    new THREE.Color('#AAAAAA'), // light grey
    new THREE.Color('#FFFFFF'), // white
    new THREE.Color('#666050'), // warm grey
  ];

  // Create building-like structures
  const buildings = [];
  for (let b = 0; b < 25; b++) {
    buildings.push({
      x: (Math.random() - 0.5) * 16,
      z: (Math.random() - 0.5) * 16,
      w: Math.random() * 1.5 + 0.5,
      d: Math.random() * 1.5 + 0.5,
      h: Math.random() * 6 + 1,
    });
  }

  for (let i = 0; i < splatCount; i++) {
    let x, y, z;

    if (i < splatCount * 0.7) {
      // Building splats
      const b = buildings[Math.floor(Math.random() * buildings.length)];
      x = b.x + (Math.random() - 0.5) * b.w;
      y = Math.random() * b.h;
      z = b.z + (Math.random() - 0.5) * b.d;
    } else if (i < splatCount * 0.85) {
      // Ground plane
      x = (Math.random() - 0.5) * 20;
      y = Math.random() * 0.3;
      z = (Math.random() - 0.5) * 20;
    } else {
      // Scattered ambient
      x = (Math.random() - 0.5) * 24;
      y = Math.random() * 8;
      z = (Math.random() - 0.5) * 24;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    splatSizes[i] = Math.random() * 1.2 + 0.2;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(splatSizes, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float dist = -mv.z;
        gl_PointSize = size * (150.0 / dist);
        vAlpha = smoothstep(60.0, 5.0, dist);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = exp(-d * d * 6.0) * 0.65 * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ââ Orbit controls (manual) ââ
  let theta = 0.3;
  let phi = 0.4;
  let radius = 16;
  let isDragging = false;
  let lastX = 0, lastY = 0;
  let autoRotate = true;

  const onPointerDown = (e) => {
    isDragging = true;
    autoRotate = false;
    lastX = e.clientX;
    lastY = e.clientY;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    theta -= dx * 0.005;
    phi = Math.max(0.1, Math.min(Math.PI / 2.2, phi - dy * 0.005));
    lastX = e.clientX;
    lastY = e.clientY;
  };

  const onPointerUp = () => {
    isDragging = false;
    // Resume auto-rotate after 3 seconds
    setTimeout(() => { if (!isDragging) autoRotate = true; }, 3000);
  };

  const onWheel = (e) => {
    radius = Math.max(6, Math.min(30, radius + e.deltaY * 0.01));
    e.preventDefault();
  };

  const el = renderer.domElement;
  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('wheel', onWheel, { passive: false });

  let animId;
  let t = 0;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    t += 0.003;

    if (autoRotate) theta += 0.002;

    camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
    camera.position.y = radius * Math.cos(phi);
    camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
    camera.lookAt(0, 2, 0);

    renderer.render(scene, camera);
  };
  animate();

  const handleResize = () => {
    const nw = container.clientWidth;
    const nh = container.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
    el.removeEventListener('pointerdown', onPointerDown);
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerup', onPointerUp);
    el.removeEventListener('wheel', onWheel);
    if (container.contains(el)) container.removeChild(el);
    renderer.dispose();
  };
}

// ââ Real Gaussian Splat Viewer ââ
async function RealSplatScene({ container }) {
  // The package uses named ESM exports; `.default` is undefined in the
  // Next.js dynamic-import output. Fall back to the namespace object itself.
  const GaussianSplats3DModule = await import('@mkkellogg/gaussian-splats-3d');
  const GaussianSplats3D = GaussianSplats3DModule.default || GaussianSplats3DModule;

  const viewer = new GaussianSplats3D.Viewer({
    cameraUp: [0, 1, 0],
    initialCameraPosition: [0, 3, 16],
    initialCameraLookAt: [0, 0, 0],
    rootElement: container,
    selfDrivenMode: true,
    sharedMemoryForWorkers: false,
  });

  // Flip the scene around X by 180°: splatfacto/COLMAP output is Y-down
  // in world space; Three.js defaults to Y-up. Quaternion [1,0,0,0] = 180° on X.
  await viewer.addSplatScene(SPLAT_PATH, {
    splatAlphaRemovalThreshold: 0,
    showLoadingUI: false,
    position: [0, 0, 0],
    rotation: [1, 0, 0, 0],
    scale: [1, 1, 1],
  });

  viewer.start();

  return () => {
    viewer.dispose();
  };
}

export default function SplatViewer() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cleanup;

    const init = async () => {
      try {
        if (USE_REAL_SPLAT) {
          cleanup = await RealSplatScene({ container: containerRef.current });
        } else {
          cleanup = ProceduralSplatScene({ container: containerRef.current });
        }
      } catch (err) {
        console.error('Splat viewer error:', err);
        setError(err.message);
        // Fallback to procedural
        cleanup = ProceduralSplatScene({ container: containerRef.current });
      }
    };

    init();
    return () => { if (cleanup) cleanup(); };
  }, []);

  return (
    <div ref={containerRef} style={{
      width: '100%', height: '100%', position: 'relative',
      cursor: 'grab',
    }}>
      {error && (
        <div style={{
          position: 'absolute', bottom: 8, left: 12,
          fontSize: '0.65rem', color: '#555',
        }}>
          Using procedural preview. Add a .splat file to /public/splats/ for real data.
        </div>
      )}
    </div>
  );
}
