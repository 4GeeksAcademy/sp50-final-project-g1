import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import iconCalendar from '../../../img/icon-cal.png';
import iconAccount from '../../../img/icon-account.png';
import iconHours from '../../../img/icon-hours.png';
import iconPatients from '../../../img/icon-patients.png';
import iconLocation from '../../../img/icon-location.png';
import iconServices from '../../../img/icon-services.png';

export default function NavDashSide() {
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState(location.pathname);

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);


  return (

    <div id="dash-navigation" className=" bg-white px-4 py-5" style={{ minWidth: "15rem" }}>
      <ul className="list-unstyled fs-6">

        {/* CALENDAR */}
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" >
            {currentUrl === "/dashboard/calendar" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconCalendar} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="fw-bold" style={{ color: "#14C4B9" }}>CALENDAR</span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconCalendar} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="text-black-50">CALENDAR</span>
              </div>
            )}
          </Link>
        </li>

        {/* WORKING DAY AND HOLIDAY */}
        <li className="mb-5">
          <Link to="/dashboard/working-day" className="text-decoration-none" >
            {currentUrl === "/dashboard/working-day" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconHours} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="fw-bold" style={{ color: "#14C4B9" }}>DAY & HOLIDAY</span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconHours} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="text-black-50">DAY & HOLIDAY</span>
              </div>
            )}
          </Link>
        </li>

        {/* ACCOUNT DATA */}
        <li className="mb-5">
          <Link to="/dashboard/account-data" className="text-decoration-none" >
            {currentUrl === "/dashboard/account-data" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconAccount} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="fw-bold" style={{ color: "#14C4B9" }}>ACCOUNT DATA</span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconAccount} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="text-black-50">ACCOUNT DATA</span>
              </div>
            )}
          </Link>
        </li>

        {/* PATIENTS */}
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" >
            {currentUrl === "/dashboard/patients" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconPatients} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="fw-bold" style={{ color: "#14C4B9" }}>PATIENTS</span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconPatients} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="text-black-50">PATIENTS</span>
              </div>
            )}
          </Link>
        </li>


        {/* MY STUDIO */}
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" >
            {currentUrl === "/dashboard/studio" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconLocation} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="fw-bold" style={{ color: "#14C4B9" }}>MY STUDIO</span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconLocation} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="text-black-50">MY STUDIO</span>
              </div>
            )}
          </Link>
        </li>

        {/* SERVICES */}
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" >
            {currentUrl === "/dashboard/patients" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconServices} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="fw-bold" style={{ color: "#14C4B9" }}>SERVICES</span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconServices} width="30" height="30" className="p-1" ></img>
                </span>
                <span className="text-black-50">SERVICES</span>
              </div>
            )}
          </Link>
        </li>

      </ul>
    </div>
  )
}
