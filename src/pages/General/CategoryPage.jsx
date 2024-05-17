import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProductCardForSearch from '../../components/ProductCardForSearch.jsx';
import ProductService from '../../services/ProductService.js';
import '../../css/pages/CategoryPage.css';

const CategoryPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  
  if (location.state === null) {
    return (
      <div>
        <p>Oops, something went wrong. Please come back later or try again.</p>
      </div>
    );
  }

  useEffect(() => {
      async function fetchProducts() {
        try {
          const productsData = await ProductService.getProductsByCategory(location.state?.categoryId);
          setProducts(productsData);
        } catch (error) {
          console.error('Error fetching products for category:', error);
        }
      }
      
      fetchProducts();
    
  }, [location.state?.categoryId]);

  return (
    <div>
      <h2>Category: {location.state?.categoryName}</h2>
      {products.length === 0 ? (
        <p>Unfortunately, there are no products in this category.</p>
      ) : (
        <div className='products-block'>
          <div className='products-grid-container'>
            <div className='margin-block' />
            <div className='products-grid-search'>
                {products.map(product => (
                  <Link 
                  key = {product.id}
                  to={`/${location.state?.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')}/${product.name.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()}`}
                  state = {{
                    productId : product.id
                  }}
                  >
                    <ProductCardForSearch key={product.id} product={product} />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;



