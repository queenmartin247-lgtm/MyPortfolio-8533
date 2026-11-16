import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import type { Project } from "../lib/portfolio";

const sculpturePositions: [number, number, number][] = [
  [-2.25, 0.08, -2.25],
  [2.25, 0.08, -2.25],
  [-2.25, 0.08, 2.3],
  [2.25, 0.08, 2.3],
];

function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.08, 1, 8]} />
        <meshStandardMaterial color="#7b8060" />
      </mesh>
      {[-1, 0, 1].map((n) => (
        <mesh
          key={n}
          position={[n * 0.22, 1 + Math.abs(n) * 0.05, 0]}
          rotation={[0.1, n * 0.3, n * 0.5]}
          scale={[0.42, 0.82, 0.35]}
          castShadow
        >
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial color={n === 0 ? "#83986c" : "#a2b18a"} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
function Rock({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial color="#b9b9a2" roughness={1} />
    </mesh>
  );
}
function Sculpture({
  index,
  position,
  onSelect,
  reduced,
}: {
  index: number;
  position: [number, number, number];
  onSelect: (i: number) => void;
  reduced: boolean;
}) {
  const [hovered, hover] = useState(false);
  const object = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (object.current) {
      object.current.rotation.y += reduced ? 0 : dt * (hovered ? 0.3 : 0.07);
    }
  });
  return (
    <group position={position} scale={0.85}>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.78, 0.85, 0.6, 64]} />
        <meshStandardMaterial color="#eae8d9" roughness={0.85} />
      </mesh>
      <Float
        speed={reduced ? 0 : 1.4}
        rotationIntensity={reduced ? 0 : 0.08}
        floatIntensity={reduced ? 0 : 0.15}
      >
        <group
          ref={object}
          position={[0, 1.62, 0]}
          scale={hovered ? 1.08 : 1}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            hover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            hover(false);
            document.body.style.cursor = "auto";
          }}
        >
          {index === 0 && (
            <group rotation={[0.15, 0, -0.14]}>
              <mesh castShadow position={[0, 0.32, 0]}>
                <torusGeometry args={[0.61, 0.27, 32, 80, Math.PI]} />
                <meshStandardMaterial color="#d8a9a7" roughness={0.45} />
              </mesh>
              {[-0.61, 0.61].map((x) => (
                <mesh key={x} castShadow position={[x, -0.2, 0]}>
                  <capsuleGeometry args={[0.27, 0.95, 12, 24]} />
                  <meshStandardMaterial color="#d8a9a7" roughness={0.45} />
                </mesh>
              ))}
            </group>
          )}
          {index === 1 && (
            <group rotation={[0.35, 0, 0.15]}>
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i * Math.PI) / 4;
                return (
                  <mesh
                    key={i}
                    position={[Math.cos(a) * 0.63, Math.sin(a) * 0.63, 0]}
                    rotation={[0, 0, a]}
                    scale={[0.59, 0.32, 0.24]}
                    castShadow
                  >
                    <sphereGeometry args={[1, 32, 24]} />
                    <meshStandardMaterial color="#e8cb7f" roughness={0.55} />
                  </mesh>
                );
              })}
              <mesh position={[0, 0, 0.12]} castShadow>
                <sphereGeometry args={[0.35, 32, 24]} />
                <meshStandardMaterial color="#ebd593" roughness={0.5} />
              </mesh>
            </group>
          )}
          {index === 2 && (
            <group rotation={[0.3, 0.3, 0.3]}>
              <mesh rotation={[0, 0, 0.4]} castShadow>
                <torusGeometry args={[0.73, 0.14, 24, 100]} />
                <meshStandardMaterial color="#6e9389" metalness={0.25} roughness={0.3} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, -0.4]} castShadow>
                <torusGeometry args={[0.73, 0.14, 24, 100]} />
                <meshStandardMaterial color="#94b9a8" metalness={0.15} roughness={0.35} />
              </mesh>
              <mesh castShadow>
                <sphereGeometry args={[0.33, 32, 32]} />
                <meshStandardMaterial color="#e0e6cd" roughness={0.3} />
              </mesh>
            </group>
          )}
          {index === 3 && (
            <group rotation={[0.12, 0, -0.1]}>
              {Array.from({ length: 6 }, (_, i) => {
                const a = (i * Math.PI) / 3;
                return (
                  <mesh
                    key={i}
                    position={[Math.cos(a) * 0.51, Math.sin(a) * 0.51, 0]}
                    rotation={[0, 0, a]}
                    scale={[0.56, 0.27, 0.28]}
                    castShadow
                  >
                    <sphereGeometry args={[1, 28, 20]} />
                    <meshStandardMaterial color="#baaecb" roughness={0.5} />
                  </mesh>
                );
              })}
              <mesh position={[0, 0, 0.19]} castShadow>
                <sphereGeometry args={[0.3, 28, 20]} />
                <meshStandardMaterial color="#e5dec5" roughness={0.4} />
              </mesh>
            </group>
          )}
        </group>
      </Float>
    </group>
  );
}
function World({
  onSelect,
  reset,
  reduced,
  labels,
}: {
  projects: Project[];
  onSelect: (i: number) => void;
  reset: number;
  reduced: boolean;
  labels: React.RefObject<(HTMLButtonElement | null)[]>;
}) {
  const controls = useRef<OrbitControlsType>(null);
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom = Math.min(size.width / 12.5, size.height / 7.5, 65);
    cam.updateProjectionMatrix();
    controls.current?.saveState();
  }, [camera, size.width, size.height]);
  const previous = useRef(reset);
  useFrame(() => {
    sculpturePositions.forEach(([x, , z], i) => {
      const p = new THREE.Vector3(x, -0.1, z + (i < 2 ? .65 : 1)).project(camera);
      const label = labels.current[i];
      if (label)
        label.style.transform = `translate(-50%, -50%) translate(${((p.x + 1) * size.width) / 2}px, ${((-p.y + 1) * size.height) / 2}px)`;
    });
    if (previous.current !== reset) {
      controls.current?.reset();
      previous.current = reset;
    }
  });
  return (
    <>
      <color attach="background" args={["#f3f2e9"]} />
      <fog attach="fog" args={["#f3f2e9", 22, 45]} />
      <ambientLight intensity={1.7} />
      <directionalLight
        position={[-5, 10, 7]}
        intensity={2.7}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-normalBias={0.04}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#f3f2e9" toneMapped={false} />
      </mesh>
      <group position={[0, -0.1, 0]}>
        <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[5.35, 5.1, 0.42, 100]} />
          <meshStandardMaterial color="#b1bea0" roughness={1} />
        </mesh>
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[3.9, 4.7, 100]} />
          <meshStandardMaterial color="#dedccb" roughness={1} />
        </mesh>
        <mesh position={[0, 0.02, 0]} scale={[1, 1, 0.75]} receiveShadow>
          <cylinderGeometry args={[2.85, 2.85, 0.06, 80]} />
          <meshStandardMaterial color="#c7ceb3" roughness={1} />
        </mesh>
        <mesh position={[0, 0.062, 1.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 3.7]} />
          <meshStandardMaterial color="#dedccb" roughness={1} />
        </mesh>
        {sculpturePositions.map((position, i) => (
          <Sculpture key={i} index={i} position={position} onSelect={onSelect} reduced={reduced} />
        ))}
        <Plant position={[-3.3, 0.02, -3.2]} scale={1.1} />
        <Plant position={[3.3, 0.02, -3.2]} scale={1.25} />
        <Plant position={[-4.4, 0.02, 0.3]} scale={0.55} />
        <Plant position={[4.05, 0.02, 1.3]} scale={0.7} />
        <Rock position={[-2.4, 0.2, 2.4]} scale={[0.75, 0.28, 0.48]} />
        <Rock position={[-3.05, 0.14, 2.15]} scale={[0.38, 0.2, 0.35]} />
        <Rock position={[2.2, 0.15, -3]} scale={[0.6, 0.22, 0.4]} />
        {Array.from({ length: 38 }, (_, i) => {
          const a = i * 2.399;
          const r = 3.25 + (i % 4) * 0.32;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * r, 0.08, Math.sin(a) * r]}
              scale={[0.13 + (i % 3) * 0.03, 0.07, 0.12]}
              receiveShadow
            >
              <sphereGeometry args={[1, 8, 6]} />
              <meshStandardMaterial color={i % 2 ? "#9fab87" : "#d3d5b9"} />
            </mesh>
          );
        })}
        {[
          [1.65, 2.8],
          [-1.9, -2.3],
          [3.7, -0.7],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0.1, z]}>
            {Array.from({ length: 7 }, (_, j) => (
              <mesh
                key={j}
                position={[Math.cos(j) * 0.18, 0.17, Math.sin(j) * 0.18]}
                rotation={[0.15 * j, 0, 0.2 * j]}
                scale={[0.06, 0.32, 0.06]}
              >
                <sphereGeometry args={[1, 8, 12]} />
                <meshStandardMaterial color="#7a8e64" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <ContactShadows
        position={[0, -0.46, 0]}
        opacity={0.25}
        scale={24}
        blur={2.5}
        far={6}
        resolution={512}
      />
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 0.4, 0]}
        enablePan={false}
        enableZoom
        minZoom={20}
        maxZoom={90}
        minPolarAngle={0.65}
        maxPolarAngle={1.25}
        minAzimuthAngle={-0.7}
        maxAzimuthAngle={0.7}
      />
    </>
  );
}
export default function Garden(props: {
  projects: Project[];
  onSelect: (i: number) => void;
  reset: number;
  reduced: boolean;
}) {
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{ position: [0, 8, 13], zoom: 56, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true }}
        aria-label="Interactive 3D sculpture garden. Drag to rotate; select a labeled sculpture to see its project."
      >
        <Suspense fallback={null}>
          <World {...props} labels={labels} />
        </Suspense>
      </Canvas>
      <div className="garden-labels">
        {props.projects.map((project, i) => (
          <button
            key={i}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="scene-label"
            onClick={() => props.onSelect(i)}
          >
            <span className="label-number">0{i + 1}</span>
            <span>
              <strong>{project.shortTitle || project.title}</strong>
              <small>{project.category}</small>
            </span>
            <span className="label-arrow">↗</span>
          </button>
        ))}
      </div>
    </>
  );
}
