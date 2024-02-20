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
    <div id='dash-menu' className="bg-secondary px-4 d-flex align-items-center" style={{ height: "5vh" }}>
      <div className="">
        <Link to="/dashboard/calendar" className="text-black-50 text-decoration-none fs-3">
          <img src={logoGray} width="120" className="me-3 rounded"></img>
        </Link>
      </div>

      <div className="ms-auto">
        <span className="text-white text-decoration-underline" style={{ cursor: "pointer" }} onClick={handleLogout} >Logout</span>
      </div>
    </div>
  )
}
