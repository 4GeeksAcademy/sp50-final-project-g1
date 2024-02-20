import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import iconCalendar from '../../../img/icon-cal.png';
import iconAccount from '../../../img/icon-account.png';
import iconHours from '../../../img/icon-hours.png';
import iconPatients from '../../../img/icon-patients.png';
import iconLocation from '../../../img/icon-location.png';
import iconServices from '../../../img/icon-services.png';

export default function NavDashBottom() {
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState(location.pathname);

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);


  return (

    <div id="dash-navigation" className=" bg-white p-3 w-100 position-fixed bottom-0 " style={{ zIndex: "1" }}>
      <ul className="d-flex list-unstyled justify-content-between">

        {/* CALENDAR */}
        <li className="">
          <Link to="/dashboard/calendar" className="text-decoration-none" >
            {currentUrl === "/dashboard/calendar" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconCalendar} width="30" height="30" className="p-1" ></img>
                </span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconCalendar} width="30" height="30" className="p-1" ></img>
                </span>
              </div>
            )}
          </Link>
        </li>

        {/* WORKING DAY AND HOLIDAY */}
        <li className="">
          <Link to="/dashboard/working-day" className="text-decoration-none" >
            {currentUrl === "/dashboard/working-day" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconHours} width="30" height="30" className="p-1" ></img>
                </span>
              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconHours} width="30" height="30" className="p-1" ></img>
                </span>
              </div>
            )}
          </Link>
        </li>

        {/* ACCOUNT DATA */}
        <li className="">
          <Link to="/dashboard/account-data" className="text-decoration-none" >
            {currentUrl === "/dashboard/account-data" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconAccount} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconAccount} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            )}
          </Link>
        </li>

        {/* PATIENTS */}
        <li className="">
          <Link to="/dashboard/patients-list" className="text-decoration-none" >
            {currentUrl === "/dashboard/patients-list" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconPatients} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconPatients} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            )}
          </Link>
        </li>


        {/* MY STUDIO */}
        <li className="">
          <Link to="/dashboard/studio" className="text-decoration-none" >
            {currentUrl === "/dashboard/studio" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconLocation} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconLocation} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            )}
          </Link>
        </li>

        {/* SERVICES */}
        <li className="">
          <Link to="/dashboard/services" className="text-decoration-none" >
            {currentUrl === "/dashboard/services" ? (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconServices} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            ) : (
              <div>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconServices} width="30" height="30" className="p-1" ></img>
                </span>

              </div>
            )}
          </Link>
        </li>

      </ul>

    </div>
  )
}
