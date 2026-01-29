'use client';

import { useState, useCallback } from 'react';

interface Match {
  team1: string | null;
  team2: string | null;
  winner: string | null;
  matchId: string;
}

interface QuadrantData {
  rounds: { [key: number]: Match[] };
}

interface BracketData {
  quadrants: { [key: number]: QuadrantData };
  finalFour: Match[];
  championship: Match;
  winner: string | null;
}

export type BracketType = 'food' | 'rappers' | 'stags';

const BRACKET_DATA: Record<BracketType, { teams: string[]; regions: string[]; maintainRegions: boolean }> = {
  rappers: {
    teams: [
      "Tupac", "Kendrick Lamar", "Dr. Dre", "Snoop Dogg", "Ice Cube", "E-40", "The Game", "Tyler, the Creator",
      "Vince Staples", "Schoolboy Q", "Nate Dogg", "Anderson .Paak", "Drake", "Childish Gambino", "Trippie Redd", "YG",
      "Jay-Z", "Nas", "Biggie", "DMX", "50 Cent", "Eminem", "Pop Smoke", "MF DOOM",
      "A$AP Rocky", "Joey Bada$$", "Nicki Minaj", "Action Bronson", "Meek Mill", "A$AP Ferg", "Kid Cudi", "Lil Uzi Vert",
      "Future", "Young Thug", "Lil Baby", "21 Savage", "Gunna", "Jeezy", "T.I.", "Gucci Mane",
      "Andre 3000", "Playboi Carti", "Waka Flocka", "Lil Yachty", "Kodak Black", "2 Chainz", "Big Sean", "Rich Homie Quan",
      "Kanye West", "Chief Keef", "Juice WRLD", "Pusha T", "Mike Jones", "J. Cole", "Lil Wayne", "NBA YoungBoy",
      "Kevin Gates", "Don Toliver", "Mac Miller", "Juicy J", "Twista", "Travis Scott", "Denzel Curry", "Rick Ross"
    ],
    regions: ["California", "Northeast", "Atl + Detroit", "South + Chiraq"],
    maintainRegions: true
  },
  stags: {
    teams: [
      "Cooper Nixon", "Samuel Brewer", "Robert Litscher", "Nick Wilde", "Justin Edwards", "Tarius Hamlin", "Jake Prieto", "Evan Siegel",
      "Andrew Kress", "Lorance Wong", "Owen Benjamin", "Roman Ramirez", "Zach Fogel", "Anthony Carrano", "Walter Kuhlenkamp", "Brandon Becker",
      "CJ Jackson", "James Catron", "Bryce DesJardins", "Daniel Kroshchuk", "Calvin Miller", "Luke Carfaro", "Bryce Mey", "Caleb Carfaro",
      "Grayson Therron", "Patrick Wilson", "Gabe Alencar", "Michael Houk", "Dylan Phares", "Zachariah Schlichting", "Austin Andersen", "Rich Brutto",
      "Luke Gildred", "Anderson Cynkar", "Kevin White", "Chase Cioe", "Ethan Hemby", "Brendan Cannon", "Cesar Fernandez", "James Raymond",
      "Quintin Craig", "Dylan Cotti", "Jason Malley", "Evan Gerber", "Stiles Satterlee", "Kaden Gallant", "Luke Ferris", "Wyatt Chang",
      "Mason Cotton", "Daniel Rosenberg", "Aidan Cushing", "Peter Boehm", "Connor Cryan", "Kirby Baynes", "Thanio Bright", "Jacob Fenton",
      "Jacob O'Connell", "Andrew Carrasquillo", "Ben Kim", "Benjamin Littlefield", "Tom Burton", "Michael Colangelo", "Ben Cooney", "Chris Amemiya"
    ],
    regions: ["Fat", "Stinky", "Gay", "Cookie Monster"],
    maintainRegions: false
  },
  food: {
    teams: [
      "Burger", "Pizza", "Fried chicken", "Steak", "BBQ ribs", "BBQ brisket", "Pulled pork", "Mac & cheese",
      "Hot dog", "Corn dog", "Buffalo wings", "Grilled cheese", "Chili", "Lobster roll", "Clam chowder", "Chicken Caesar salad",
      "Taco", "Burrito", "Quesadilla", "Enchiladas", "Tamales", "Fajitas", "Nachos", "Street corn (elote)",
      "Guacamole", "Taquitos", "Empanadas", "Pupusas", "Chilaquiles", "Ceviche", "Tostadas", "Paella",
      "Sushi", "Ramen", "Pho", "Pad Thai", "Fried rice", "Dumplings", "Bibimbap", "Katsu",
      "Butter chicken", "Curry", "Banh mi", "Pad see ew", "Peking duck", "Bao buns", "Bulgogi", "Teriyaki chicken",
      "Carbonara", "Bolognese", "Lasagna", "Risotto", "Gnocchi", "Panini", "Croque monsieur", "Shepherd's pie",
      "Gyro", "Falafel", "Hummus & pita", "Kebab", "Schnitzel", "Bratwurst", "Fish & chips", "Croissant"
    ],
    regions: ["American", "Latin American", "Asian", "European"],
    maintainRegions: true
  }
};

