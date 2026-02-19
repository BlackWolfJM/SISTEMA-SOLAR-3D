import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { planetData } from '../data/planets';

// Textures map
const textureMap = {
  sun: '/textures/2k_sun.jpg',
  mercury: '/textures/2k_mercury.jpg',
  venus: '/textures/2k_venus_surface.jpg',
  earth: '/textures/2k_earth_daymap.jpg',
  mars: '/textures/2k_mars.jpg',
  jupiter: '/textures/2k_jupiter.jpg',
  saturn: '/textures/2k_saturn.jpg',
  uranus: '/textures/2k_uranus.jpg',
  neptune: '/textures/2k_neptune.jpg',
};

// Preload all textures to avoid suspension waterfalls or missing textures
// Preload all textures to avoid suspension waterfalls or missing textures
Object.values(textureMap).forEach(path => {
  useLoader.preload(TextureLoader, path);
});
// Preload moon textures manually for now
useLoader.preload(TextureLoader, '/textures/2k_moon.jpg');
useLoader.preload(TextureLoader, '/textures/2k_phobos.jpg');
useLoader.preload(TextureLoader, '/textures/2k_deimos.jpg');
// Preload new textures
useLoader.preload(TextureLoader, '/textures/2k_earth_clouds.jpg');
useLoader.preload(TextureLoader, '/textures/2k_earth_normal.jpg');

