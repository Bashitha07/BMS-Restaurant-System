import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
type HeroSectionProps = {
  onSearch: (query: string) => void;
};
export function HeroSection({
  onSearch
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  return <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          BMS Kingdom of taste
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Order from your favorite menu and get it delivered in minutes
        </p>
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <input type="text" placeholder="Search for food, cuisines..." className="w-full pl-4 pr-12 py-4 rounded-full shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800 text-lg" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-105 transition-all">
            <SearchIcon size={24} />
          </button>
        </form>
      </div>
    </section>;
}