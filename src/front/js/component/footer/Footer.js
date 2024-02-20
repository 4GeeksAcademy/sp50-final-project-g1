import React from "react";
import logoWhite from '../../../img/logo-white.png';



export default function Footer() {
  return (
    <footer className="p-5 bg-secondary text-white">
      <div className="container">

        <div className="row g-5">
          <div className="col-sm-4">
            <h5>Italy</h5>
            <ul className=" list-unstyled small fw-lighter">
              <li>Milano - Italy</li>
              <li>Via Colosseo, 3</li>
              <li>+39 2922388445</li>
              <br />
              <li className="fw-normal">support@infomed.com</li>
            </ul>
          </div>
          <div className="col-sm-4">
            <h5>Spain</h5>
            <ul className=" list-unstyled small fw-lighter">
              <li>Tenerife - Sliain (CA)</li>
              <li>Calle Caballero, 23</li>
              <li>+34 62839400</li>
              <br />
              <li className="fw-normal">info@infomed.com</li>
            </ul>
          </div>

          <div className=" col-sm-4">
            <img src={logoWhite} width="150" className="me-3 rounded mb-4"></img>
            <p className="fw-lighter small">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            In eu mauris neque. Cras ultrices arcu eget diam hendrerit hendrerit. 
            Nunc congue at metus at tincidunt. </p>
          </div>
          <div className="col-sm-4">
          </div>

        </div>

      </div>
    </footer>
  )
}
