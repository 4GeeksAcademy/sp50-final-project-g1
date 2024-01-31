import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function NavDashSide() {
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState(location.pathname);

  const handleMenuClick = (url) => {
    setCurrentUrl(url);
  };

  return (

    <div id="dash-navigation" className=" bg-white px-4 py-5" style={{ width: "14rem" }}>
      <ul className="list-unstyled fs-5">
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" onClick={() => handleMenuClick("/dashboard/calendar")}>
            <span className={currentUrl === "/dashboard/calendar" ? "fw-bold" : "text-black-50"} style={{ color: currentUrl === "/dashboard/calendar" ? "#14C4B9" : "inherit" }}>CALENDAR</span>
          </Link>
        </li>
        <li className="mb-5">
          <Link to="/dashboard/account-data" className="text-decoration-none" onClick={() => handleMenuClick("/dashboard/account-data")}>
            {currentUrl === "/dashboard/account-data" ? (<span className="fw-bold" style={{ color: "#14C4B9" }}>ACCOUNT DATA</span>) : (<span className="text-black-50">ACCOUNT DATA</span>)}
          </Link>
        </li>

        <li className="mb-5">
          <Link to="/dashboard/working-day" className="text-decoration-none" onClick={() => handleMenuClick("/dashboard/working-day")}>
            {currentUrl === "/dashboard/working-day" ? (<span className="fw-bold" style={{ color: "#14C4B9" }}>WORKING DAY</span>) : (<span className="text-black-50">WORKING DAY</span>)}
          </Link>
        </li>
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" onClick={() => handleMenuClick("/dashboard/calendar")}>
            {currentUrl === "/dashboard/patients" ? (<span className="fw-bold" style={{ color: "#14C4B9" }}>PATIENTS</span>) : (<span className="text-black-50">PATIENTS</span>)}
          </Link>
        </li>
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" onClick={() => handleMenuClick("/dashboard/calendar")}>
            {currentUrl === "/dashboard/studio" ? (<span className="fw-bold" style={{ color: "#14C4B9" }}>MY STUDIO</span>) : (<span className="text-black-50">MY STUDIO</span>)}
          </Link>
        </li>
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" onClick={() => handleMenuClick("/dashboard/calendar")}>
            {currentUrl === "/dashboard/services" ? (<span className="fw-bold" style={{ color: "#14C4B9" }}>SERVICES</span>) : (<span className="text-black-50">SERVICES</span>)}
          </Link>
        </li>
      </ul>
    </div>
  )
}
