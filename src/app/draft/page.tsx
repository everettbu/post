import Draft from '@/components/Draft';

export const metadata = {
  title: 'Mock Draft',
  description: 'Mock draft board with snake draft order',
};

export default function DraftPage() {
  return (
    <main className="pt-20">
      <Draft />
    </main>
  );
}
