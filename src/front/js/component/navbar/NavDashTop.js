import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../../store/appContext.js";

// Components
import logoGray from '../../../img/logo_gray.png';

export default function NavDashTop() {

  const { store, actions } = useContext(Context)
  const navigate = useNavigate()

  const handleLogout = () => {
    actions.logout()
    navigate("/login")
  }

  return (
    <div id='dash-menu' className="bg-secondary p-4 d-flex align-items-center" style={{ height: "10vh" }}>
      <div className="">
        <Link to="/dashboard/calendar" className="text-black-50 text-decoration-none fs-3">
          <img src={logoGray} width="120" className="me-3 rounded"></img>
        </Link>
      </div>

      <div className="ms-auto">
        <button className="btn btn-sm btn-light border-0 ms-auto text-black-50">Support</button>
        <button className="btn btn-sm ms-3 text-white border-0" onClick={handleLogout} style={{ backgroundColor: "#14C4B9" }}>Logout</button>
      </div>
    </div>
  )
}
