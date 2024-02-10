import React from 'react'
import Footer from '../component/footer/Footer'
import NavDashSide from '../component/navbar/NavDashSide';
import NavDashTop from '../component/navbar/NavDashTop';
import NavDashPath from '../component/navbar/NavDashPath';


export default function DashboardLayout({ children }) {
  return (

    <>
      <NavDashTop />

      <div className=" d-flex">
        <NavDashSide />
        <div className="bg-light w-100">
          <NavDashPath />
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};