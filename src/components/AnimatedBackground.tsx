"use client";

import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
};

type FormulaMark = {
  text: string;
  x: number;
  y: number;
  speed: number;
  alpha: number;
  phase: number;
};

const formulas = [
  "P(y|x)",
  "∇L(θ)",
  "AᵀA",
  "softmax(z)",
  "E[x]",
  "Σwᵢxᵢ",
  "argmax",
  "QKᵀ/√d",
  "H(X)",
  "f: X → Y"
];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || prefersReducedMotion()) {
      return;
    }

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let nodes: NodePoint[] = [];
    let marks: FormulaMark[] = [];
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const reset = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const nodeCount = Math.min(86, Math.max(44, Math.floor((width * height) / 19000)));
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 1.2 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2
      }));

      marks = formulas.map((text, index) => ({
        text,
        x: ((index + 0.6) / formulas.length) * width + (Math.random() - 0.5) * 80,
        y: Math.random() * height,
        speed: 0.12 + Math.random() * 0.22,
        alpha: 0.12 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2
      }));
    };

    const draw = (time: number) => {
      const t = time * 0.001;
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        width * 0.68 + Math.sin(t * 0.18) * 80,
        height * 0.2 + Math.cos(t * 0.16) * 50,
        0,
        width * 0.68 + Math.sin(t * 0.18) * 80,
        height * 0.2 + Math.cos(t * 0.16) * 50,
        Math.max(width, height) * 0.44
      );
      glow.addColorStop(0, "rgba(37, 99, 235, 0.13)");
      glow.addColorStop(0.45, "rgba(15, 118, 110, 0.08)");
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (const mark of marks) {
        mark.y -= mark.speed;
        if (mark.y < -30) {
          mark.y = height + 30;
          mark.x = Math.random() * width;
        }

        context.font = `${13 + Math.sin(t + mark.phase) * 1.5}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        context.fillStyle = `rgba(71, 85, 105, ${mark.alpha})`;
        context.fillText(mark.text, mark.x + Math.sin(t * 0.65 + mark.phase) * 18, mark.y);
      }

      for (const node of nodes) {
        node.vx *= 0.986;
        node.vy *= 0.986;
        node.x += node.vx + Math.cos(t + node.phase) * 0.05;
        node.y += node.vy + Math.sin(t * 0.9 + node.phase) * 0.05;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < 116) {
            context.strokeStyle = `rgba(37, 99, 235, ${0.13 * (1 - distance / 116)})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      for (const node of nodes) {
        context.fillStyle = "rgba(15, 118, 110, 0.34)";
        context.beginPath();
        context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    reset();
    window.addEventListener("resize", reset);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", reset);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90"
    />
  );
}
