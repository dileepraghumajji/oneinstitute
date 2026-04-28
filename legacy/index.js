import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(12, 8, 12);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);

// Post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.6, 0.4, 0.85
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 8;
controls.maxDistance = 25;
controls.maxPolarAngle = Math.PI / 2.1;
controls.target.set(0, 1.5, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;

// Colors
const ORANGE = 0xFF5300;
const WHITE = 0xFFFFFF;
const BLACK = 0x111111;
const CHARCOAL = 0x1a1a1a;

// Materials
const orangeMat = new THREE.MeshStandardMaterial({ color: ORANGE, roughness: 0.3, metalness: 0.1 });
const whiteMat = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.4, metalness: 0.0 });
const blackMat = new THREE.MeshStandardMaterial({ color: BLACK, roughness: 0.2, metalness: 0.5 });
const charcoalMat = new THREE.MeshStandardMaterial({ color: CHARCOAL, roughness: 0.3, metalness: 0.4 });
const orangeEmissive = new THREE.MeshStandardMaterial({
  color: ORANGE, emissive: ORANGE, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.0
});
const orangeEmissiveDim = new THREE.MeshStandardMaterial({
  color: ORANGE, emissive: ORANGE, emissiveIntensity: 1.0, roughness: 0.2, metalness: 0.0
});

// ==================== PLATFORM BASE ====================
const platformGroup = new THREE.Group();
platformGroup.name = 'platformGroup';

// Main black platform
const platformGeo = new THREE.BoxGeometry(10, 1.2, 10);
const platform = new THREE.Mesh(platformGeo, blackMat);
platform.name = 'platformBase';
platform.position.y = 0.6;
platform.castShadow = true;
platform.receiveShadow = true;
platformGroup.add(platform);

// Platform top trim (thin orange border)
const trimGeo = new THREE.BoxGeometry(10.05, 0.04, 10.05);
const platformTrim = new THREE.Mesh(trimGeo, orangeEmissiveDim);
platformTrim.name = 'platformTrim';
platformTrim.position.y = 1.22;
platformGroup.add(platformTrim);

// LED glow strips on the platform sides
function createLedStrip(width, position, rotation) {
  const stripGeo = new THREE.BoxGeometry(width, 0.05, 0.08);
  const strip = new THREE.Mesh(stripGeo, orangeEmissive);
  strip.position.copy(position);
  if (rotation) strip.rotation.copy(rotation);
  strip.name = 'ledStrip_' + Math.random().toString(36).substr(2, 5);
  return strip;
}

// Front/back LED strips (3 rows on each face)
for (let side = 0; side < 4; side++) {
  for (let row = 0; row < 3; row++) {
    const y = 0.25 + row * 0.35;
    const offset = 5.03;
    let pos, rot;
    if (side === 0) { pos = new THREE.Vector3(0, y, offset); rot = new THREE.Euler(0, 0, 0); }
    else if (side === 1) { pos = new THREE.Vector3(0, y, -offset); rot = new THREE.Euler(0, 0, 0); }
    else if (side === 2) { pos = new THREE.Vector3(offset, y, 0); rot = new THREE.Euler(0, Math.PI / 2, 0); }
    else { pos = new THREE.Vector3(-offset, y, 0); rot = new THREE.Euler(0, Math.PI / 2, 0); }
    platformGroup.add(createLedStrip(9.2, pos, rot));
  }
}

// Steps on one side
for (let i = 0; i < 3; i++) {
  const stepGeo = new THREE.BoxGeometry(2.5, 0.25, 0.8);
  const step = new THREE.Mesh(stepGeo, charcoalMat);
  step.name = 'step_' + i;
  step.position.set(0, 0.12 + i * 0.35, 5.4 + (2 - i) * 0.8);
  step.receiveShadow = true;
  platformGroup.add(step);

  // Step LED
  const stepLedGeo = new THREE.BoxGeometry(2.3, 0.03, 0.04);
  const stepLed = new THREE.Mesh(stepLedGeo, orangeEmissive);
  stepLed.name = 'stepLed_' + i;
  stepLed.position.set(0, 0.25 + i * 0.35, 5.4 + (2 - i) * 0.8 + 0.38);
  platformGroup.add(stepLed);
}

scene.add(platformGroup);

// ==================== RING SURFACE ====================
const ringGroup = new THREE.Group();
ringGroup.name = 'ringGroup';

// White mat surface
const matGeo = new THREE.BoxGeometry(8.5, 0.12, 8.5);
const matMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6, metalness: 0.0 });
const ringMat = new THREE.Mesh(matGeo, matMaterial);
ringMat.name = 'ringSurface';
ringMat.position.y = 1.32;
ringMat.receiveShadow = true;
ringGroup.add(ringMat);

