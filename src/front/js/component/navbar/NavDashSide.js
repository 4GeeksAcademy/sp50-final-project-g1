import React from 'react'
import { Link } from 'react-router-dom';

export default function NavDashSide() {
  return (
    <div id='dash-sidebar-menu' className="bg-white p-4" style={{ width: "14rem" }}>
      <div className="mb-5 border-bottom text-center">
        <Link to="/dashboard/calendar" className="text-black-50 text-decoration-none fs-3">
          <span className="">Doc<strong>Date</strong></span>
        </Link>
      </div>
      <div id="dash-navigation" className="pt-5">
        <ul className="list-unstyled fs-5">
          <li className="mb-5"><Link to="/dashboard/calendar" className="text-black-50 text-decoration-none">CALENDAR</Link></li>
          <li className="mb-5"><Link to="/dashboard/account-data" className="text-black-50 text-decoration-none">ACCOUNT DATA</Link></li>
          <li className="mb-5"><Link to="/dashboard/account-data" className="text-black-50 text-decoration-none">PATIENTS</Link></li>
          <li className="mb-5"><Link to="/dashboard/account-data" className="text-black-50 text-decoration-none">MY STUDIO</Link></li>
          <li className="mb-5"><Link to="/dashboard/account-data" className="text-black-50 text-decoration-none">WORKING DAY</Link></li>
          <li className="mb-5"><Link to="/dashboard/account-data" className="text-black-50 text-decoration-none">SERVICES</Link></li>
        </ul>
      </div>
    </div>
  )
}
