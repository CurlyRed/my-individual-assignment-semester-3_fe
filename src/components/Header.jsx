import React from 'react';
import AdminNavigation from './headerNavigation/AdminNavigation';
import SupportNavigation from './headerNavigation/SupportNavigation';
import UserNavigation from './headerNavigation/UserNavigation';
import '../css/components/Header.css';

function Header({ userRole }) {
  let NavigationComponent;

  switch (userRole) {
    case 'ADMIN':
      NavigationComponent = AdminNavigation;
      break;
    case 'SUPPORT':
      NavigationComponent = SupportNavigation;
      break;
    default:
      NavigationComponent = UserNavigation;
  }

  return (
    <header className="header">
      <div className="header-container">
        <NavigationComponent />
      </div>
    </header>
  );
}

export default Header;



