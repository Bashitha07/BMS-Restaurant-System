import React from 'react';
import { UtensilsIcon, CakeIcon, BeerIcon, SaladIcon, IceCreamIcon } from 'lucide-react';
type CategoryFilterProps = {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};
type CategoryItem = {
  id: string;
  name: string;
  icon: React.ReactNode;
};
export function CategoryFilter({
  activeCategory,
  onCategoryChange
}: CategoryFilterProps) {
  const categories: CategoryItem[] = [{
    id: 'all',
    name: 'All',
    icon: <UtensilsIcon className="mx-auto" size={24} />
  }, {
    id: 'kottu',
    name: 'Kottu',
    icon: <SaladIcon className="mx-auto" size={24} />
  }, {
    id: 'rice',
    name: 'Rice',
    icon: <UtensilsIcon className="mx-auto" size={24} />
  }, {
    id: 'noodles',
    name: 'Noodles',
    icon: <UtensilsIcon className="mx-auto" size={24} />
  }, {
    id: 'burgers',
    name: 'Burgers',
    icon: <UtensilsIcon className="mx-auto" size={24} />
  }, {
    id: 'submarines',
    name: 'Submarines',
    icon: <UtensilsIcon className="mx-auto" size={24} />
  }, {
    id: 'bites',
    name: 'Bites',
    icon: <CakeIcon className="mx-auto" size={24} />
  }, {
    id: 'juice',
    name: 'Fresh Juice',
    icon: <BeerIcon className="mx-auto" size={24} />
  }, {
    id: 'desserts',
    name: 'Desserts',
    icon: <IceCreamIcon className="mx-auto" size={24} />
  }];
  return <section className="bg-white py-8 shadow-md">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Explore Categories
        </h2>
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
          {categories.map(category => <button key={category.id} className={`flex-none w-24 p-4 rounded-xl text-center transition-all ${activeCategory === category.id ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform -translate-y-1' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => onCategoryChange(category.id)}>
              <div className={`mb-2 ${activeCategory === category.id ? 'text-white' : 'text-gray-700'}`}>
                {category.icon}
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </button>)}
        </div>
      </div>
    </section>;
}