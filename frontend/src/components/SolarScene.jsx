import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { planetData } from '../data/planets';

export const BASE = process.env.PUBLIC_URL || '';
export const assets = (filename) => BASE + '/textures/' + filename;
export const planetTexture = (id) => assets('2k_' + (
  id === 'earth' ? 'earth_daymap' : id === 'venus' ? 'venus_surface' : id
) + '.jpg');
export const PLANET_KEYS = Object.keys(planetData);

function TexturedStars() {
  const map = useLoader(THREE.TextureLoader, assets('8k_stars_milky_way.jpg'));
  return <mesh>
    <sphereGeometry args={[420, 48, 32]} />
    <meshBasicMaterial map={map} side={THREE.BackSide} depthWrite={false} />
  </mesh>;
}

function SpaceBackdrop({ backgroundMode, quality }) {
  if (backgroundMode === 'off') return null;
  if (backgroundMode === 'texture' && quality !== 'low') {
    return <Suspense fallback={<Stars count={1800} factor={4} radius={200} fade />}>
      <TexturedStars />
    </Suspense>;
  }
  return <Stars radius={240} depth={100} count={quality === 'low' ? 650 : 2100}
    factor={3.4} saturation={0.18} fade />;
}

function AsteroidBelt({ speed, quality }) {
  const count = quality === 'low' ? 450 : quality === 'medium' ? 1000 : 1800;
  const ref = useRef();
  const mesh = useRef();
  const matrices = useMemo(() => {
    const data = [];
    let seed = 1305;
    const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = random() * Math.PI * 2;
      const d = 23 + random() * 4.2; // Between Mars and Jupiter in the visual model.
      const r = 0.035 + random() * 0.085;
      dummy.position.set(d * Math.cos(a), (random() - 0.5) * 1.2, d * Math.sin(a));
      dummy.rotation.set(random() * 3, random() * 3, random() * 3);
      dummy.scale.set(r, r * (0.7 + random() * 0.5), r);
      dummy.updateMatrix();
      data.push(dummy.matrix.clone());
    }
    return data;
  }, [count]);
  useEffect(() => {
    if (!mesh.current) return;
    matrices.forEach((matrix, index) => mesh.current.setMatrixAt(index, matrix));
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed * 0.018;
  });
  return <group ref={ref}>
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#9b9fa7" roughness={0.9} />
    </instancedMesh>
  </group>;
}

function Moon({ moon, speed, quality }) {
  const ref = useRef();
  const file = moon.texture.split('/').pop();
  const map = useLoader(THREE.TextureLoader, assets(file));
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * moon.speed * speed * 60; });
  return <group ref={ref}>
    <mesh position={[moon.distance + 0.2, 0, 0]}>
      <sphereGeometry args={[moon.radius, quality === 'low' ? 12 : 24, quality === 'low' ? 10 : 16]} />
      <meshStandardMaterial map={map} roughness={0.94} />
    </mesh>
  </group>;
}

function EarthAtmosphere({ radius, speed, quality }) {
  const cloudsRef = useRef();
  const cloudMap = useLoader(THREE.TextureLoader, assets('2k_earth_clouds.jpg'));
  useFrame((_, delta) => { if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.007 * speed * 60; });
  return <mesh ref={cloudsRef}>
    <sphereGeometry args={[radius * 1.015, quality === 'high' ? 48 : 24, 24]} />
    <meshStandardMaterial map={cloudMap} transparent opacity={0.35} depthWrite={false}
      side={THREE.DoubleSide} blending={THREE.NormalBlending} />
  </mesh>;
}

function SaturnRings({ radius }) {
  const alpha = useLoader(THREE.TextureLoader, assets('2k_saturn_ring_alpha.png'));
  return <mesh rotation={[-Math.PI / 2.3, 0, 0]}>
    <ringGeometry args={[radius * 1.32, radius * 2.32, 128]} />
    <meshStandardMaterial color="#dcc7a1" alphaMap={alpha} transparent opacity={0.84}
      side={THREE.DoubleSide} depthWrite={false} roughness={0.95} />
  </mesh>;
}

