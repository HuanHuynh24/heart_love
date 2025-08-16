"use client";
import React, { useEffect, useRef } from "react";
export default function Heart({ setOpen, open }) {
 const audioRef = useRef(null);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.muted = false; // chắc chắn bật tiếng
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <audio ref={audioRef} autoPlay loop muted>
        <source src="/audio/nhac.m4a" type="audio/mp4" />
      </audio>
      <div className="relative w-[600px] h-[660px] max-w-full">
        <HeartbeatWrapper>
          <HeartCanvas className="h-[600px] w-[600px] max-w-full" />
        </HeartbeatWrapper>
        {/* Truyền audioRef xuống CenterText */}
           <CenterText
          text="Tên - dòng 334"
          setOpen={setOpen}
          open={open}
          playMusic={playMusic}
        />
      </div>
    </div>
  );
}

/** Heartbeat scale animation wrapper */
function HeartbeatWrapper({ children }) {
  return (
    <div className="relative w-full h-[600px] animate-heartbeat">
      {children}
      <style jsx>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(0.8);
          }
          60% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-heartbeat {
          animation: heartbeat 1.3s infinite;
        }
      `}</style>
    </div>
  );
}

/** Centered caption below the canvas */
/** Centered caption below the canvas */
function CenterText({ text, setOpen, open, playMusic }) {
  const handleClick = () => {
    setOpen(!open); // chỉ mở, không toggle nữa
    playMusic();   // phát nhạc
  };

  return (
    <div
      className="relative w-full text-center italic text-[31px] text-pink-500 mt-2 select-none cursor-pointer z-[100]"
      onClick={handleClick}
    >
      {!open ? "Mở nhật ký" : "Đóng nhật ký"}
    </div>
  );
}
/** Canvas component with particle heart system (plain JS, no libs) */
function HeartCanvas({ className = "", settings: userSettings = {} }) {
  const canvasRef = useRef(null);
  const settings = {
    particles: {
      length: 2000, // max particles
      duration: 2, // seconds
      velocity: 100, // px/sec
      effect: -1.3, // acceleration factor
      size: 13, // particle size in px
      ...(userSettings.particles || {}),
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let time;

    // --- Geometry helpers ---
    class Point {
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      clone() {
        return new Point(this.x, this.y);
      }
      length(len) {
        if (len === undefined) return Math.hypot(this.x, this.y);
        this.normalize();
        this.x *= len;
        this.y *= len;
        return this;
      }
      normalize() {
        const l = this.length();
        if (l === 0) return this;
        this.x /= l;
        this.y /= l;
        return this;
      }
    }

    // --- Particle ---
    class Particle {
      constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
      }
      initialize(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
      }
      update(dt) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.age += dt;
      }
      draw(context, image) {
        const ease = (t) => {
          t -= 1;
          return t * t * t + 1;
        };
        const size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(
          image,
          this.position.x - size / 2,
          this.position.y - size / 2,
          size,
          size
        );
      }
    }

    // --- Particle Pool ---
    class ParticlePool {
      constructor(length) {
        this.particles = new Array(length).fill(null).map(() => new Particle());
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = settings.particles.duration;
      }
      add(x, y, dx, dy) {
        const p = this.particles[this.firstFree];
        p.initialize(x, y, dx, dy);
        this.firstFree = (this.firstFree + 1) % this.particles.length;
        if (this.firstActive === this.firstFree) {
          this.firstActive = (this.firstActive + 1) % this.particles.length;
        }
      }
      update(dt) {
        const { particles } = this;
        if (this.firstActive < this.firstFree) {
          for (let i = this.firstActive; i < this.firstFree; i++)
            particles[i].update(dt);
        } else if (this.firstFree < this.firstActive) {
          for (let i = this.firstActive; i < particles.length; i++)
            particles[i].update(dt);
          for (let i = 0; i < this.firstFree; i++) particles[i].update(dt);
        }
        while (
          particles[this.firstActive].age >= this.duration &&
          this.firstActive !== this.firstFree
        ) {
          this.firstActive = (this.firstActive + 1) % particles.length;
        }
      }
      draw(context, image) {
        const { particles } = this;
        if (this.firstActive < this.firstFree) {
          for (let i = this.firstActive; i < this.firstFree; i++)
            particles[i].draw(context, image);
        } else if (this.firstFree < this.firstActive) {
          for (let i = this.firstActive; i < particles.length; i++)
            particles[i].draw(context, image);
          for (let i = 0; i < this.firstFree; i++)
            particles[i].draw(context, image);
        }
      }
    }

    // Heart curve
    function pointOnHeart(t) {
      return new Point(
        80 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) -
          50 * Math.cos(2 * t) -
          20 * Math.cos(3 * t) -
          10 * Math.cos(4 * t) +
          25
      );
    }

    // Create particle image
    const particleImage = (() => {
      const c = document.createElement("canvas");
      const cx = c.getContext("2d");
      c.width = settings.particles.size;
      c.height = settings.particles.size;
      const to = (t) => {
        const p = pointOnHeart(t);
        p.x = c.width / 2 + (p.x * c.width) / 350;
        p.y = c.height / 2 - (p.y * c.height) / 350;
        return p;
      };
      cx.beginPath();
      let t = -Math.PI;
      let p = to(t);
      cx.moveTo(p.x, p.y);
      while (t < Math.PI) {
        t += 0.01;
        p = to(t);
        cx.lineTo(p.x, p.y);
      }
      cx.closePath();
      cx.fillStyle = "#FF5CA4";
      cx.fill();
      const img = new Image();
      img.src = c.toDataURL();
      return img;
    })();

    const pool = new ParticlePool(settings.particles.length);
    const particleRate =
      settings.particles.length / settings.particles.duration; // per second

    function onResize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function render() {
      animationId = requestAnimationFrame(render);
      const newTime = Date.now() / 1000;
      const dt = newTime - (time || newTime);
      time = newTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const amount = particleRate * dt;
      for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity);
        pool.add(
          canvas.width / 2 + pos.x,
          canvas.height / 2 - pos.y,
          dir.x,
          -dir.y
        );
      }
      pool.update(dt);
      pool.draw(ctx, particleImage);
    }

    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    onResize();
    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 ${className}`} />;
}
