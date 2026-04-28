'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
 * SpinningWordmark — a point-cloud DAITA logo rendered in WebGL,
 * rotating around the vertical axis (turntable). Used in the final CTA
 * section to give the page a "look at the 3D" beat right before the
 * action buttons.
 *
 *   - Letters are rasterised into a hidden 2D canvas (Archivo Black look),
 *     then sampled to point positions every 3 px.
 *   - Each point is given a small random Z so the cloud has depth that
 *     reads when it rotates.
 *   - Cream points on a transparent background so it composites on the
 *     teal final section without a baked colour.
 */
export default function SpinningWordmark() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = () => container.clientWidth;
    const H = () => container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W() / H(), 0.1, 100);
    camera.position.set(0, 0, 12);

    // ---- sample DAITA glyphs into a point cloud ----
    const tcw = 1400;
    const tch = 280;
    const tmp = document.createElement('canvas');
    tmp.width = tcw;
    tmp.height = tch;
    const ctx = tmp.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, tcw, tch);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    // Use Archivo Black if loaded, fall back to a chunky geometric stack.
    ctx.font = '900 220px "Archivo Black", "Inter", system-ui, sans-serif';
    ctx.fillText('DAITA', tcw / 2, tch / 2 + 6);

    const img = ctx.getImageData(0, 0, tcw, tch).data;
    const positions = [];
    const STEP = 3;
    for (let y = 0; y < tch; y += STEP) {
      for (let x = 0; x < tcw; x += STEP) {
        const r = img[(y * tcw + x) * 4];
        if (r > 180) {
          // Centre + scale to world units (~6 wide). Random Z gives depth.
          positions.push(
            (x - tcw / 2) / 90,
            -(y - tch / 2) / 90,
            (Math.random() - 0.5) * 0.6
          );
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xf3eede,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const points = new THREE.Points(geom, mat);
    scene.add(points);

    // A second, sparser glow layer in teal for accent.
    const glowMat = new THREE.PointsMaterial({
      color: 0x2fd8d8,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const glow = new THREE.Points(geom.clone(), glowMat);
    scene.add(glow);

    let rafId = 0;
    const tick = (t) => {
      const k = t * 0.0006;
      points.rotation.y = k;
      glow.rotation.y = k * 1.02;
      // tiny breathing tilt
      points.rotation.x = Math.sin(k * 0.7) * 0.08;
      glow.rotation.x = Math.sin(k * 0.7) * 0.08;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      renderer.setSize(W(), H());
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      geom.dispose();
      mat.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="spinning-wordmark" />;
}