function OrbitLine({ distance }) {
  if (!distance) return null;
  return <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[distance - 0.015, distance + 0.015, 192]} />
    <meshBasicMaterial color="#6384ab" transparent opacity={0.23} side={THREE.DoubleSide} depthWrite={false} />
  </mesh>;
}

function Planet({ id, info, speed, quality, selected, onSelect, positions, showLabels, showOrbits, showMoons, showSelectionWireframe }) {
  const orbital = useRef();
  const body = useRef();
  const map = useLoader(THREE.TextureLoader, planetTexture(id));
  const size = quality === 'high' ? 48 : quality === 'medium' ? 32 : 20;
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.07) * speed * 60;
    if (orbital.current) orbital.current.rotation.y += info.speed * step;
    if (body.current) body.current.rotation.y += info.rotationSpeed * step;
    if (body.current) {
      body.current.updateWorldMatrix(true, false);
      body.current.getWorldPosition(positions.current[id] ?? (positions.current[id] = new THREE.Vector3()));
    }
  });
  return <>
    {showOrbits && <OrbitLine distance={info.distance} />}
    <group ref={orbital}>
      <group position={[info.distance, 0, 0]}>
        <mesh ref={body} onPointerDown={(event) => { event.stopPropagation(); onSelect(id); }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
          <sphereGeometry args={[info.radius, size, size / 1.5]} />
          {id === 'sun'
            ? <meshBasicMaterial color="#ffe9ae" map={map} />
            : <meshStandardMaterial map={map} roughness={id === 'earth' ? 0.87 : 0.97}
                metalness={0} bumpMap={id !== 'jupiter' && id !== 'saturn' ? map : null}
                bumpScale={0.012} />}
        </mesh>
        {id === 'sun' && <pointLight color="#fff0d2" intensity={3.2} distance={190} decay={1.4} />}
        {id === 'earth' && quality !== 'low' && <EarthAtmosphere radius={info.radius} speed={speed} quality={quality} />}
        {info.hasRings && <SaturnRings radius={info.radius} />}
        {showMoons && info.moons?.map(moon => <Suspense key={moon.name} fallback={null}>
          <Moon moon={moon} speed={speed} quality={quality} />
        </Suspense>)}
        {selected && showSelectionWireframe && <mesh scale={1.18}>
          <sphereGeometry args={[info.radius, 22, 14]} />
          <meshBasicMaterial color="#7bdaf4" wireframe transparent opacity={0.18} depthWrite={false} />
        </mesh>}
        {showLabels && <Html position={[0, info.radius + (info.radius > 1.9 ? 1.6 : 1), 0]}
          center distanceFactor={35} style={{ pointerEvents: 'none' }} zIndexRange={[15, 4]}>
          <div className={'celestial-label' + (selected ? ' is-active' : '')}>
            <span className="celestial-label-dot" style={{ background: info.color }} />{info.name}
          </div>
        </Html>}
      </group>
    </group>
  </>;
}

