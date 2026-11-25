// Motor 3D da WF: busto procedural + corrente/pingente gerados a partir de um "spec".
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const V3 = THREE.Vector3;

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    const lose = gl.getExtension('WEBGL_lose_context'); lose && lose.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(name);
  } catch (e) { return false; }
}

// Espessuras e tipos de elo
const THICK = {
  fino: { R: 0.02, tube: 0.006 },
  medio: { R: 0.03, tube: 0.0095 },
  grosso: { R: 0.046, tube: 0.0155 },
};
const CHAINS = {
  cadeado: { sx: 1.42 },
  cartier: { sx: 2.3 },
  grumet: { sx: 1.3, flat: true, tilt: 0.5, pitch: 0.62 },
  piastrine: { sx: 1.75, flat: true, tilt: 0.12, pitch: 0.82 },
  box: { sx: 1.0, square: true },
};

// ---------- formas 2D ----------
function rr(w, h, r, cx = 0, cy = 0, Cls = THREE.Shape) {
  const s = new Cls(), x = cx - w / 2, y = cy - h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function crossPts(cx, cy, h) {
  const v = 0.1 * h, a = 0.32 * h, t1 = cy + 0.3 * h, t2 = cy + 0.12 * h, top = cy + h / 2, bot = cy - h / 2;
  return [[-v, top], [v, top], [v, t1], [a, t1], [a, t2], [v, t2], [v, bot], [-v, bot], [-v, t2], [-a, t2], [-a, t1], [-v, t1]]
    .map(([x, y]) => new THREE.Vector2(cx + x, y));
}
const fromPts = (pts, Cls = THREE.Shape) => new Cls(pts);
function ellipse(cx, cy, rx, ry, Cls = THREE.Shape) { const s = new Cls(); s.absellipse(cx, cy, rx, ry, 0, Math.PI * 2, false, 0); return s; }
function heart(cx, cy, w, Cls = THREE.Shape) {
  const k = w / 22, P = (x, y) => [cx + (x - 5) * k, cy - (y - 9.5) * k];
  const s = new Cls();
  s.moveTo(...P(5, 5));
  s.bezierCurveTo(...P(5, 5), ...P(4, 0), ...P(0, 0));
  s.bezierCurveTo(...P(-6, 0), ...P(-6, 7), ...P(-6, 7));
  s.bezierCurveTo(...P(-6, 11), ...P(-3, 15.4), ...P(5, 19));
  s.bezierCurveTo(...P(12, 15.4), ...P(16, 11), ...P(16, 7));
  s.bezierCurveTo(...P(16, 7), ...P(16, 0), ...P(10, 0));
  s.bezierCurveTo(...P(7, 0), ...P(5, 5), ...P(5, 5));
  return s;
}
function figure(cx, cy, k) { // silhueta de santa com manto
  const s = new THREE.Shape(), P = (x, y) => [cx + x * k, cy + y * k];
  s.moveTo(...P(0, 0.2)); s.quadraticCurveTo(...P(0.09, 0.19), ...P(0.08, 0.08));
  s.lineTo(...P(0.17, -0.26)); s.quadraticCurveTo(...P(0, -0.32), ...P(-0.17, -0.26));
  s.lineTo(...P(-0.08, 0.08)); s.quadraticCurveTo(...P(-0.09, 0.19), ...P(0, 0.2));
  return s;
}
function shield(Cls = THREE.Shape) {
  const s = new Cls();
  s.moveTo(-0.3, -0.12); s.lineTo(0.3, -0.12); s.lineTo(0.3, -0.5);
  s.quadraticCurveTo(0.3, -0.8, 0, -0.95); s.quadraticCurveTo(-0.3, -0.8, -0.3, -0.5); s.lineTo(-0.3, -0.12);
  return s;
}
function cloverShape(r, d) {
  const s = new THREE.Shape(), t = (d + Math.sqrt(2 * r * r - d * d)) / 2, th = Math.atan2(t, t - d);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; s.absarc(d * Math.cos(a), d * Math.sin(a), r, a - th, a + th, false); }
  return s;
}
const ext = (shape, depth, bevel = 0.015) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 28 });

function grainTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  x.fillStyle = '#7a7a7a'; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    const y = Math.random() * 512, v = Math.random() > 0.5 ? 255 : 0;
    x.strokeStyle = `rgba(${v},${v},${v},${0.04 + Math.random() * 0.12})`; x.lineWidth = 0.5 + Math.random() * 2.2;
    x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(170, y + (Math.random() - 0.5) * 6, 340, y + (Math.random() - 0.5) * 6, 512, y + (Math.random() - 0.5) * 3); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 5); return t;
}

