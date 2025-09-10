import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="w-full py-6 px-8">
      <div className="flex justify-center gap-12">
        <Link 
          href="/shop" 
          className="text-4xl hover:text-gray-600 transition-colors"
        >
          Shop
        </Link>
        <Link 
          href="/games" 
          className="text-4xl hover:text-gray-600 transition-colors"
        >
          Games
        </Link>
        <Link 
          href="/emojis" 
          className="text-4xl hover:text-gray-600 transition-colors"
        >
          Joemojis
        </Link>
      </div>
    </nav>
  );
}