// Orange "M" logo on center of mat using canvas texture
const logoCanvas = document.createElement('canvas');
logoCanvas.width = 512;
logoCanvas.height = 512;
const ctx = logoCanvas.getContext('2d');
ctx.fillStyle = '#f0f0f0';
ctx.fillRect(0, 0, 512, 512);

// Draw stylized "M" logo
ctx.fillStyle = '#FF5300';
ctx.globalAlpha = 0.5;
ctx.beginPath();
ctx.moveTo(160, 360);
ctx.lineTo(200, 140);
ctx.lineTo(256, 260);
ctx.lineTo(312, 140);
ctx.lineTo(352, 360);
ctx.lineTo(310, 360);
ctx.lineTo(290, 220);
ctx.lineTo(256, 310);
ctx.lineTo(222, 220);
ctx.lineTo(202, 360);
ctx.closePath();
ctx.fill();

// Draw an overlapping arrow/triangle
ctx.beginPath();
ctx.moveTo(190, 350);
ctx.lineTo(256, 150);
ctx.lineTo(322, 350);
ctx.lineTo(280, 280);
ctx.lineTo(256, 320);
ctx.lineTo(232, 280);
ctx.closePath();
ctx.fill();
ctx.globalAlpha = 1.0;

const logoTexture = new THREE.CanvasTexture(logoCanvas);
const logoMatGeo = new THREE.PlaneGeometry(4, 4);
const logoMaterial = new THREE.MeshStandardMaterial({
  map: logoTexture, roughness: 0.6, metalness: 0.0, transparent: true
});
const logoMesh = new THREE.Mesh(logoMatGeo, logoMaterial);
logoMesh.name = 'centerLogo';
logoMesh.rotation.x = -Math.PI / 2;
logoMesh.position.y = 1.39;
ringGroup.add(logoMesh);

scene.add(ringGroup);

// ==================== CORNER POSTS ====================
const postsGroup = new THREE.Group();
postsGroup.name = 'postsGroup';

const postPositions = [
  { x: -3.9, z: -3.9 },
  { x: 3.9, z: -3.9 },
  { x: 3.9, z: 3.9 },
  { x: -3.9, z: 3.9 }
];

postPositions.forEach((pos, i) => {
  // Main post cylinder
  const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16);
  const post = new THREE.Mesh(postGeo, whiteMat);
  post.name = 'cornerPost_' + i;
  post.position.set(pos.x, 2.8, pos.z);
  post.castShadow = true;
  postsGroup.add(post);

  // Post base (black)
  const baseGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.3, 16);
  const base = new THREE.Mesh(baseGeo, charcoalMat);
  base.name = 'postBase_' + i;
  base.position.set(pos.x, 1.35, pos.z);
  postsGroup.add(base);

  // Post cap (orange)
  const capGeo = new THREE.CylinderGeometry(0.06, 0.14, 0.2, 16);
  const cap = new THREE.Mesh(capGeo, orangeMat);
  cap.name = 'postCap_' + i;
  cap.position.set(pos.x, 4.5, pos.z);
  postsGroup.add(cap);

  // Turnbuckle pads
  const padGeo = new THREE.BoxGeometry(0.3, 2.4, 0.3);
  const isOrange = (i === 0 || i === 2);
  const padMat = isOrange ? orangeMat : whiteMat;
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.name = 'turnbucklePad_' + i;
  pad.position.set(pos.x, 2.8, pos.z);
  postsGroup.add(pad);
});

scene.add(postsGroup);

// ==================== ROPES ====================
const ropesGroup = new THREE.Group();
ropesGroup.name = 'ropesGroup';

const ropeHeights = [1.9, 2.6, 3.3, 4.0];
const ropeColors = [orangeMat, whiteMat, orangeMat, whiteMat];

function createRopeBetween(start, end, material, name) {
  const dir = new THREE.Vector3().subVectors(end, start);
  const length = dir.length();
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Slight sag curve using a TubeGeometry
  const sagAmount = 0.06;
  const points = [];
  for (let t = 0; t <= 1; t += 0.05) {
    const p = new THREE.Vector3().lerpVectors(start, end, t);
    p.y -= Math.sin(t * Math.PI) * sagAmount;
    points.push(p);
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.035, 8, false);
  const rope = new THREE.Mesh(tubeGeo, material);
  rope.name = name;
  rope.castShadow = true;
  return rope;
}

const corners = postPositions.map(p => new THREE.Vector3(p.x, 0, p.z));

ropeHeights.forEach((h, ri) => {
  for (let ci = 0; ci < 4; ci++) {
    const c1 = corners[ci];
    const c2 = corners[(ci + 1) % 4];
    const start = new THREE.Vector3(c1.x, h, c1.z);
    const end = new THREE.Vector3(c2.x, h, c2.z);
    const rope = createRopeBetween(start, end, ropeColors[ri], `rope_${ri}_${ci}`);
    ropesGroup.add(rope);
  }
});

