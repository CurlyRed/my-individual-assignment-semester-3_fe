import '../../../css/pages/Products.css';
import '../../../css/components/ProfileDashboardNavigation.css';
import '../../../css/pages/PostProduct.css';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ProductService from '../../../services/ProductService.js';
import CategoryService from '../../../services/CategoryService.js';
import ProductCard from '../../../components/ProductCardForProfile.jsx';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSort, setSelectedSort] = useState('');

    useEffect(() => {
        async function fetchProducts() {
            try {
                const productsData = await ProductService.getProductsForUser();
                setProducts(productsData);
                console.log(productsData)
            } catch (error) {
                console.error(error)
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

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        console.log(event.target.value)
    };

    const handleSortChange = (event) => {
        setSelectedSort(event.target.value);
    };

    let displayedProducts = selectedCategory
        ? products.filter(product => product.category.id == selectedCategory)
        : products;

    switch (selectedSort) {
        case 'newest':
            displayedProducts.sort((a, b) => new Date(b.date_of_post) - new Date(a.date_of_post));
            break;
        case 'oldest':
            displayedProducts.sort((a, b) => new Date(a.date_of_post) - new Date(b.date_of_post));  
            break;
        case 'nameAZ':
            displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameZA':
            displayedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            break;
    }

    return (
        <div className="page-content">
            <div className="page-content-2">
                <div className="filters-box">
                    <ul className='ul-style'>
                        <li className='li-selected'>
                            <span className='button-selected'>Active</span>
                        </li>
                        <li className='li-notselected'>Not Active</li>
                    </ul>
                    <div className="filters-box-buttons">
                        <div className="search-by-container">
                            <div className="search-by-inside">
                                <input className="search-input" placeholder='Search by name..'></input>
                            </div>
                        </div>
                        <div className="select-category-container">
                            <div className="select-category-inside">
                                <select className='select-style' onChange={handleCategoryChange}>
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='select-category-container'>
                            <div className='select-category-inside'>
                                <select className='select-style' onChange={handleSortChange}>
                                    <option value="">Sort by</option>
                                    <option value="newest">Newest to Oldest</option>
                                    <option value="oldest">Oldest to Newest</option>
                                    <option value="nameAZ">Name A-Z</option>
                                    <option value="nameZA">Name Z-A</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="space-line"></div>
                </div>
                <div className="products-content">
                    <div className='products-grid'>
                        {displayedProducts.length === 0 ? (
                            <div className="no-products-message">
                                <h3>Oops, seems like you did not post anything yet!</h3>
                                <p>Follow the button below to make your first post!</p>
                                <Link to="/postproduct">
                                    <button className='button-post'>
                                        Post Product
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            displayedProducts.map(product => (
                                <Link
                                    key={product.id}
                                    to={`/profile/products/${product.name.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()}`}
                                    state={{
                                        productId: product.id
                                    }}
                                >
                                    <ProductCard key={product.id} product={product} />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;