export class JewelryStage {
  constructor(host, { mode = 'orbit', gold = '#f0c46c' } = {}) {
    this.host = host; this.mode = mode;
    this.mobile = Math.min(innerWidth, innerHeight) < 700 || matchMedia('(pointer:coarse)').matches;
    this.S = { rotY: -0.35, gx: 1.15, cx: 0, cy: 0.35, cz: 9.2, tx: 0, ty: -0.15, tz: 0, la: 0.55 };
    this.I = { dolly: 0, light: 1, rise: 0, jy: 0 };
    this.mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    this._drapes = {};

    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio, this.mobile ? 1 : 1.75)); r.setSize(w, h);
    r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = !this.mobile; r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:' + (mode === 'orbit' ? 'none' : 'auto');
    host.appendChild(r.domElement); this.renderer = r;

    const scene = new THREE.Scene(); this.scene = scene;
    if (mode === 'hero') scene.fog = new THREE.Fog(0x090909, 13, 28);
    this.camera = new THREE.PerspectiveCamera(30, w / h, 0.05, 60);

    // ambiente de estúdio procedural
    const pm = new THREE.PMREMGenerator(r), es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshBasicMaterial({ color: 0x040404, side: THREE.BackSide })));
    const soft = (sw, sh, col, k, p) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(...p); m.lookAt(0, 0, 0); es.add(m); };
    soft(8, 5, '#fff0d6', 8, [6, 5, 8]); soft(2, 12, '#ffffff', 5, [-9, 2, 3]); soft(14, 2, '#ffdcaa', 3, [0, 10, -4]);
    soft(6, 6, '#d6bc83', 1.2, [0, -7, 8]); soft(3, 9, '#ffffff', 3, [8, 0, -6]); soft(1.5, 10, '#22e4f2', 6, [-8, 1, -5]);
    scene.environment = pm.fromScene(es, 0.03).texture; pm.dispose();

    const key = new THREE.SpotLight(0xffe6c0, 320, 40, 0.42, 0.7, 2);
    key.castShadow = !this.mobile; key.shadow.mapSize.set(this.mobile ? 512 : 1024, this.mobile ? 512 : 1024); key.shadow.bias = -0.0002; key.shadow.radius = 6;
    key.position.set(Math.sin(0.55) * 9, 7.5, Math.cos(0.55) * 9); key.target.position.set(0, -0.2, 0);
    scene.add(key, key.target); this.key = key;
    const rim = new THREE.DirectionalLight(0xd6bc83, 2.0); rim.position.set(6, 5, -7); scene.add(rim);
    const cyan = new THREE.SpotLight(0x22e4f2, 700, 40, 0.5, 0.8, 2); cyan.position.set(-7, 3, -6); scene.add(cyan, cyan.target); this.cyan = cyan;
    scene.add(new THREE.HemisphereLight(0x2a241a, 0x000000, mode === 'orbit' ? 1.2 : 0.5));
    if (mode === 'orbit') { const fill = new THREE.DirectionalLight(0xfff3df, 1.4); fill.position.set(-2, 3, 8); scene.add(fill); }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.55 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.2; floor.receiveShadow = true; scene.add(floor);

    this.rig = new THREE.Group(); scene.add(this.rig);
    this.jewelSlot = new THREE.Group();
    this.gold = new THREE.MeshPhysicalMaterial({ color: gold, metalness: 1, roughness: 0.19, envMapIntensity: 1.35 });
    this.goldMatte = new THREE.MeshPhysicalMaterial({ color: '#e2b660', metalness: 1, roughness: 0.42, envMapIntensity: 1.2 });
    this.dark = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0c, metalness: 0.2, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 });
    this.relief = new THREE.MeshStandardMaterial({ color: 0x3a2a16, metalness: 0.7, roughness: 0.85 });
    this.bust = this.buildBust(); this.rig.add(this.bust, this.jewelSlot);

    if (mode === 'orbit') {
      this.controls = new OrbitControls(this.camera, r.domElement);
      Object.assign(this.controls, { enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 2.2, maxDistance: 10, minPolarAngle: 0.7, maxPolarAngle: 2.05, autoRotate: !this.mobile, autoRotateSpeed: 1.4, rotateSpeed: this.mobile ? 0.7 : 1 });
      this.controls.addEventListener('start', () => { this.controls.autoRotate = false; });
      this.controls.addEventListener('change', () => { this._force = true; });
    }

    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(host);
    this.visible = true;
    this.io = new IntersectionObserver(([en]) => { this.visible = en.isIntersecting; }); this.io.observe(host);
    this.onMove = e => { this.mouse.x = e.clientX / innerWidth * 2 - 1; this.mouse.y = e.clientY / innerHeight * 2 - 1; };
    if (mode === 'hero' && !this.mobile) window.addEventListener('pointermove', this.onMove);
    this.loop();
  }

  resize() {
    if (!this.renderer) return;
    const W = this.host.clientWidth || 1, H = this.host.clientHeight || 1;
    this.renderer.setSize(W, H); this.camera.aspect = W / H; this.camera.updateProjectionMatrix(); this._force = true;
  }

  buildBust() {
    const P = [[0, -2.2], [0.62, -2.2], [0.68, -2.1], [0.72, -1.6], [0.8, -0.8], [0.9, 0.1], [0.97, 0.7], [0.99, 0.94], [0.93, 1.08], [0.78, 1.17], [0.6, 1.22], [0.53, 1.28], [0.52, 1.4], [0.52, 1.6], [0.52, 1.8], [0.51, 1.87], [0.46, 1.9], [0.25, 1.905], [0, 1.905]];
    const pts = new THREE.SplineCurve(P.map(p => new THREE.Vector2(p[0], p[1]))).getPoints(this.mobile ? 60 : 110);
    const g = new THREE.LatheGeometry(pts, this.mobile ? 56 : 104, Math.PI, Math.PI * 2);
    const pos = g.attributes.position, ss = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i); let z = pos.getZ(i);
      z *= 0.44 + 0.56 * ss(1.14, 1.34, y);
      if (z > 0 && y < 1.2) z += 0.05 * Math.exp(-((y - 0.35) ** 2) / 0.9) * Math.max(0, 1 - x * x);
      pos.setZ(i, z);
    }
    g.computeVertexNormals();
    const grain = grainTexture();
    const mat = new THREE.MeshStandardMaterial({ color: 0x0b0b0b, roughness: 0.78, metalness: 0, bumpMap: grain, bumpScale: 1.4, roughnessMap: grain, envMapIntensity: 0.55 });
    const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true;
    return m;
  }

  drape(off) {
    const key = off.toFixed(4); if (this._drapes[key]) return this._drapes[key];
    const rig = this.rig, sp = rig.position.clone(), sr = rig.rotation.clone(), jy = this.jewelSlot.position.y;
    rig.position.set(0, 0, 0); rig.rotation.set(0, 0, 0); this.jewelSlot.position.y = 0; rig.updateMatrixWorld(true);
    const rc = new THREE.Raycaster();
    const hit = (o, d) => { rc.set(o, d.normalize()); const h = rc.intersectObject(this.bust, false)[0]; if (!h) return null; const n = h.face.normal.clone().transformDirection(h.object.matrixWorld); return h.point.clone().addScaledVector(n, off); };
    const ctrl = [[0.55, 1.22], [0.6, 0.7], [0.58, -0.1], [0.47, -0.9], [0.27, -1.48], [0, -1.62]];
    const half = new THREE.SplineCurve(ctrl.map(p => new THREE.Vector2(p[0], p[1]))).getPoints(36);
    const front = [...half, ...half.slice(0, -1).reverse().map(v => new THREE.Vector2(-v.x, v.y))];
    const out = [];
    front.forEach(v => { const p = hit(new V3(v.x, v.y, 6), new V3(0, 0, -1)); if (p) out.push(p); });
    let fl = 0; for (let i = 1; i < out.length; i++) fl += out[i].distanceTo(out[i - 1]);
    for (let k = 1; k < 24; k++) {
      const a = Math.PI * 1.5 - (k / 24) * Math.PI;
      const p = hit(new V3(Math.sin(a) * 6, 1.27, Math.cos(a) * 6), new V3(-Math.sin(a), 0, -Math.cos(a))); if (p) out.push(p);
    }
    const curve = new THREE.CatmullRomCurve3(out, true, 'centripetal');
    rig.position.copy(sp); rig.rotation.copy(sr); this.jewelSlot.position.y = jy; rig.updateMatrixWorld(true);
    return (this._drapes[key] = { curve, frontFrac: fl / curve.getLength() });
  }
  frame(curve, u, tan, nrm) {
    const p = curve.getPointAt(u); curve.getTangentAt(u, tan);
    nrm.set(p.x * 0.35, 0, p.z).normalize(); nrm.addScaledVector(tan, -nrm.dot(tan)).normalize();
    return p;
  }

  links(curve, type, th) {
    const c = CHAINS[type] || CHAINS.cadeado, { R, tube } = THICK[th] || THICK.medio;
    const step = (2 * R * c.sx - 2 * tube) * (c.pitch || 1);
    let n = Math.floor(curve.getLength() / step); if (n % 2) n--;
    const seg = c.square ? [6, 4] : (this.mobile ? [8, 18] : [10, 24]);
    const geo = new THREE.TorusGeometry(R, tube, seg[0], seg[1]);
    if (c.square) geo.rotateZ(Math.PI / 4);
    geo.scale(c.sx, 1, 1);
    const inst = new THREE.InstancedMesh(geo, this.gold, n); inst.castShadow = true;
    const m = new THREE.Matrix4(), tan = new V3(), nrm = new V3(), b = new V3(), q = new THREE.Quaternion();
    for (let i = 0; i < n; i++) {
      const p = this.frame(curve, i / n, tan, nrm);
      if (c.flat) {
        q.setFromAxisAngle(tan, (i % 2 ? 1 : -1) * c.tilt); const n2 = nrm.clone().applyQuaternion(q);
        b.crossVectors(n2, tan); m.makeBasis(tan, b, n2);
      } else {
        b.crossVectors(tan, nrm);
        if (i % 2) m.makeBasis(tan, nrm, b); else m.makeBasis(tan, b, nrm.clone().negate());
      }
      m.setPosition(p); inst.setMatrixAt(i, m);
    }
    inst.instanceMatrix.needsUpdate = true; return inst;
  }

  orient(obj, curve, u, out) {
    const tan = new V3(), nrm = new V3(), p = this.frame(curve, u, tan, nrm);
    const up = new V3(0, 1, 0).addScaledVector(nrm, -nrm.y).normalize(), xa = new V3().crossVectors(up, nrm);
    obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xa, up, nrm));
    obj.position.copy(p).addScaledVector(nrm, out);
  }

  buildPendant(spec) {
    const g = new THREE.Group(), gold = spec.matte ? this.goldMatte : this.gold;
    const add = (geo, mat, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.z = z; m.castShadow = true; g.add(m); return m; };
    const bail = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.024, 10, 24), gold);
    bail.rotation.y = Math.PI / 2; bail.position.set(0, -0.03, 0.03); g.add(bail);
    switch (spec.pendant) {
      case 'cruz': add(ext(fromPts(crossPts(0, -0.62, 1.0)), 0.07), gold); break;
      case 'placa-cruz':
        add(ext(rr(0.5, 0.68, 0.05, 0, -0.45), 0.05), gold);
        add(ext(rr(0.4, 0.58, 0.035, 0, -0.45), 0.01, 0.005), this.dark, 0.06);
        add(ext(fromPts(crossPts(0, -0.45, 0.42)), 0.012, 0.006), gold, 0.072);
        break;
      case 'placa':
        add(ext(rr(0.5, 0.66, 0.05, 0, -0.44), 0.05), gold);
        add(ext(rr(0.4, 0.56, 0.035, 0, -0.44), 0.012, 0.008), this.relief, 0.058);
        break;
      case 'medalha-oval': {
        add(ext(ellipse(0, -0.56, 0.34, 0.46), 0.05), gold);
        const ring = ellipse(0, -0.56, 0.31, 0.43); ring.holes.push(ellipse(0, -0.56, 0.27, 0.39, THREE.Path));
        add(ext(ring, 0.015, 0.006), gold, 0.062);
        add(ext(figure(0, -0.52, 1.25), 0.02, 0.008), gold, 0.062);
        break;
      }
      case 'medalha-cruz': {
        const s = ellipse(0, -0.45, 0.27, 0.35); s.holes.push(fromPts(crossPts(0, -0.45, 0.46), THREE.Path));
        add(ext(s, 0.05), gold);
        break;
      }
      case 'coracao': {
        const s = heart(0, -0.5, 0.78); s.holes.push(heart(0, -0.5, 0.64, THREE.Path));
        add(ext(s, 0.05), gold);
        add(ext(heart(0, -0.5, 0.66), 0.02, 0.006), this.dark, 0.01);
        if (spec.figure) add(ext(figure(0, -0.48, 1.05), 0.02, 0.008), gold, 0.04);
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), gold); drop.position.set(0, -0.93, 0.03); g.add(drop);
        break;
      }
      case 'escudo': {
        add(ext(shield(), 0.05), gold);
        for (let i = 0; i < 4; i++) {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(0.5 - i * 0.06, 0.04, 0.02), this.goldMatte);
          bar.position.set(0, -0.42 - i * 0.1, 0.075); g.add(bar);
        }
        add(ext(rr(0.18, 0.16, 0.02, -0.16, -0.24), 0.01, 0.005), this.goldMatte, 0.065);
        break;
      }
      default: break;
    }
    return g;
  }

  buildClovers(curve, frontFrac, hex) {
    const g = new THREE.Group();
    const bez = new THREE.ExtrudeGeometry(cloverShape(1, 0.75), { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 18 });
    const ena = new THREE.ExtrudeGeometry(cloverShape(0.8, 0.6), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 18 });
    ena.translate(0, 0, 0.3);
    const enamel = new THREE.MeshPhysicalMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.12, roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, iridescence: 0.35, envMapIntensity: 1.1 });
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach(f => {
      const c = new THREE.Group(), a = new THREE.Mesh(bez, this.gold), b = new THREE.Mesh(ena, enamel);
      a.castShadow = b.castShadow = true; c.add(a, b); c.scale.setScalar(0.068);
      this.orient(c, curve, f * frontFrac, 0.012); g.add(c);
    });
    return g;
  }

  setSpec(spec) {
    const slot = this.jewelSlot;
    slot.children.slice().forEach(o => { slot.remove(o); o.traverse(m => { if (m.geometry) m.geometry.dispose(); }); });
    const c = CHAINS[spec.chain] || CHAINS.cadeado, { R, tube } = THICK[spec.thickness] || THICK.medio;
    const off = c.flat ? tube + 0.008 : R + tube + 0.004;
    const { curve, frontFrac } = this.drape(off);
    const g = new THREE.Group();
    g.add(this.links(curve, spec.chain, spec.thickness));
    if (spec.clover) g.add(this.buildClovers(curve, frontFrac, spec.clover));
    if (spec.pendant) { const p = this.buildPendant(spec); p.scale.setScalar(spec.pendantScale || 0.42); this.orient(p, curve, frontFrac * 0.5, 0.035); g.add(p); }
    slot.add(g);
    if (spec.accent) this.cyan.color.set(spec.accent);
    if (this.controls) {
      const focus = spec.pendant ? { y: -1.05, d: 4.6 } : { y: -0.15, d: 7.2 };
      this.controls.target.set(0, focus.y, 0);
      this.camera.position.set(1.2, focus.y + 0.6, focus.d);
      this.controls.update();
    }
    this._force = true;
  }

  loop = () => {
    if (this.dead) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!this.visible || !this.renderer || document.hidden) return;
    if (this.controls) {
      // Renderiza só quando algo muda (economiza bateria e evita travar no celular)
      this.rig.rotation.y = 0; const moved = this.controls.update();
      if (!moved && !this._force && !this.controls.autoRotate) return; this._force = false;
      this.renderer.render(this.scene, this.camera); return;
    }
    const S = this.S, I = this.I, M = this.mouse;
    M.sx += (M.x - M.sx) * 0.05; M.sy += (M.y - M.sy) * 0.05;
    const asp = this.camera.aspect, narrow = asp < 0.9, k = narrow ? 1.55 : 1;
    this.rig.position.set(S.gx * (narrow ? 0.12 : 1), I.rise, 0); this.jewelSlot.position.y = I.jy;
    this.rig.rotation.y = S.rotY + M.sx * 0.07;
    const { tx, ty, tz } = S;
    this.camera.position.set(tx + (S.cx - tx) * k + M.sx * 0.25, ty + (S.cy - ty) * k - M.sy * 0.15, tz + (S.cz - tz) * k + I.dolly);
    this.camera.lookAt(tx, ty, tz);
    this.key.position.set(Math.sin(S.la) * 9, 7.5, Math.cos(S.la) * 9);
    this.key.intensity = 320 * I.light;
    const sig = [S.rotY, S.gx, S.cx, S.cy, S.cz, S.tx, S.ty, S.tz, S.la, I.dolly, I.light, I.rise, I.jy, M.sx, M.sy, asp].map(v => v.toFixed(4)).join();
    if (sig === this._sig && !this._force) return;
    this._sig = sig; this._force = false;
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.dead = true; cancelAnimationFrame(this.raf);
    this.ro.disconnect(); this.io.disconnect();
    window.removeEventListener('pointermove', this.onMove);
    if (this.controls) this.controls.dispose();
    this.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    this.renderer.dispose(); this.renderer.domElement.remove(); this.renderer = null;
  }
}
