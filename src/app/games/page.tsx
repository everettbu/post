import FlappyBird from '@/components/FlappyBird';

export default function GamesPage() {
  return (
    <div 
      className="flex flex-col items-center justify-center p-4"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        minHeight: 'calc(100vh - 80px)'
      }}
    >
      <FlappyBird />
    </div>
  );
}