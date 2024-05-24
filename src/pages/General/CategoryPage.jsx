import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCardForSearch from '../../components/ProductCardForSearch.jsx';
import ProductService from '../../services/ProductService.js';
import '../../css/pages/CategoryPage.css';

const CategoryPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

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

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="p-4">
      <h2>Category: {location.state?.categoryName}</h2>
      {products.length === 0 ? (
        <p>Unfortunately, there are no products in this category.</p>
      ) : (
        <div className='products-block'>
          <div className='products-grid-container'>
            <div className='margin-block' />
            <div className='products-grid-search'>
              {currentProducts.map(product => (
                <Link 
                  key={product.id}
                  to={`/${location.state?.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')}/${product.name.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()}`}
                  state={{ productId: product.id }}
                >
                  <ProductCardForSearch key={product.id} product={product} />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            <button
              className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
              onClick={handleFirstPage}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            <button
              className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              if (index + 1 === 1 || index + 1 === 2 || index + 1 === 3 || index + 1 === totalPages) {
                return (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-amber-600`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                );
              } else if (index + 1 === 4 && totalPages > 4) {
                return (
                  <span key={index} className="px-4 py-2">...</span>
                );
              }
              return null;
            })}
            <button
              className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              &rsaquo;
            </button>
            <button
              className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;