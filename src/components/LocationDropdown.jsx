import '../css/pages/Home.css'
import LocationService from '../services/LocationService.js';
import { useEffect, useState } from 'react';

function LocationDropdown() {
  const [locations, setLocations] = useState([]);

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

  return (
    <select>
      <option value=''>Select a district</option>
      {locations.map((location, index) => (
        <option key={index} value={location}>{location.name}</option>
      ))}
    </select>
  );
}

export default LocationDropdown;
