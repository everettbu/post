import Bracket from '@/components/Bracket';

export const metadata = {
  title: 'Bracket',
  description: 'Tournament bracket maker - Food, Rappers, and more',
};

export default function BracketPage() {
  return (
    <main className="pt-20">
      <Bracket />
    </main>
  );
}
