import '../../css/pages/Home.css';

import { GoSearch } from 'react-icons/go';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import LocationDropdown from '../../components/LocationDropdown.jsx';
import CategoryList from '../../components/CategoryList.jsx';
import ProductService from '../../services/ProductService.js';
import ProductCard from '../../components/ProductCardForProfile.jsx';

function Home() {
  const [vipProducts, setVipProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const allProducts = await ProductService.getProducts();
      const promotedProducts = allProducts.filter(product => product.promoted);
      setVipProducts(promotedProducts);
    } catch (error) {
      toast.error('Error fetching products.');
    }
  };

  const totalPages = Math.ceil(vipProducts.length / productsPerPage);

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
  const currentProducts = vipProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const formatProductName = (name) => {
    return name.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
  };

  return (
    <div className="p-4">
      <Toaster />
      
      <div className="bg-white shadow-md rounded-md p-6 mb-6 mx-4">
        <div className="flex items-center mb-6">
          <div className="relative flex-grow-0 w-1/3">
            <GoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
            <input type="text" className="w-full pl-10 p-2 border border-gray-300" placeholder="What are you looking for..?" />
          </div>
          <LocationDropdown />
          <button type="button" className="px-4 py-2 bg-[#ffa500] text-white hover:bg-white hover:text-[#ffa500] border border-[#ffa500]">Search</button>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-center">All Categories</h2>
        <CategoryList />
      </div>
      
      <div className="bg-gray-100 shadow-md rounded-md p-6 mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">VIP Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map(product => (
            <Link
              key={product.id}
              to={`/${formatProductName(product.category.name)}/${formatProductName(product.name)}`}
              state={{ productId: product.id }}
            >
              <ProductCard key={product.id} product={product} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          <button
            className={`px-4 py-2 rounded-none bg-gray-200 text-gray-700 hover:bg-amber-600`}
            onClick={handleFirstPage}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          <button
            className={`px-4 py-2 rounded-none bg-gray-200 text-gray-700 hover:bg-amber-600`}
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
                  className={`px-4 py-2 rounded-none ${currentPage === index + 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-amber-600`}
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
            className={`px-4 py-2 rounded-none bg-gray-200 text-gray-700 hover:bg-amber-600`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
          <button
            className={`px-4 py-2 rounded-none bg-gray-200 text-gray-700 hover:bg-amber-600`}
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
