import React from 'react';
import NavDashSide from '../component/navbar/NavDashSide';
import NavDashBottom from '../component/navbar/NavDashBottom';
import NavDashTop from '../component/navbar/NavDashTop';
import NavDashPath from '../component/navbar/NavDashPath';
import FooterDashboard from '../component/footer/FooterDashboard';

export default function DashboardLayout({ children }) {
  return (
    <>
      <NavDashTop />

      <div className="d-flex">
        <div className="d-none d-md-block"> {/* Hide on mobile */}
          <NavDashSide />
        </div>
        <div className="bg-light w-100">
          {/* <NavDashPath /> */}
          {children}
        </div>
      </div>
      <div className="d-block d-md-none fixed-bottom w-100"> {/* Always shown at bottom */}
        <NavDashBottom />
      </div>
      <FooterDashboard />
    </>
  );
};
