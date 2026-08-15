import { useEffect, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';

interface Props {
  text?: string;
  color?: string;
  depth?: number; // extrusion depth in px
  particleSize?: number; // in px
  density?: number; // sampling step in px (smaller = denser)
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  tilt?: number; // degrees
  scatter?: number; // in px
  gatherDuration?: number; // ms
  stagger?: number; // ms
  idleDrift?: number; // in px
  className?: string;
  style?: CSSProperties;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function resolveFontSize(value: string, container: HTMLElement, weight: number, family: string): number {
  const probe = document.createElement('span');
  probe.textContent = 'M';
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.fontSize = value;
  probe.style.fontWeight = String(weight);
  probe.style.fontFamily = family;
  container.appendChild(probe);
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 80;
  probe.remove();
  return size;
}

interface Point2D {
  x: number;
  y: number;
}

// Sample the glyph into 2D points (pixel coords, centered at origin).
function sampleText(text: string, fontSize: number, weight: number, family: string, density: number) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const font = `${weight} ${fontSize}px ${family}`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const pw = Math.ceil(metrics.width) + 4;
  const ph = Math.ceil(fontSize * 1.5);
  canvas.width = pw;
  canvas.height = ph;
  ctx.font = font;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 2, ph / 2);

  const data = ctx.getImageData(0, 0, pw, ph).data;
  const points: Point2D[] = [];
  const step = Math.max(2, Math.floor(density));
  for (let y = 0; y < ph; y += step) {
    for (let x = 0; x < pw; x += step) {
      if (data[(y * pw + x) * 4 + 3] > 40) {
        points.push({ x: x - pw / 2, y: y - ph / 2 });
      }
    }
  }
  return { points, pw, ph };
}

export default function ParticleText3D({
  text = '周游的小破站',
  color = '#1a1a1a',
  depth = 45,
  particleSize = 2.6,
  density = 5,
  fontSize = 'clamp(3rem, 8vw, 5rem)',
  fontWeight = 700,
  fontFamily = 'inherit',
  tilt = 7.5,
  scatter = 140,
  gatherDuration = 1800,
  stagger = 420,
  idleDrift = 1.2,
  className = '',
  style = {}
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const computed = window.getComputedStyle(mount);
    const family = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;
    const resolvedSize = resolveFontSize(fontSize, mount, fontWeight, family);
    const { points: pts2d, pw, ph } = sampleText(text, resolvedSize, fontWeight, family, density);
    if (!pts2d.length) return;

    // --- Extrude the 2D glyph into a 3D particle cloud ---
    const layers = Math.max(4, Math.round(depth / 5));
    const N = pts2d.length * layers;
    const targets = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const seeds = new Float32Array(N);
    const delays = new Float32Array(N);

    const frontColor = new THREE.Color(color);
    const backColor = new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.55);
    const halfDepth = depth / 2;

    let idx = 0;
    for (const p of pts2d) {
      for (let l = 0; l < layers; l++) {
        const z = halfDepth - (l / (layers - 1)) * depth; // +halfDepth (front) → -halfDepth (back)
        const i3 = idx * 3;
        targets[i3] = p.x;
        targets[i3 + 1] = p.y;
        targets[i3 + 2] = z;
        const mix = (z + halfDepth) / depth; // 0 at back → 1 at front
        const c = backColor.clone().lerp(frontColor, mix);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
        const seed = ((idx * 9301 + 49297) % 233280) / 233280;
        seeds[idx] = seed;
        delays[idx] = reducedMotion ? 0 : seed * stagger;
        idx++;
      }
    }

    // Scatter start positions (randomized around each target).
    const starts = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const seed = seeds[i];
      const angle = seed * Math.PI * 2;
      const dist = scatter * (0.35 + seed * 0.75);
      starts[i * 3] = targets[i * 3] + Math.cos(angle) * dist;
      starts[i * 3 + 1] = targets[i * 3 + 1] + Math.sin(angle) * dist;
      starts[i * 3 + 2] = targets[i * 3 + 2] + (seed - 0.5) * scatter * 0.8;
    }

    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) positions[i] = reducedMotion ? targets[i] : starts[i];

    // --- Three.js scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 2000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Tilt: 3D rotation tracking the pointer ---
    const tiltRad = (tilt * Math.PI) / 180;
    const baseRotX = -tiltRad * 0.32;
    const baseRotY = tiltRad * 0.42;
    let rotX = baseRotX;
    let rotY = baseRotY;
    let targetRotX = baseRotX;
    let targetRotY = baseRotY;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
      const y = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);
      targetRotX = baseRotX - y * tiltRad;
      targetRotY = baseRotY + x * tiltRad;
    };
    const onPointerLeave = () => {
      targetRotX = baseRotX;
      targetRotY = baseRotY;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);

    // --- Resize + fit camera so the text fills the container with margin ---
    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const margin = 1.35;
      const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
      const zFromHeight = (ph * margin) / (2 * tanHalf);
      const zFromWidth = (pw * margin) / (2 * tanHalf * (w / h));
      camera.position.z = Math.max(zFromHeight, zFromWidth);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    // --- Animation loop ---
    const startTime = performance.now();
    let raf = 0;

    const tick = () => {
      const now = performance.now();
      const pos = geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        let px = targets[i3];
        let py = targets[i3 + 1];
        let pz = targets[i3 + 2];

        if (!reducedMotion) {
          const local = (now - startTime - delays[i]) / gatherDuration;
          const progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          px = starts[i3] + (targets[i3] - starts[i3]) * eased;
          py = starts[i3 + 1] + (targets[i3 + 1] - starts[i3 + 1]) * eased;
          pz = starts[i3 + 2] + (targets[i3 + 2] - starts[i3 + 2]) * eased;

          if (progress >= 1 && idleDrift > 0) {
            const t = now * 0.001;
            const amp = idleDrift * (seeds[i] + 0.5);
            px += Math.sin(t * 0.9 + seeds[i] * 10) * amp;
            py += Math.cos(t * 0.75 + seeds[i] * 10) * amp;
          }
        }

        pos.array[i3] = px;
        pos.array[i3 + 1] = py;
        pos.array[i3 + 2] = pz;
      }
      pos.needsUpdate = true;

      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;
      points.rotation.x = rotX;
      points.rotation.y = rotY;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [text, color, depth, particleSize, density, fontSize, fontWeight, fontFamily, tilt, scatter, gatherDuration, stagger, idleDrift]);

  return <div ref={mountRef} className={className} style={style} />;
}
