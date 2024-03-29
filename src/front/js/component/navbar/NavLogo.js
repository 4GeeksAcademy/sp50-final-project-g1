import React from "react";
import { Link } from "react-router-dom";

// Components
import logo from '../../../img/docdate_logo.png';

export default function NavLogo() {

  return (
    <nav className="p-4 bg-white sticky-top shadow " style={{ zIndex: "0" }}>
      <div className="d-flex align-items-center container">

        <div className="" >
          <Link to="/" style={{ textDecoration: 'none' }} >
            <img src={logo} width="160" className="me-3 rounded"></img>
          </Link>
        </div>

      </div>
    </nav>
  );
};
