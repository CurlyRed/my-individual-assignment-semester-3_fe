import '../../css/pages/ProductDetails.css';
import '../../css/pages/PostProduct.css';

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { GoHeart } from "react-icons/go";
import { FaMapMarkerAlt, FaFlag, FaPhone, FaArrowLeft } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import XRegExp from 'xregexp';

import ProductService from '../../services/ProductService.js';
import LocationService from "../../services/LocationService.js";
import UserService from '../../services/UserService.js';
import TokenManager from '../../services/TokenManager.js';

function ProductDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState();
    const [productLocation, setLocation] = useState();
    const [user, setUser] = useState();
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [cities, setCities] = useState([]);
    const [cityDisabled, setCityDisabled] = useState(true);

    const [edit, setEdit] = useState(false);
    const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = useState('Show phone number');

    const [newName, setName] = useState('');
    const [nameCharCount, setNameCharCount] = useState(0);
    const [newDescription, setDescription] = useState('');
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const [newPrice, setPrice] = useState('');
    const [newCity, setCity] = useState(null);
    const [newContactPerson, setContactPerson] = useState('');
    const [newEmail, setEmail] = useState('');
    const [newPhoneNumber, setPhoneNumber] = useState('');

    const MAX_NAME_LENGTH = 70;
    const MAX_DESCRIPTION_LENGTH = 9000;

    const handleButtonShowNumberClick = () => {
        if (product && product.contact_information) {
            setPhoneNumberPlaceholder(
                <React.Fragment>
                    <FaPhone /> {product.contact_information.phone_number}
                </React.Fragment>
            );
        }
    };

    const formatDateCreation = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} ${month} ${year}`;
    };

    const formatDateUser = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const goBack = () => {
        navigate(-1);
    };

    const handleEditButtonClick = () => {
        setEdit(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelButtonClick = () => {
        setEdit(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const validateInputs = () => {
        if (newName.length < 16) {
            toast.error('Name must be at least 16 characters long.');
            return false;
        }
        if (newDescription.length < 40) {
            toast.error('Description must be at least 40 characters long.');
            return false;
        }
        if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
            toast.error('Please enter a valid price.');
            return false;
        }
        if (!newCity) {
            toast.error('Please select a city.');
            return false;
        }
        if (!newContactPerson) {
            toast.error('Please enter a contact person.');
            return false;
        }
        if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        if (!newPhoneNumber || !/^\d{10}$/.test(newPhoneNumber)) {
            toast.error('Please enter a valid 10-digit phone number.');
            return false;
        }
        return true;
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }

        try {
            const updateProductRequest = {
                productName: newName,
                productDescription: newDescription,
                productPrice: newPrice,
                cityId: newCity.id,
                contact_person: newContactPerson,
                email: newEmail,
                phone_number: newPhoneNumber,
            };
            await ProductService.updateProduct(product.id, updateProductRequest);
            toast.success('Changes applied successfully!');
        } catch (error) {
            console.error('Error updating product', error.message);
            toast.error('Error updating product. Please try again.');
        }
    };

    const handleSaveButtonClick = (e) => {
        updateProduct(e);
        setEdit(false);
        window.location.reload();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const handleDisctrictChange = (event) => {
        const districtId = Number(event.target.value);
        if (districtId === 0) {
            setSelectedDistrict(null);
            setCities([]);
            setCityDisabled(true);
        } else {
            const district = districts.find((distr) => distr.id === districtId);
            setSelectedDistrict(district);
            setCityDisabled(false);
        }
    };

    const handleCityChange = (event) => {
        const cityId = Number(event.target.value);
        if (cityId === 0) {
            setCity(null);
        } else {
            const city = cities.find((c) => c.id === cityId);
            setCity(city);
        }
    };

    const handleContactPersonChange = (event) => {
        const value = event.target.value;
        setContactPerson(value);
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
    };

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
        setPhoneNumber(value);
    };

    const handlePriceChange = (event) => {
        const value = event.target.value;
        setPrice(value);
    };

    useEffect(() => {
        async function getLocation() {
            try {
                const locationData = await LocationService.getLocationForProduct(location.state?.productId);
                setLocation(locationData);
            } catch (error) {
                console.error('Error fetching location for a product', error);
            }
        }

        getLocation();
    }, [location.state?.productId]);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const productData = await ProductService.getProduct(location.state?.productId);
                setProduct(productData);
            } catch (error) {
                console.error("Error fetching product:" + error);
            }
        }
        fetchProduct();
    }, [location.state?.productId]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await UserService.getUserByProductId(location.state?.productId);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:' + error);
            }
        }
        fetchUser();
    }, [location.state?.productId]);

    useEffect(() => {
        async function fetchDistricts() {
            try {
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
            setCities(selectedDistrict.cities);
        }
    }, [selectedDistrict]);

    const handleRedirectToLogin = () => {
        navigate('/login');
    };

    const handlePromoteProductButtonClick = () => {
        navigate('/promoteproduct', { state: { productId: product.id } });
    };

    return (
        <div>
            <Toaster />
            <div className="upper-block">
                <button className="back-button" onClick={goBack}>
                    <FaArrowLeft /> Back
                </button>
            </div>
            {product && productLocation && user && (
                edit ? (
                    // Content to render when editMode is true
                    <div>
                        <h1>Edit Product Details</h1>
                        <form onSubmit={updateProduct}>
                            <div className='content-block'>
                                <div className='content'>
                                    <h4>Describe in details*</h4>
                                    <h3>Current name: {product.name}</h3>
                                    <label>Enter the new name*</label>
                                    <input
                                        type='text'
                                        placeholder='For example, Iphone 11 with warranty'
                                        value={newName}
                                        onChange={handleNameChange}
                                        maxLength={MAX_NAME_LENGTH}
                                        required
                                    />
                                    <div className='chars-info'>
                                        Enter at least 16 characters
                                        <span>
                                            {nameCharCount}
                                            /
                                            {MAX_NAME_LENGTH}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='content-block'>
                                <div className='content'>
                                    <h4>Description</h4>
                                    <label>Enter the description*</label>
                                    <textarea
                                        type='text'
                                        placeholder='Think of what would you like to know from posting and add it to the description'
                                        value={newDescription}
                                        onChange={handleDescriptionChange}
                                        maxLength={MAX_DESCRIPTION_LENGTH}
                                        required
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
                                    <h3>Current price: {product.price}$</h3>
                                    <label>Enter the price of the product</label>
                                    <input
                                        type='number'
                                        placeholder='For example, 100$'
                                        value={newPrice}
                                        onChange={handlePriceChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='content-block'>
                                <div className='content'>
                                    <h4>Location</h4>
                                    <h3>Current Location: {productLocation.cityName}, {productLocation.districtName}</h3>
                                    <label>Choose the district*</label>
                                    <select onChange={handleDisctrictChange} required>
                                        <option value=''>Select a district</option>
                                        {districts.map((district) => (
                                            <option key={district.id} value={district.id}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Choose the city*</label>
                                    <select onChange={handleCityChange} disabled={cityDisabled} required>
                                        <option value='' >Select a city</option>
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
                                    <h3>Current Contact Person: {product.contact_information.contact_person}</h3>
                                    <label>Contact person*</label>
                                    <input type='text'
                                        value={newContactPerson}
                                        onChange={handleContactPersonChange}
                                        required
                                    />
                                    <h3>Current Email Address: {product.contact_information.email}</h3>
                                    <label>Email address</label>
                                    <input type='text'
                                        value={newEmail}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                    <h3>Current Phone Number: {product.contact_information.phone_number}</h3>
                                    <label>Phone number</label>
                                    <input type='text'
                                        value={newPhoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='content-block'>
                                <div className='content'>
                                    <div className='button-group'>
                                        <button className='button-cancel' onClick={handleCancelButtonClick}>Cancel</button>
                                        <button type='submit' className='button-post' onClick={handleSaveButtonClick}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    // Content to render when editMode is false
                    <div className="product-details-grid">
                        <div className="product-main-content">
                            <div className="product-image-placeholder">
                                <div className="image-placeholder">
                                    {/* Image content goes here */}
                                </div>
                            </div>
                            <div className="product-details-placeholder">
                                <ul className="product-attributes-ul">
                                    {product.category.attributes.map((attribute, index) => (
                                        <li key={index} className="product-attributes-li">
                                            {attribute.name}: {product.productAttributes[index].value}
                                        </li>
                                    ))}
                                </ul>
                                <div className="product-description-placeholder">
                                    <h3 className="product-description-header">Description</h3>
                                    <div className="product-description-area">
                                        {XRegExp.split(product.description, XRegExp('(?<=[^0-9]\\.)(?=\\s|$)')).map((sentence, index) => (
                                            <React.Fragment key={index}>
                                                {sentence.trim()}
                                                <br /><br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="product-description-area-bottom">
                                        <div className="product-details-footer">
                                            <span className="footer-span">ID: {product.id}</span>
                                            {TokenManager.getUserId() !== user.id && (
                                                <div className="report-button-block">
                                                    <button className="report-button">
                                                        <FaFlag />
                                                        <span className="report-button-text">
                                                            <span>Report</span>
                                                                <i className="report-button-i"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <section className="section-block">
                                <div className="section-inside">
                                    <div className="section-info-grid">
                                        <div className="user-info-block">
                                            <p className="user-statement-p">Contact seller</p>
                                            <div className="user-info-grid">
                                                <div className="user-image">user image</div>
                                                <div className="user-details-info">
                                                    <h4 className="h4-username">{product.contact_information.contact_person}</h4>
                                                    <p className="p-dateofregistry">On Marketplace since {formatDateUser(user.date_of_registry)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="message-phone-button-block">
                                            {TokenManager.isAuthenticated() ? (
                                                TokenManager.getUserId() !== user.id && (
                                                    <div className="buttons-phone-button-grid">
                                                        <button className="button-message-user">Message</button>
                                                        <button className="button-user-phone-not-clicked" onClick={handleButtonShowNumberClick}>
                                                            {phoneNumberPlaceholder}
                                                        </button>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="buttons-phone-button-grid">
                                                    <button className="button-message-user" onClick={handleRedirectToLogin}>Message</button>
                                                    <button className="button-user-phone-not-clicked" onClick={handleRedirectToLogin}>
                                                        {phoneNumberPlaceholder}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {TokenManager.getUserId() === user.id && (
                                <section className="section-block">
                                    <div className="section-inside">
                                        <div className="section-info-grid">
                                            <div className="message-phone-button-block">
                                                <button className="button-message-user" onClick={handleEditButtonClick}>Edit</button>
                                                {product.promoted ? (
                                                    <div>
                                                        <span>Promoted until: 10.09.20492</span>
                                                    </div>
                                                ) : (
                                                    <button className='button-message-user' onClick={handlePromoteProductButtonClick}>Promote Product</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                        <div className="product-aside-content">
                            <div className="product-aside-price-contact">
                                <div className="product-aside-price-contact-date-name">
                                    <span className="span-date">Posted on {formatDateCreation(product.date_of_post)}</span>
                                    <GoHeart />
                                </div>
                                <div className="product-aside-price-contact-date-name">
                                    <h4 className="product-name-header">{product.name}</h4>
                                </div>
                                <div className="product-price">
                                    <h3 className="product-price-header">{product.price}$</h3>
                                </div>
                                <div className="message-phone-button-block">
                                    {TokenManager.isAuthenticated() ? (
                                        TokenManager.getUserId() !== user.id && (
                                            <div className="buttons-phone-button-grid">
                                                <button className="button-message-user">Message</button>
                                                <button className="button-user-phone-not-clicked" onClick={handleButtonShowNumberClick}>
                                                    {phoneNumberPlaceholder}
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="buttons-phone-button-grid">
                                            <button className="button-message-user" onClick={handleRedirectToLogin}>Message</button>
                                            <button className="button-user-phone-not-clicked" onClick={handleRedirectToLogin}>
                                                {phoneNumberPlaceholder}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="product-user-information-location">
                                <div className="user-statement">
                                    <p className="user-statement-p">User</p>
                                </div>
                                <div className="user-info-grid">
                                    <div className="user-image">user image</div>
                                    <div className="user-details-info">
                                        <h4 className="h4-username">{product.contact_information.contact_person}</h4>
                                        <p className="p-dateofregistry">On Marketplace since {formatDateUser(user.date_of_registry)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="product-user-information-location">
                                <div className="user-statement">
                                    <p className="user-statement-p">Location</p>
                                </div>
                                <p>
                                    <FaMapMarkerAlt />
                                    {productLocation.cityName}, {productLocation.districtName}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default ProductDetails;
