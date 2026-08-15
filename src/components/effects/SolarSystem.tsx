import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface Props {
  className?: string;
}

interface PlanetDef {
  name: string;
  label: string;
  radius: number;
  distance: number;
  speed: number;
  tilt: number;
  fallback: number;
  atmosphere?: boolean;
  ring?: boolean;
}

const PLANETS: PlanetDef[] = [
  { name: 'mercury', label: '水星', radius: 0.06, distance: 1.0, speed: 0.5, tilt: 0.0, fallback: 0xb8bcc4 },
  { name: 'venus', label: '金星', radius: 0.09, distance: 1.35, speed: 0.38, tilt: 0.03, fallback: 0xe3b477 },
  { name: 'earth', label: '地球', radius: 0.1, distance: 1.75, speed: 0.3, tilt: 0.02, fallback: 0x5a9de0, atmosphere: true },
  { name: 'mars', label: '火星', radius: 0.075, distance: 2.15, speed: 0.24, tilt: -0.04, fallback: 0xd1663b },
  { name: 'jupiter', label: '木星', radius: 0.22, distance: 2.75, speed: 0.17, tilt: 0.05, fallback: 0xd9b384 },
  { name: 'saturn', label: '土星', radius: 0.19, distance: 3.35, speed: 0.13, tilt: -0.05, fallback: 0xe7c978, ring: true },
  { name: 'uranus', label: '天王星', radius: 0.14, distance: 3.95, speed: 0.1, tilt: 0.06, fallback: 0x8fd6e6 },
  { name: 'neptune', label: '海王星', radius: 0.14, distance: 4.55, speed: 0.08, tilt: -0.03, fallback: 0x6a9fd8 },
];

const STAR_COUNT = 1800;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

const ATMOSPHERE_VERT = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMOSPHERE_FRAG = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = 1.0 - abs(dot(vView, vNormal));
    fresnel = pow(fresnel, 3.0);
    gl_FragColor = vec4(0.4, 0.72, 1.0, fresnel * 0.85);
  }
