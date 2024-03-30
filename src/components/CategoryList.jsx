import React, { useState, useEffect } from 'react';
import '../css/components/CategoryList.css';

import CategoryService from '../services/CategoryService.js';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await CategoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="category-list">
    {categories.map(category => (
        <div className="category-card">
            <div className="category-image"></div>
            <p className="category-name">{category.name}</p>
        </div>
    ))}
</div>
  );
};

export default CategoryList;


