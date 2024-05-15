import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
          <Link 
            key = {category.id} 
            to={`/${category.name.toLowerCase()}`}
            state = {{
              categoryName: category.name,
              categoryId: category.id
            }}
            className="cardlink"
          >
            <div className="category-card">
                <div className="category-image"></div>
                <p className="category-name">{category.name}</p>
            </div>
          </Link>
      ))}
  </div>
  );
};

export default CategoryList;


