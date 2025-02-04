'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { HouseDetails } from '../types/house';
import { generateLayoutDesign } from '../utils/layouts';

export default function HousePlanViewer({ houseDetails }: { houseDetails: HouseDetails }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [currentRoom, setCurrentRoom] = useState<string>('Outside');
  const [cameraHeight, setCameraHeight] = useState<'ground' | 'eye' | 'top'>('eye');

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup with higher resolution
    const pixelRatio = window.devicePixelRatio;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
    const camera = viewMode === '2d' 
      ? new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 1000)
      : new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
    scene.add(hemisphereLight);

    // Dimensions
    const totalArea = houseDetails.totalArea;
    const aspectRatio = 4/3;
    const houseWidth = Math.sqrt(totalArea * aspectRatio);
    const houseLength = totalArea / houseWidth;
    const scale = 20 / Math.max(houseWidth, houseLength);
    const wallHeight = 3 * scale;

    if (viewMode === '2d') {
      // Enhanced 2D View
      const rooms = generateLayoutDesign(houseDetails, houseWidth * scale, houseLength * scale);
      
      // Grid helper for scale reference
      const gridHelper = new THREE.GridHelper(Math.max(houseWidth, houseLength) * scale * 1.5, 20);
      scene.add(gridHelper);

      rooms.forEach(room => {
        // Floor with grid pattern
        const floorGeometry = new THREE.PlaneGeometry(room.width, room.length);
        const floorMaterial = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(room.color).multiplyScalar(1.2),
          side: THREE.DoubleSide
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(room.x, 0.01, room.z); // Slightly above grid
        scene.add(floor);

        // High-resolution room labels
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512; // Higher resolution
        canvas.height = 512;
        if (context) {
          context.fillStyle = '#000000';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          
          // Room name
          context.font = 'bold 48px Arial';
          context.fillText(room.name, 256, 200);
          
          // Dimensions
          context.font = '36px Arial';
          const dimensions = `${(room.width / scale).toFixed(1)}' × ${(room.length / scale).toFixed(1)}'`;
          context.fillText(dimensions, 256, 256);
          
          // Area
          const area = ((room.width * room.length) / (scale * scale)).toFixed(1);
          context.font = '32px Arial';
          context.fillText(`${area} sq ft`, 256, 312);

          const texture = new THREE.CanvasTexture(canvas);
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          const labelMaterial = new THREE.SpriteMaterial({ map: texture });
          const label = new THREE.Sprite(labelMaterial);
          label.position.set(room.x, 0.1, room.z);
          label.scale.set(room.width * 0.8, room.width * 0.8, 1);
          scene.add(label);
        }

        // Thick walls
        const wallMaterial = new THREE.LineBasicMaterial({ 
          color: 0x000000,
          linewidth: 3
        });
        
        // Main walls
        const wallPoints = [
          new THREE.Vector3(room.x - room.width/2, 0, room.z - room.length/2),
          new THREE.Vector3(room.x + room.width/2, 0, room.z - room.length/2),
          new THREE.Vector3(room.x + room.width/2, 0, room.z + room.length/2),
          new THREE.Vector3(room.x - room.width/2, 0, room.z + room.length/2),
          new THREE.Vector3(room.x - room.width/2, 0, room.z - room.length/2)
        ];
        const wallGeometry = new THREE.BufferGeometry().setFromPoints(wallPoints);
        const walls = new THREE.Line(wallGeometry, wallMaterial);
        scene.add(walls);

        // Enhanced door symbols
        room.doors?.forEach(door => {
          const doorGroup = new THREE.Group();
          
          // Door arc
          const arcPoints = [];
          const radius = door.width * 0.7;
          for (let i = 0; i <= 32; i++) {
            const angle = (i / 32) * Math.PI / 2;
            arcPoints.push(new THREE.Vector3(
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ));
          }
          const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
          const arc = new THREE.Line(arcGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
          
          // Door opening line
          const openingGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(radius, 0, 0)
          ]);
          const opening = new THREE.Line(openingGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
          
          doorGroup.add(arc);
          doorGroup.add(opening);
          doorGroup.position.set(door.x, 0, door.z);
          doorGroup.rotation.y = door.rotation;
          scene.add(doorGroup);
        });

        // Enhanced window symbols
        room.windows?.forEach(window => {
          const windowGroup = new THREE.Group();
          
          // Window frame
          const frameGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-window.width/2, 0, 0),
            new THREE.Vector3(window.width/2, 0, 0)
          ]);
          const frame = new THREE.Line(frameGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 }));
          
          // Window panes
          const paneWidth = window.width / 4;
          for (let i = -1; i <= 1; i++) {
            const paneGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(i * paneWidth, 0, -0.1),
              new THREE.Vector3(i * paneWidth, 0, 0.1)
            ]);
            const pane = new THREE.Line(paneGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
            windowGroup.add(pane);
          }
          
          windowGroup.add(frame);
          windowGroup.position.set(window.x, 0, window.z);
          windowGroup.rotation.y = window.rotation;
          scene.add(windowGroup);
        });
      });

    } else {
      // Enhanced 3D View
      const rooms = generateLayoutDesign(houseDetails, houseWidth * scale, houseLength * scale);
      
      // Create environment map for realistic reflections
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envMapTexture = pmremGenerator.fromScene(new THREE.Scene()).texture;
      
      // Ground with realistic grass texture
      const groundTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
      groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
      groundTexture.repeat.set(25, 25);
      
      const groundGeometry = new THREE.PlaneGeometry(houseWidth * scale * 3, houseLength * scale * 3);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        map: groundTexture,
        roughness: 0.8,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Foundation
      const baseGeometry = new THREE.BoxGeometry(houseWidth * scale, 0.5, houseLength * scale);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        roughness: 0.7,
        metalness: 0.2,
        envMap: envMapTexture
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 0.25;
      base.castShadow = true;
      base.receiveShadow = true;
      scene.add(base);

      rooms.forEach(room => {
        const roomGroup = new THREE.Group();

        // Floor with realistic wood texture
        const floorTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(4, 4);
        
        const floorGeometry = new THREE.BoxGeometry(room.width, 0.2, room.length);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
          map: floorTexture,
          roughness: 0.8,
          metalness: 0.2,
          envMap: envMapTexture
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.set(room.x, 0.6, room.z);
        floor.castShadow = true;
        floor.receiveShadow = true;
        roomGroup.add(floor);

        // Walls with realistic textures
        const wallTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/brick_diffuse.jpg');
        wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(2, 2);
        
        const wallMaterial = new THREE.MeshStandardMaterial({ 
          map: wallTexture,
          roughness: 0.7,
          metalness: 0.1,
          envMap: envMapTexture
        });

        const wallThickness = 0.2;
        const walls = [
          { pos: [room.x, wallHeight/2 + 0.6, room.z + room.length/2], size: [room.width, wallHeight, wallThickness] },
          { pos: [room.x, wallHeight/2 + 0.6, room.z - room.length/2], size: [room.width, wallHeight, wallThickness] },
          { pos: [room.x - room.width/2, wallHeight/2 + 0.6, room.z], size: [wallThickness, wallHeight, room.length] },
          { pos: [room.x + room.width/2, wallHeight/2 + 0.6, room.z], size: [wallThickness, wallHeight, room.length] }
        ];

        walls.forEach(({ pos, size }) => {
          const wallGeometry = new THREE.BoxGeometry(...size);
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(...pos);
          wall.castShadow = true;
          wall.receiveShadow = true;
          roomGroup.add(wall);
        });

        // Add room label in 3D
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        if (context) {
          context.fillStyle = '#000000';
          context.font = 'bold 36px Arial';
          context.textAlign = 'center';
          context.fillText(room.name, 128, 64);
          
          const texture = new THREE.CanvasTexture(canvas);
          const labelMaterial = new THREE.SpriteMaterial({ map: texture });
          const label = new THREE.Sprite(labelMaterial);
          label.position.set(room.x, wallHeight + 1, room.z);
          label.scale.set(2, 1, 1);
          roomGroup.add(label);
        }

        // Enhanced furniture with realistic materials
        room.furniture?.forEach(furniture => {
          const furnGroup = new THREE.Group();
          
          // Base geometry
          const furnGeometry = new THREE.BoxGeometry(furniture.width, wallHeight * 0.3, furniture.length);
          const furnMaterial = new THREE.MeshStandardMaterial({
            color: furniture.color,
            roughness: 0.6,
            metalness: 0.3,
            envMap: envMapTexture
          });
          const furnMesh = new THREE.Mesh(furnGeometry, furnMaterial);
          furnMesh.castShadow = true;
          furnMesh.receiveShadow = true;
          furnGroup.add(furnMesh);

          // Add details based on furniture type
          if (furniture.type === 'bed') {
            // Add mattress
            const mattressGeometry = new THREE.BoxGeometry(furniture.width * 0.9, wallHeight * 0.1, furniture.length * 0.8);
            const mattressMaterial = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              roughness: 0.5,
              metalness: 0.1
            });
            const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
            mattress.position.y = wallHeight * 0.2;
            furnGroup.add(mattress);
          }

          furnGroup.position.set(furniture.x, wallHeight * 0.15 + 0.6, furniture.z);
          furnGroup.rotation.y = furniture.rotation;
          roomGroup.add(furnGroup);
        });

        // Enhanced windows
        room.windows?.forEach(window => {
          const windowGroup = new THREE.Group();
          
          // Window frame
          const frameGeometry = new THREE.BoxGeometry(window.width, wallHeight * 0.4, wallThickness * 2);
          const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            metalness: 0.8,
            roughness: 0.2,
            envMap: envMapTexture
          });
          const frame = new THREE.Mesh(frameGeometry, frameMaterial);
          
          // Window glass
          const glassGeometry = new THREE.BoxGeometry(window.width * 0.9, wallHeight * 0.35, wallThickness/2);
          const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.9,
            roughness: 0.05,
            transparent: true,
            opacity: 0.3,
            envMapIntensity: 1,
            envMap: envMapTexture
          });
          const glass = new THREE.Mesh(glassGeometry, glassMaterial);
          
          windowGroup.add(frame);
          windowGroup.add(glass);
          windowGroup.position.set(window.x, wallHeight * 0.6 + 0.6, window.z);
          windowGroup.rotation.y = window.rotation;
          roomGroup.add(windowGroup);
        });

        // Enhanced doors
        room.doors?.forEach(door => {
          const doorGroup = new THREE.Group();
          
          // Door frame
          const frameGeometry = new THREE.BoxGeometry(door.width * 1.1, wallHeight * 0.85, wallThickness * 2);
          const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            metalness: 0.5,
            roughness: 0.5,
            envMap: envMapTexture
          });
          const frame = new THREE.Mesh(frameGeometry, frameMaterial);
          
          // Door
          const doorGeometry = new THREE.BoxGeometry(door.width, wallHeight * 0.8, wallThickness);
          const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.3,
            roughness: 0.7,
            envMap: envMapTexture
          });
          const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
          
          // Door handle
          const handleGeometry = new THREE.SphereGeometry(0.1);
          const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.1,
            envMap: envMapTexture
          });
          const handle = new THREE.Mesh(handleGeometry, handleMaterial);
          handle.position.set(door.width * 0.35, 0, wallThickness/2);
          doorMesh.add(handle);
          
          doorGroup.add(frame);
          doorGroup.add(doorMesh);
          doorGroup.position.set(door.x, wallHeight * 0.4 + 0.6, door.z);
          doorGroup.rotation.y = door.rotation;
          roomGroup.add(doorGroup);
        });

        scene.add(roomGroup);
      });

      // Enhanced roof
      const roofTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
      roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping;
      roofTexture.repeat.set(5, 5);
      
      const roofGeometry = new THREE.ConeGeometry(
        Math.sqrt(Math.pow(houseWidth * scale, 2) + Math.pow(houseLength * scale, 2)) / 2,
        wallHeight * 0.8,
        4
      );
      const roofMaterial = new THREE.MeshStandardMaterial({ 
        map: roofTexture,
        roughness: 0.7,
        metalness: 0.2,
        envMap: envMapTexture
      });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = wallHeight + 0.6;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      scene.add(roof);
    }

    // Camera setup based on view mode and height
    if (viewMode === '2d') {
      camera.position.set(0, 20, 0);
      camera.lookAt(0, 0, 0);
      camera.zoom = 0.8;
      camera.updateProjectionMatrix();
    } else {
      let cameraPos;
      switch (cameraHeight) {
        case 'ground':
          cameraPos = new THREE.Vector3(houseWidth * scale, wallHeight * 0.5, houseLength * scale);
          break;
        case 'eye':
          cameraPos = new THREE.Vector3(houseWidth * scale, wallHeight * 1.6, houseLength * scale);
          break;
        case 'top':
          cameraPos = new THREE.Vector3(houseWidth * scale, wallHeight * 4, houseLength * scale);
          break;
      }
      camera.position.copy(cameraPos);
      camera.lookAt(0, wallHeight/2, 0);
    }

    // Enhanced controls
    const controls = new OrbitControls(camera, renderer.domElement);
    if (viewMode === '2d') {
      controls.enableRotate = false;
    } else {
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.maxPolarAngle = Math.PI / 2;
      controls.minDistance = 2;
      controls.maxDistance = 50;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [houseDetails, viewMode, currentRoom, cameraHeight]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === '2d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            2D View
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === '3d' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            3D View
          </button>
        </div>
        
        {viewMode === '3d' && (
          <div className="space-x-4">
            <button
              onClick={() => setCameraHeight('ground')}
              className={`px-4 py-2 rounded-lg ${
                cameraHeight === 'ground'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ground View
            </button>
            <button
              onClick={() => setCameraHeight('eye')}
              className={`px-4 py-2 rounded-lg ${
                cameraHeight === 'eye'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Eye Level
            </button>
            <button
              onClick={() => setCameraHeight('top')}
              className={`px-4 py-2 rounded-lg ${
                cameraHeight === 'top'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Top View
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full h-[600px] bg-gray-100 rounded-xl shadow-lg"
      />
      
      <div className="text-sm text-gray-600">
        <p>Navigation Tips:</p>
        <ul className="list-disc list-inside">
          <li>Left click + drag to rotate (3D only)</li>
          <li>Right click + drag to pan</li>
          <li>Scroll to zoom in/out</li>
          <li>Use the view buttons above to change perspective</li>
        </ul>
      </div>
    </div>
  );
}