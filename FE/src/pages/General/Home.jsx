import '../../css/pages/Home.css'
import { GoSearch } from 'react-icons/go';
import LocationDropdown from '../../components/LocationDropdown.jsx'

function Home() {
  return (
    <div>
      <div className="search-container">
        <GoSearch className='search-icon'/>
        <input type="text" className="search-input" placeholder="What are you looking for..?" />
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