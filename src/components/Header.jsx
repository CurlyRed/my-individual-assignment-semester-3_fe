import React from 'react';
import AdminNavigation from './headerNavigation/AdminNavigation';
import SupportNavigation from './headerNavigation/SupportNavigation';
import UserNavigation from './headerNavigation/UserNavigation';

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
    <header className="bg-[#ffa500] shadow-md">
      <div className="container mx-auto p-4">
        <NavigationComponent />
      </div>
    </header>
  );
}

export default Header;