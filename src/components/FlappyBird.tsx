'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, LeaderboardEntry } from '@/lib/supabase';

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

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  
  const birdRef = useRef({
    y: 250,
    velocity: 0,
    gravity: 0.6,
    jumpPower: -10
  });
  
  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef(0);
  const flapAnimationRef = useRef(0);
  const cloudsRef = useRef<Cloud[]>([]);
  
  const face1Ref = useRef<HTMLImageElement | null>(null);
  const face2Ref = useRef<HTMLImageElement | null>(null);
  const imagesLoadedRef = useRef(false);
  const lastFrameTime = useRef(0);
  const gradientsRef = useRef<{ sky?: CanvasGradient; ground?: CanvasGradient }>({});
  const deltaTimeRef = useRef(16.67);
  
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 700;
  const BIRD_SIZE = 100;
  const PIPE_WIDTH = 80;
  const PIPE_GAP = 200;
  const PIPE_SPEED = 3;
  
  const jump = useCallback(() => {
    if (showNameInput) {
      // Don't jump if name input is showing
      return;
    }
    
    // Use refs to avoid re-renders during gameplay
    if (gameState === 'playing') {
      // Just update the refs, no state changes
      birdRef.current.velocity = birdRef.current.jumpPower;
      flapAnimationRef.current = 25;
      return;
    }
    
    if (gameState === 'idle') {
      birdRef.current.velocity = birdRef.current.jumpPower;
      flapAnimationRef.current = 25;
      // Only state change is starting the game
      setGameState('playing');
    } else if (gameState === 'gameOver') {
      resetGame();
    }
  }, [gameState, showNameInput]);
  
  const resetGame = () => {
    birdRef.current.y = 250;
    birdRef.current.velocity = 0;
    pipesRef.current = [];
    frameCountRef.current = 0;
    setScore(0);
    setGameState('idle');
    setShowNameInput(false);
    setPlayerName('');
    setScoreSubmitted(false);
  };
  
  const fetchLeaderboard = async () => {
    if (!supabase) {
      return;
    }
    try {
      const { data, error } = await supabase
        .from('flappy_bird_leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      if (data) setLeaderboard(data);
    } catch {
      // Silently handle error
    }
  };
  
  const submitScore = async () => {
    if (!playerName.trim() || score === 0) return;
    
    if (!supabase) {
      setShowNameInput(false);
      setPlayerName('');
      setScoreSubmitted(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('flappy_bird_leaderboard')
        .insert([{ name: playerName.trim(), score }]);
      
      if (error) throw error;
      
      await fetchLeaderboard();
      setShowNameInput(false);
      setPlayerName('');
      setScoreSubmitted(true);
    } catch {
      // Silently handle error
      setShowNameInput(false);
      setPlayerName('');
      setScoreSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const checkIfHighScore = useCallback(() => {
    if (score === 0) return false;
    if (leaderboard.length < 10) return true;
    return score > leaderboard[9].score;
  }, [score, leaderboard]);
  
  const checkCollision = (birdY: number, pipes: Pipe[]): boolean => {
    if (birdY <= 0 || birdY + BIRD_SIZE >= CANVAS_HEIGHT) {
      return true;
    }
    
    for (const pipe of pipes) {
      if (
        pipe.x < 80 && 
        pipe.x + PIPE_WIDTH > 50
      ) {
        if (
          birdY < pipe.topHeight || 
          birdY + BIRD_SIZE > pipe.topHeight + PIPE_GAP
        ) {
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
    
    // More consistent frame timing with delta tracking
    if (currentTime) {
      if (lastFrameTime.current === 0) {
        lastFrameTime.current = currentTime;
        deltaTimeRef.current = 16.67;
      } else {
        const deltaTime = currentTime - lastFrameTime.current;
        if (deltaTime < 15) { // Skip if too fast
          requestRef.current = requestAnimationFrame(gameLoop);
          return;
        }
        deltaTimeRef.current = Math.min(deltaTime, 33); // Cap at 2 frames
        lastFrameTime.current = currentTime;
      }
    }
    
    // Disable antialiasing for better performance
    ctx.imageSmoothingEnabled = false;
    
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Sky gradient - cache it
    if (!gradientsRef.current.sky) {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#98D8E8');
      gradientsRef.current.sky = gradient;
    }
    ctx.fillStyle = gradientsRef.current.sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Initialize clouds if empty
    if (cloudsRef.current.length === 0) {
      for (let i = 0; i < 4; i++) {
        cloudsRef.current.push({
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * 150 + 20,
          width: Math.random() * 40 + 60,
          speed: Math.random() * 0.5 + 0.2
        });
      }
    }
    
    // Update and draw clouds - simplified for performance
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    cloudsRef.current.forEach(cloud => {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.width < -20) {
        cloud.x = CANVAS_WIDTH + 20;
        cloud.y = Math.random() * 150 + 20;
      }
      
      // Draw cloud as simple rectangles instead of complex arcs
      ctx.fillRect(cloud.x, cloud.y - 10, cloud.width, 20);
      ctx.fillRect(cloud.x + 10, cloud.y - 15, cloud.width - 20, 30);
    });
    
    if (gameState === 'playing') {
      birdRef.current.velocity += birdRef.current.gravity;
      birdRef.current.y += birdRef.current.velocity;
      
      frameCountRef.current++;
      if (frameCountRef.current % 125 === 0) {
        const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
        pipesRef.current.push({
          x: CANVAS_WIDTH,
          topHeight,
          passed: false
        });
      }
      
      // Move pipes with consistent speed using delta time
      const targetFPS = 60;
      const frameDelta = deltaTimeRef.current / (1000 / targetFPS);
      const adjustedSpeed = PIPE_SPEED * frameDelta;
      
      // Clean up pipes more efficiently
      const activePipes: Pipe[] = [];
      pipesRef.current.forEach(pipe => {
        pipe.x -= adjustedSpeed;
        
        // Only keep pipes that are still visible
        if (pipe.x + PIPE_WIDTH > -50) {
          activePipes.push(pipe);
          
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
            pipe.passed = true;
            // Defer score update to next idle callback
            setTimeout(() => {
              setScore(prev => prev + 1);
            }, 0);
          }
        }
      });
      pipesRef.current = activePipes;
      
      if (checkCollision(birdRef.current.y, pipesRef.current)) {
        setGameState('gameOver');
      }
    }
    
    // Draw pipes with simplified rendering for better performance
    pipesRef.current.forEach(pipe => {
      const capHeight = 30;
      
      // Top pipe - simplified
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      
      // Add simple shading
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(pipe.x + 5, 0, 10, pipe.topHeight - capHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(pipe.x + PIPE_WIDTH - 15, 0, 10, pipe.topHeight - capHeight);
      
      // Pipe cap (top)
      ctx.fillStyle = '#3e8e41';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - capHeight, PIPE_WIDTH + 10, capHeight);
      
      // Bottom pipe
      const bottomY = pipe.topHeight + PIPE_GAP;
      const bottomHeight = CANVAS_HEIGHT - bottomY;
      
      // Bottom pipe - simplified
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(pipe.x, bottomY + capHeight, PIPE_WIDTH, bottomHeight - capHeight);
      
      // Add simple shading
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(pipe.x + 5, bottomY + capHeight, 10, bottomHeight - capHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(pipe.x + PIPE_WIDTH - 15, bottomY + capHeight, 10, bottomHeight - capHeight);
      
      // Pipe cap (bottom)
      ctx.fillStyle = '#3e8e41';
      ctx.fillRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, capHeight);
      
      // Simple borders
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, bottomHeight);
    });
    
    // Draw ground
    const groundHeight = 20;
    
    // Cache ground gradient
    if (!gradientsRef.current.ground) {
      const groundGradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - groundHeight, 0, CANVAS_HEIGHT);
      groundGradient.addColorStop(0, '#8B7355');
      groundGradient.addColorStop(1, '#654321');
      gradientsRef.current.ground = groundGradient;
    }
    
    ctx.fillStyle = gradientsRef.current.ground;
    ctx.fillRect(0, CANVAS_HEIGHT - groundHeight, CANVAS_WIDTH, groundHeight);
    
    // Ground grass
    ctx.fillStyle = '#3d8b3d';
    ctx.fillRect(0, CANVAS_HEIGHT - groundHeight, CANVAS_WIDTH, 3);
    
    if (flapAnimationRef.current > 0) {
      flapAnimationRef.current--;
    }
    
    ctx.save();
    ctx.translate(65, birdRef.current.y + BIRD_SIZE/2);
    const angle = Math.min(Math.max(birdRef.current.velocity * 3, -30), 60) * Math.PI / 180;
    ctx.rotate(angle);
    
    if (imagesLoadedRef.current && face1Ref.current && face2Ref.current) {
      const currentImage = flapAnimationRef.current > 0 ? face2Ref.current : face1Ref.current;
      ctx.drawImage(currentImage, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    }
    
    ctx.restore();
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    if (gameState === 'idle') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Tap to Start!', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      ctx.font = '16px Arial';
      ctx.fillText('Tap or click to flap', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 30);
      ctx.textAlign = 'left';
    }
    
    if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 8-bit style font
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FF0000';
      ctx.fillText('GAME OVER', CANVAS_WIDTH/2, 60);
      
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`SCORE: ${score}`, CANVAS_WIDTH/2, 85);
      
      // Draw 8-bit style leaderboard box
      const boxX = 110;
      const boxY = 110;
      const boxWidth = 280;
      const boxHeight = 250;
      
      // Outer border
      ctx.fillStyle = '#FFF';
      ctx.fillRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4);
      
      // Inner background
      ctx.fillStyle = '#000';
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      
      // Title
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('-- HIGH SCORES --', CANVAS_WIDTH/2, boxY + 25);
      
      // Leaderboard entries
      ctx.font = '12px monospace';
      const startY = boxY + 50;
      const lineHeight = 18;
      
      if (leaderboard.length > 0) {
        leaderboard.slice(0, 10).forEach((entry, index) => {
          const y = startY + (index * lineHeight);
          
          // Rank
          if (index === 0) ctx.fillStyle = '#FFD700';
          else if (index === 1) ctx.fillStyle = '#C0C0C0';
          else if (index === 2) ctx.fillStyle = '#CD7F32';
          else ctx.fillStyle = '#FFF';
          
          ctx.textAlign = 'left';
          ctx.fillText(`${(index + 1).toString().padStart(2, '0')}.`, boxX + 15, y);
          
          // Name
          ctx.fillStyle = '#FFF';
          const truncatedName = entry.name.length > 12 ? entry.name.substring(0, 12) + '..' : entry.name;
          ctx.fillText(truncatedName, boxX + 45, y);
          
          // Score
          ctx.fillStyle = '#0FF';
          ctx.textAlign = 'right';
          ctx.fillText(entry.score.toString().padStart(4, '0'), boxX + boxWidth - 15, y);
        });
      } else {
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText('NO SCORES YET!', CANVAS_WIDTH/2, startY + 20);
      }
      
      // Play again prompt
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#0F0';
      ctx.textAlign = 'center';
      if (!showNameInput) {
        ctx.fillText('TAP TO PLAY AGAIN', CANVAS_WIDTH/2, CANVAS_HEIGHT - 50);
      }
      
      ctx.textAlign = 'left';
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, score, leaderboard, showNameInput]);
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);
  
  useEffect(() => {
    if (gameState === 'gameOver' && score > 0 && !scoreSubmitted) {
      if (checkIfHighScore()) {
        setShowNameInput(true);
      }
    }
  }, [gameState, score, checkIfHighScore, scoreSubmitted]);
  
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
  
  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    fetchLeaderboard();
  }, []);
  
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyBirdHighScore', score.toString());
    }
  }, [score, highScore]);
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 overflow-hidden">
      <div className="relative" style={{ touchAction: 'none' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-gray-800 shadow-xl cursor-pointer touch-none select-none"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            jump();
          }}
          style={{
            maxWidth: '100%',
            height: 'auto',
            imageRendering: 'pixelated',
            borderRadius: '0',
            borderStyle: 'solid',
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />
        
        {showNameInput && gameState === 'gameOver' && (
          <div 
            className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-black border-4 border-white p-4"
            style={{
              width: '280px',
              imageRendering: 'pixelated',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.5)'
            }}
          >
            <h3 className="text-green-400 font-mono font-bold text-sm mb-2 text-center">NEW HIGH SCORE!</h3>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && submitScore()}
              placeholder="ENTER NAME"
              maxLength={12}
              className="w-full px-2 py-1 bg-gray-900 text-white border-2 border-green-400 font-mono text-sm uppercase"
              style={{ imageRendering: 'pixelated' }}
              autoFocus
            />
            <button
              onClick={submitScore}
              disabled={isSubmitting || !playerName.trim()}
              className="w-full mt-2 bg-green-400 text-black font-mono font-bold py-1 border-2 border-white hover:bg-green-300 disabled:bg-gray-600 disabled:text-gray-400"
              style={{ imageRendering: 'pixelated' }}
            >
              {isSubmitting ? 'SAVING...' : 'SAVE SCORE'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}