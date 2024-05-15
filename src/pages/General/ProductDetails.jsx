import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { GoHeart } from "react-icons/go";
import { FaMapMarkerAlt, FaFlag, FaPhone, FaArrowLeft } from 'react-icons/fa';
import ProductService from '../../services/ProductService.js';
import LocationService from "../../services/LocationService.js";
import UserService from '../../services/UserService.js';
import '../../css/pages/ProductDetails.css';
import XRegExp from 'xregexp';

function ProductDetails () {
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState();
    const [user, setUser] = useState();
    const [productLocation, setLocation] = useState();
    const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = useState('Show phone number');

    const handleButtonShowNumberClick = () => {
        if (product && product.contact_information) {
            setPhoneNumberPlaceholder(
                <React.Fragment>
                    <FaPhone /> {product.contact_information.phone_number}
                </React.Fragment>
            );
        }
    }

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
    }

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
    }, [])

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
    }, [location.state?.productId])

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
    })

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <div className="upper-block">
                <button className="back-button" onClick={goBack}>
                    <FaArrowLeft /> Back
                </button>
            </div>
            {product && productLocation && user && (
                <div className="product-details-grid">
                <div className="product-main-content">
                    <div className="product-image-placeholder">
                        <div className="image-placeholder">

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
                            <h3 className="product-description-header">
                                Description
                            </h3>
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
                                    <span className="footer-span">
                                        ID: {product.id}
                                    </span>
                                    <div className="report-button-block">
                                        <button className="report-button">
                                            <FaFlag />    
                                            <span className="report-button-text">
                                                <span>
                                                    Report
                                                </span>
                                                <i className="report-button-i"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <section>
                        <div className="section-inside">
                            <div className="section-info-grid">
                                <div className="user-info-block">
                                    <p className="user-statement-p">
                                        Contact seller
                                    </p>
                                    <div className="user-info-grid">
                                        <div className="user-image">
                                            user image
                                        </div>
                                        <div className="user-details-info">
                                            <h4 className="h4-username">{product.contact_information.contact_person}</h4>
                                            <p className="p-dateofregistry">On Marketplace since {formatDateUser(user.date_of_registry)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="message-phone-button-block">
                                    <div className="buttons-phone-button-grid">
                                        <button className="button-message-user">
                                            Message
                                        </button>
                                        <button className="button-user-phone-not-clicked" onClick={handleButtonShowNumberClick}>
                                            {phoneNumberPlaceholder}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="product-aside-content">
                    <div className="product-aside-price-contact">
                        <div className="product-aside-price-contact-date-name">
                            <span className="span-date">
                                Posted on {formatDateCreation(product.date_of_post)}
                            </span>
                            <GoHeart />
                        </div>
                        <div className="product-aside-price-contact-date-name">
                            <h4 className="product-name-header">
                                {product.name}
                            </h4>
                        </div>
                        <div className="product-price">
                            <h3 className="product-price-header">
                                {product.price}$
                            </h3>
                        </div>
                        <div className="message-phone-button-block">
                            <div className="buttons-phone-button-grid">
                                <button className="button-message-user">
                                    Message
                                </button>
                                <button className="button-user-phone-not-clicked" onClick={handleButtonShowNumberClick}>
                                    {phoneNumberPlaceholder}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="product-user-information-location">
                        <div className="user-statement">
                            <p className="user-statement-p">
                                User
                            </p>
                        </div>
                        <div className="user-info-grid">
                            <div className="user-image">
                                user image
                            </div>
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
            )}x
        </div>
    )
}

export default ProductDetails;