scene.add(ropesGroup);

// ==================== TEXT ON PLATFORM ====================
// "FIGHT. FOCUS. WIN." text using canvas
const textCanvas = document.createElement('canvas');
textCanvas.width = 2048;
textCanvas.height = 256;
const tctx = textCanvas.getContext('2d');
tctx.fillStyle = '#111111';
tctx.fillRect(0, 0, 2048, 256);

tctx.fillStyle = '#FFFFFF';
tctx.font = 'bold 100px Arial, sans-serif';
tctx.textAlign = 'center';
tctx.textBaseline = 'middle';
tctx.letterSpacing = '12px';
tctx.fillText('FIGHT.  FOCUS.  WIN.', 1024, 128);

const textTexture = new THREE.CanvasTexture(textCanvas);
const textPlaneGeo = new THREE.PlaneGeometry(8, 1);
const textPlaneMat = new THREE.MeshStandardMaterial({
  map: textTexture, roughness: 0.4, metalness: 0.2, transparent: true
});
const textPlane = new THREE.Mesh(textPlaneGeo, textPlaneMat);
textPlane.name = 'fightFocusWinText';
textPlane.position.set(0, 0.6, 5.03);
scene.add(textPlane);

// Back side text/logo
const backCanvas = document.createElement('canvas');
backCanvas.width = 512;
backCanvas.height = 256;
const bctx = backCanvas.getContext('2d');
bctx.fillStyle = '#111111';
bctx.fillRect(0, 0, 512, 256);
bctx.fillStyle = '#FF5300';
bctx.font = 'bold 120px Arial, sans-serif';
bctx.textAlign = 'center';
bctx.textBaseline = 'middle';
bctx.fillText('M', 256, 128);
const backTexture = new THREE.CanvasTexture(backCanvas);
const backPlaneGeo = new THREE.PlaneGeometry(2, 1);
const backPlaneMat = new THREE.MeshStandardMaterial({
  map: backTexture, roughness: 0.4, metalness: 0.2
});
const backPlane = new THREE.Mesh(backPlaneGeo, backPlaneMat);
backPlane.name = 'backLogo';
backPlane.position.set(3.5, 0.6, 5.03);
scene.add(backPlane);

// ==================== LIGHTING ====================
// Dramatic studio lighting
const ambientLight = new THREE.AmbientLight(0x111111, 0.5);
ambientLight.name = 'ambientLight';
scene.add(ambientLight);

// Key light (warm white from top-right)
const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
keyLight.name = 'keyLight';
keyLight.position.set(8, 15, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 40;
keyLight.shadow.camera.left = -12;
keyLight.shadow.camera.right = 12;
keyLight.shadow.camera.top = 12;
keyLight.shadow.camera.bottom = -12;
keyLight.shadow.bias = -0.001;
keyLight.shadow.normalBias = 0.02;
scene.add(keyLight);

// Fill light (orange tint from left)
const fillLight = new THREE.DirectionalLight(0xFF7733, 1.0);
fillLight.name = 'fillLight';
fillLight.position.set(-10, 8, -3);
scene.add(fillLight);

// Rim light (from behind)
const rimLight = new THREE.DirectionalLight(0xFF5300, 1.5);
rimLight.name = 'rimLight';
rimLight.position.set(0, 10, -10);
scene.add(rimLight);

// Point lights at corners for dramatic effect
const cornerLightPositions = [
  { x: -5, z: -5 }, { x: 5, z: -5 }, { x: 5, z: 5 }, { x: -5, z: 5 }
];
cornerLightPositions.forEach((pos, i) => {
  const pl = new THREE.PointLight(0xFF5300, 3, 10, 2);
  pl.name = 'cornerLight_' + i;
  pl.position.set(pos.x, 0.3, pos.z);
  scene.add(pl);
});

// Top spot light aimed at center
const spotLight = new THREE.SpotLight(0xFFFFFF, 4, 30, Math.PI / 6, 0.5, 1);
spotLight.name = 'spotLight';
spotLight.position.set(0, 15, 0);
spotLight.target.position.set(0, 1.3, 0);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(spotLight.target);

// ==================== GROUND ====================
const groundGeo = new THREE.PlaneGeometry(80, 80);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x050505, roughness: 0.95, metalness: 0.0
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.name = 'ground';
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ==================== ANIMATE ====================
let time = 0;

function animate() {
  time += 0.016;
  controls.update();

  // Subtle pulsing on LED strips
  const pulse = 1.5 + Math.sin(time * 2) * 1.0;
  orangeEmissive.emissiveIntensity = pulse;

  composer.render();
}

renderer.setAnimationLoop(animate);

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});