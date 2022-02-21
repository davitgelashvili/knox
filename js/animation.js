$(document).ready(function(){
    let group;
    let container, stats;
    const particlesData = [];
    let camera, scene, renderer;
    let positions, colors;
    let particles;
    let pointCloud;
    let particlePositions;
    let linesMesh;
    
    let colorHelpers = 0x101010;
    let colorParticles = 0xff00ff;
    let colorLines = 0x00ff00;
    
    const maxParticleCount = 1000;
    let particleCount = 500;
    const r = 800;
    const rHalf = r / 2;
    
    const effectController = {
      showDots: true,
      showLines: true,
      minDistance: 150,
      limitConnections: false,
      maxConnections: 20,
      particleCount: 500
    };
    
    init();
    animate();
    colorsChange();
    
    function init() {
      container = document.querySelector(".animation");
    
      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        4000
      );
      // camera.position.z = 1750;
      camera.position.z = 1000;


      if ($(document).innerWidth() < 992) {
        camera.position.z = 1400;
      }

    
      const controls = new THREE.OrbitControls(camera, container);
    
      controls.minDistance = 1000;
      controls.maxDistance = 3000;
    
      scene = new THREE.Scene();
      group = new THREE.Group();
    
      scene.add(group);
    
      const helper = new THREE.BoxHelper(
        new THREE.Mesh(new THREE.BoxGeometry(r, r, r))
      );
    
      helper.material.color.setHex(colorHelpers);
      helper.material.blending = THREE.AdditiveBlending;
      helper.material.transparent = true;
    
      group.add(helper);
    
      const segments = maxParticleCount * maxParticleCount;
    
      positions = new Float32Array(segments * 3);
      colors = new Float32Array(segments * 3);
    
      // dots
      const pMaterial = new THREE.PointsMaterial({
        color: colorParticles,
        size: 3,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: false
      });
    
      particles = new THREE.BufferGeometry();
      particlePositions = new Float32Array(maxParticleCount * 3);
    
      for (let i = 0; i < maxParticleCount; i++) {
        const x = Math.random() * r - r / 2;
        const y = Math.random() * r - r / 2;
        const z = Math.random() * r - r / 2;
    
        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;
    
        // add it to the geometry
        particlesData.push({
          velocity: new THREE.Vector3(
            -1 + Math.random() * 2,
            -1 + Math.random() * 2,
            -1 + Math.random() * 2
          ),
          numConnections: 0
        });
      }
    
      particles.setDrawRange(0, particleCount);
      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3).setUsage(
          THREE.DynamicDrawUsage
        )
      );
    
      // create the particle system
      pointCloud = new THREE.Points(particles, pMaterial);
    
      group.add(pointCloud);
    
      const geometry = new THREE.BufferGeometry();
    
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
      );
      geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
      );
    
      geometry.computeBoundingSphere();
      geometry.setDrawRange(0, 0);
    
      const material = new THREE.LineBasicMaterial({
        color: colorLines,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
    
      linesMesh = new THREE.LineSegments(geometry, material);
    
      group.add(linesMesh);
    
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;
    
      container.appendChild(renderer.domElement);
    
      window.addEventListener("resize", onWindowResize);
    }
    
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    function animate() {
      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;
    
      for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0;
    
      for (let i = 0; i < particleCount; i++) {
        // get the particle
        const particleData = particlesData[i];
    
        particlePositions[i * 3] += particleData.velocity.x;
        particlePositions[i * 3 + 1] += particleData.velocity.y;
        particlePositions[i * 3 + 2] += particleData.velocity.z;
    
        if (
          particlePositions[i * 3 + 1] < -rHalf ||
          particlePositions[i * 3 + 1] > rHalf
        )
          particleData.velocity.y = -particleData.velocity.y;
    
        if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
          particleData.velocity.x = -particleData.velocity.x;
    
        if (
          particlePositions[i * 3 + 2] < -rHalf ||
          particlePositions[i * 3 + 2] > rHalf
        )
          particleData.velocity.z = -particleData.velocity.z;
    
        if (
          effectController.limitConnections &&
          particleData.numConnections >= effectController.maxConnections
        )
          continue;
    
        // Check collision
        for (let j = i + 1; j < particleCount; j++) {
          const particleDataB = particlesData[j];
    
          if (
            effectController.limitConnections &&
            particleDataB.numConnections >= effectController.maxConnections
          )
            continue;
    
          const dx = particlePositions[i * 3] - particlePositions[j * 3];
          const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
          const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
          if (dist < effectController.minDistance) {
            particleData.numConnections++;
            particleDataB.numConnections++;
    
            const alpha = 1.0 - dist / effectController.minDistance;
    
            positions[vertexpos++] = particlePositions[i * 3];
            positions[vertexpos++] = particlePositions[i * 3 + 1];
            positions[vertexpos++] = particlePositions[i * 3 + 2];
    
            positions[vertexpos++] = particlePositions[j * 3];
            positions[vertexpos++] = particlePositions[j * 3 + 1];
            positions[vertexpos++] = particlePositions[j * 3 + 2];
    
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
    
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
            colors[colorpos++] = alpha;
    
            numConnected++;
          }
        }
      }
    
      linesMesh.geometry.setDrawRange(0, numConnected * 2);
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;
    
      pointCloud.geometry.attributes.position.needsUpdate = true;
    
      requestAnimationFrame(animate);
    
      render();
    }
    
    function getRandomColor() {
      return +`0x${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    
    function colorsChange() {
      const newColorParticles = new THREE.Color(getRandomColor());
      const newColorLines = new THREE.Color(getRandomColor());
    
      gsap
        .timeline({
          onComplete() {
            colorsChange();
          }
        })
        .to(
          pointCloud.material.color,
          {
            duration: 2,
            r: newColorParticles.r,
            g: newColorParticles.g,
            b: newColorParticles.b
          },
          0
        )
        .to(
          linesMesh.material.color,
          {
            duration: 2,
            r: newColorLines.r,
            g: newColorLines.g,
            b: newColorLines.b
          },
          0
        );
    }
    
    function render() {
      const time = Date.now() * 0.0005;
    
      group.rotation.y = time * 0.1;
      renderer.render(scene, camera);
    }
    
})
