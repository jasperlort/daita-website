'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
 * PlascassierMini — Google Photorealistic 3D Tiles centred on
 * Plascassier (Provence, FR). Same data Google Earth uses: full
 * photogrammetric meshes with real photo textures.
 *
 * Needs a Google Maps Platform API key with the "Map Tiles API"
 * enabled, exposed at build time as NEXT_PUBLIC_GOOGLE_MAPS_KEY.
 *
 * If the key isn't set we silently fall back to a small text card —
 * we don't ship a half-broken viewer.
 */
const LAT = 43.6595;
const LON = 6.9430;

export default function PlascassierMini() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!KEY) {
      // Quiet fallback so the page still ships when the env var isn't wired.
      const note = document.createElement('div');
      note.className = 'plascassier-mini__fallback';
      note.textContent = 'Plascassier · Provence';
      container.appendChild(note);
      return () => { container.removeChild(note); };
    }

    let alive = true;
    let rafId = 0;

    const W = () => container.clientWidth;
    const H = () => container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W() / H(), 1, 100000);
    scene.add(camera);

    // Initial orbit: 800 m back, 280 m up. Will rotate around the
    // village centre at this radius.
    const ORBIT_R = 800;
    const ORBIT_H = 280;

    (async () => {
      const mod = await import('3d-tiles-renderer');
      if (!alive) return;
      const { GoogleCloudAuthPlugin, TilesRenderer } = mod;

      const tiles = new TilesRenderer();
      tiles.registerPlugin(new GoogleCloudAuthPlugin({ apiToken: KEY, autoRefreshToken: true }));
      tiles.group.rotation.x = -Math.PI / 2; // align tiles' Z-up to scene Y-up
      scene.add(tiles.group);

      // Wait for the root tileset to load so we know the origin.
      tiles.addEventListener('load-tile-set', () => {
        if (!alive) return;
        // Re-centre camera on Plascassier after the tileset loads.
        const sphere = new THREE.Sphere();
        tiles.getBoundingSphere(sphere);
        // Move tiles.group so the village centre sits at world origin.
        tiles.group.position.sub(sphere.center);
        // Now the tile data is centred; use a simple orbit.
      });

      const target = new THREE.Vector3(0, 0, 0);
      const tick = (t) => {
        if (!alive) return;
        const k = t * 0.00012;
        camera.position.set(
          Math.sin(k) * ORBIT_R,
          ORBIT_H,
          Math.cos(k) * ORBIT_R,
        );
        camera.lookAt(target);
        camera.updateMatrixWorld();

        tiles.setCamera(camera);
        tiles.setResolutionFromRenderer(camera, renderer);
        tiles.update();

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      // attribution
      const attr = document.createElement('div');
      attr.className = 'plascassier-mini__attr';
      attr.textContent = '© Google · Plascassier';
      container.appendChild(attr);

      const onResize = () => {
        renderer.setSize(W(), H());
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(container);

      const cleanup = () => {
        ro.disconnect();
        tiles.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        if (attr.parentNode === container) container.removeChild(attr);
      };
      container.__cleanupTiles = cleanup;
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      if (container.__cleanupTiles) {
        container.__cleanupTiles();
        delete container.__cleanupTiles;
      }
    };
  }, []);

  return <div ref={containerRef} className="plascassier-mini" />;
}
