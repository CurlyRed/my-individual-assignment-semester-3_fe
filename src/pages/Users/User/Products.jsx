import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ProductService from '../../../services/ProductService.js';
import CategoryService from '../../../services/CategoryService.js';
import ProductCard from '../../../components/ProductCardForProfile.jsx';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        searchTerm: '',
        searchBy: 'name',
        category: '',
        sort: '',
        minPrice: '',
        maxPrice: '',
        fromDate: '',
        toDate: ''
    });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 6;

    useEffect(() => {
        async function fetchProducts() {
            try {
                const productsData = await ProductService.getProductsForUser();
                setProducts(productsData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProducts();
    }, []);

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

    useEffect(() => {
        applyFilters();
    }, [filters, products]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({ ...filters, [name]: value });
        setCurrentPage(1); // Reset to the first page
    };

    const removeFilter = (filterName) => {
        setFilters({ ...filters, [filterName]: '' });
    };

    const applyFilters = () => {
        let filtered = products;

        if (filters.searchTerm) {
            if (filters.searchBy === 'name') {
                filtered = filtered.filter(product => product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()));
            } else if (filters.searchBy === 'id') {
                filtered = filtered.filter(product => product.id === parseInt(filters.searchTerm));
            }
        }

        if (filters.category) {
            filtered = filtered.filter(product => product.category.id === parseInt(filters.category));
        }

        if (filters.minPrice) {
            filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
        }

        if (filters.fromDate) {
            filtered = filtered.filter(product => new Date(product.date_of_post) >= new Date(filters.fromDate));
        }

        if (filters.toDate) {
            filtered = filtered.filter(product => new Date(product.date_of_post) <= new Date(filters.toDate));
        }

        switch (filters.sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.date_of_post) - new Date(a.date_of_post));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.date_of_post) - new Date(b.date_of_post));
                break;
            case 'nameAZ':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameZA':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-xl font-semibold mb-2">Filters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="searchTerm" className="block mb-2 font-semibold">Search</label>
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                            name="searchTerm"
                            placeholder={`Search by ${filters.searchBy}`}
                            value={filters.searchTerm}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold">Search By</label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="searchBy"
                                    value="name"
                                    checked={filters.searchBy === 'name'}
                                    onChange={handleFilterChange}
                                    className="form-radio"
                                />
                                <span className="ml-2">Name</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="searchBy"
                                    value="id"
                                    checked={filters.searchBy === 'id'}
                                    onChange={handleFilterChange}
                                    className="form-radio"
                                />
                                <span className="ml-2">ID</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block mb-2 font-semibold">Category</label>
                        <select
                            className='border p-2 rounded w-full'
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort" className="block mb-2 font-semibold">Sort By</label>
                        <select
                            className='border p-2 rounded w-full'
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                        >
                            <option value="">Sort by</option>
                            <option value="newest">Newest to Oldest</option>
                            <option value="oldest">Oldest to Newest</option>
                            <option value="nameAZ">Name A-Z</option>
                            <option value="nameZA">Name Z-A</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="minPrice" className="block mb-2 font-semibold">Min Price</label>
                        <input
                            type="number"
                            className="border p-2 rounded w-full"
                            name="minPrice"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="block mb-2 font-semibold">Max Price</label>
                        <input
                            type="number"
                            className="border p-2 rounded w-full"
                            name="maxPrice"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="fromDate" className="block mb-2 font-semibold">From Date</label>
                        <input
                            type="date"
                            className="border p-2 rounded w-full"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="toDate" className="block mb-2 font-semibold">To Date</label>
                        <input
                            type="date"
                            className="border p-2 rounded w-full"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Applied Filters</h3>
                    <div className="flex space-x-2 mt-2">
                        {filters.searchTerm && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>{filters.searchBy === 'name' ? 'Name' : 'ID'}: {filters.searchTerm}</span>
                                <button onClick={() => removeFilter('searchTerm')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.category && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>Category: {categories.find(cat => cat.id === parseInt(filters.category))?.name}</span>
                                <button onClick={() => removeFilter('category')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.sort && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>Sort: {filters.sort}</span>
                                <button onClick={() => removeFilter('sort')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.minPrice && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>Min Price: {filters.minPrice}</span>
                                <button onClick={() => removeFilter('minPrice')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.maxPrice && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>Max Price: {filters.maxPrice}</span>
                                <button onClick={() => removeFilter('maxPrice')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.fromDate && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>From: {filters.fromDate}</span>
                                <button onClick={() => removeFilter('fromDate')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.toDate && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>To: {filters.toDate}</span>
                                <button onClick={() => removeFilter('toDate')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="space-line"></div>
            <div className="products-content">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.length === 0 ? (
                        <div className="no-products-message">
                            <h3>No products found based on filters</h3>
                        </div>
                    ) : (
                        getPaginatedProducts().map(product => (
                            <Link
                                key={product.id}
                                to={`/profile/products/${product.name.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()}`}
                                state={{ productId: product.id }}
                            >
                                <ProductCard key={product.id} product={product} />
                            </Link>
                        ))
                    )}
                </div>
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
                        onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &lsaquo;
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-amber-600`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
                        onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        &rsaquo;
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Products;
