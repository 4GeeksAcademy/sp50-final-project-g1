import React from "react";
import logoWhite from '../../../img/logo-white.png';



export default function FooterBooking() {
  return (
    <footer className="p-3 bg-secondary text-white" style={{ height: "5vh" }}>
      <div className="small fw-lighter text-center">
        <span>This is calendar is provided by <span className="fw-bold">www.docdate.com</span>. For more info send an email to <span className="fw-bold">info@docdate.com</span></span>
      </div>
    </footer>
  )
}
