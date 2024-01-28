import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin


export default function Calendar() {

  const url = window.location.pathname

  return (

    <div className=" min-vh-100">

      <div id='account-data' className="align-items-center bg-light py-5 container">

        <div className="text-black-50 w-75 mx-auto mb-5">
          <div className="d-flex mb-4">
            <h4 className=" text-decoration-underline">MY CALENDAR</h4>
            <button className="btn btn-sm ms-auto text-white" style={{ backgroundColor: "#14C4B9" }}>Add visit</button>
          </div>
          <div className="p-5 rounded bg-white border text-black-50">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              events={[
                { title: 'event 1', date: '2024-01-14' },
                { title: 'event 1', date: '2024-01-18' },
                { title: 'event 1', date: '2024-01-17' },
                { title: 'event 1', date: '2024-01-16' },
                { title: 'event 1', date: '2024-01-14' },
                { title: 'event 2', date: '2024-01-15' },
              ]}
            />
          </div>
        </div>


      </div>

    </div>


  )
}
