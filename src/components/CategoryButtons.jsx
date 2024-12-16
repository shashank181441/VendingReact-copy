import React from 'react';

function CategoryButtons({ categories, onCategorySelect, activeCategory }) {
  let all = {name: "All", slug: "all"}
  return (
    <div
      id="category-buttons"
      className="mt-4 mb-3 mx-8 flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-thin"
    >
      {[all, ...categories].map((category, index) => (
        <button
        key={index}
        className={`text-md font-bold py-2 px-4 rounded-full ${
          activeCategory === category.slug || (activeCategory === '' && category.slug === 'all')
            ? 'bg-orange-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => onCategorySelect(category.slug === 'all' ? '' : category.slug)}
      >
        {category.name}
      </button>
      ))}
    </div>
  );
}

export default CategoryButtons;