const MoonMesh = ({ moon, planetRadius, speed }) => {
  const meshRef = useRef();
  const orbitRef = useRef();
  const texture = useLoader(TextureLoader, moon.texture);

  useFrame(() => {
    if (orbitRef.current) {
      // Moons orbit the planet
      orbitRef.current.rotation.y += moon.speed * speed;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[planetRadius + moon.distance, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[moon.radius, 32, 32]} />
          <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={0.02} />
        </mesh>
      </group>
    </group>
  );
};

const AsteroidBelt = ({ count = 2000, speed }) => {
  const meshRef = useRef();

  // Create random positions for asteroids
  const [dummy] = useState(() => new THREE.Object3D());
  const asteroids = useRef(new Array(count).fill(0).map(() => ({
    angle: Math.random() * Math.PI * 2,
    distance: 35 + Math.random() * 10, // Between Mars (20) and Jupiter (50), tweaked
    radius: Math.random() * 0.1 + 0.05,
    y: (Math.random() - 0.5) * 2,
    speed: Math.random() * 0.005 + 0.001
  })));

  useFrame(() => {
    asteroids.current.forEach((data, i) => {
      data.angle += (data.speed * speed); // Apply global speed
      const x = Math.cos(data.angle) * data.distance;
      const z = Math.sin(data.angle) * data.distance;

      dummy.position.set(x, data.y, z);
      dummy.rotation.x = Math.random() * Math.PI;
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.set(data.radius, data.radius, data.radius);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.8} />
    </instancedMesh>
  );
};

// Separated component to isolate ring texture loading
const SaturnRings = ({ planetInfo }) => {
  let ringMap = null;
  try {
    ringMap = useLoader(TextureLoader, '/textures/2k_saturn_ring_alpha.png');
  } catch (e) {
    console.error("Failed to load Saturn ring texture", e);
  }

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetInfo.radius * 1.4, planetInfo.radius * 2.2, 64]} />
      <meshStandardMaterial
        map={ringMap}
        color={!ringMap ? "#E6D7C8" : "white"}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Background = () => {
  let bgTexture = null;
  try {
    bgTexture = useLoader(TextureLoader, '/textures/8k_stars_milky_way.jpg');
  } catch (e) {
    console.error("Failed to load background texture", e);
  }

  if (!bgTexture) return <Stars radius={200} depth={100} count={3000} factor={4} saturation={0.5} fade={true} speed={0.5} />;

  return (
    <mesh>
      <sphereGeometry args={[400, 64, 64]} />
      <meshBasicMaterial map={bgTexture} side={THREE.BackSide} />
    </mesh>
  );
}

const PlanetMesh = ({ planetKey, planetInfo, onClick, isSelected, speed }) => {
  const meshRef = useRef();
  const orbitRef = useRef();
  const cloudsRef = useRef();

  // Safe texture loading
  const texture = useLoader(TextureLoader, textureMap[planetKey]);
  const colorMap = texture;

  // Specific textures for realism
  const normalMap = planetKey === 'earth' ? useLoader(TextureLoader, '/textures/2k_earth_normal.jpg') : null;
  const cloudMap = planetKey === 'earth' ? useLoader(TextureLoader, '/textures/2k_earth_clouds.jpg') : null;

  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += planetInfo.speed * speed;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += planetInfo.rotationSpeed * speed;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += (planetInfo.rotationSpeed * 0.8) * speed;
    }
  });

  const getMaterialProps = (planetKey) => {
    // Fallback colors if texture fails or for emissive
    switch (planetKey) {
      case 'sun': return { color: '#FDB813' };
      case 'mercury': return { color: '#8C7853' };
      case 'venus': return { color: '#FFC649' };
      case 'earth': return { color: '#6B93D6' };
      case 'mars': return { color: '#CD5C5C' };
      case 'jupiter': return { color: '#D8CA9D' };
      case 'saturn': return { color: '#FAD5A5' };
      case 'uranus': return { color: '#4FD0E7' };
      case 'neptune': return { color: '#4B70DD' };
      default: return { color: '#FFFFFF' };
    }
  };

  const fallbackProps = getMaterialProps(planetKey);

  return (
    <group ref={orbitRef}>
      <group position={[planetInfo.distance, 0, 0]}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[planetInfo.radius, 64, 64]} />
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            normalScale={planetKey === 'earth' ? [2, 2] : [0, 0]}
            color={!colorMap ? fallbackProps.color : 'white'}
            metalness={0.4}
            roughness={0.7}
            emissive={planetKey === 'sun' ? new THREE.Color(0xFDB813) : new THREE.Color(0x000000)}
            emissiveIntensity={planetKey === 'sun' ? 2 : 0}
            emissiveMap={planetKey === 'sun' ? colorMap : null}
            bumpMap={planetKey !== 'sun' && planetKey !== 'saturn' && planetKey !== 'jupiter' ? texture : null}
            bumpScale={0.05}
          />
        </mesh>

        {planetInfo.moons && planetInfo.moons.map((moon, idx) => (
          <MoonMesh key={idx} moon={moon} planetRadius={planetInfo.radius} speed={speed} />
        ))}

        {planetInfo.hasRings && (
          <group>
            <SaturnRings planetInfo={planetInfo} />
          </group>
        )}

        {planetKey === 'earth' && cloudMap && (
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[planetInfo.radius * 1.01, 32, 32]} />
            <meshPhongMaterial
              map={cloudMap}
              transparent={true}
              opacity={0.8}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        <Text
          position={[0, planetInfo.radius + 1.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {planetInfo.name}
        </Text>

        {isSelected && (
          <mesh>
            <sphereGeometry args={[planetInfo.radius * 1.15, 32, 32]} />
            <meshStandardMaterial
              color="#ffff00"
              transparent
              opacity={0.3}
              wireframe
              emissive="#ffff00"
              emissiveIntensity={0.2}
            />
          </mesh>
        )}
      </group>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planetInfo.distance - 0.05, planetInfo.distance + 0.05, 128]} />
        <meshBasicMaterial
          color="#444444"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};



const SolarSystemScene = ({ onPlanetClick, selectedPlanet, speed, flyTarget }) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (flyTarget && controlsRef.current) {
      const key = flyTarget.key;
      if (key === 'sun') {
        controlsRef.current.target.set(0, 0, 0);
        camera.position.set(20, 10, 20);
      } else {
        const info = planetData[key];
        const targetPos = new THREE.Vector3(info.distance, 0, 0);
        controlsRef.current.target.copy(targetPos);
        const offset = info.radius * 3 + 2;
        camera.position.set(info.distance + offset, info.radius + 2, offset);
      }
      controlsRef.current.update();
    }
  }, [flyTarget, camera]);

  return (
    <>
      <ambientLight intensity={0.3} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#FDB813" distance={100} decay={2} />

      <Suspense fallback={null}>
        <Background />
      </Suspense>

      <AsteroidBelt speed={speed} />

      <Suspense fallback={null}>
        <PlanetMesh
          planetKey="sun"
          planetInfo={planetData.sun}
          onClick={() => onPlanetClick('sun')}
          isSelected={selectedPlanet === 'sun'}
          speed={speed}
        />

        {Object.keys(planetData).filter(key => key !== 'sun').map(planetKey => (
          <PlanetMesh
            key={planetKey}
            planetKey={planetKey}
            planetInfo={planetData[planetKey]}
            onClick={() => onPlanetClick(planetKey)}
            isSelected={selectedPlanet === planetKey}
            speed={speed}
          />
        ))}
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={400}
      />
    </>
  );
};