const ROUND_NAMES = ['Rd of 64', 'Rd of 32', 'Sweet 16', 'Elite 8'];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createEmptyBracket(): BracketData {
  const bracket: BracketData = {
    quadrants: {},
    finalFour: [
      { team1: null, team2: null, winner: null, matchId: 'f4-m1' },
      { team1: null, team2: null, winner: null, matchId: 'f4-m2' }
    ],
    championship: { team1: null, team2: null, winner: null, matchId: 'championship' },
    winner: null
  };

  for (let q = 1; q <= 4; q++) {
    bracket.quadrants[q] = { rounds: {} };
    for (let r = 1; r <= 4; r++) {
      const numMatches = Math.pow(2, 4 - r);
      bracket.quadrants[q].rounds[r] = [];
      for (let m = 0; m < numMatches; m++) {
        bracket.quadrants[q].rounds[r].push({
          team1: null,
          team2: null,
          winner: null,
          matchId: `q${q}-r${r}-m${m}`
        });
      }
    }
  }

  return bracket;
}

function populateBracket(teams: string[]): BracketData {
  const bracket = createEmptyBracket();

  for (let quadrant = 1; quadrant <= 4; quadrant++) {
    const startIndex = (quadrant - 1) * 16;
    const quadrantTeams = teams.slice(startIndex, startIndex + 16);

    for (let i = 0; i < 16; i += 2) {
      const matchIndex = Math.floor(i / 2);
      bracket.quadrants[quadrant].rounds[1][matchIndex] = {
        team1: quadrantTeams[i],
        team2: quadrantTeams[i + 1],
        winner: null,
        matchId: `q${quadrant}-r1-m${matchIndex}`
      };
    }
  }

  return bracket;
}

interface BracketProps {
  initialBracket?: BracketType;
}

