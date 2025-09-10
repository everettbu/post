-- Create the flappy_bird_leaderboard table
CREATE TABLE flappy_bird_leaderboard (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on score for faster queries
CREATE INDEX idx_score ON flappy_bird_leaderboard(score DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE flappy_bird_leaderboard ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the leaderboard
CREATE POLICY "Anyone can view leaderboard" 
  ON flappy_bird_leaderboard 
  FOR SELECT 
  USING (true);

-- Create a policy that allows anyone to insert their score
CREATE POLICY "Anyone can add their score" 
  ON flappy_bird_leaderboard 
  FOR INSERT 
  WITH CHECK (true);