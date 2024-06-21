import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import CategoryService from '../../../services/CategoryService.js';
import ProductService from '../../../services/ProductService.js';

function CategoryManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categoryImage, setCategoryImage] = useState(null);
    const [newAttributes, setNewAttributes] = useState([{ name: '' }]);
    const [nameError, setNameError] = useState('');
    const [attributeErrors, setAttributeErrors] = useState([]);
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false); // State for the How to? modal
    const [currentHowToPage, setCurrentHowToPage] = useState(1); // State for current page in How to? modal

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchProductsByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategories(categoriesData);
        } catch (error) {
            toast.error('Error fetching categories');
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProductsByCategory = async (category) => {
        try {
            const categoryData = await ProductService.getProductsByCategory(category.id);
            setProducts(categoryData);
        } catch (error) {
            console.error('Error fetching products per category: ', error);
        }
    };

    const addCategory = async (e) => {
        e.preventDefault();

        let isValid = true;
        if (newCategoryName.trim() === '') {
            setNameError('Category name cannot be empty');
            isValid = false;
        } else {
            setNameError('');
        }

        const newAttributeErrors = newAttributes.map(attr => attr.name.trim() === '' ? 'Attribute name cannot be empty' : '');
        setAttributeErrors(newAttributeErrors);
        if (newAttributeErrors.some(error => error !== '')) {
            isValid = false;
        }

        if (newAttributes.length === 0) {
            toast.error('Attributes list cannot be empty');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            const categoryRequest = {
                categoryName: newCategoryName,
                attributes: newAttributes
            };

            const newCategory = await CategoryService.createCategory(categoryRequest);
            setCategories((prevCategories) => [...prevCategories, newCategory]);
            fetchCategories();
            closeModal();
            setNewCategoryName('');
            setNewAttributes([{ name: '' }]);
            toast.success('Category created successfully!');
        } catch (error) {
            toast.error('Error adding category');
            console.error('Error adding category:', error);
        }
    };

    const deleteCategory = async () => {
        try {
            await CategoryService.deleteCategory(categoryToDelete.id);
            setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryToDelete.id));
            closeDeleteModal();
            closeModal();
            toast.success('Category deleted successfully!');
        } catch (error) {
            toast.error('Error deleting category');
            console.error('Error deleting category:', error);
        }
    };

    const showCategoryDetails = (category) => {
        setSelectedCategory(category);
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setProducts([]);
        setIsModalOpen(false);
        setNewCategoryName('');
        setCategoryImage(null);
        setNewAttributes([{ name: '' }]);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const handleAttributeChange = (index, event) => {
        const { name, value } = event.target;
        const updatedAttributes = [...newAttributes];
        updatedAttributes[index][name] = value;
        setNewAttributes(updatedAttributes);

        if (value.trim() !== '') {
            const newAttributeErrors = [...attributeErrors];
            newAttributeErrors[index] = '';
            setAttributeErrors(newAttributeErrors);
        }
    };

    const addAttributeField = () => {
        setNewAttributes([...newAttributes, { name: '' }]);
        setAttributeErrors([...attributeErrors, '']);
    };

    const removeAttributeField = (index) => {
        const updatedAttributes = [...newAttributes];
        updatedAttributes.splice(index, 1);
        setNewAttributes(updatedAttributes);

        const newAttributeErrors = [...attributeErrors];
        newAttributeErrors.splice(index, 1);
        setAttributeErrors(newAttributeErrors);
    };

    const openHowToModal = () => {
        setIsHowToModalOpen(true);
    };

    const closeHowToModal = () => {
        setIsHowToModalOpen(false);
        setCurrentHowToPage(1); // Reset to first page when closing
    };

    const nextHowToPage = () => {
        setCurrentHowToPage((prevPage) => Math.min(prevPage + 1, 2)); // Max 2 pages
    };

    const prevHowToPage = () => {
        setCurrentHowToPage((prevPage) => Math.max(prevPage - 1, 1)); // Min 1 page
    };

    return (
        <div className="p-6 pt-12 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-6 mt-6">
            <Toaster />
            <h1 className="text-3xl font-bold text-center">Category Management</h1>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner flex justify-between">
                <button id="create-category-button" className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-amber-500 hover:border-5 hover:border-amber-500" onClick={openModal}>Create New Category</button>
                <button id="how-to-button" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-blue-500 hover:border-5 hover:border-blue-500" onClick={openHowToModal}>How to?</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer" onClick={() => showCategoryDetails(category)}>
                        <div className="category-image bg-gray-300 h-32 mb-2 rounded-md"></div>
                        <p className="text-center font-semibold">{category.name}</p>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md space-y-4 max-w-md w-full">
                        <h2 className="text-xl font-semibold">Create New Category</h2>
                        <form onSubmit={addCategory}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Category Name:</label>
                                    <input
                                        id="category-name-input"
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700">Upload Image:</label>
                                    <input
                                        id="category-image-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCategoryImage(e.target.files[0])}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {categoryImage && (
                                        <div className="mt-2">
                                            <img src={URL.createObjectURL(categoryImage)} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700">Attributes:</label>
                                    <div className={`space-y-2 ${newAttributes.length > 5 ? 'max-h-40 overflow-y-auto' : ''}`}>
                                        {newAttributes.map((attribute, index) => (
                                            <div key={index} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    id={`attribute-name-input-${index}`}
                                                    type="text"
                                                    name="name"
                                                    value={attribute.name}
                                                    onChange={(e) => handleAttributeChange(index, e)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                                <button id={`remove-attribute-button-${index}`} type="button" onClick={() => removeAttributeField(index)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-white hover:text-red-500 hover:border-5 hover:border-red-500">X</button>
                                                {attributeErrors[index] && <p className="text-red-500 text-sm">{attributeErrors[index]}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    <button id="add-attribute-button" type="button" onClick={addAttributeField} className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-amber-500 hover:border-5 hover:border-amber-500">Add Attribute</button>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button id="close-modal-button" type="button" onClick={closeModal} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-red-500 hover:border-5 hover:border-red-500">Close</button>
                                <button id="create-category-submit-button" type="submit" className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-amber-500 hover:border-5 hover:border-amber-500">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {selectedCategory && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md space-y-4 max-w-md w-full">
                        <div className="category-image-placeholder bg-gray-300 h-32 mb-4 rounded-md"></div>
                        <h2 className="text-xl font-semibold">{selectedCategory.name}</h2>
                        <h3>Products in category: {products.length}</h3>
                        <div className="attributes-scroll-container max-h-40 overflow-y-auto">
                            <ul className="list-disc list-inside space-y-2">
                                {selectedCategory.attributes.map((attribute, index) => (
                                    <li key={index}>
                                        <span className="font-semibold">Attribute:</span> {attribute.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {products.length > 0 && (
                            <p className="text-red-500 text-sm">This category contains products. Deleting it may cause irreversible consequences. Contact website maintainers to address this issue.</p>
                        )}
                        <div className="flex justify-end space-x-2 mt-4">
                            <button type="button" onClick={closeModal} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-red-500 hover:border-5 hover:border-red-500">Close</button>
                            {products.length === 0 && (
                                <button type="button" onClick={() => openDeleteModal(selectedCategory)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-red-500 hover:border-5 hover:border-red-500">Delete</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md space-y-4 max-w-md w-full">
                        <h2 className="text-xl font-semibold">Are you sure you want to delete this category?</h2>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button id="cancel-delete-button" type="button" onClick={closeDeleteModal} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-gray-500 hover:border-5 hover:border-gray-500">No</button>
                            <button id="confirm-delete-button" type="button" onClick={deleteCategory} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-red-500 hover:border-5 hover:border-red-500">Yes</button>
                        </div>
                    </div>
                </div>
            )}
            {isHowToModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md space-y-4 max-w-md w-full relative">
                        <button id="close-how-to-modal-button" type="button" onClick={closeHowToModal} className="absolute top-4 right-4 text-gray-700 hover:text-red-500">
                            <FaTimes size={20} />
                        </button>
                        {currentHowToPage === 1 && (
                            <div>
                                <h2 className="text-xl font-semibold">How to Create a Category</h2>
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Click the "Create New Category" button.</li>
                                    <li>Fill in the category name and upload an image if desired.</li>
                                    <li>Add attributes by clicking the "Add Attribute" button and filling in the attribute names.</li>
                                    <li>Click the "Create" button to save the new category.</li>
                                </ol>
                                <div className="flex justify-center items-center mt-4 space-x-4">
                                    <span>Page 1 of 2</span>
                                    <button id="next-page-button" type="button" onClick={nextHowToPage} className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-amber-500 hover:border-5 hover:border-amber-500">Next</button>
                                </div>
                            </div>
                        )}
                        {currentHowToPage === 2 && (
                            <div>
                                <h2 className="text-xl font-semibold">How to Delete a Category</h2>
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Navigate to the category you want to delete.</li>
                                    <li>Ensure the category has no products associated with it.</li>
                                    <li>Click the "Delete" button.</li>
                                    <li>Confirm the deletion in the confirmation modal.</li>
                                </ol>
                                <div className="flex justify-center items-center mt-4 space-x-4">
                                    <button id="prev-page-button" type="button" onClick={prevHowToPage} className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-white hover:text-amber-500 hover:border-5 hover:border-amber-500">Previous</button>
                                    <span>Page 2 of 2</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryManagement;
