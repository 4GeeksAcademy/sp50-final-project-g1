import React, { useState } from "react";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid' // plugin

export default function Calendar() {
  // Definisci lo stato per la gestione dei clic sulle date
  const [selectedEvent, setSelectedEvent] = useState({});
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);


  // Definisci la funzione per gestire i clic sulle date
  const handleEventClick = (arg) => {
    console.log('arg event: ', arg.event)
    setSelectedEvent(arg.event);
    setShowOffcanvas(!showOffcanvas)
  }

  const handleCloseCanvas = () => {
    setShowOffcanvas(!showOffcanvas)
  }

  const handleAddBookingForm = () => {
    setShowAddBooking(!showAddBooking)
  }

  return (
    <div className="min-vh-100">
      <div id='account-data' className="align-items-center bg-light py-5 container">
        <div className="text-black-50 w-75 mx-auto mb-5">
          <div className="d-flex mb-4">
            <h4 className="text-decoration-underline">MY CALENDAR</h4>
            <button className="btn btn-sm ms-auto text-white" style={{ backgroundColor: "#14C4B9" }} onClick={handleAddBookingForm}>Add New Booking</button>
          </div>
          <div className="p-5 rounded bg-white border text-black-50">
            <FullCalendar
              plugins={[timeGridPlugin]}
              initialView='timeGridWeek'
              headerToolbar={{
                left: 'prev,next,today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay' // user can switch between the two
              }}
              weekends={false}
              eventClick={handleEventClick}
              eventColor='#14C4B9'
              allDaySlot={false}
              events={[
                { title: 'General Treatment', start: '2024-02-01T10:30:00', end: '2024-02-01T11:45:00' },
                { title: 'General Treatment', start: '2024-02-01T11:30:00', end: '2024-02-01T12:30:00' },
                { title: 'General Treatment', start: '2024-02-01T12:30:00', end: '2024-02-01T13:30:00' },
                { title: 'General Treatment', start: '2024-02-01T13:30:00', end: '2024-02-01T14:30:00' },
                { title: 'General Treatment', start: '2024-02-01T14:30:00', end: '2024-02-01T15:30:00' },
                { title: 'General Treatment', start: '2024-02-01T15:30:00', end: '2024-02-01T16:30:00' },
              ]}
            />
          </div>
        </div>


        {showOffcanvas ? (
          <div className="bg-white position-fixed top-0 end-0 bottom-0 min-vh-100 py-5 px-4 w-25 shadow" style={{ zIndex: "2" }} >

            <div className="d-flex justify-content-between mb-5">
              <h5 className="me-4 text-black-50 text-decoration-underline fw-bold" >BOOKING DETAILS</h5>
              <button type="button" className="btn-close" onClick={handleCloseCanvas} ></button>
            </div>
            <div className="rounded bg-dark bg-opacity-10 p-3 text-black-50 fw-light">
              <p>EVENT NAME: <strong className="fw-bold">{selectedEvent.title}</strong></p>
              <p>DATE: <strong className="fw-bold">{selectedEvent.startStr}</strong></p>
              <p>DURATION: <strong className="fw-bold">60 minutes</strong></p>
              <p>SPECIALIZATION: <strong className="fw-bold">Phisioterpy</strong></p>
              <p>SERVICE: <strong className="fw-bold">General tratment</strong></p>
              <p>PATIENT: <strong className="fw-bold">Yoel Cabaleiro</strong></p>
              <p>STATUS: <strong className="fw-bold">Confirmed</strong></p>
              <p>PATIENT NOTES: <strong className="fw-bold"></strong></p>
              <p>MY NOTES: <strong className="fw-bold"></strong></p>
            </div>

          </div>


        ) : (null)}


        {showAddBooking ? (
          <div className="bg-white position-fixed top-0 end-0 bottom-0 min-vh-100 py-5 px-4 w-25 shadow" style={{ zIndex: "2" }} >

            <div className="d-flex justify-content-between mb-5">
              <h5 className="me-4 text-black-50 text-decoration-underline fw-bold" >ADD NEW BOOKING</h5>
              <button type="button" className="btn-close" onClick={handleAddBookingForm} ></button>
            </div>

            <div className="rounded bg-dark bg-opacity-10 p-3 text-black-50 fw-light">
              <form>
                <div>
                  <h5 className="mb-4 text-decoration-underline">Booking Details</h5>
                  <input type='text' placeholder="Date" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  <input type='text' placeholder="Starting Time" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  <div className="mb-3">
                    <label htmlFor="service" className="form-label">Service</label>
                    <select id="service" className="form-select w-100">
                      <option value="">Select a service</option>
                      <option value="service1">Service 1</option>
                      <option value="service2">Service 2</option>
                      <option value="service3">Service 3</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea id="notes" placeholder="My Notes" className="form-control w-100"></textarea>
                  </div>
                </div>

                <div>
                  <h5 className="mb-4 text-decoration-underline">Patient details</h5>
                  <input type='text' placeholder="Name" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  <input type='text' placeholder="Last Name" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  <input type='text' placeholder="Email" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  <input type='text' placeholder="Phone" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                </div>

              </form>
            </div>

          </div>


        ) : (null)}


      </div>
    </div>
  )
}
