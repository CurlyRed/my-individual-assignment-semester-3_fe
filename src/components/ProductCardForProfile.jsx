import '../css/components/ProductCardForProfile.css';
import LocationService from '../services/LocationService.js';
import { useState, useEffect } from 'react';

function ProductCard({ product }) {
    const [location, setLocation] = useState(null);
    useEffect(() => {
        async function getLocation() {
            try {
                const locationData = await LocationService.getLocationForProduct(product.id);
                setLocation(locationData);
            } catch (error) {
                console.error('Error fetching location for a product', error);
            }
        }

        getLocation();
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} ${month} ${year}`;
    };

    if (!location) {
        return null; // Or render a loading indicator
    }
    return (
        <div className="product-card-container">
            <div className="product-card-container">
                <div type='grid' className="product-card">
                    <div type ='grid' className="product-card-image-container">

                    </div>
                    <div type='grid' className="description-container">
                        <div>
                            <p className="p-name">{product.name}</p>
                            <p className="p-price">{product.price}$</p>
                        </div>
                        <div>
                            <p className="p-location">{location.cityName}, {location.districtName}</p>
                            <p className="p-location">
                                <span>
                                    {formatDate(product.date_of_post)}
                                </span>
                            </p>
                            <p className="break-line"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;