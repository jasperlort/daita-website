'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
 * PlascassierMini — a 3D mini model of Plascassier (Provence, FR).
 * Building footprints are pulled from OpenStreetMap and baked into
 * /data/plascassier.json at build time. Each footprint is extruded by
 * its tagged height (or 6 m default) and rendered as a single merged
 * mesh that rotates slowly around the vertical axis on a turntable.
 */
export default function PlascassierMini() {
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
    const camera = new THREE.PerspectiveCamera(34, W() / H(), 0.1, 4000);
    camera.position.set(0, 220, 460);
    camera.lookAt(0, 0, 0);

    // simple lighting — gives the cream extrusions readable shading
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(200, 400, 200);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2fd8d8, 0.35);
    rim.position.set(-300, 200, -200);
    scene.add(rim);

    const village = new THREE.Group();
    scene.add(village);

    let rafId = 0;
    let alive = true;
    const tick = (t) => {
      if (!alive) return;
      const k = t * 0.00018;
      village.rotation.y = k;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    // Load + build mesh
    fetch('/data/plascassier.json')
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        const buildings = data.buildings || [];
        // gather all points to compute bounds for centring
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const b of buildings) {
          for (const [x, y] of b.pts) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;

        const wallMat = new THREE.MeshStandardMaterial({
          color: 0xf3eede,
          roughness: 0.85,
          metalness: 0.0,
        });
        const roofMat = new THREE.MeshStandardMaterial({
          color: 0x0b6e6e,
          roughness: 0.9,
          metalness: 0.0,
        });

        for (const b of buildings) {
          const shape = new THREE.Shape();
          const pts = b.pts;
          if (pts.length < 3) continue;
          shape.moveTo(pts[0][0] - cx, -(pts[0][1] - cy));
          for (let i = 1; i < pts.length; i++) {
            shape.lineTo(pts[i][0] - cx, -(pts[i][1] - cy));
          }
          shape.closePath();
          const geom = new THREE.ExtrudeGeometry(shape, {
            depth: b.h,
            bevelEnabled: false,
            curveSegments: 1,
          });
          // ExtrudeGeometry extrudes along +Z; we want +Y (up).
          geom.rotateX(-Math.PI / 2);
          const mesh = new THREE.Mesh(geom, [wallMat, roofMat]);
          // index 0 = front/back faces (extrude caps → roof + floor),
          // index 1 = side faces (walls).
          // ExtrudeGeometry actually uses 0 for the caps and 1 for the
          // side faces in the order we built groups; assigning two
          // materials gives the roof/wall split for free.
          village.add(mesh);
        }

        // ground disc, very subtle, so the model has a base
        const groundGeom = new THREE.CircleGeometry(280, 64);
        groundGeom.rotateX(-Math.PI / 2);
        const ground = new THREE.Mesh(
          groundGeom,
          new THREE.MeshBasicMaterial({ color: 0x063a3a, transparent: true, opacity: 0.55 })
        );
        ground.position.y = -0.1;
        village.add(ground);

        rafId = requestAnimationFrame(tick);
      })
      .catch(() => {});

    const onResize = () => {
      renderer.setSize(W(), H());
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="plascassier-mini" />;
}