`;

function makeRingGeometry(inner: number, outer: number): THREE.RingGeometry {
  const geo = new THREE.RingGeometry(inner, outer, 128);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = v.length();
    uv.setXY(i, (r - inner) / (outer - inner), 0.5);
  }
  return geo;
}

export default function SolarSystem({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const tooltip = tooltipRef.current;
    const wrapper = mount?.parentElement;
    if (!mount || !tooltip || !wrapper) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    camera.position.set(0, 2.2, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.6, 0.5, 0.85);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // --- Starfield ---
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 30 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, sizeAttenuation: true, transparent: true, opacity: 0.85 }),
    );
    scene.add(stars);

    // --- Sun ---
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0xffc23e }),
    );
    const sunTex = loader.load('/textures/sun.jpg', (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      const m = sun.material as THREE.MeshBasicMaterial;
      m.map = t;
      m.color.set(0xffffff);
      m.needsUpdate = true;
    });
    textures.push(sunTex);
    scene.add(sun);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 256;
    const ctx = glowCanvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 240, 200, 0.95)');
    gradient.addColorStop(0.2, 'rgba(255, 190, 80, 0.45)');
    gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.12)');
    gradient.addColorStop(1, 'rgba(255, 140, 40, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    const corona = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    corona.scale.set(7, 7, 1);
    scene.add(corona);

    // --- Lighting ---
    const sunLight = new THREE.PointLight(0xffffff, 50, 0, 2);
    scene.add(sunLight);
    const ambient = new THREE.AmbientLight(0x334466, 0.35);
    scene.add(ambient);

    // --- Planets + hover registry ---
    const hoverTargets: { mesh: THREE.Mesh; label: string }[] = [{ mesh: sun, label: '太阳' }];
    const orbiters = PLANETS.map((p) => {
      const group = new THREE.Group();
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.radius, 48, 48),
        new THREE.MeshStandardMaterial({ color: p.fallback, roughness: 1, metalness: 0 }),
      );
      group.add(mesh);
      hoverTargets.push({ mesh, label: p.label });

      const tex = loader.load(`/textures/${p.name}.jpg`, (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        const m = mesh.material as THREE.MeshStandardMaterial;
        m.map = t;
        m.color.set(0xffffff);
        m.needsUpdate = true;
      });
      textures.push(tex);

      if (p.ring) {
        const ring = new THREE.Mesh(
          makeRingGeometry(p.radius * 1.4, p.radius * 2.3),
          new THREE.MeshBasicMaterial({ color: 0xd9c07a, side: THREE.DoubleSide, transparent: true, opacity: 0.8, depthWrite: false }),
        );
        ring.rotation.x = Math.PI / 2.2;
        const ringTex = loader.load('/textures/saturn_ring.png', (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          const m = ring.material as THREE.MeshBasicMaterial;
          m.map = t;
          m.color.set(0xffffff);
          m.needsUpdate = true;
        });
        textures.push(ringTex);
        group.add(ring);
      }

      if (p.atmosphere) {
        group.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(p.radius * 1.15, 48, 48),
            new THREE.ShaderMaterial({ vertexShader: ATMOSPHERE_VERT, fragmentShader: ATMOSPHERE_FRAG, side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }),
          ),
        );
      }

      const orbitPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        orbitPts.push(new THREE.Vector3(Math.cos(a) * p.distance, 0, Math.sin(a) * p.distance));
      }
      scene.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(orbitPts),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 }),
        ),
      );

      group.rotation.x = p.tilt;
      scene.add(group);
      return { group, mesh, p, angle: Math.random() * Math.PI * 2 };
    });

    // --- Orbit controls (spherical: theta=azimuth, phi=elevation, radius=zoom) ---
    let theta = 0;
    let phi = 1.2;
    let radius = 6.2;
    let targetTheta = 0;
    let targetPhi = 1.2;
    let targetRadius = 6.2;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const worldPos = new THREE.Vector3();

    const updateTooltip = (clientX: number, clientY: number) => {
      const rect = mount.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        tooltip.style.opacity = '0';
        return;
      }
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(
        hoverTargets.map((t) => t.mesh),
        false,
      );
      if (hits.length > 0) {
        const entry = hoverTargets.find((t) => t.mesh === hits[0].object);
        if (entry) {
          entry.mesh.getWorldPosition(worldPos).project(camera);
          const wrapRect = wrapper.getBoundingClientRect();
          tooltip.textContent = entry.label;
          tooltip.style.left = `${(worldPos.x * 0.5 + 0.5) * wrapRect.width}px`;
          tooltip.style.top = `${(-worldPos.y * 0.5 + 0.5) * wrapRect.height}px`;
          tooltip.style.opacity = '1';
          return;
        }
      }
      tooltip.style.opacity = '0';
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        targetTheta += (e.clientX - lastX) * 0.005;
        targetPhi = clamp(targetPhi + (e.clientY - lastY) * 0.005, 0.25, Math.PI - 0.25);
        lastX = e.clientX;
        lastY = e.clientY;
        tooltip.style.opacity = '0';
      } else {
        updateTooltip(e.clientX, e.clientY);
      }
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      // Only Ctrl (or Cmd on macOS) + wheel zooms the system; a plain wheel
      // scrolls the page normally so the hero never traps the user's scroll.
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      targetRadius = clamp(targetRadius + e.deltaY * 0.006, 3.2, 12);
    };

    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('wheel', onWheel, { passive: false });

    // --- Resize ---
    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    // --- Animation loop ---
    const clock = new THREE.Clock();
    let raf = 0;
    let elapsed = 0;

    const tick = () => {
      const delta = reducedMotion ? 0 : Math.min(clock.getDelta(), 0.1);
      elapsed += delta;

      theta += (targetTheta - theta) * 0.08;
      phi += (targetPhi - phi) * 0.08;
      radius += (targetRadius - radius) * 0.1;
      camera.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta),
      );
      camera.lookAt(0, 0, 0);

      stars.rotation.y += delta * 0.008;
      stars.rotation.x += delta * 0.003;

      for (const o of orbiters) {
        o.angle += o.p.speed * delta * 0.55;
        o.group.position.set(Math.cos(o.angle) * o.p.distance, 0, Math.sin(o.angle) * o.p.distance);
        o.mesh.rotation.y += delta * o.p.speed * 0.3;
      }

      const pulse = 7 + Math.sin(elapsed * 0.9) * 0.3;
      corona.scale.set(pulse, pulse, 1);

      composer.render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('wheel', onWheel);
      textures.forEach((t) => t.dispose());
      scene.traverse((obj) => {
        const anyObj = obj as THREE.Mesh;
        if (anyObj.geometry) anyObj.geometry.dispose();
        const mat = anyObj.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          transform: 'translate(-50%, -150%)',
          padding: '4px 14px',
          borderRadius: '999px',
          background: 'rgba(10, 14, 30, 0.82)',
          color: '#fff',
          fontSize: '13px',
          lineHeight: '1.5',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.16)',
          backdropFilter: 'blur(6px)',
          opacity: 0,
          transition: 'opacity 0.15s ease',
          zIndex: 10,
        }}
      />
    </div>
  );
}
