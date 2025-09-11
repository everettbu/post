import PhotoAnimation from '@/components/PhotoAnimation';

export default function Home() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <PhotoAnimation />
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-12 p-8 overflow-hidden pointer-events-none">
      </div>
    </div>
  );
}