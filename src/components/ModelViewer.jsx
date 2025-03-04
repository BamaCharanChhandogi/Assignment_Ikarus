import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelViewer = ({ modelUrl }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  
  // Function to convert Dropbox sharing links to direct download links
  const convertDropboxUrlToDirectLink = (url) => {
    // Check if it's a Dropbox URL
    if (!url.includes('dropbox.com')) {
      return url; // Not a Dropbox URL, return as is
    }
    
    try {
      // Extract the file name from the preview parameter
      const previewMatch = url.match(/preview=([^&]+)/);
      if (!previewMatch) {
        return url; // Can't find the preview parameter
      }
      
      const fileName = decodeURIComponent(previewMatch[1]);
      
      // Extract the folder path
      let folderPath = url.split('dropbox.com')[1].split('?')[0];
      
      // Create direct download URL
      return `https://dl.dropboxusercontent.com${folderPath}/${fileName}?dl=1`;
    } catch (error) {
      console.error('Error converting Dropbox URL:', error);
      return url; // Return original URL if anything goes wrong
    }
  };

  useEffect(() => {
    let animationFrameId;

    // Initialize scene
    const initScene = () => {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputEncoding = THREE.sRGBEncoding;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controlsRef.current = controls;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Responsive handling
      window.addEventListener('resize', handleResize);
    };

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && containerRef.current) {
        cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    // Load model
    const loadModel = () => {
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }

      // Convert the URL if it's a Dropbox sharing link
      const processedUrl = convertDropboxUrlToDirectLink(modelUrl);
      console.log('Loading model from URL:', processedUrl);

      const loader = new GLTFLoader();
      loader.load(
        processedUrl,
        (gltf) => {
          const model = gltf.scene;
          
          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Scale the model to fit in view
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          model.scale.multiplyScalar(scale);
          
          sceneRef.current.add(model);
          modelRef.current = model;
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.error('Error loading model', error);
          // Add a placeholder or error message in the scene
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
          const cube = new THREE.Mesh(geometry, material);
          sceneRef.current.add(cube);
          modelRef.current = cube;
        }
      );
    };

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Initialize everything
    initScene();
    loadModel();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [modelUrl]);

  return <div className="model-viewer" ref={containerRef}></div>;
};

export default ModelViewer;