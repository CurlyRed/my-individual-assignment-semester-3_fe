import React, { useEffect, useState } from 'react';
import LocationService from '../services/LocationService.js';

function LocationDropdown() {
  const [locations, setLocations] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const locationsData = await LocationService.getAllLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }

    fetchLocations();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedCity(null); // Reset selected city when district changes
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleSelectWholeDistrict = () => {
    setIsDropdownOpen(false); // Close dropdown after selecting the whole district
  };

  return (
    <div className="relative">
      <button 
        className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100" 
        onClick={toggleDropdown}
      >
        {selectedCity ? selectedCity.name : selectedDistrict ? selectedDistrict.name : 'Select Location'}
      </button>
      {isDropdownOpen && (
        <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-10">
          <ul>
            {locations.map((district) => (
              <li key={district.id} className="relative group">
                <button
                  onClick={() => handleDistrictSelect(district)}
                  className="w-full text-left p-2 hover:bg-gray-100 flex justify-between items-center"
                >
                  {district.name}
                  <span>&gt;</span>
                </button>
                {selectedDistrict?.id === district.id && (
                  <div className="absolute top-0 left-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-20">
                    <ul>
                      <li>
                        <button
                          onClick={handleSelectWholeDistrict}
                          className="w-full text-left p-2 hover:bg-gray-100 font-bold"
                        >
                          Whole District
                        </button>
                      </li>
                      {district.cities.map((city) => (
                        <li key={city.id}>
                          <button
                            onClick={() => handleCitySelect(city)}
                            className="w-full text-left p-2 hover:bg-gray-100"
                          >
                            {city.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LocationDropdown;

