import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

export default function AccountData() {

  const { store, actions } = useContext(Context)

  const [email, setEmail] = useState('thisis@myemail.com')
  const [googleCalendar, setGoogleCalendar] = useState('thisis@gmail.com')
  const [userName, setUserName] = useState('lorenzostudio')
  const [phone, setPhone] = useState('+39 3933222334')


  return (

    <div className=" min-vh-100">

      <div id='account-data' className="align-items-center bg-light py-5 container">

        <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
          <h4 className=" text-decoration-underline">ACCOUNT DATA</h4>
          <div className="p-5 rounded bg-white border text-black-50">
            <div><span>EMAIL: </span><span>{email}</span></div>
            <div><span>USERNAME: </span><span>{userName}</span></div>
            <div><span>PHONE: </span><span>{phone}</span></div>
            <div><span>PASSWORX: </span><span>************</span></div>
          </div>
        </div>

        <div className=" text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
          <h4 className=" text-decoration-underline">MY BOOKING PAGE URL</h4>
          <p>Share it with your patient or place it in your website to collect bookings</p>
          <div className="p-3 rounded-3 border text-black-50" style={{ backgroundColor: "#E0F3F3" }}>
            <div><span>{`https://www.docdate.com/${userName}`}</span></div>
          </div>
        </div>

        <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
          <h4 className=" text-decoration-underline">GOOGLE CALENDAR API CONNECTION</h4>
          <p>Connect your google calendar with the DocDate agenda and keep all your events in one place</p>
          <div className="p-5 rounded-3 bg-white border text-black-50">
            <div><span>CALENDAR CONNECTED: </span><span>{googleCalendar}</span></div>
          </div>
        </div>

      </div>

    </div>


  )
}