export default function Bracket({ initialBracket = 'food' }: BracketProps) {
  const [bracketType, setBracketType] = useState<BracketType>(initialBracket);
  const [teams, setTeams] = useState<string[]>(BRACKET_DATA[initialBracket].teams);
  const [regionNames, setRegionNames] = useState<string[]>(BRACKET_DATA[initialBracket].regions);
  const [bracket, setBracket] = useState<BracketData>(() => populateBracket(BRACKET_DATA[initialBracket].teams));

  const selectBracket = useCallback((type: BracketType) => {
    const data = BRACKET_DATA[type];
    setBracketType(type);
    setTeams(data.teams);
    setRegionNames(data.regions);
    setBracket(populateBracket(data.teams));
  }, []);

  const resetBracket = useCallback(() => {
    setBracket(populateBracket(teams));
  }, [teams]);

  const randomizeTeams = useCallback(() => {
    const newTeams = shuffleArray(teams);
    setTeams(newTeams);
    setBracket(populateBracket(newTeams));
  }, [teams]);

  const selectWinner = useCallback((
    section: string,
    round: number,
    matchIndex: number,
    teamName: string
  ) => {
    if (!teamName) return;

    setBracket(prev => {
      const newBracket = JSON.parse(JSON.stringify(prev)) as BracketData;
      let match: Match | undefined;

      if (section.startsWith('q')) {
        const quadrant = parseInt(section.slice(1));
        match = newBracket.quadrants[quadrant].rounds[round][matchIndex];
      } else if (section === 'f4') {
        match = newBracket.finalFour[matchIndex];
      } else if (section === 'champ') {
        match = newBracket.championship;
      }

      if (!match) return prev;
      match.winner = teamName;

      if (section.startsWith('q')) {
        const quadrant = parseInt(section.slice(1));

        if (round < 4) {
          const nextRound = round + 1;
          const nextMatchIndex = Math.floor(matchIndex / 2);
          const teamPosition = matchIndex % 2;
          const nextMatch = newBracket.quadrants[quadrant].rounds[nextRound][nextMatchIndex];

          if (teamPosition === 0) {
            nextMatch.team1 = teamName;
          } else {
            nextMatch.team2 = teamName;
          }
        } else if (round === 4) {
          const finalFourIndex = quadrant <= 2 ? 0 : 1;
          const teamPosition = (quadrant - 1) % 2;

          if (teamPosition === 0) {
            newBracket.finalFour[finalFourIndex].team1 = teamName;
          } else {
            newBracket.finalFour[finalFourIndex].team2 = teamName;
          }
        }
      } else if (section === 'f4') {
        if (matchIndex === 0) {
          newBracket.championship.team1 = teamName;
        } else {
          newBracket.championship.team2 = teamName;
        }
      } else if (section === 'champ') {
        newBracket.winner = teamName;
      }

      return newBracket;
    });
  }, []);

  const TeamSlot = ({
    team,
    match,
    section,
    round,
    matchIndex
  }: {
    team: string | null;
    match: Match;
    section: string;
    round: number;
    matchIndex: number;
  }) => {
    const isWinner = team && match.winner === team;
    const isLoser = team && match.winner && match.winner !== team;
    const isEmpty = !team;

    return (
      <div
        onClick={() => team && !isEmpty && selectWinner(section, round, matchIndex, team)}
        className={`
          px-3 py-1.5 rounded-md text-center text-base tracking-wide transition-all truncate
          ${isEmpty
            ? 'bg-primary/10 text-muted-foreground cursor-not-allowed italic'
            : isWinner
              ? 'bg-primary text-primary-foreground cursor-pointer shadow-md shadow-primary/30'
              : isLoser
                ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed line-through opacity-50'
                : 'bg-secondary text-foreground hover:bg-primary/30 cursor-pointer'
          }
        `}
      >
        {team || 'TBD'}
      </div>
    );
  };

  const MatchComponent = ({
    match,
    section,
    round,
    matchIndex
  }: {
    match: Match;
    section: string;
    round: number;
    matchIndex: number;
  }) => (
    <div className="bg-card rounded-lg p-1.5 flex flex-col gap-1 border border-border">
      <TeamSlot team={match.team1} match={match} section={section} round={round} matchIndex={matchIndex} />
      <TeamSlot team={match.team2} match={match} section={section} round={round} matchIndex={matchIndex} />
    </div>
  );

  const QuadrantComponent = ({ quadrant, reversed }: { quadrant: number; reversed?: boolean }) => {
    const quadrantData = bracket.quadrants[quadrant];
    const rounds = [1, 2, 3, 4];

    return (
      <div className="flex-1 bg-card/50 rounded-xl p-4 border border-border backdrop-blur-sm">
        <h2 className="text-center text-primary font-bold text-2xl mb-4 underline underline-offset-4">
          {regionNames[quadrant - 1]}
        </h2>
        <div className={`flex gap-2 ${reversed ? 'flex-row-reverse' : ''}`}>
          {rounds.map((round, idx) => (
            <div key={round} className="flex-1 flex flex-col">
              <h4 className="text-sm text-muted-foreground text-center mb-2 font-medium">
                {ROUND_NAMES[idx]}
              </h4>
              <div className="flex flex-col justify-around flex-1 gap-2">
                {quadrantData.rounds[round]?.map((match, matchIndex) => (
                  <MatchComponent
                    key={match.matchId}
                    match={match}
                    section={`q${quadrant}`}
                    round={round}
                    matchIndex={matchIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Controls Bar */}
        <div className="flex justify-between items-center mb-4 bg-card/50 border border-border rounded-xl p-2 backdrop-blur-sm">
          {/* Bracket Selector - Left */}
          <div className="flex items-center gap-1">
            {(Object.keys(BRACKET_DATA) as BracketType[]).map(type => (
              <button
                key={type}
                onClick={() => selectBracket(type)}
                className={`
                  px-4 py-2 text-sm rounded-lg font-medium transition-all
                  ${bracketType === type
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/20'
                  }
                `}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Controls - Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetBracket}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/20 rounded-lg font-medium transition-all"
            >
              Reset
            </button>
            <button
              onClick={randomizeTeams}
              className="px-4 py-2 text-sm bg-secondary hover:bg-primary/30 text-foreground rounded-lg font-medium transition-all"
            >
              Randomize
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Top Half: Regions 1 & 2 */}
          <div className="flex flex-col lg:flex-row gap-4">
            <QuadrantComponent quadrant={1} />
            <QuadrantComponent quadrant={2} reversed />
          </div>

          {/* Center: Final Four and Championship */}
          <div className="bg-card/50 rounded-xl p-4 border border-border backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
              {/* Final Four */}
              <div className="flex-1 max-w-sm">
                <h3 className="text-lg text-primary text-center mb-3 font-bold">Final 4</h3>
                <div className="flex flex-row gap-2">
                  {bracket.finalFour.map((match, idx) => (
                    <div key={match.matchId} className="flex-1">
                      <MatchComponent
                        match={match}
                        section="f4"
                        round={5}
                        matchIndex={idx}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Championship */}
              <div className="flex-1 max-w-xs">
                <h3 className="text-lg text-primary text-center mb-3 font-bold">Championship</h3>
                <MatchComponent
                  match={bracket.championship}
                  section="champ"
                  round={6}
                  matchIndex={0}
                />
              </div>

              {/* Champion */}
              <div className="flex-1 max-w-xs">
                <h3 className="text-lg text-primary text-center mb-3 font-bold">Champion</h3>
                <div className={`
                  bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-lg p-4 text-center shadow-lg shadow-primary/30
                  ${bracket.winner ? 'animate-pulse' : ''}
                `}>
                  <div className="text-xl tracking-wide">
                    {bracket.winner || 'TBD'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Regions 3 & 4 */}
          <div className="flex flex-col lg:flex-row gap-4">
            <QuadrantComponent quadrant={3} />
            <QuadrantComponent quadrant={4} reversed />
          </div>
        </div>

      </div>
    </div>
  );
}
