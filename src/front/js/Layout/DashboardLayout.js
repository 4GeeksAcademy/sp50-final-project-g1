import React from 'react'
import Footer from '../component/footer/Footer'
import NavDashSide from '../component/navbar/NavDashSide';
import NavDashTop from '../component/navbar/NavDashTop';


export default function DashboardLayout({ children }) {
  return (
    <div className=" d-flex">
      <NavDashSide />

      <div id="main-content" className="bg-light w-100">
        <NavDashTop />
        {children}
        <Footer />
      </div>

    </div>
  );
};