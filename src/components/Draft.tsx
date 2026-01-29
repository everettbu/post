'use client';

import { useState, useEffect, useCallback } from 'react';

interface DraftState {
  teams: string[];
  rounds: number;
  picks: (string | null)[];
  currentPick: number;
  status: 'setup' | 'drafting' | 'complete';
}

const STORAGE_KEY = 'mockDraft';

const TEAM_OPTIONS = [2, 3, 4, 5, 6];
const ROUND_OPTIONS = [6, 8, 10, 12];

const DEFAULT_TEAM_NAMES = [
  'Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6'
];

function getPickPosition(pickIndex: number, numTeams: number): { round: number; team: number } {
  const round = Math.floor(pickIndex / numTeams);
  const positionInRound = pickIndex % numTeams;
  const isEvenRound = round % 2 === 1;
  const team = isEvenRound ? (numTeams - 1 - positionInRound) : positionInRound;
  return { round, team };
}

function getPickIndex(round: number, team: number, numTeams: number): number {
  const isEvenRound = round % 2 === 1;
  const positionInRound = isEvenRound ? (numTeams - 1 - team) : team;
  return round * numTeams + positionInRound;
}

function createInitialState(): DraftState {
  return {
    teams: [],
    rounds: 0,
    picks: [],
    currentPick: 0,
    status: 'setup'
  };
}

