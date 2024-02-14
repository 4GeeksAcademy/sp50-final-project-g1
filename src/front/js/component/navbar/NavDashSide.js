import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import iconCalendar from '../../../img/icon-cal.png';
import iconAccount from '../../../img/icon-account.png';
import iconHours from '../../../img/icon-hours.png';
import iconPatients from '../../../img/icon-patients.png';
import iconLocation from '../../../img/icon-location.png';
import iconServices from '../../../img/icon-services.png';

import "../../../styles/navDashSide.css"

export default function NavDashSide() {
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState(location.pathname);
  const [compressedMenu, setCompressedMenu] = useState(false)

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);

  const handleCompressMenu = () => {
    setCompressedMenu(!compressedMenu)
  }

  const menuExpandedStyle = {
    minWidth: "15rem"
  }

  const menuCompressedStyle = {
    minWidth: "auto"
  }

  return (

    <div id="dash-navigation" className=" bg-white px-4 py-5" style={compressedMenu ? (menuCompressedStyle) : (menuExpandedStyle)}>
      <ul className="list-unstyled fs-6 pb-5">

        {/* CALENDAR */}
        <li className="mb-5">
          <Link to="/dashboard/calendar" className="text-decoration-none" >
            {currentUrl === "/dashboard/calendar" ? (
              <div className='side-icon selected'>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconCalendar} width="35" height="35" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="fw-bold" style={{ color: "#14C4B9" }}>MY CALENDAR</span>
                ) : null}
              </div>
            ) : (
              <div className='side-icon'>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconCalendar} width="30" height="30" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="text-black-50">MY CALENDAR</span>
                ) : null}
              </div>
            )}
          </Link>
        </li>

        {/* WORKING DAY AND HOLIDAY */}
        <li className="mb-5">
          <Link to="/dashboard/working-day" className="text-decoration-none" >
            {currentUrl === "/dashboard/working-day" ? (
              <div className='side-icon selected'>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconHours} width="35" height="35" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="fw-bold" style={{ color: "#14C4B9" }}>MY HOURS</span>
                ) : null}
              </div>
            ) : (
              <div className='side-icon'>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconHours} width="30" height="30" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="text-black-50">MY HOURS</span>
                ) : null}
              </div>
            )}
          </Link>
        </li>

        {/* ACCOUNT DATA */}
        <li className="mb-5">
          <Link to="/dashboard/account-data" className="text-decoration-none" >
            {currentUrl === "/dashboard/account-data" ? (
              <div className='side-icon selected'>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconAccount} width="35" height="35" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="fw-bold" style={{ color: "#14C4B9" }}>MY ACCOUNT</span>
                ) : null}
              </div>
            ) : (
              <div className='side-icon'>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconAccount} width="30" height="30" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="text-black-50">MY ACCOUNT</span>
                ) : null}
              </div>
            )}
          </Link>
        </li>

        {/* PATIENTS */}
        <li className="mb-5">
          <Link to="/dashboard/patients-list" className="text-decoration-none" >
            {currentUrl === "/dashboard/patients-list" ? (
              <div className='side-icon selected'>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconPatients} width="35" height="35" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="fw-bold" style={{ color: "#14C4B9" }}>MY PATIENTS</span>
                ) : null}
              </div>
            ) : (
              <div className='side-icon'>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconPatients} width="30" height="30" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="text-black-50">MY PATIENTS</span>
                ) : null}
              </div>
            )}
          </Link>
        </li>


        {/* MY STUDIO */}
        <li className="mb-5">
          <Link to="/dashboard/studio" className="text-decoration-none" >
            {currentUrl === "/dashboard/studio" ? (
              <div className='side-icon selected'>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconLocation} width="35" height="35" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="fw-bold" style={{ color: "#14C4B9" }}>MY STUDIO</span>
                ) : null}
              </div>
            ) : (
              <div className='side-icon'>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconLocation} width="30" height="30" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="text-black-50">MY STUDIO</span>
                ) : null}
              </div>
            )}
          </Link>
        </li>

        {/* SERVICES */}
        <li className="mb-5">
          <Link to="/dashboard/services" className="text-decoration-none" >
            {currentUrl === "/dashboard/services" ? (
              <div className='side-icon selected'>
                <span className="p-1 me-2 rounded-circle d-inline-block" style={{ backgroundColor: "#14C4B9" }}>
                  <img src={iconServices} width="35" height="35" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="fw-bold" style={{ color: "#14C4B9" }}>MY SERVICES</span>
                ) : null}
              </div>
            ) : (
              <div className='side-icon'>
                <span className="p-1 me-2 rounded-circle d-inline-block bg-secondary">
                  <img src={iconServices} width="30" height="30" className="p-1" ></img>
                </span>
                {!compressedMenu ? (
                  <span className="text-black-50">MY SERVICES</span>
                ) : null}
              </div>
            )}
          </Link>
        </li>

      </ul>
      <div className="menu-button d-flex justify-content-center p-2 border-top" onClick={handleCompressMenu} style={{ cursor: "pointer" }}>
        {!compressedMenu ? (
          <span className="ms-auto fs-3 compressor">{'<'}</span>
        ) : (
          <span className="fs-3 compressor">{'>'}</span>
        )}
      </div>
    </div>
  )
}
