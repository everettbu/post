import FlappyBird from '@/components/FlappyBird';

export default function GamesPage() {
  return (
    <div 
      className="flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{ 
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
        minHeight: 'calc(100vh - 80px)'
      }}
    >
      <FlappyBird />
    </div>
  );
}