function CameraRig({ positions, focus, homeSignal, follow, onCameraReady, quality }) {
  const { camera } = useThree();
  const controls = useRef();
  const targetPoint = useRef(new THREE.Vector3());
  const destination = useRef(new THREE.Vector3(0, 35, 110));
  const lastFocus = useRef('');
  const lastHome = useRef(-1);
  const transitioning = useRef(true);
  const followOffset = useRef(new THREE.Vector3(4, 2, 4));
  useEffect(() => { if (onCameraReady) onCameraReady(controls); }, [onCameraReady]);
  useFrame((_, delta) => {
    const orbitControls = controls.current;
    if (!orbitControls) return;
    const focused = focus && planetData[focus.key];
    const position = focused ? positions.current[focus.key] : null;
    if (homeSignal !== lastHome.current) {
      lastHome.current = homeSignal;
      if (!focused) {
        targetPoint.current.set(0, 0, 0);
        destination.current.set(0, 35, 110);
        transitioning.current = true;
        lastFocus.current = '';
      }
    }
    if (focused && position) {
      if (lastFocus.current !== focus.key + ':' + focus.id) {
        const info = planetData[focus.key];
        const r = Math.max(info.radius * 3.6, 3.6);
        followOffset.current.set(r * 1.35, r * 0.8, r * 1.65);
        transitioning.current = true;
        lastFocus.current = focus.key + ':' + focus.id;
      }
      targetPoint.current.copy(position);
      destination.current.copy(position).add(followOffset.current);
    } else if (!focused && lastFocus.current) {
      lastFocus.current = '';
      transitioning.current = true;
      targetPoint.current.set(0, 0, 0);
      destination.current.set(0, 35, 110);
    }
    const factor = 1 - Math.exp(-Math.min(delta, 0.09) * (transitioning.current ? 3.0 : 2.0));
    if (transitioning.current || (focused && follow)) {
      orbitControls.target.lerp(targetPoint.current, factor);
      camera.position.lerp(destination.current, factor);
      if (transitioning.current && camera.position.distanceTo(destination.current) < 0.07 &&
        orbitControls.target.distanceTo(targetPoint.current) < 0.07) transitioning.current = false;
    }
    if (quality === 'low') camera.updateProjectionMatrix();
  });
  return <OrbitControls ref={controls} makeDefault enablePan enableRotate enableZoom enableDamping dampingFactor={0.075}
    minDistance={1.1} maxDistance={250} rotateSpeed={0.65} panSpeed={0.8} />;
}

function Scene({ selected, speed, focus, homeSignal, options, onSelect, onCameraReady }) {
  const positions = useRef({});
  return <>
    <color attach="background" args={['#040910']} />
    <ambientLight color="#b3c2df" intensity={0.14} />
    <pointLight position={[0, 0, 0]} color="#fff1d3" intensity={3.2} distance={190} decay={1.4} />
    <SpaceBackdrop backgroundMode={options.background} quality={options.quality} />
    {options.showGrid && <gridHelper args={[150, 30, '#294961', '#132d41']} position={[0, -0.14, 0]} />}
    {options.showAsteroids && <AsteroidBelt speed={speed} quality={options.quality} />}
    {PLANET_KEYS.map(id => <Suspense key={id} fallback={null}>
      <Planet id={id} info={planetData[id]} speed={speed} quality={options.quality}
        selected={selected === id} onSelect={onSelect} positions={positions}
        showLabels={options.showLabels} showOrbits={options.showOrbits} showMoons={options.showMoons}
        showSelectionWireframe={options.showSelectionWireframe} />
    </Suspense>)}
    <CameraRig positions={positions} focus={focus} homeSignal={homeSignal} follow={options.follow}
      quality={options.quality} onCameraReady={onCameraReady} />
  </>;
}

export default function SolarScene({ speed, selected, onSelect, focus, homeSignal, options, canvasRef }) {
  return <Canvas
    className="solar-canvas"
    camera={{ position: [0, 35, 110], fov: 56, near: 0.1, far: 1000 }}
    dpr={options.quality === 'low' ? 1 : options.quality === 'medium' ? [1, 1.5] : [1, 2]}
    gl={{ antialias: options.quality !== 'low', preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
    shadows={false}
    onCreated={({ gl }) => { if (canvasRef) canvasRef.current = gl.domElement; }}
    fallback={<div className="scene-fallback">WebGL no está disponible en este navegador.</div>}
  >
    <Scene speed={speed} selected={selected} onSelect={onSelect} focus={focus}
      homeSignal={homeSignal} options={options} />
  </Canvas>;
}
