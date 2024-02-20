import React from "react";
import logoWhite from '../../../img/logo-white.png';



export default function FooterDashboard() {
  return (
    <footer className="p-3 bg-secondary text-white" style={{ height: "5vh" }}>
      <div className="small fw-lighter">
        <span>This is a footer disclaimer to use in the platform. For more info send an email to <span className="fw-bold">info@docdate.com</span></span>
      </div>
    </footer>
  )
}
