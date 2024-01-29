import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext.js";

export default function NavDashTop() {

  const url = window.location.pathname
  const { store, actions } = useContext(Context)
  const navigate = useNavigate()

  const handleLogout = () => {
    actions.logout()
    navigate("/login")
  }

  return (
    <>
      <div id='dash-menu' className="bg-black bg-opacity-50 p-4 d-flex align-items-center">
        <button className="btn btn-small btn-light border ms-auto text-black-50">Support</button>
        <button className="btn btn-small ms-3 text-white" onClick={handleLogout} style={{ backgroundColor: "#14C4B9" }}>Logout</button>
      </div>
      <div id='dash-navigator' className="bg-white text-black text-opacity-25" >
        <p className="container py-2">{url}</p>
      </div>
    </>
  )
}
