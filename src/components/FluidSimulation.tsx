import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FluidSimulationProps {
  className?: string;
  dyeColor?: [number, number, number];
  intensity?: number;
  radius?: number;
  curl?: number;
  dissipation?: number;
}

export function FluidSimulation({
  className = '',
  dyeColor = [1.0, 1.0, 1.0],
  intensity = 1.0,
  radius = 0.003,
  curl = 28.0,
  dissipation = 0.985,
}: FluidSimulationProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Fluid simulation grid resolution (balanced for 60fps+ and smooth gradients)
    const simRes = 256;
    const dyeRes = 512;

    // Three.js Scene and Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    // Fullscreen Camera and Geometry
    const camera = new THREE.Camera();
    const quadGeometry = new THREE.PlaneGeometry(2, 2);

    // Determine target format
    const isHalfFloatSupported = renderer.capabilities.isWebGL2;
    const type = isHalfFloatSupported ? THREE.HalfFloatType : THREE.UnsignedByteType;

    const createDoubleFBO = (w: number, h: number) => {
      const options: THREE.RenderTargetOptions = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: type,
        depthBuffer: false,
        stencilBuffer: false,
      };
      let read = new THREE.WebGLRenderTarget(w, h, options);
      let write = new THREE.WebGLRenderTarget(w, h, options);
      return {
        read,
        write,
        swap: () => {
          const temp = read;
          read = write;
          write = temp;
        },
        dispose: () => {
          read.dispose();
          write.dispose();
        },
      };
    };

    const createFBO = (w: number, h: number) => {
      return new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: type,
        depthBuffer: false,
        stencilBuffer: false,
      });
    };

    let density = createDoubleFBO(dyeRes, dyeRes);
    let velocity = createDoubleFBO(simRes, simRes);
    let divergence = createFBO(simRes, simRes);
    let curlFBO = createFBO(simRes, simRes);
    let pressure = createDoubleFBO(simRes, simRes);

    const baseVertexShader = `
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main() {
        vUv = uv;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(position, 1.0);
      }
    `;

    // 1. Splat Shader (injected at mouse pointer)
    const splatMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTarget: { value: null },
        aspectRatio: { value: width / height },
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
        radius: { value: radius },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main() {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    // 2. Curl Shader
    const curlMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;

        void main() {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    // 3. Vorticity Confinement Shader
    const vorticityMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uCurl: { value: null },
        curl: { value: curl },
        dt: { value: 0.016 },
        texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main() {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 vel = texture2D(uVelocity, vUv).xy;
          gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    // 4. Divergence Shader
    const divergenceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;

        void main() {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    // 5. Pressure Poisson Shader (Jacobi Iteration)
    const pressureMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uDivergence: { value: null },
        texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main() {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float div = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - div) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    // 6. Gradient Subtraction Shader
    const gradientSubtractMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main() {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 vel = texture2D(uVelocity, vUv).xy;
          vel.xy -= vec2(R - L, T - B) * 0.5;
          gl_FragColor = vec4(vel, 0.0, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    // 7. Advection Shader
    const advectionMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        texelSize: { value: new THREE.Vector2(1 / simRes, 1 / simRes) },
        dt: { value: 0.016 },
        dissipation: { value: dissipation },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;

        void main() {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          gl_FragColor = dissipation * texture2D(uSource, coord);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });

    // 8. Display Shader (rendered onto canvas with mix-blend-mode: exclusion)
    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uDensity: { value: null },
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2(1 / dyeRes, 1 / dyeRes) },
      },
      vertexShader: baseVertexShader,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uDensity;
        uniform sampler2D uVelocity;

        void main() {
          vec4 d = texture2D(uDensity, vUv);
          vec2 vel = texture2D(uVelocity, vUv).xy;
          
          // Fluid normal reconstruction from density gradient
          float dL = texture2D(uDensity, vL).r;
          float dR = texture2D(uDensity, vR).r;
          float dT = texture2D(uDensity, vT).r;
          float dB = texture2D(uDensity, vB).r;
          vec3 n = normalize(vec3((dR - dL) * 2.5, (dT - dB) * 2.5, 0.8));
          
          // Specular highlights for liquid surface
          vec3 light = normalize(vec3(0.3, 0.6, 0.7));
          float spec = pow(max(dot(n, light), 0.0), 16.0) * 0.45;
          
          float densityVal = max(d.r, max(d.g, d.b));
          
          // Add subtle dynamic velocity-based luminance
          float speed = length(vel) * 0.08;
          
          // Final fluid luminance for exclusion blending:
          // In exclusion blend mode:
          // A pure white or bright fluid tone inverts the underlying pixels cleanly,
          // producing crisp, vivid contrast over red (#e30613), black (#000000), or typography.
          vec3 fluidTone = d.rgb + vec3(spec + speed);
          float alpha = smoothstep(0.005, 0.9, densityVal);
          
          gl_FragColor = vec4(fluidTone * alpha, alpha);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    // Helper Mesh & Scene for rendering passes
    const passScene = new THREE.Scene();
    const passMesh = new THREE.Mesh(quadGeometry, splatMaterial);
    passScene.add(passMesh);

    const renderPass = (material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) => {
      passMesh.material = material;
      renderer.setRenderTarget(target);
      renderer.render(passScene, camera);
    };

    // Splat helper
    const splat = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: [number, number, number],
      customRadius?: number
    ) => {
      // 1. Splat Velocity
      splatMaterial.uniforms.uTarget.value = velocity.read.texture;
      splatMaterial.uniforms.aspectRatio.value = width / height;
      splatMaterial.uniforms.point.value.set(x, y);
      splatMaterial.uniforms.color.value.set(dx, dy, 0.0);
      splatMaterial.uniforms.radius.value = (customRadius || radius) * 1.2;
      renderPass(splatMaterial, velocity.write);
      velocity.swap();

      // 2. Splat Density (Dye)
      splatMaterial.uniforms.uTarget.value = density.read.texture;
      splatMaterial.uniforms.color.value.set(color[0], color[1], color[2]);
      splatMaterial.uniforms.radius.value = customRadius || radius;
      renderPass(splatMaterial, density.write);
      density.swap();
    };

    // Mouse and Pointer Tracking
    let mouse = {
      x: 0.5,
      y: 0.5,
      prevX: 0.5,
      prevY: 0.5,
      dx: 0,
      dy: 0,
      moved: false,
    };

    let lastMoveTime = performance.now();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const normX = (clientX - rect.left) / width;
      const normY = 1.0 - (clientY - rect.top) / height;

      if (!mouse.moved) {
        mouse.prevX = normX;
        mouse.prevY = normY;
        mouse.moved = true;
      }

      mouse.dx = (normX - mouse.prevX) * 55 * intensity;
      mouse.dy = (normY - mouse.prevY) * 55 * intensity;
      mouse.x = normX;
      mouse.y = normY;

      lastMoveTime = performance.now();

      // Sub-step splats along fast cursor movements for seamless trails
      const dist = Math.hypot(normX - mouse.prevX, normY - mouse.prevY);
      const steps = Math.min(Math.max(Math.ceil(dist / 0.015), 1), 8);

      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const subX = mouse.prevX + (normX - mouse.prevX) * t;
        const subY = mouse.prevY + (normY - mouse.prevY) * t;
        splat(subX, subY, mouse.dx, mouse.dy, dyeColor);
      }

      mouse.prevX = normX;
      mouse.prevY = normY;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener('resize', handleResize);

    // Initial warm-up fluid burst
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const rx = 0.5 + Math.cos(angle) * 0.08;
        const ry = 0.5 + Math.sin(angle) * 0.08;
        const rdx = -Math.sin(angle) * 8;
        const rdy = Math.cos(angle) * 8;
        splat(rx, ry, rdx, rdy, dyeColor, 0.005);
      }
    }, 200);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.033);
      const time = clock.getElapsedTime();

      // Idle fluid motion (organic floating breathing swirl when user is stationary)
      const now = performance.now();
      if (now - lastMoveTime > 400) {
        const idleX = 0.5 + Math.sin(time * 0.8) * 0.2 + Math.cos(time * 0.3) * 0.1;
        const idleY = 0.5 + Math.cos(time * 0.7) * 0.15 + Math.sin(time * 0.4) * 0.1;
        const idleVx = Math.cos(time * 1.2) * 2.0;
        const idleVy = -Math.sin(time * 1.1) * 2.0;
        splat(idleX, idleY, idleVx, idleVy, [0.65, 0.65, 0.65], 0.002);
      }

      // Step 1: Curl & Vorticity Confinement
      curlMaterial.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(curlMaterial, curlFBO);

      vorticityMaterial.uniforms.uVelocity.value = velocity.read.texture;
      vorticityMaterial.uniforms.uCurl.value = curlFBO.texture;
      vorticityMaterial.uniforms.dt.value = delta;
      renderPass(vorticityMaterial, velocity.write);
      velocity.swap();

      // Step 2: Divergence
      divergenceMaterial.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(divergenceMaterial, divergence);

      // Step 3: Pressure solve (Poisson via Jacobi Iteration)
      pressureMaterial.uniforms.uDivergence.value = divergence.texture;
      for (let i = 0; i < 16; i++) {
        pressureMaterial.uniforms.uPressure.value = pressure.read.texture;
        renderPass(pressureMaterial, pressure.write);
        pressure.swap();
      }

      // Step 4: Gradient Subtraction (incompressibility projection)
      gradientSubtractMaterial.uniforms.uPressure.value = pressure.read.texture;
      gradientSubtractMaterial.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(gradientSubtractMaterial, velocity.write);
      velocity.swap();

      // Step 5: Advection of Velocity
      advectionMaterial.uniforms.uVelocity.value = velocity.read.texture;
      advectionMaterial.uniforms.uSource.value = velocity.read.texture;
      advectionMaterial.uniforms.dissipation.value = 0.982;
      advectionMaterial.uniforms.dt.value = delta;
      renderPass(advectionMaterial, velocity.write);
      velocity.swap();

      // Step 6: Advection of Dye/Density
      advectionMaterial.uniforms.uVelocity.value = velocity.read.texture;
      advectionMaterial.uniforms.uSource.value = density.read.texture;
      advectionMaterial.uniforms.dissipation.value = dissipation;
      renderPass(advectionMaterial, density.write);
      density.swap();

      // Step 7: Final Screen Output Pass with Specular and Normal Gradient
      displayMaterial.uniforms.uDensity.value = density.read.texture;
      displayMaterial.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(displayMaterial, null);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      density.dispose();
      velocity.dispose();
      divergence.dispose();
      curlFBO.dispose();
      pressure.dispose();

      quadGeometry.dispose();
      splatMaterial.dispose();
      curlMaterial.dispose();
      vorticityMaterial.dispose();
      divergenceMaterial.dispose();
      pressureMaterial.dispose();
      gradientSubtractMaterial.dispose();
      advectionMaterial.dispose();
      displayMaterial.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [dyeColor, intensity, radius, curl, dissipation]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      style={{
        mixBlendMode: 'exclusion',
      }}
      aria-hidden="true"
    />
  );
}
