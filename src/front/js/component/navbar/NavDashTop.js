import React from 'react'

export default function NavDashTop() {

  const url = window.location.pathname

  return (
    <>
      <div id='dash-menu' className="bg-black bg-opacity-50 p-4 d-flex align-items-center">
        <button className="btn btn-small btn-light border ms-auto text-black-50">Support</button>
      </div>
      <div id='dash-navigator' className="bg-white text-black text-opacity-25" >
        <p className="container py-2">{url}</p>
      </div>
    </>
  )
}
