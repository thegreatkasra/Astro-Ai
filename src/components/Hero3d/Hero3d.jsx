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
    const earthRef = useRef(null); // Added reference for earth

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000814, 0.001);
        
        // Camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Post-processing
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.0, 0.6, 0.8
        );
        composer.addPass(bloomPass);

        // Create Milky Way particles
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
                blending: THREE.AdditiveBlending
            });

            const particleSystem = new THREE.Points(particles, particleMaterial);
            scene.add(particleSystem);
            particlesRef.current = particleSystem;
        };

        // Create mars
        const createMars = () => {
            const marsGeometry = new THREE.SphereGeometry(10, 32, 32);
            
            const marsTexture = new THREE.TextureLoader().load(
                '/textures/mars.jpg',
                (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(1, 1);
                }
            );
        
            const marsMaterial = new THREE.MeshStandardMaterial({
                map: marsTexture,
                roughness: 0.4,
                metalness: 0.1
            });
        
            const earthMesh = new THREE.Mesh(marsGeometry, marsMaterial);
            earthMesh.position.set(-40, -10, -50);
            scene.add(earthMesh);
            
            return earthMesh;
        };

        // Create Sun
        const createSun = () => {
            const sunGeometry = new THREE.SphereGeometry(4, 64, 64);
            const sunMaterial = new THREE.MeshStandardMaterial({
                color: 0xfff4d6,
                emissive: 0xffcc66,
                emissiveIntensity: 1.5,
                roughness: 2,
                metalness: 0.2
            });

            const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
            sunMesh.position.set(30, 15, -100);
            scene.add(sunMesh);

            const coronaGeometry = new THREE.SphereGeometry(6, 64, 64);
            const coronaMaterial = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
            corona.position.copy(sunMesh.position);
            scene.add(corona);

            const sunLight = new THREE.PointLight(0xff1111, 5, 100, 2);
            sunLight.position.copy(sunMesh.position);
            scene.add(sunLight);

            const directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
            directionalLight.position.copy(sunMesh.position);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            sunRef.current = {
                mesh: sunMesh,
                corona: corona,
                light: sunLight,
                directionalLight: directionalLight
            };
        };

        // Load UFO model
        const loadModel = () => {
            new GLTFLoader().load(
                '/models/ufo.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.setScalar(2);
                    scene.add(model);
                    modelRef.current = model;
                },
                undefined,
                (error) => console.error('Error loading model:', error)
            );
        };

        // Setup lights
        const setupLights = () => {
            scene.add(new THREE.AmbientLight(0x404040, 4));
            const pointLight = new THREE.PointLight(0x87CEEB, 100, 1000);
            pointLight.position.set(
                camera.position.x + 5,  
                camera.position.y + 5,  
                camera.position.z - 5   
            );
            scene.add(pointLight);
        };

        // Initialize all components
        createParticles();
        createSun();
        loadModel();
        setupLights();
        earthRef.current = createMars(); // Store earth reference

        // Mouse movement tracking
        const handleMouseMove = (e) => {
            mousePosition.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate Earth
            if (earthRef.current) {
                earthRef.current.rotation.y += 0.003;
            }

            // Rotate particles
            if (particlesRef.current) {
                particlesRef.current.rotation.y += 0.0002;
            }

            // Animate sun
            if (sunRef.current) {
                const time = Date.now() * 0.001;
                const pulseFactor = Math.sin(time * 0.5) * 0.1 + 1;
                sunRef.current.mesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
                sunRef.current.corona.scale.set(pulseFactor * 1.2, pulseFactor * 1.2, pulseFactor * 1.2);
                sunRef.current.light.intensity = 5 + Math.sin(time) * 2;
            }

            // UFO follows cursor
            if (modelRef.current) {
                modelRef.current.position.x += (mousePosition.current.x * 5 - modelRef.current.position.x) * 0.05;
                modelRef.current.position.y += (mousePosition.current.y * 3 - modelRef.current.position.y) * 0.05;
                modelRef.current.rotation.y += 0.01;
            }

            composer.render();
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            renderer.dispose();
        };
    }, []);

    return (
        <div className='home-hero--3d'>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Hero3d;