const SolarSystem = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [cameraTarget, setCameraTarget] = useState(null);

  const handlePlanetClick = (planetKey) => {
    setSelectedPlanet(planetKey);
  };

  const handleCloseInfo = () => {
    setSelectedPlanet(null);
  };

  const handleFlyTo = () => {
    if (selectedPlanet) {
      setCameraTarget({ key: selectedPlanet, t: Date.now() });
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 40, 100], fov: 60 }}
        style={{ background: '#000000' }}
      >
        <SolarSystemScene
          onPlanetClick={handlePlanetClick}
          selectedPlanet={selectedPlanet}
          speed={speed}
          flyTarget={cameraTarget}
        />
      </Canvas>

      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
        <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg backdrop-blur-sm border border-gray-800">
          <h1 className="text-2xl font-bold mb-2">Sistema Solar 3D</h1>
          <p className="text-sm opacity-80 mb-2">Velocidad del Tiempo</p>
          <div className="flex items-center gap-2">
            <span className="text-xs">0x</span>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-32 accent-blue-500 cursor-pointer"
            />
            <span className="text-xs">{speed.toFixed(1)}x</span>
          </div>
          <p className="text-sm opacity-80 mt-2">
            Haz clic en cualquier planeta para ver su información
          </p>
          <div className="mt-2 text-xs opacity-60">
            <p>• Arrastra para rotar la vista</p>
            <p>• Scroll para hacer zoom</p>
            <p>• Clic derecho para mover</p>
          </div>
        </div>
      </div>

      {selectedPlanet && (
        <div className="absolute top-4 right-4 z-10 w-80">
          <div className="bg-black bg-opacity-80 text-white p-6 rounded-lg backdrop-blur-sm border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-yellow-300">
                {planetData[selectedPlanet].name}
              </h2>
              <button
                onClick={handleCloseInfo}
                className="text-white hover:text-red-400 transition-colors"
                aria-label="Cerrar información"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 rounded-md overflow-hidden h-32 relative">
              <img
                src={selectedPlanet === 'sun' ? '/textures/2k_sun.jpg' : `/textures/2k_${selectedPlanet === 'venus' ? 'venus_surface' : selectedPlanet === 'earth' ? 'earth_daymap' : selectedPlanet}.jpg`}
                alt={planetData[selectedPlanet].name}
                className="w-full h-full object-cover opacity-80"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            </div>

            <button
              onClick={handleFlyTo}
              className="w-full mb-4 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span>🚀</span> Viajar a {planetData[selectedPlanet].name}
            </button>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-blue-300 font-semibold">Tipo:</span>{' '}
                <span>{planetData[selectedPlanet].info.type}</span>
              </div>
              <div>
                <span className="text-blue-300 font-semibold">Diámetro:</span>{' '}
                <span>{planetData[selectedPlanet].info.diameter}</span>
              </div>
              <div>
                <span className="text-blue-300 font-semibold">Masa:</span>{' '}
                <span>{planetData[selectedPlanet].info.mass}</span>
              </div>
              <div>
                <span className="text-blue-300 font-semibold">Temperatura:</span>{' '}
                <span>{planetData[selectedPlanet].info.temperature}</span>
              </div>
              {planetData[selectedPlanet].info.orbital_period && (
                <div>
                  <span className="text-blue-300 font-semibold">Período orbital:</span>{' '}
                  <span>{planetData[selectedPlanet].info.orbital_period}</span>
                </div>
              )}
              {planetData[selectedPlanet].info.day_length && (
                <div>
                  <span className="text-blue-300 font-semibold">Duración del día:</span>{' '}
                  <span>{planetData[selectedPlanet].info.day_length}</span>
                </div>
              )}
              {planetData[selectedPlanet].info.composition && (
                <div>
                  <span className="text-blue-300 font-semibold">Composición:</span>{' '}
                  <span>{planetData[selectedPlanet].info.composition}</span>
                </div>
              )}
              {planetData[selectedPlanet].info.age && (
                <div>
                  <span className="text-blue-300 font-semibold">Edad:</span>{' '}
                  <span>{planetData[selectedPlanet].info.age}</span>
                </div>
              )}
              <div className="mt-4 pt-2 border-t border-gray-600">
                <p className="text-gray-300 italic">
                  {planetData[selectedPlanet].info.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarSystem;