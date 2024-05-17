import React, { useState, useEffect } from 'react';
import CategoryService from '../../services/CategoryService.js';
import LocationService from '../../services/LocationService.js';
import ProductService from '../../services/ProductService.js';
import '../../css/pages/PostProduct.css';

function PostProduct() {

    const [uploadedImages, setUploadedImages] = useState(Array(16).fill(null));
    const [firstImageUploaded, setFirstImageUploaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [name, setName] = useState('');
    const [nameCharCount, setNameCharCount] = useState(0);
    const [description, setDescription] = useState('');
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [cities, setCities] = useState([]);
    const [cityDisabled, setCityDisabled] = useState(true);
    const [selectedCity, setSelectedCity] = useState(null);
    const [productAttributes, setProductAttributes] = useState([{value: ''}]);
    const [contact_person, setContanctPerson] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [price, setPrice] = useState('')

    const MAX_NAME_LENGTH = 70;
    const MAX_DESCRIPTION_LENGTH = 9000;

    const postProduct = async () => {
        try{
            const createProductRequest = {
                productName: name,
                productDescription: description,
                productPrice: price,
                dateOfPost: new Date(),
                categoryId: selectedCategory.id,
                cityId: selectedCity.id,
                contact_person: contact_person,
                email: email,
                phone_number: phone_number,
                attributes: productAttributes
            }
    
            ProductService.createProduct(createProductRequest);
        } catch (error){
            console.error("Error while creating a product", error)
        }

    }

    const handleProductAttributeChange = (index, event) => {
        const newAttributes = [...productAttributes];
        newAttributes[index] = { value: event.target.value };
        setProductAttributes(newAttributes);
    };

    const handleNameChange = (event) => {
        const value = event.target.value;
        setName(value);
        setNameCharCount(value.length);
    };

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        setDescription(value);
        setDescriptionCharCount(value.length);
    };

    const handleCityChange = (event) => {
        const cityId = Number(event.target.value);
        if (cityId === 0) {
            setSelectedCity(null);
        } else {
            const city = cities.find((c) => c.id === cityId)
            setSelectedCity(city);
        }
    }

    const handleCategoryChange = (event) => {
        const categoryId = Number(event.target.value);
        if (categoryId === 0) { 
            setSelectedCategory(null);
            setAttributes([]);
        } else {
            const category = categories.find((cat) => cat.id === categoryId);
            setSelectedCategory(category);
        }
    };

    const handleDisctrictChange = (event) => {
        const districtId = Number(event.target.value);
        if (districtId === 0){
            setSelectedDistrict(null);
            setCities([]);
            setCityDisabled(true);
        } else {
            const district = districts.find((distr) => distr.id === districtId)
            setSelectedDistrict(district);
            setCityDisabled(false);
        }
    }

    const handleContactPersonChange = (event) => {
        const value = event.target.value;
        setContanctPerson(value);
    }

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
    }

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
        setPhoneNumber(value);
    }

    const handlePriceChange = (event) => {
        const value = event.target.value;
        setPrice(value);
    }

    useEffect(() => {
        async function fetchCategories() {
          try {
            const categoriesData = await CategoryService.getAllCategories();
            setCategories(categoriesData);
            console.log(categoriesData)
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        }
    
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            setAttributes(selectedCategory.attributes);
            console.log(attributes)
        }
    }, [selectedCategory]);

    useEffect(() => {
        async function fetchDistricts(){
            try{
                const districtsData = await LocationService.getAllLocations();
                setDistricts(districtsData);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        }

        fetchDistricts();
    }, []);

    useEffect(() => {
        if (selectedDistrict) {
            setCities(selectedDistrict.cities)
        }
    }, [selectedDistrict])

    const handleImageUpload = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const updatedImages = [...uploadedImages];
            if (!firstImageUploaded) {
                updatedImages[0] = URL.createObjectURL(file);
                setFirstImageUploaded(true);
            } else {
                let nextAvailableIndex = updatedImages.findIndex(image => image === null);
                if (nextAvailableIndex === -1) {
                    nextAvailableIndex = updatedImages.length;
                }
                updatedImages[nextAvailableIndex] = URL.createObjectURL(file);
            }
            setUploadedImages(updatedImages);
        }
    };
      
    const handleDivClick = (index) => {
        document.getElementById(`fileInput${index}`).click();
    };

    return (
        <div>
            <h1>Post Product</h1>
            <form onSubmit={postProduct}>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Describe in details*</h4>
                        <label>Enter the name*</label>
                        <input 
                            type='text' 
                            placeholder='For example, Iphone 11 with warranty'
                            value={name}
                            onChange={handleNameChange} 
                            maxLength={MAX_NAME_LENGTH}
                        />
                        <div className='chars-info'>
                            Enter at least 16 characters
                            <span>
                                {nameCharCount}
                                /
                                {MAX_NAME_LENGTH}
                            </span>
                        </div>
                        <label>Category*</label>
                        <select onChange={handleCategoryChange}> 
                            <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Picture</h4>
                        <label>First picture will be the cover for your posting. Drag to pictures to change order.</label>
                        <div className='image-container'>
                            {uploadedImages.map((imagePath, index) => (
                                <div key={index} className='image-input' onClick={() => handleDivClick(index)}>
                                    {index === 0 && firstImageUploaded && <div className='first-image-label'>First Image</div>}
                                    {imagePath && (
                                        <img src={imagePath} alt={`Image ${index + 1}`} />
                                    )}
                                    <input
                                        type='file'
                                        id={`fileInput${index}`}
                                        accept='image/*'
                                        onChange={(e) => handleImageUpload(e, index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {attributes.map((attribute, index) => (
                <div className='content-block' key={attribute.id}>
                    <div className='content'>
                        <h4>{attribute.name}</h4>
                        <h3>Note, you will not be able to edit this value in the future!</h3>
                        <label>Enter the {attribute.name}*</label>
                        <input
                            type='text'
                            value={productAttributes[index] ? productAttributes[index].value : ''}
                            onChange={(event) => handleProductAttributeChange(index, event)}
                        />
                    </div>
                </div>
                ))}
                <div className='content-block'>
                    <div className='content'>
                        <h4>Description</h4>
                        <label>Enter the description*</label>
                        <textarea 
                        type='text' 
                        placeholder='Think of what would you like to know from posting and add it to the description'
                        value={description}
                        onChange={handleDescriptionChange}
                        maxLength={MAX_DESCRIPTION_LENGTH} 
                        />
                        <div className='chars-info'>
                            Enter at least 40 characters
                            <span>
                                {descriptionCharCount}
                                /
                                {MAX_DESCRIPTION_LENGTH}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Price</h4>
                        <label>Enter the price of the product</label>
                        <input 
                            type='number' 
                            placeholder='For example, 100$'
                            value={price}
                            onChange={handlePriceChange} 
                        />
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Location</h4>
                        <label>Choose the district*</label>
                        <select onChange={handleDisctrictChange}>
                        <option value=''>Select a district</option>
                        {districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                        </select>
                        <label>Choose the city*</label>
                        <select onChange={handleCityChange}>
                        <option value='' disabled={cityDisabled}>Select a city</option>
                        {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <h4>Contact information</h4>
                        <label>Contact person*</label>
                        <input type='text' 
                            value={contact_person}
                            onChange={handleContactPersonChange}
                        />
                        <label>Email address</label>
                        <input type='text' 
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <label>Phone number</label>
                        <input type='text' 
                            value={phone_number}
                            onChange={handlePhoneNumberChange}
                        />
                    </div>
                </div>
                <div className='content-block'>
                    <div className='content'>
                        <div className='button-group'>
                            <button type='submit' className='button-post'>Post Product</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PostProduct;