import React, { useEffect, useRef, useState } from 'react';
import './Particles.css';

const Particles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const radiusRef = useRef(1);
  const animationFrameRef = useRef(null);
  
  const [text] = useState('Smart Brain');
  const [canvasSize, setCanvasSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 800, 
    height: typeof window !== 'undefined' ? window.innerHeight : 600 
  });

  const colors = ["rgba(162, 155, 254,1.0)", "rgba(108, 92, 231,1.0)", "rgba(116, 185, 255,1.0)", "rgba(9, 132, 227,1.0)", "rgba(232, 67, 147,1.0)"];

  class Particle {
    constructor(x, y, ww, wh) {
      this.x = Math.random() * ww;
      this.y = Math.random() * wh;
      this.dest = { x, y };
      this.r = Math.random() * 5 + 2;
      this.vx = (Math.random() - 0.5) * 20;
      this.vy = (Math.random() - 0.5) * 20;
      this.accX = 0;
      this.accY = 0;
      this.friction = Math.random() * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    render(ctx, mouse, radius) {
      this.accX = (this.dest.x - this.x) / 1000;
      this.accY = (this.dest.y - this.y) / 1000;
      this.vx += this.accX;
      this.vy += this.accY;
      this.vx *= this.friction;
      this.vy *= this.friction;

      this.x += this.vx;
      this.y += this.vy;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
      ctx.fill();

      const a = this.x - mouse.x;
      const b = this.y - mouse.y;
      const distance = Math.sqrt(a * a + b * b);
      
      if (distance < radius * 70) {
        this.accX = (this.x - mouse.x) / 100;
        this.accY = (this.y - mouse.y) / 100;
        this.vx += this.accX;
        this.vy += this.accY;
      }
    }
  }

  const initScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const ww = canvas.width = canvasSize.width;
    const wh = canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.font = `bold ${ww / 5}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text, ww / 2, wh / 2);

    // Get image data for particle placement
    const data = ctx.getImageData(0, 0, ww, wh).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'screen';

    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < ww; i += Math.round(ww / 150)) {
      for (let j = 0; j < wh; j += Math.round(ww / 150)) {
        if (data[(i + j * ww) * 4 + 3] > 150) {
          particlesRef.current.push(new Particle(i, j, ww, wh));
        }
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach(particle => {
      particle.render(ctx, mouseRef.current, radiusRef.current);
    });

    animationFrameRef.current = requestAnimationFrame(render);
  };

  // Event handlers
  const handleMouseMove = (e) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      mouseRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = () => {
    mouseRef.current = { x: -9999, y: -9999 };
  };

  const handleMouseClick = () => {
    radiusRef.current++;
    if (radiusRef.current === 5) {
      radiusRef.current = 0;
    }
  };

  const handleResize = () => {
    setCanvasSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  // Effects
  useEffect(() => {
    initScene();
    animationFrameRef.current = requestAnimationFrame(render);

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    initScene();
  }, [text, canvasSize]);

  return (
    <div className='container'>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ 
          display: 'block'
        }}
      />
    </div>
  );
};

export default Particles;
