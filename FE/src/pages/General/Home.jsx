import '/Users/sergeysokyrko/Desktop/semester 3/Individual Project/Individual Assignment/FE/my-individual-assignment-semester-3_fe/FE/src/css/pages/Home.css'
import { GoSearch } from 'react-icons/go';
import LocationDropdown from '/Users/sergeysokyrko/Desktop/semester 3/Individual Project/Individual Assignment/FE/my-individual-assignment-semester-3_fe/FE/src/components/LocationDropdown.jsx'

function Home() {
  return (
    <div>
      <div className="search-container">
        <GoSearch className='search-icon'/>
        <input type="text" className="search-input" placeholder="Search..." />
        <LocationDropdown />
        <button type="button" className="search-button">Search</button>
      </div>

      <div className="categories-container">
        <h2>All Categories</h2>
        <div className="category">
          <h3 className="category-title">Category 1</h3>
        </div>
        <div className="category">
          <h3 className="category-title">Category 2</h3>
        </div>
      </div>
    </div>
  );
}

export default Home;