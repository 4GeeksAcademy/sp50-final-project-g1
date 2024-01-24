import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
// import logo from '../../img/plannermed_logo.png';
import logo from '../../../img/docdate_logo.png';
import { Context } from "../../store/appContext.js";

export default function Navbar() {

  const {store, actions} = useContext(Context)
  const navigate = useNavigate()

  const handleLogout = () => {
    actions.logout()
    navigate("/login")
  }

  return (

    <nav className="p-4 sticky-top shadow ">
      <div className="d-flex align-items-center container">

        <div className="me-auto h7 fw-lighter" >
          <Link to="/" >
            <img src={logo} width="120" className="me-3 rounded"></img>
          </Link>
        </div>


        {store.isLogin ? (
          <div>
            <Link to="/dashboard"><button className="btn btn-sm btn-light me-3" >Dashboard</button></Link>
            <button className="btn btn-sm btn-primary" onClick={handleLogout}>Logout</button>
          </div>
        ):(
          <div className="text-black">
              <Link to="/login" style={{ textDecoration:'none'}}>
                <button className="mb-0 me-4 btn btn-sm btn-light border">Login</button>
              </Link>
              <Link to="/signup" style={{ textDecoration:'none'}}>
                <button className="mb-0 me-4 btn btn-sm btn-primary border-0" style={{backgroundColor:"#14C4B9", border:"none"}}>Signup</button>
              </Link>
          </div>
        )}


      </div>
    </nav>
  );
};
