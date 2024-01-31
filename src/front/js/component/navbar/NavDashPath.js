import React, { useContext } from "react";


// Components


export default function NavDashPath() {

  const url = window.location.pathname


  return (
    <div id='dash-navigator' className="bg-white text-black text-opacity-25" >
      <p className=" p-3">{url}</p>
    </div>
  )
}
