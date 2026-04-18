'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
    camera.position.set(0, 0, 35);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ââ Main splat-like particles ââ
    const count = 5000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const goldA = new THREE.Color('#C4A265');
    const goldB = new THREE.Color('#E8D5A8');
    const grey = new THREE.Color('#666666');
    const white = new THREE.Color('#FFFFFF');

    for (let i = 0; i < count; i++) {
      // City-like distribution: clusters + spread
      const cluster = Math.random() < 0.3;
      const angle = Math.random() * Math.PI * 2;
      const radius = cluster ? Math.random() * 8 : Math.random() * 30 + 5;
      const heightVal = cluster
        ? (Math.random() - 0.3) * 12
        : (Math.random() - 0.5) * 20;

      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = heightVal;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 3;

      const r = Math.random();
      const c = r < 0.25 ? goldA : r < 0.45 ? goldB : r < 0.7 ? grey : white;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sizes[i] = cluster ? Math.random() * 2 + 0.5 : Math.random() * 1.2 + 0.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vDist;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDist = -mv.z;
          gl_PointSize = size * (180.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDist;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = exp(-d * d * 8.0) * 0.55;
          // Fade with distance
          alpha *= smoothstep(80.0, 20.0, vDist);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ââ Ambient larger splats ââ
    const ambCount = 150;
    const ambGeo = new THREE.BufferGeometry();
    const ambPos = new Float32Array(ambCount * 3);
    const ambCol = new Float32Array(ambCount * 3);
    const ambSizes = new Float32Array(ambCount);

    for (let i = 0; i < ambCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 20 + 3;
      ambPos[i * 3] = Math.cos(a) * r;
      ambPos[i * 3 + 1] = (Math.random() - 0.4) * 10;
      ambPos[i * 3 + 2] = Math.sin(a) * r;
      const c = Math.random() > 0.6 ? goldA : goldB;
      ambCol[i * 3] = c.r;
      ambCol[i * 3 + 1] = c.g;
      ambCol[i * 3 + 2] = c.b;
      ambSizes[i] = Math.random() * 4 + 2;
    }

    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute('color', new THREE.BufferAttribute(ambCol, 3));
    ambGeo.setAttribute('size', new THREE.BufferAttribute(ambSizes, 1));

    const ambMat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (180.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = exp(-d * d * 3.0) * 0.15;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ambPoints = new THREE.Points(ambGeo, ambMat);
    scene.add(ambPoints);

    // ââ Mouse interaction ââ
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / w - 0.5) * 2;
      mouseY = (e.clientY / h - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ââ Animation ââ
    let t = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.002;

      points.rotation.y = t * 0.25 + mouseX * 0.05;
      points.rotation.x = mouseY * 0.03;
      ambPoints.rotation.y = t * 0.12;

      camera.position.y = Math.sin(t * 0.4) * 1.5;
      camera.lookAt(0, 0, 0);

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
      window.removeEventListener('mousemove', onMouseMove);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: 'absolute', inset: 0, zIndex: 0,
    }} />
  );
}
