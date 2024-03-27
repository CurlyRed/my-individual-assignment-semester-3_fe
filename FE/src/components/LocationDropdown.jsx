import '../css/pages/Home.css'

function LocationDropdown() {
  const locations = ['Location 1', 'Location 2', 'Location 3'];

  return (
    <select className="location-dropdown">
      {locations.map((location, index) => (
        <option key={index} value={location}>{location}</option>
      ))}
    </select>
  );
}

export default LocationDropdown;
