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
  const [dailyHighScores, setDailyHighScores] = useState<LeaderboardEntry[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [isCheckingScore, setIsCheckingScore] = useState(false);
  const [qualifiesForLeaderboard, setQualifiesForLeaderboard] = useState(false);
  const [qualifiesForDailyLeaderboard, setQualifiesForDailyLeaderboard] = useState(false);
  
  const birdRef = useRef({
    y: 250,
    velocity: 0,
    gravity: 0.6,
    jumpPower: -10
  });
  
  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef(0);
  const lastPipeSpawnTime = useRef(0);
  const flapAnimationRef = useRef(0);
  const cloudsRef = useRef<Cloud[]>([]);
  
  // Store frequently accessed state values in refs to avoid re-creating gameLoop
  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(score);
  const leaderboardRef = useRef(leaderboard);
  const dailyHighScoresRef = useRef(dailyHighScores);
  const showNameInputRef = useRef(showNameInput);
  const isCheckingScoreRef = useRef(isCheckingScore);
  const qualifiesForLeaderboardRef = useRef(qualifiesForLeaderboard);
  const qualifiesForDailyLeaderboardRef = useRef(qualifiesForDailyLeaderboard);
  
  const face1Ref = useRef<HTMLImageElement | null>(null);
  const face2Ref = useRef<HTMLImageElement | null>(null);
  const imagesLoadedRef = useRef(false);
  const lastFrameTime = useRef(0);
  const gradientsRef = useRef<{ sky?: CanvasGradient; ground?: CanvasGradient }>({});
  const deltaTimeRef = useRef(16.67);
  const pipePositionsRef = useRef<Map<Pipe, number>>(new Map());
  
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 700;
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
  
  useEffect(() => {
    leaderboardRef.current = leaderboard;
  }, [leaderboard]);
  
  useEffect(() => {
    dailyHighScoresRef.current = dailyHighScores;
  }, [dailyHighScores]);
  
  useEffect(() => {
    showNameInputRef.current = showNameInput;
  }, [showNameInput]);
  
  useEffect(() => {
    isCheckingScoreRef.current = isCheckingScore;
  }, [isCheckingScore]);
  
  useEffect(() => {
    qualifiesForLeaderboardRef.current = qualifiesForLeaderboard;
  }, [qualifiesForLeaderboard]);
  
  useEffect(() => {
    qualifiesForDailyLeaderboardRef.current = qualifiesForDailyLeaderboard;
  }, [qualifiesForDailyLeaderboard]);
  
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
      // Don't allow reset if score qualifies for either leaderboard and hasn't been submitted
      if ((qualifiesForLeaderboard || qualifiesForDailyLeaderboard) && !scoreSubmitted) {
        // Force show name input if it's not already showing
        if (!showNameInput) {
          setShowNameInput(true);
        }
        return;
      }
      resetGame();
    }
  }, [gameState, showNameInput, qualifiesForLeaderboard, qualifiesForDailyLeaderboard, scoreSubmitted]);
  
  const resetGame = () => {
    birdRef.current.y = 250;
    birdRef.current.velocity = 0;
    pipesRef.current = [];
    pipePositionsRef.current.clear();
    frameCountRef.current = 0;
    lastPipeSpawnTime.current = 0;
    scoreRef.current = 0;  // Reset the score ref
    setScore(0);
    setGameState('idle');
    setShowNameInput(false);
    setPlayerName('');
    setScoreSubmitted(false);
    setIsCheckingScore(false);
    setQualifiesForLeaderboard(false);
    setQualifiesForDailyLeaderboard(false);
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
  
  const fetchDailyHighScores = async () => {
    if (!supabase) {
      return;
    }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data, error } = await supabase
        .from('flappy_bird_leaderboard')
        .select('*')
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .order('score', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      if (data) setDailyHighScores(data);
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
      setIsCheckingScore(false);
      setQualifiesForLeaderboard(false);
      setQualifiesForDailyLeaderboard(false);
      setQualifiesForDailyLeaderboard(false);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('flappy_bird_leaderboard')
        .insert([{ name: playerName.trim(), score }]);
      
      if (error) throw error;
      
      await fetchLeaderboard();
      await fetchDailyHighScores();
      setShowNameInput(false);
      setPlayerName('');
      setScoreSubmitted(true);
      setIsCheckingScore(false);
      setQualifiesForLeaderboard(false);
      setQualifiesForDailyLeaderboard(false);
    } catch {
      // Silently handle error
      setShowNameInput(false);
      setPlayerName('');
      setScoreSubmitted(true);
      setIsCheckingScore(false);
      setQualifiesForLeaderboard(false);
      setQualifiesForDailyLeaderboard(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
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
    if (!currentTime) {
      currentTime = performance.now();
    }
    
    if (lastFrameTime.current === 0) {
      lastFrameTime.current = currentTime;
      deltaTimeRef.current = 16.67;
    } else {
      const deltaTime = currentTime - lastFrameTime.current;
      
      // Skip frame if less than 8ms (>120fps) to prevent micro-stutters
      if (deltaTime < 8) {
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      // Smooth out delta time with rolling average for more consistent motion
      const smoothingFactor = 0.8;
      deltaTimeRef.current = deltaTimeRef.current * smoothingFactor + deltaTime * (1 - smoothingFactor);
      
      // Cap at 50ms (20 FPS minimum) to prevent huge jumps
      deltaTimeRef.current = Math.min(deltaTimeRef.current, 50);
      lastFrameTime.current = currentTime;
    }
    
    // Disable antialiasing for better performance and consistent pixel rendering
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = 'low';
    
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
    
    if (gameStateRef.current === 'playing') {
      // Make bird physics frame-rate independent
      // Target 60 FPS as the baseline
      const targetFrameTime = 1000 / 60; // ~16.67ms per frame at 60 FPS
      const timeScale = deltaTimeRef.current / targetFrameTime;
      
      // Apply gravity and velocity scaled to frame time
      // This maintains the original game feel while being frame-rate independent
      birdRef.current.velocity += birdRef.current.gravity * timeScale;
      birdRef.current.y += birdRef.current.velocity * timeScale;
      
      // Spawn pipes based on time, not frame count
      const currentTime = performance.now();
      const pipeSpawnInterval = 2000; // Spawn a pipe every 2 seconds
      
      if (lastPipeSpawnTime.current === 0) {
        lastPipeSpawnTime.current = currentTime;
      }
      
      if (currentTime - lastPipeSpawnTime.current >= pipeSpawnInterval) {
        // Ensure pipes don't get too close to ground or ceiling
        const MIN_PIPE_HEIGHT = 80;  // Minimum height for top pipe
        const MIN_BOTTOM_CLEARANCE = 100;  // Minimum clearance from ground for bottom pipe
        const maxTopHeight = CANVAS_HEIGHT - PIPE_GAP - MIN_BOTTOM_CLEARANCE;
        const topHeight = Math.random() * (maxTopHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;
        const newPipe = {
          x: CANVAS_WIDTH,
          topHeight,
          passed: false
        };
        pipesRef.current.push(newPipe);
        pipePositionsRef.current.set(newPipe, CANVAS_WIDTH);
        lastPipeSpawnTime.current = currentTime;
      }
      
      // Move pipes with time-based animation for consistency
      const movement = PIPE_SPEED * timeScale;
      
      // Clean up pipes more efficiently
      const activePipes: Pipe[] = [];
      pipesRef.current.forEach(pipe => {
        // Store exact position in map, render rounded position
        let exactX = pipePositionsRef.current.get(pipe);
        if (exactX === undefined) {
          exactX = pipe.x;
          pipePositionsRef.current.set(pipe, exactX);
        }
        
        // Update exact position
        exactX -= movement;
        pipePositionsRef.current.set(pipe, exactX);
        
        // Store rounded position for rendering
        pipe.x = Math.floor(exactX);
        
        // Only keep pipes that are still visible
        if (pipe.x + PIPE_WIDTH > -50) {
          activePipes.push(pipe);
          
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
            pipe.passed = true;
            // Update score ref only - no state update during gameplay
            scoreRef.current += 1;
          }
        } else {
          // Clean up position tracking for removed pipes
          pipePositionsRef.current.delete(pipe);
        }
      });
      pipesRef.current = activePipes;
      
      if (checkCollision(birdRef.current.y, pipesRef.current)) {
        // Sync the score from ref to state when game ends
        const finalScore = scoreRef.current;
        setScore(finalScore);
        
        // Immediately check if score qualifies for leaderboard
        if (finalScore > 0 && leaderboardRef.current) {
          const qualifies = leaderboardRef.current.length < 10 || 
                           finalScore > (leaderboardRef.current[9]?.score || 0);
          setQualifiesForLeaderboard(qualifies);
          qualifiesForLeaderboardRef.current = qualifies;
        }
        
        // Check if score qualifies for daily leaderboard
        if (finalScore > 0 && dailyHighScoresRef.current) {
          const dailyQualifies = dailyHighScoresRef.current.length < 3 || 
                                finalScore > (dailyHighScoresRef.current[2]?.score || 0);
          setQualifiesForDailyLeaderboard(dailyQualifies);
          qualifiesForDailyLeaderboardRef.current = dailyQualifies;
        }
        
        setGameState('gameOver');
      }
    }
    
    // Draw pipes with simplified rendering for better performance
    pipesRef.current.forEach(pipe => {
      const capHeight = 30;
      // Use the already-rounded pipe.x position
      const pipeX = Math.floor(pipe.x);
      const topHeight = Math.floor(pipe.topHeight);
      
      // Top pipe - simplified
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(pipeX, 0, PIPE_WIDTH, topHeight);
      
      // Add simple shading
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(pipeX + 5, 0, 10, topHeight - capHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(pipeX + PIPE_WIDTH - 15, 0, 10, topHeight - capHeight);
      
      // Pipe cap (top)
      ctx.fillStyle = '#3e8e41';
      ctx.fillRect(pipeX - 5, topHeight - capHeight, PIPE_WIDTH + 10, capHeight);
      
      // Bottom pipe
      const bottomY = Math.floor(topHeight + PIPE_GAP);
      const bottomHeight = CANVAS_HEIGHT - bottomY;
      
      // Bottom pipe - simplified
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(pipeX, bottomY + capHeight, PIPE_WIDTH, bottomHeight - capHeight);
      
      // Add simple shading
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(pipeX + 5, bottomY + capHeight, 10, bottomHeight - capHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(pipeX + PIPE_WIDTH - 15, bottomY + capHeight, 10, bottomHeight - capHeight);
      
      // Pipe cap (bottom)
      ctx.fillStyle = '#3e8e41';
      ctx.fillRect(pipeX - 5, bottomY, PIPE_WIDTH + 10, capHeight);
      
      // Simple borders
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipeX, 0, PIPE_WIDTH, topHeight);
      ctx.strokeRect(pipeX, bottomY, PIPE_WIDTH, bottomHeight);
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
    ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);
    
    if (gameStateRef.current === 'idle') {
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
    
    if (gameStateRef.current === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // 8-bit style font
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FF0000';
      ctx.fillText('GAME OVER', CANVAS_WIDTH/2, 60);
      
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`SCORE: ${scoreRef.current}`, CANVAS_WIDTH/2, 85);
      
      // Draw 8-bit style leaderboard box
      const boxX = 60;
      const boxY = 120;
      const boxWidth = 380;
      const boxHeight = 480;
      
      // Outer border
      ctx.fillStyle = '#FFF';
      ctx.fillRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4);
      
      // Inner background
      ctx.fillStyle = '#000';
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      
      // Title
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('-- HIGH SCORES --', CANVAS_WIDTH/2, boxY + 35);
      
      // Leaderboard entries
      ctx.font = '16px monospace';
      const startY = boxY + 70;
      const lineHeight = 26;
      
      if (leaderboardRef.current.length > 0) {
        leaderboardRef.current.slice(0, 10).forEach((entry, index) => {
          const y = startY + (index * lineHeight);
          
          // Rank
          if (index === 0) ctx.fillStyle = '#FFD700';
          else if (index === 1) ctx.fillStyle = '#C0C0C0';
          else if (index === 2) ctx.fillStyle = '#CD7F32';
          else ctx.fillStyle = '#FFF';
          
          ctx.textAlign = 'left';
          ctx.fillText(`${(index + 1).toString().padStart(2, '0')}.`, boxX + 25, y);
          
          // Name
          ctx.fillStyle = '#FFF';
          const truncatedName = entry.name.length > 20 ? entry.name.substring(0, 20) + '..' : entry.name;
          ctx.fillText(truncatedName, boxX + 65, y);
          
          // Score
          ctx.fillStyle = '#0FF';
          ctx.textAlign = 'right';
          ctx.fillText(entry.score.toString().padStart(4, '0'), boxX + boxWidth - 25, y);
        });
      } else {
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText('NO SCORES YET!', CANVAS_WIDTH/2, startY + 30);
      }
      
      // Daily High Scores Section
      const dailyStartY = boxY + 350;
      
      // Divider line
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boxX + 20, dailyStartY - 20);
      ctx.lineTo(boxX + boxWidth - 20, dailyStartY - 20);
      ctx.stroke();
      
      // Daily title
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#00FF00';
      ctx.textAlign = 'center';
      ctx.fillText('-- TODAY\'S BEST --', CANVAS_WIDTH/2, dailyStartY + 10);
      
      // Daily scores
      ctx.font = '16px monospace';
      const dailyEntriesY = dailyStartY + 40;
      
      if (dailyHighScoresRef.current.length > 0) {
        dailyHighScoresRef.current.slice(0, 3).forEach((entry, index) => {
          const y = dailyEntriesY + (index * lineHeight);
          
          // Rank with daily colors
          if (index === 0) ctx.fillStyle = '#00FF00';
          else if (index === 1) ctx.fillStyle = '#00CC00';
          else ctx.fillStyle = '#009900';
          
          ctx.textAlign = 'left';
          ctx.fillText(`${(index + 1).toString().padStart(2, '0')}.`, boxX + 25, y);
          
          // Name
          ctx.fillStyle = '#FFF';
          const truncatedName = entry.name.length > 20 ? entry.name.substring(0, 20) + '..' : entry.name;
          ctx.fillText(truncatedName, boxX + 65, y);
          
          // Score
          ctx.fillStyle = '#0FF';
          ctx.textAlign = 'right';
          ctx.fillText(entry.score.toString().padStart(4, '0'), boxX + boxWidth - 25, y);
        });
      } else {
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText('NO SCORES TODAY!', CANVAS_WIDTH/2, dailyEntriesY + 15);
      }
      
      // Play again prompt - always show unless entering name
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#0F0';
      ctx.textAlign = 'center';
      if (!showNameInputRef.current) {
        ctx.fillText('TAP TO PLAY AGAIN', CANVAS_WIDTH/2, CANVAS_HEIGHT - 50);
      }
      
      ctx.textAlign = 'left';
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, []);
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);
  
  useEffect(() => {
    if (gameState === 'gameOver' && (qualifiesForLeaderboard || qualifiesForDailyLeaderboard) && !scoreSubmitted && !showNameInput) {
      // Immediately show name input for qualifying scores (either all-time or daily)
      setShowNameInput(true);
    }
    if (gameState === 'gameOver') {
      // Refresh daily scores when game ends
      fetchDailyHighScores();
    }
  }, [gameState, qualifiesForLeaderboard, qualifiesForDailyLeaderboard, scoreSubmitted, showNameInput]);
  
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
  
  // Add passive touch event listeners for better mobile performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Only add touch listeners on actual touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      const handleTouch = (e: TouchEvent) => {
        // Only prevent default on the canvas itself to allow page scrolling
        if (e.target === canvas) {
          e.preventDefault();
          e.stopPropagation();
          
          // Directly check states using refs to avoid stale closure issues
          if (showNameInputRef.current) {
            return;
          }
          
          if (gameStateRef.current === 'playing') {
            birdRef.current.velocity = birdRef.current.jumpPower;
            flapAnimationRef.current = 25;
          } else if (gameStateRef.current === 'idle') {
            birdRef.current.velocity = birdRef.current.jumpPower;
            flapAnimationRef.current = 25;
            setGameState('playing');
          } else if (gameStateRef.current === 'gameOver') {
            // Check if score qualifies for either leaderboard
            if ((qualifiesForLeaderboardRef.current || qualifiesForDailyLeaderboardRef.current) && !scoreSubmitted) {
              // Force show name input
              setShowNameInput(true);
            } else {
              resetGame();
            }
          }
        }
      };
      
      const preventMove = (e: TouchEvent) => {
        // Only prevent scrolling on the canvas, not the whole page
        if (e.target === canvas) {
          e.preventDefault();
        }
      };
      
      // Use passive: false to prevent default behavior on canvas only
      canvas.addEventListener('touchstart', handleTouch, { passive: false });
      canvas.addEventListener('touchmove', preventMove, { passive: false });
      canvas.addEventListener('touchend', preventMove, { passive: false });
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouch);
        canvas.removeEventListener('touchmove', preventMove);
        canvas.removeEventListener('touchend', preventMove);
      };
    }
  }, [scoreSubmitted]);
  
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
    fetchDailyHighScores();
  }, []);
  
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyBirdHighScore', score.toString());
    }
  }, [score, highScore]);
  
  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="relative w-full sm:w-auto flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={() => {
            // Direct click handling to avoid stale closures - using mouseDown for instant response
            if (showNameInputRef.current) {
              return;
            }
            
            if (gameStateRef.current === 'playing') {
              birdRef.current.velocity = birdRef.current.jumpPower;
              flapAnimationRef.current = 25;
            } else if (gameStateRef.current === 'idle') {
              birdRef.current.velocity = birdRef.current.jumpPower;
              flapAnimationRef.current = 25;
              setGameState('playing');
            } else if (gameStateRef.current === 'gameOver') {
              // Check if score qualifies for leaderboard
              if (qualifiesForLeaderboardRef.current && !scoreSubmitted) {
                // Force show name input
                setShowNameInput(true);
              } else {
                resetGame();
              }
            }
          }}
          className="border-4 border-gray-800 shadow-xl cursor-pointer touch-none select-none"
          style={{
            maxWidth: '100%',
            width: '100%',
            height: 'auto',
            maxHeight: 'calc(100vh - 100px)',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            borderRadius: '0',
            borderStyle: 'solid',
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            perspective: 1000,
            WebkitPerspective: 1000,
            willChange: 'auto',
            contain: 'layout style paint',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            touchAction: 'none'
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