export default function Draft() {
  const [draftState, setDraftState] = useState<DraftState>(createInitialState);
  const [selectedTeams, setSelectedTeams] = useState(4);
  const [selectedRounds, setSelectedRounds] = useState(10);
  const [editingCell, setEditingCell] = useState<{ round: number; team: number } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DraftState;
        setDraftState(parsed);
      } catch {
        // Invalid data, use default
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isLoaded && draftState.status !== 'setup') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftState));
    }
  }, [draftState, isLoaded]);

  const startDraft = useCallback(() => {
    const teams = DEFAULT_TEAM_NAMES.slice(0, selectedTeams);
    const totalPicks = selectedTeams * selectedRounds;
    setDraftState({
      teams,
      rounds: selectedRounds,
      picks: new Array(totalPicks).fill(null),
      currentPick: 0,
      status: 'drafting'
    });
  }, [selectedTeams, selectedRounds]);

  const resetDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDraftState(createInitialState());
  }, []);

  const clearPicks = useCallback(() => {
    setDraftState(prev => ({
      ...prev,
      picks: new Array(prev.picks.length).fill(null),
      currentPick: 0,
      status: 'drafting'
    }));
    setEditingCell(null);
    setInputValue('');
  }, []);

  const makePick = useCallback((value: string, round: number, team: number) => {
    if (!value.trim()) return;

    const pickIndex = getPickIndex(round, team, draftState.teams.length);

    setDraftState(prev => {
      const newPicks = [...prev.picks];
      newPicks[pickIndex] = value.trim();

      // Find the next empty pick
      let nextPick = prev.currentPick;
      for (let i = 0; i < prev.picks.length; i++) {
        if (newPicks[i] === null) {
          nextPick = i;
          break;
        }
        if (i === prev.picks.length - 1) {
          nextPick = prev.picks.length; // All picks made
        }
      }

      const isComplete = newPicks.every(p => p !== null);

      return {
        ...prev,
        picks: newPicks,
        currentPick: nextPick,
        status: isComplete ? 'complete' : 'drafting'
      };
    });

    setEditingCell(null);
    setInputValue('');
  }, [draftState.teams.length]);

  const getPick = useCallback((round: number, team: number): string | null => {
    const pickIndex = getPickIndex(round, team, draftState.teams.length);
    return draftState.picks[pickIndex] ?? null;
  }, [draftState.picks, draftState.teams.length]);

  const getCurrentPickPosition = useCallback(() => {
    if (draftState.currentPick >= draftState.picks.length) return null;
    return getPickPosition(draftState.currentPick, draftState.teams.length);
  }, [draftState.currentPick, draftState.picks.length, draftState.teams.length]);

  const handleCellClick = useCallback((round: number, team: number) => {
    const existingPick = getPick(round, team);
    setEditingCell({ round, team });
    setInputValue(existingPick || '');
  }, [getPick]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingCell) {
      makePick(inputValue, editingCell.round, editingCell.team);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setInputValue('');
    }
  }, [editingCell, inputValue, makePick]);

  // Don't render until loaded to avoid hydration mismatch
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Setup Phase
  if (draftState.status === 'setup') {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
        <div className="bg-card/50 rounded-xl border border-border p-8 max-w-md w-full backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-center mb-8">Mock Draft</h1>

          <div className="space-y-6">
            {/* Team Count Selector */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-medium">
                Number of Teams
              </label>
              <div className="flex gap-2">
                {TEAM_OPTIONS.map(num => (
                  <button
                    key={num}
                    onClick={() => setSelectedTeams(num)}
                    className={`
                      flex-1 px-4 py-2 rounded-lg font-medium transition-all
                      ${selectedTeams === num
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'bg-secondary text-foreground hover:bg-primary/30'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Round Count Selector */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2 font-medium">
                Number of Rounds
              </label>
              <div className="flex gap-2">
                {ROUND_OPTIONS.map(num => (
                  <button
                    key={num}
                    onClick={() => setSelectedRounds(num)}
                    className={`
                      flex-1 px-4 py-2 rounded-lg font-medium transition-all
                      ${selectedRounds === num
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'bg-secondary text-foreground hover:bg-primary/30'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startDraft}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Start Draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Draft Phase
  const currentPosition = getCurrentPickPosition();
  const totalPicks = draftState.teams.length * draftState.rounds;
  const picksMade = draftState.picks.filter(p => p !== null).length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-card/50 border border-border rounded-xl p-4 backdrop-blur-sm">
          {/* Current Pick Indicator */}
          <div className="flex items-center gap-4">
            {draftState.status === 'complete' ? (
              <div className="text-lg font-bold text-primary">
                Draft Complete!
              </div>
            ) : currentPosition ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">On the clock:</span>
                <span className="text-lg font-bold text-primary">
                  Round {currentPosition.round + 1}, Pick {currentPosition.team + 1}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({draftState.teams[currentPosition.team]})
                </span>
              </div>
            ) : null}
            <span className="text-sm text-muted-foreground">
              {picksMade}/{totalPicks} picks
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={clearPicks}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/20 rounded-lg font-medium transition-all"
            >
              Clear All
            </button>
            <button
              onClick={resetDraft}
              className="px-4 py-2 text-sm bg-secondary hover:bg-primary/30 text-foreground rounded-lg font-medium transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Draft Board */}
        <div className="bg-card/50 rounded-xl border border-border p-4 backdrop-blur-sm overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="sticky left-0 bg-card/90 backdrop-blur-sm p-2 text-sm text-muted-foreground font-medium border-b border-border z-10">
                  Round
                </th>
                {draftState.teams.map((team, idx) => (
                  <th
                    key={idx}
                    className="p-2 text-sm text-primary font-bold border-b border-border min-w-[120px]"
                  >
                    {team}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: draftState.rounds }, (_, roundIdx) => {
                const isEvenRound = roundIdx % 2 === 1;
                return (
                  <tr key={roundIdx} className={isEvenRound ? 'bg-secondary/10' : ''}>
                    <td className="sticky left-0 bg-card/90 backdrop-blur-sm p-2 text-sm text-muted-foreground font-medium border-b border-border z-10">
                      {roundIdx + 1}
                      {isEvenRound && (
                        <span className="ml-1 text-xs text-primary">←</span>
                      )}
                    </td>
                    {draftState.teams.map((_, teamIdx) => {
                      const pick = getPick(roundIdx, teamIdx);
                      const isCurrentPick = currentPosition?.round === roundIdx && currentPosition?.team === teamIdx;
                      const isEditing = editingCell?.round === roundIdx && editingCell?.team === teamIdx;

                      return (
                        <td
                          key={teamIdx}
                          className={`
                            p-1 border-b border-border
                            ${isCurrentPick && !isEditing ? 'bg-primary/20' : ''}
                          `}
                        >
                          {isEditing ? (
                            <input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={handleInputKeyDown}
                              onBlur={() => {
                                if (inputValue.trim()) {
                                  makePick(inputValue, roundIdx, teamIdx);
                                } else {
                                  setEditingCell(null);
                                  setInputValue('');
                                }
                              }}
                              autoFocus
                              className="w-full px-2 py-1.5 bg-background border border-primary rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter pick..."
                            />
                          ) : (
                            <div
                              onClick={() => handleCellClick(roundIdx, teamIdx)}
                              className={`
                                px-2 py-1.5 rounded text-sm text-center cursor-pointer transition-all truncate
                                ${pick
                                  ? 'bg-secondary text-foreground hover:bg-primary/30'
                                  : isCurrentPick
                                    ? 'bg-primary/30 text-primary font-medium hover:bg-primary/40 border border-dashed border-primary'
                                    : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50'
                                }
                              `}
                            >
                              {pick || (isCurrentPick ? 'Click to pick' : '')}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
