import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import './Hero3d.css';

const Hero3d = () => {
    const canvasRef = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const modelRef = useRef(null);
    const particlesRef = useRef(null);
    const sunRef = useRef(null);
    const earthRef = useRef(null);
    const stoneRef = useRef(null);
    const spaceshipRef = useRef(null);
    const stoneVelocityRef = useRef(new THREE.Vector3());
    const sceneRef = useRef(null);
    const clock = new THREE.Clock();

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000814, 0.001);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.0,
            0.6,
            0.8
        );
        composer.addPass(bloomPass);

        const createParticles = () => {
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(5000 * 3);
            const colors = new Float32Array(5000 * 3);
            for (let i = 0; i < 5000; i++) {
                const radius = 50 + Math.random() * 50;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi) * -5;
                const color = new THREE.Color(
                    Math.random() * 0.2 + 0.1,
                    Math.random() * 0.3 + 0.2,
                    Math.random() * 0.5 + 0.5
                );
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
            }
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
            });

            const particleSystem = new THREE.Points(particles, particleMaterial);
            scene.add(particleSystem);
            particlesRef.current = particleSystem;
        };

        const createMars = () => {
            const marsGeometry = new THREE.SphereGeometry(5, 32, 32);
            const marsTexture = new THREE.TextureLoader().load('/textures/mars.jpg');
            const marsMaterial = new THREE.MeshStandardMaterial({
                map: marsTexture,
                roughness: 0.4,
                metalness: 0.1,
                envMapIntensity: 1.0,
            });

            const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
            marsMesh.position.set(-40, -10, -50);
            scene.add(marsMesh);
            return marsMesh;
        };

        const createSun = () => {
            const sunGeometry = new THREE.SphereGeometry(4, 64, 64);
            const sunMaterial = new THREE.MeshStandardMaterial({
                color: 0xfff4d6,
                emissive: 0xffcc66,
                emissiveIntensity: 1.5,
                roughness: 2,
                metalness: 0.2,
            });

            const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
            sunMesh.position.set(30, 15, -100);
            scene.add(sunMesh);

            const coronaGeometry = new THREE.SphereGeometry(6, 64, 64);
            const coronaMaterial = new THREE.MeshBasicMaterial({
                color: 0xffdd99,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
            });

            const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
            corona.position.copy(sunMesh.position);
            scene.add(corona);

            const sunLight = new THREE.PointLight(0xff9933, 5, 100, 2);
            sunLight.position.copy(sunMesh.position);
            scene.add(sunLight);

            const directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
            directionalLight.position.copy(sunMesh.position);
            scene.add(directionalLight);

            sunRef.current = {
                mesh: sunMesh,
                corona: corona,
                light: sunLight,
                directionalLight: directionalLight,
            };
        };

        const loadModel = () => {
            new GLTFLoader().load(
                '/models/ufo.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.setScalar(10);
                    model.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material.envMapIntensity = 1.0;
                        }
                    });
                    scene.add(model);
                    modelRef.current = model;
                },
                undefined,
                (error) => console.error('Error loading model:', error)
            );
        };

        const loadModelStone = () => {
            new GLTFLoader().load(
                '/models/stone.glb',
                (gltf) => {
                    const stoneModel = gltf.scene;
                    stoneModel.scale.setScalar(2);
                    stoneModel.position.set(0, 0, -20);
                    stoneModel.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material.envMapIntensity = 1.0;
                        }
                    });
                    scene.add(stoneModel);
                    stoneRef.current = stoneModel;
                },
                undefined,
                (error) => console.error('Error loading stone model:', error)
            );
        };

        const loadModelSpaceship = () => {
            new GLTFLoader().load(
                '/models/spaceship.glb',
                (gltf) => {
                    const spaceshipModel = gltf.scene;
                    spaceshipModel.scale.setScalar(0.04);
                    spaceshipModel.position.set(-40, 10, -50);
                    spaceshipModel.rotateY(45);
                    scene.add(spaceshipModel);
                    spaceshipRef.current = spaceshipModel;
                },
                undefined,
                (error) => console.error('Error loading spaceship model:', error)
            );
        };

        const setupLights = () => {
            scene.add(new THREE.AmbientLight(0x404040, 4));
            const pointLight = new THREE.PointLight(0x87CEEB, 100, 1000);
            pointLight.position.set(camera.position.x + 5, camera.position.y + 5, camera.position.z - 5);
            scene.add(pointLight);
        };

        const changeStoneDirection = () => {
            const randomVector = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
            stoneVelocityRef.current.lerp(randomVector, 0.1);
        };

        setInterval(changeStoneDirection, 2000);

        createParticles();
        createSun();
        loadModel();
        loadModelStone();
        loadModelSpaceship();
        setupLights();
        earthRef.current = createMars();

        const handleMouseMove = (e) => {
            mousePosition.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
                movementX: e.movementX || 0,
                movementY: e.movementY || 0,
            };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();

            if (earthRef.current) earthRef.current.rotation.y += 0.003;
            if (particlesRef.current) particlesRef.current.rotation.y += 0.0002;

            if (sunRef.current) {
                const time = Date.now() * 0.001;
                const pulseFactor = Math.sin(time * 0.5) * 0.1 + 1;
                sunRef.current.mesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
                sunRef.current.corona.scale.set(pulseFactor * 1.2, pulseFactor * 1.2, pulseFactor * 1.2);
                sunRef.current.light.intensity = 5 + Math.sin(time) * 2;
            }

            if (modelRef.current) {
                modelRef.current.position.x += (mousePosition.current.x * 10 - modelRef.current.position.x) * 0.05;
                modelRef.current.position.y += (mousePosition.current.y * 6 - modelRef.current.position.y) * 0.05;
                modelRef.current.rotation.y += 0.001;
            }

            if (stoneRef.current) {
                stoneRef.current.position.add(stoneVelocityRef.current.clone().multiplyScalar(delta * 60));
                modelRef.current.rotation.y += 0.001;
            }

            if (spaceshipRef.current) {
                const targetPosition = new THREE.Vector3(40, -10, 50);
                const currentPosition = spaceshipRef.current.position;
                // Move at 2 units per second (adjust this value to change speed)
                const speed = 0.01; // units per second
                const step = speed * delta;
                currentPosition.lerp(targetPosition, Math.min(step, 0.1)); // Cap at 0.1 per frame
                spaceshipRef.current.rotation.y += 0.005 * delta * 60; // Adjust rotation speed too
            }

            composer.render();
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            renderer.dispose();
        };
    }, []);

    return (
        <div className="home-hero--3d">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Hero3d;