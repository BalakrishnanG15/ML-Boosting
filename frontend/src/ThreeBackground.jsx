import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Create particle system
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 15;
            posArray[i + 1] = (Math.random() - 0.5) * 15;
            posArray[i + 2] = (Math.random() - 0.5) * 15;

            // Color variation (purple to blue)
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i] = 0.545; // R for purple
                colors[i + 1] = 0.361; // G
                colors[i + 2] = 0.965; // B
            } else if (colorChoice < 0.66) {
                colors[i] = 0.231; // R for blue
                colors[i + 1] = 0.510; // G
                colors[i + 2] = 0.965; // B
            } else {
                colors[i] = 0.925; // R for pink
                colors[i + 1] = 0.282; // G
                colors[i + 2] = 0.580; // B
            }
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Create geometric shapes
        const geometries = [
            new THREE.TorusGeometry(0.7, 0.2, 16, 100),
            new THREE.OctahedronGeometry(0.8),
            new THREE.IcosahedronGeometry(0.8),
        ];

        const shapes = [];
        geometries.forEach((geometry, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: index === 0 ? 0x8b5cf6 : index === 1 ? 0x3b82f6 : 0xec4899,
                transparent: true,
                opacity: 0.15,
                wireframe: true,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );
            shapes.push(mesh);
            scene.add(mesh);
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x8b5cf6, 1);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x3b82f6, 1);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        // Mouse movement
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotate particles
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.03;

            // Animate shapes
            shapes.forEach((shape, index) => {
                shape.rotation.x = elapsedTime * (0.3 + index * 0.1);
                shape.rotation.y = elapsedTime * (0.2 + index * 0.1);
                shape.position.y = Math.sin(elapsedTime + index) * 0.5;
            });

            // Camera movement based on mouse
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
};

export default ThreeBackground;
