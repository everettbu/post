import FlappyBird from '@/components/FlappyBird';

export default function GamesPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden fixed inset-0"
      style={{ 
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none'
      }}
    >
      <FlappyBird />
    </div>
  );
}