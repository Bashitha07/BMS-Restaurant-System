import React from 'react'
import PropTypes from 'prop-types'

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-orange-500 text-black shadow-md border-2 border-black'
              : 'bg-white text-black border-2 border-orange-500 hover:bg-orange-500 hover:text-black'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-orange-500 text-black shadow-md border-2 border-black'
                : 'bg-white text-black border-2 border-orange-500 hover:bg-orange-500 hover:text-black'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string,
  onCategorySelect: PropTypes.func.isRequired,
}

export default CategoryFilter