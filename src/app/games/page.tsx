import FlappyBird from '@/components/FlappyBird';

export default function GamesPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden pt-12 sm:pt-20">
      <FlappyBird />
    </div>
  );
}