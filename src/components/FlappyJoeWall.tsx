'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  speed: number;
}

interface FlappyJoeWallProps {
  onUnlock: () => void;
  targetScore?: number;
}

export default function FlappyJoeWall({ onUnlock, targetScore = 14 }: FlappyJoeWallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver' | 'unlocked'>('idle');
  const [score, setScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 700 });

  const birdRef = useRef({
    y: 250,
    velocity: 0,
    gravity: 0.6,
    jumpPower: -10
  });

  const pipesRef = useRef<Pipe[]>([]);
  const lastPipeSpawnTime = useRef(0);
  const flapAnimationRef = useRef(0);
  const cloudsRef = useRef<Cloud[]>([]);

  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(score);

  const face1Ref = useRef<HTMLImageElement | null>(null);
  const face2Ref = useRef<HTMLImageElement | null>(null);
  const imagesLoadedRef = useRef(false);
  const lastFrameTime = useRef(0);
  const gradientsRef = useRef<{ sky?: CanvasGradient; ground?: CanvasGradient }>({});
  const deltaTimeRef = useRef(16.67);
  const pipePositionsRef = useRef<Map<Pipe, number>>(new Map());

  const BASE_WIDTH = 500;
  const BASE_HEIGHT = 700;
  const BIRD_SIZE = 100;
  const PIPE_WIDTH = 80;
  const PIPE_GAP = 200;
  const PIPE_SPEED = 3;

  // Keep refs in sync with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Handle responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // Calculate the best fit while maintaining aspect ratio
        const aspectRatio = BASE_WIDTH / BASE_HEIGHT;
        let width = Math.min(containerWidth - 32, BASE_WIDTH);
        let height = width / aspectRatio;

        if (height > containerHeight - 100) {
          height = containerHeight - 100;
          width = height * aspectRatio;
        }

        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      birdRef.current.velocity = birdRef.current.jumpPower;
      flapAnimationRef.current = 25;
      return;
    }

    if (gameState === 'idle') {
      birdRef.current.velocity = birdRef.current.jumpPower;
      flapAnimationRef.current = 25;
      setGameState('playing');
    } else if (gameState === 'gameOver') {
      resetGame();
    }
  }, [gameState]);

  const resetGame = () => {
    birdRef.current.y = 250;
    birdRef.current.velocity = 0;
    pipesRef.current = [];
    pipePositionsRef.current.clear();
    lastPipeSpawnTime.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setGameState('idle');
  };

  const checkCollision = (birdY: number, pipes: Pipe[]): boolean => {
    if (birdY <= 0 || birdY + BIRD_SIZE >= BASE_HEIGHT) {
      return true;
    }

    for (const pipe of pipes) {
      if (pipe.x < 80 && pipe.x + PIPE_WIDTH > 50) {
        if (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.topHeight + PIPE_GAP) {
          return true;
        }
      }
    }

    return false;
  };

  const gameLoop = useCallback((currentTime?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    if (!currentTime) {
      currentTime = performance.now();
    }

    if (lastFrameTime.current === 0) {
      lastFrameTime.current = currentTime;
      deltaTimeRef.current = 16.67;
    } else {
      const deltaTime = currentTime - lastFrameTime.current;

      if (deltaTime < 8) {
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const smoothingFactor = 0.8;
      deltaTimeRef.current = deltaTimeRef.current * smoothingFactor + deltaTime * (1 - smoothingFactor);
      deltaTimeRef.current = Math.min(deltaTimeRef.current, 50);
      lastFrameTime.current = currentTime;
    }

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    // Sky gradient
    if (!gradientsRef.current.sky) {
      const gradient = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#98D8E8');
      gradientsRef.current.sky = gradient;
    }
    ctx.fillStyle = gradientsRef.current.sky;
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    // Initialize clouds
    if (cloudsRef.current.length === 0) {
      for (let i = 0; i < 4; i++) {
        cloudsRef.current.push({
          x: Math.random() * BASE_WIDTH,
          y: Math.random() * 150 + 20,
          width: Math.random() * 40 + 60,
          speed: Math.random() * 0.5 + 0.2
        });
      }
    }

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    cloudsRef.current.forEach(cloud => {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.width < -20) {
        cloud.x = BASE_WIDTH + 20;
        cloud.y = Math.random() * 150 + 20;
      }
      ctx.fillRect(cloud.x, cloud.y - 10, cloud.width, 20);
      ctx.fillRect(cloud.x + 10, cloud.y - 15, cloud.width - 20, 30);
    });

    if (gameStateRef.current === 'playing') {
      const targetFrameTime = 1000 / 60;
      const timeScale = deltaTimeRef.current / targetFrameTime;

      birdRef.current.velocity += birdRef.current.gravity * timeScale;
      birdRef.current.y += birdRef.current.velocity * timeScale;

      const currentTime = performance.now();
      const pipeSpawnInterval = 2000;

      if (lastPipeSpawnTime.current === 0) {
        lastPipeSpawnTime.current = currentTime;
      }

      if (currentTime - lastPipeSpawnTime.current >= pipeSpawnInterval) {
        const MIN_PIPE_HEIGHT = 80;
        const MIN_BOTTOM_CLEARANCE = 100;
        const maxTopHeight = BASE_HEIGHT - PIPE_GAP - MIN_BOTTOM_CLEARANCE;
        const topHeight = Math.random() * (maxTopHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;
        const newPipe = { x: BASE_WIDTH, topHeight, passed: false };
        pipesRef.current.push(newPipe);
        pipePositionsRef.current.set(newPipe, BASE_WIDTH);
        lastPipeSpawnTime.current = currentTime;
      }

      const movement = PIPE_SPEED * timeScale;
      const activePipes: Pipe[] = [];

      pipesRef.current.forEach(pipe => {
        let exactX = pipePositionsRef.current.get(pipe);
        if (exactX === undefined) {
          exactX = pipe.x;
          pipePositionsRef.current.set(pipe, exactX);
        }

        exactX -= movement;
        pipePositionsRef.current.set(pipe, exactX);
        pipe.x = Math.floor(exactX);

        if (pipe.x + PIPE_WIDTH > -50) {
          activePipes.push(pipe);

          if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
            pipe.passed = true;
            scoreRef.current += 1;

            // Check if target score reached
            if (scoreRef.current >= targetScore) {
              setScore(scoreRef.current);
              setGameState('unlocked');
              return;
            }
          }
        } else {
          pipePositionsRef.current.delete(pipe);
        }
      });
      pipesRef.current = activePipes;

      if (checkCollision(birdRef.current.y, pipesRef.current)) {
        setScore(scoreRef.current);
        setGameState('gameOver');
      }
    }

    // Draw pipes
    pipesRef.current.forEach(pipe => {
      const capHeight = 30;
      const pipeX = Math.floor(pipe.x);
      const topHeight = Math.floor(pipe.topHeight);

      // Top pipe
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(pipeX, 0, PIPE_WIDTH, topHeight);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(pipeX + 5, 0, 10, topHeight - capHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(pipeX + PIPE_WIDTH - 15, 0, 10, topHeight - capHeight);
      ctx.fillStyle = '#3e8e41';
      ctx.fillRect(pipeX - 5, topHeight - capHeight, PIPE_WIDTH + 10, capHeight);

      // Bottom pipe
      const bottomY = Math.floor(topHeight + PIPE_GAP);
      const bottomHeight = BASE_HEIGHT - bottomY;
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(pipeX, bottomY + capHeight, PIPE_WIDTH, bottomHeight - capHeight);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(pipeX + 5, bottomY + capHeight, 10, bottomHeight - capHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(pipeX + PIPE_WIDTH - 15, bottomY + capHeight, 10, bottomHeight - capHeight);
      ctx.fillStyle = '#3e8e41';
      ctx.fillRect(pipeX - 5, bottomY, PIPE_WIDTH + 10, capHeight);

      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipeX, 0, PIPE_WIDTH, topHeight);
      ctx.strokeRect(pipeX, bottomY, PIPE_WIDTH, bottomHeight);
    });

    // Draw ground
    const groundHeight = 20;
    if (!gradientsRef.current.ground) {
      const groundGradient = ctx.createLinearGradient(0, BASE_HEIGHT - groundHeight, 0, BASE_HEIGHT);
      groundGradient.addColorStop(0, '#8B7355');
      groundGradient.addColorStop(1, '#654321');
      gradientsRef.current.ground = groundGradient;
    }
    ctx.fillStyle = gradientsRef.current.ground;
    ctx.fillRect(0, BASE_HEIGHT - groundHeight, BASE_WIDTH, groundHeight);
    ctx.fillStyle = '#3d8b3d';
    ctx.fillRect(0, BASE_HEIGHT - groundHeight, BASE_WIDTH, 3);

    if (flapAnimationRef.current > 0) {
      flapAnimationRef.current--;
    }

    // Draw bird
    ctx.save();
    ctx.translate(65, birdRef.current.y + BIRD_SIZE/2);
    const angle = Math.min(Math.max(birdRef.current.velocity * 3, -30), 60) * Math.PI / 180;
    ctx.rotate(angle);

    if (imagesLoadedRef.current && face1Ref.current && face2Ref.current) {
      const currentImage = flapAnimationRef.current > 0 ? face2Ref.current : face1Ref.current;
      ctx.drawImage(currentImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    }
    ctx.restore();

    // Score display
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);

    // Idle state overlay
    if (gameStateRef.current === 'idle') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('FLAPPY JOE', BASE_WIDTH/2, BASE_HEIGHT/2 - 40);
      ctx.font = '18px Arial';
      ctx.fillStyle = '#FFF';
      ctx.fillText('Tap or click to flap', BASE_WIDTH/2, BASE_HEIGHT/2 + 10);
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#0F0';
      ctx.fillText('TAP TO START', BASE_WIDTH/2, BASE_HEIGHT/2 + 50);
      ctx.textAlign = 'left';
    }

    // Game over overlay
    if (gameStateRef.current === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', BASE_WIDTH/2, BASE_HEIGHT/2 - 40);
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`Score: ${scoreRef.current}`, BASE_WIDTH/2, BASE_HEIGHT/2 + 10);
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#0F0';
      ctx.fillText('TAP TO TRY AGAIN', BASE_WIDTH/2, BASE_HEIGHT/2 + 60);
      ctx.textAlign = 'left';
    }

    // Unlocked state overlay
    if (gameStateRef.current === 'unlocked') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
      ctx.fillStyle = '#0F0';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SITE UNLOCKED!', BASE_WIDTH/2, BASE_HEIGHT/2 - 20);
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#FFF';
      ctx.fillText('Welcome to Joe P', BASE_WIDTH/2, BASE_HEIGHT/2 + 30);
      ctx.textAlign = 'left';
    }

    if (gameStateRef.current !== 'unlocked') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [targetScore]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  // Handle unlock animation then callback
  useEffect(() => {
    if (gameState === 'unlocked') {
      const timer = setTimeout(() => {
        onUnlock();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState, onUnlock]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Touch event handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      const handleTouch = (e: TouchEvent) => {
        if (e.target === canvas) {
          e.preventDefault();
          e.stopPropagation();

          if (gameStateRef.current === 'playing') {
            birdRef.current.velocity = birdRef.current.jumpPower;
            flapAnimationRef.current = 25;
          } else if (gameStateRef.current === 'idle') {
            birdRef.current.velocity = birdRef.current.jumpPower;
            flapAnimationRef.current = 25;
            setGameState('playing');
          } else if (gameStateRef.current === 'gameOver') {
            resetGame();
          }
        }
      };

      const preventMove = (e: TouchEvent) => {
        if (e.target === canvas) {
          e.preventDefault();
        }
      };

      canvas.addEventListener('touchstart', handleTouch, { passive: false });
      canvas.addEventListener('touchmove', preventMove, { passive: false });
      canvas.addEventListener('touchend', preventMove, { passive: false });

      return () => {
        canvas.removeEventListener('touchstart', handleTouch);
        canvas.removeEventListener('touchmove', preventMove);
        canvas.removeEventListener('touchend', preventMove);
      };
    }
  }, []);

  // Load images
  useEffect(() => {
    const face1 = new window.Image();
    const face2 = new window.Image();

    face1.src = '/game/joe-1.png';
    face2.src = '/game/joe-2.png';

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        imagesLoadedRef.current = true;
      }
    };

    face1.onload = checkLoaded;
    face2.onload = checkLoaded;

    face1Ref.current = face1;
    face2Ref.current = face2;
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4 p-4">
        <canvas
          ref={canvasRef}
          width={BASE_WIDTH}
          height={BASE_HEIGHT}
          onMouseDown={() => {
            if (gameStateRef.current === 'playing') {
              birdRef.current.velocity = birdRef.current.jumpPower;
              flapAnimationRef.current = 25;
            } else if (gameStateRef.current === 'idle') {
              birdRef.current.velocity = birdRef.current.jumpPower;
              flapAnimationRef.current = 25;
              setGameState('playing');
            } else if (gameStateRef.current === 'gameOver') {
              resetGame();
            }
          }}
          className="border-4 border-gray-800 shadow-xl cursor-pointer touch-none select-none"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            imageRendering: 'pixelated',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'none'
          }}
        />
      </div>
    </div>
  );
}
