import React, { useState, useEffect } from 'react';
import CategoryService from '../services/CategoryService.js';
import '../css/components/CategoryList.css'; 

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
        <div className="category-card" key={category.id}>
          <div className="image-placeholder" /> {/* Added image placeholder */}
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;


