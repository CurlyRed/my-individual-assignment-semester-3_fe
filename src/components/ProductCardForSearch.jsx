import '../css/components/ProductCardForSearch.css';

import { useState, useEffect } from 'react';
import LocationService from '../services/LocationService';

function ProductCardForSearch({product}) {
    const [location, setLocation] = useState(null);
    const attributesToShow = product.productAttributes.slice(0, 2);
    const categoryAttributesToShow = product.category.attributes.slice(0,2);

    useEffect(() => {
        async function getLocation() {
            try {
                const locationData = await LocationService.getLocationForProduct(product.id);
                setLocation(locationData);
            } catch (error) {
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
        return null; 
    }

    return (
        <div className='product-card'>
            <div className='product-card-inner'>
                <div className='product-card-list'>
                    <div className='product-image'>

                    </div>
                    <div className='product-details'>
                        <div className='product-details-1'>
                            <p>{product.name}</p>
                            <p>{product.price}$</p>
                        </div>
                        <div className='product-details-1'>
                            <div className='separator'></div>
                        </div>
                        <div className='product-details-2'>
                            <div className='location-date'>
                                <p>{location.cityName}, {location.districtName} - {formatDate(product.date_of_post)}</p>
                            </div>
                            <div className='secondary-details'>
                                {attributesToShow.map((attribute, index) => (
                                    <span key={index} className='secondary-details-span'>
                                        <span className='secondary-details-item'>
                                            {categoryAttributesToShow[index].name}: {attribute.value}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCardForSearch;