import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import '../css/layouts/DefaultLayout.css';

function DefaultLayout({ userRole }) {
  return (
    <div className="default-layout-container">
      <Header userRole={userRole} /> 
      <div className="default-layout-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;


