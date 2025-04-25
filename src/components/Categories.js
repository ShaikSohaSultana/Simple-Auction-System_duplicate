import React from 'react';

const Categories = ({ currentCategory, onCategoryChange }) => {
  const categories = [
    { name: 'all', icon: 'fas fa-palette', label: 'All Items' },
    { name: 'art', icon: 'fas fa-paint-brush', label: 'Art' },
    { name: 'collectibles', icon: 'fas fa-chess-queen', label: 'Collectibles' },
    { name: 'photography', icon: 'fas fa-camera', label: 'Photography' },
    { name: 'sports', icon: 'fas fa-running', label: 'Sports' },
    { name: 'virtual-worlds', icon: 'fas fa-vr-cardboard', label: 'Virtual Worlds' },
  ];

  return (
    <div className="categories">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className={`category category-${cat.name} ${currentCategory === cat.name ? 'active' : ''}`}
          data-category={cat.name}
          onClick={() => onCategoryChange(cat.name)}
        >
          <i className={cat.icon}></i> {cat.label}
        </div>
      ))}
    </div>
  );
};

export default Categories;