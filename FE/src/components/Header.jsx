import Navigation from './Navigation';
import '../css/components/Header.css';

function Header(){
    return(
        <header className = "header">
            <div className= "header-container">
                <Navigation/>
            </div>
        </header>
    );
};

export default Header;


