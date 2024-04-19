import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../../css/components/CategoryList.css';
import '../../../css/CategoryModal.css';
import CategoryService from '../../../services/CategoryService';

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
    const [categoryImage, setCategoryImage] = useState(null);
    const [newAttributes, setNewAttributes] = useState([{ name: '', type: '' }]);
    
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const addCategory = async () => {
        try {
            if (newCategoryName.trim() === '') {
                throw new Error('Category name cannot be empty');
            }
            if (newAttributes.length === 0) {
                throw new Error('Attributes list cannot be empty');
            }
    
            const categoryRequest = {
                categoryName: newCategoryName,
                attributes: newAttributes
            };
    
            const newCategory = await CategoryService.createCategory(categoryRequest);
            
            setCategories(prevCategories => [...prevCategories, newCategory]);
            setNewCategoryName('');
            setNewAttributes([{ name: '', type: '' }]);
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };
    

    const deleteCategory = async (categoryId) => {
        try {
            await CategoryService.deleteCategory(categoryId);
            setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
            closeModal();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const showCategoryDetails = (category) => {
        setSelectedCategory(category);
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setIsNewCategoryModalOpen(false);
        setNewCategoryName('');
        setCategoryImage(null);
        setNewAttributes([{ name: '', type: '' }]);
    };

    const openNewCategoryModal = () => {
        setIsNewCategoryModalOpen(true);
    };

    const handleAttributeChange = (index, event) => {
        const { name, value } = event.target;
        const updatedAttributes = [...newAttributes];
        updatedAttributes[index][name] = value;
        setNewAttributes(updatedAttributes);
    };

    const addAttributeField = () => {
        setNewAttributes([...newAttributes, { name: '', type: '' }]);
    };

    const removeAttributeField = (index) => {
        const updatedAttributes = [...newAttributes];
        updatedAttributes.splice(index, 1);
        setNewAttributes(updatedAttributes);
    };

    return (
        <div className="category-management-container">
            <h1>Category Management</h1>
            <button className='button-create' onClick={openNewCategoryModal}>Create New Category</button>
            <Modal
                isOpen={isNewCategoryModalOpen}
                onRequestClose={closeModal}
                contentLabel="Create New Category"
                className="modal-content"
                id="categoryModal"
            >
                <h2>Create New Category</h2>
                <form onSubmit={addCategory}>
                    <label>Category Name:</label>
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                    />
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCategoryImage(e.target.files[0])}
                    />
                    <div className="image-preview-container">
                        {categoryImage && <img src={URL.createObjectURL(categoryImage)} alt="Preview" />}
                    </div>
                    <hr />
                    <div className="attributes-scroll-container">
                    <label>Attributes:</label>
                    {newAttributes.map((attribute, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="name"
                                value={attribute.name}
                                onChange={(e) => handleAttributeChange(index, e)}
                                required
                            />
                            <button className='button-remove' type="button" onClick={() => removeAttributeField(index)}>X</button>
                        </div>
                    ))}
                    <button className='button-add-attribute' type="button" onClick={addAttributeField}>Add Attribute</button>
                    </div>
                    <div className='button-container'>
                        <button className='button-close' type="button" onClick={closeModal}>Close</button>
                        <button className='button-create' type="submit">Create</button>
                    </div>
                </form>
            </Modal>
            <div className="category-list">
                {categories.map(category => (
                    <div key={category.id} className="category-card" onClick={() => showCategoryDetails(category)}>
                        <div className="category-image"></div>
                        <p className="category-name">{category.name}</p>
                    </div>
                ))}
            </div>
            {selectedCategory && (
                <Modal
                    isOpen={!!selectedCategory}
                    onRequestClose={closeModal}
                    contentLabel="Category Details"
                    className="modal-content"
                >
                    <div className="category-image-placeholder"></div>
                    <h2>{selectedCategory.name}</h2>
                    <ul className='ul-modal'>
                        {selectedCategory.attributes.map((attribute, index) => (
                            <li className='li-modal' key={index}>
                                <span className="attribute-name">{attribute.name}: </span>
                                <span className="attribute-type">{attribute.type}</span>
                            </li>
                        ))}
                    </ul>
                    <div className='button-container'>
                        <button className="button-close" onClick={closeModal}>Close</button>
                        <button className="button-delete" onClick={() => deleteCategory(selectedCategory.id)}>Delete</button>  
                    </div>              
                </Modal>
            )}
        </div>
    );
}

export default CategoryManagement;
