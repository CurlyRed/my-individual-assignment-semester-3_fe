import '../../css/pages/Home.css'
import { GoSearch } from 'react-icons/go';
import LocationDropdown from '../../components/LocationDropdown.jsx'
import CategoryList from '../../components/CategoryList.jsx';

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
        <h2 className='home-categories-title'>All Categories</h2>
        <CategoryList />
      </div>
    </div>
  );
}

export default Home;