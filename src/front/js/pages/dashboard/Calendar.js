import React, { useContext, useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Context } from "../../store/appContext";
import "../../../styles/addBooking.css"
import "../../../styles/calendar.css"

export default function Calendar() {

  const { store, actions } = useContext(Context)
  // Definisci lo stato per la gestione dei clic sulle date
  const [selectedEvent, setSelectedEvent] = useState({});
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [detailsLoaded, setDetailsLoaded] = useState(false)
  const [endingDatesLoaded, setEndingDatesLoaded] = useState(false)
  const [newPatient, setNewPatient] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [filteredPatients, setFilteredPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [newPatientName, setNewPatientName] = useState("")
  const [newPatientLastname, setNewPatientLastname] = useState("")
  const [newPatientEmail, setNewPatientEmail] = useState("")
  const [newPatientPhone, setNewPatientPhone] = useState("")
  const [selectedProService, setSelectedProService] = useState("")
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [proNotes, setProNotes] = useState("")


  //Booking edit interactions
  const [bookingEdit, setBookingEdit] = useState(false)
  const [editedProService, setEditedProService] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [editedHour, setEditedHour] = useState('');
  const [editedNote, setEditedNote] = useState('');

  const [businessHoursList, setBusinessHoursList] = useState(store.businessHours)


  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await actions.authentication(store.token);

        if (!response) {
          console.error('Error: Respuesta de autenticación no válida');
          return;
        }

        const proId = response.logged_in_as;
        await actions.getPro(proId);
        // console.log("-----PRO-----", store.currentPro);

        await actions.getLocationsByPro(proId);
        // console.log("-----PRO-LOCATIONS-----", store.currentLocations);

        await actions.getBookingsByPro(proId);
        // console.log("-----PRO-BOOKINGS-----", store.bookingsByPro);

        await actions.getServicesByPro(proId);
        // console.log("-----SERVICES-BY-PRO-----", store.servicesByPro);

        await actions.getProServicesByPro(proId);
        // console.log("-----PRO-SERVICES-----", store.proServicesByPro);

        await actions.getHoursByPro(proId);
        // console.log("-----PRO-HOURS-----", store.hoursByPro);

        await actions.getHoursByLocation(store.currentLocations[0].id);
        // console.log("-----LOCATION-HOURS-----", store.hoursByLocation);

        await actions.getInactivityByPro(proId);
        // console.log("-----PRO-INACTIVITY-----", store.inactivityByPro);

        let patientsMap = new Map();

        store.bookingsByPro.forEach((booking) => {
          const patient = {
            "id": booking.patient_id,
            "name": booking.patient_name,
            "lastname": booking.patient_lastname,
            "email": booking.patient_email,
            "phone": booking.patient_phone
          };

          patientsMap.set(patient.id, patient)
        });

        const finalPatients = Array.from(patientsMap.values())
        store.patientsByPro = finalPatients

        // console.log("-----PATIENTS_BY_PRO------", store.patientsByPro)

        setDetailsLoaded(true)

        // Llamada a la comprobacion de token si hay
        checkAndUpdateAccessToken()

        //Creación businessHours en el calendar
        getBusinessHoursList()


      } catch (error) {
        console.error('Error al obtener datos del profesional:', error)
      }
    };

    if (store.bookingsByPro.length === 0) {
      fetchData()
    }
  }, [store.isLoggedIn, store.token, store.bookingsByPro])

  // Give calculated ending time to bookings
  useEffect(() => {
    if (store.bookingsByPro.length > 0) {
      store.bookingsByPro = store.bookingsByPro.map((booking) => {
        return getEndingDate(
          booking,
          booking.date,
          booking.starting_time,
          booking.duration
        );
      });
      setEndingDatesLoaded(true)
    }

  }, [detailsLoaded, store.bookingsByPro])

  function getEndingDate(booking, date, starting_time, minutes) {
    const fullDate = new Date(`${date}T${starting_time}`)
    fullDate.setMinutes(fullDate.getMinutes() + parseInt(minutes, 10))
    const hours = fullDate.getHours().toString().padStart(2, '0')
    const nerMinutes = fullDate.getMinutes().toString().padStart(2, '0')
    const seconds = fullDate.getSeconds().toString().padStart(2, '0')
    const finalTime = `${hours}:${nerMinutes}:${seconds}`

    booking.ending_time = finalTime
    return booking;
  }

  const handleBookingEditSubmit = async (e) => {
    e.preventDefault();
    setBookingEdit(!bookingEdit);
    const updatedBooking = {
      id: selectedEvent.extendedProps.id,
      pro_service_id: editedProService !== '' && editedProService !== undefined ? parseInt(editedProService) : selectedEvent.extendedProps.proServiceId,
      date: editedDate !== '' && editedDate !== undefined ? editedDate : selectedEvent.extendedProps.date,
      starting_time: editedHour !== '' && editedHour !== undefined ? editedHour : selectedEvent.extendedProps.startTime,
      pro_notes: editedNote !== '' && editedNote !== undefined ? editedNote : selectedEvent.extendedProps.proNotes,
    };
    const finalBooking = await actions.updateBooking(updatedBooking)
    store.bookingsByPro = [...store.bookingsByPro.filter((booking) => booking.id != finalBooking.id), finalBooking]
    setShowBookingDetails(false)
    setEditedProService("")
    setEditedDate("")
    setEditedHour("")
    setEditedNote("")
  };

  const getBusinessHoursList = () => {
    const uniqueBusinessHours = [];
    store.hoursByPro.forEach(hour => {
      if (hour.starting_hour_morning !== null && hour.ending_hour_morning !== null) {
        const existingMorningIndex = uniqueBusinessHours.findIndex(item => item.startTime === hour.starting_hour_morning && item.endTime === hour.ending_hour_morning)
        if (existingMorningIndex === -1) {
          uniqueBusinessHours.push({
            daysOfWeek: [hour.working_day],
            startTime: hour.starting_hour_morning,
            endTime: hour.ending_hour_morning
          });
        } else {
          if (!uniqueBusinessHours[existingMorningIndex].daysOfWeek.includes(hour.working_day)) {
            uniqueBusinessHours[existingMorningIndex].daysOfWeek.push(hour.working_day)
          }
        }
      }
      if (hour.starting_hour_after !== null && hour.ending_hour_after !== null) {
        const existingAfterIndex = uniqueBusinessHours.findIndex(item => item.startTime === hour.starting_hour_after && item.endTime === hour.ending_hour_after)

        if (existingAfterIndex === -1) {
          uniqueBusinessHours.push({
            daysOfWeek: [hour.working_day],
            startTime: hour.starting_hour_after,
            endTime: hour.ending_hour_after
          });
        } else {
          if (!uniqueBusinessHours[existingAfterIndex].daysOfWeek.includes(hour.working_day)) {
            uniqueBusinessHours[existingAfterIndex].daysOfWeek.push(hour.working_day)
          }
        }
      }
    })
    setBusinessHoursList(uniqueBusinessHours)
    store.businessHours = uniqueBusinessHours
  }



  // Logica para la actualización de google token si es necesario.
  const isAccessTokenValid = (accessToken, expiresIn) => {
    if (!accessToken || !expiresIn) {
      return false;
    }

    const expirationDate = new Date(expiresIn);
    const currentDate = new Date();

    return expirationDate > currentDate;
  };

  const refreshAccessToken = async (refreshToken) => {
    const tokenEndpoint = 'https://oauth2.googleapis.com/token'
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'refresh_token': refreshToken,
          'client_id': clientId,
          'client_secret': clientSecret,
          'grant_type': 'refresh_token',
        }),
      });

      if (response.ok) {
        const tokenData = await response.json();
        return tokenData;
      } else {
        console.error('Access token refresh error:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const checkAndUpdateAccessToken = async () => {
    const tokens = await actions.getGoogleTokensByPro(store.currentPro.id)
    console.log(tokens)
    const accessToken = tokens.access_token
    const expiresIn = tokens.expires_in
    const refreshToken = tokens.refresh_token
    if (!isAccessTokenValid(accessToken, expiresIn)) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        console.log(newAccessToken)
        const pro = store.currentPro
        pro.google_access_token = newAccessToken.access_token
        const expirationDate = new Date()
        expirationDate.setMinutes(expirationDate.getMinutes() + newAccessToken.expires_in)
        const localExpirationDateString = expirationDate.toISOString().slice(0, 19)
        pro.google_access_expires = localExpirationDateString
        console.log(pro)
        await actions.updatePro(pro)
        console.log("token updated")
      }
    }
  };


  // Click on event
  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event);
    setShowBookingDetails(!showBookingDetails)
    setShowAddBooking(false)
  }

  const handleCloseCanvas = () => {
    setShowBookingDetails(!showBookingDetails)
    setEditedDate('')
    setEditedProService('')
    setEditedHour('')
    setEditedNote('')
  }

  const handleAddBookingForm = () => {
    setShowAddBooking(!showAddBooking)
    setShowBookingDetails(false)
  }

  const handleNewPatient = () => {
    setNewPatient(!newPatient)
  }

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);

    const filtered = store.patientsByPro.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.lastname.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query)
    );

    setFilteredPatients(filtered);

    if (filtered.length === 0 || query.trim() === '') {
      setFilteredPatients([]);
    }
  };

  const handleSelectPatient = (patient) => {
    setInputValue(`${patient.name} ${patient.lastname}`)
    setSelectedPatient(patient)
    setPatientPhone(patient.phone)
    setPatientEmail(patient.email)
    setFilteredPatients([])
  };

  const handleNewPatientName = (newName) => {
    setNewPatientName(newName)
  }

  const handleNewPatientLastname = (newLastname) => {
    setNewPatientLastname(newLastname)
  }

  const handleNewPatientEmail = (newEmail) => {
    setNewPatientEmail(newEmail)
  }

  const handleNewPatientPhone = (newPhone) => {
    setNewPatientPhone(newPhone)
  }

  const handleSelectedProService = (proServiceId) => {
    setSelectedProService(parseInt(proServiceId))
  }

  const handleBookingDate = (newDate) => {
    setBookingDate(newDate)
  }

  const handleBookingTime = (newTime) => {
    setBookingTime(newTime)
  }

  const handleProNotes = (newNotes) => {
    setProNotes(newNotes)
  }

  const handleSaveBooking = async (e) => {
    e.preventDefault()

    if (!newPatient) {
      let newBooking = {
        "patient_id": selectedPatient.id,
        "pro_service_id": selectedProService,
        "date": bookingDate,
        "starting_time": bookingTime,
        "pro_notes": proNotes,
        "status": "pending"
      }

      const booked = await actions.newBooking(newBooking)
      alert("Booking saved!")
      await actions.getBookingsByPro(store.currentPro.id)

      const finalBooked = getEndingDate(booked, booked.date, booked.starting_time, booked.duration)

      const googleEvent = {
        'summary': 'DocDate Appointment',
        'description': `${finalBooked.specialization}: ${finalBooked.service_name}`,
        'start': {
          'dateTime': `${finalBooked.date}T${finalBooked.starting_time}:00`,
          'timeZone': `Europe/London`,
        },
        'end': {
          'dateTime': `${finalBooked.date}T${finalBooked.ending_time}`,
          'timeZone': `Europe/London`,
        },
      };
      console.log(googleEvent)
      await fetch(process.env.BACKEND_URL + `/create-event/${store.currentPro.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleEvent }),
      })
      console.log("gEvent created!")
    }
    if (newPatient) {
      let newPatients = {
        "name": newPatientName,
        "lastname": newPatientLastname,
        "email": newPatientEmail,
        "phone": newPatientPhone,
      }
      const finalPatient = await actions.newPatient(newPatients)
      store.patientsByPro = [...store.patientsByPro, finalPatient]
      let newBooking = {
        "patient_id": finalPatient.id,
        "pro_service_id": selectedProService,
        "date": bookingDate,
        "starting_time": bookingTime,
        "pro_notes": proNotes,
        "status": "pending"
      }
      const booked = await actions.newBooking(newBooking)
      alert("Booking saved!")
      await actions.getBookingsByPro(store.currentPro.id)

      const finalBooked = getEndingDate(booked, booked.date, booked.starting_time, booked.duration)

      const googleEvent = {
        'summary': 'DocDate Appointment',
        'description': `${finalBooked.specialization}: ${finalBooked.service_name}`,
        'start': {
          'dateTime': `${finalBooked.date}T${finalBooked.starting_time}:00`,
          'timeZone': `Europe/London`,
        },
        'end': {
          'dateTime': `${finalBooked.date}T${finalBooked.ending_time}`,
          'timeZone': `Europe/London`,
        },
      };
      console.log(googleEvent)
      await fetch(process.env.BACKEND_URL + `/create-event/${store.currentPro.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleEvent }),
      })
      console.log("gEvent created!")
    }

  }


  return (
    <div className="pt-4 " style={{ minHeight: "80vh" }}>
      <div id='account-data' className="align-items-center bg-light py-3 container">
        <div className="text-black-50 mx-auto px-4" style={{ marginBottom: "6rem", width: "100%", maxWidth: "1500px" }}>
          <div className="d-flex">
            <h4 className=" text-decoration-underline">MY CALENDAR</h4>
            <button className="btn btn-sm ms-auto text-white" style={{ backgroundColor: "#14C4B9" }} onClick={handleAddBookingForm}>Add New Booking</button>
          </div>
          <hr />
          <div className="p-3 rounded bg-white border text-black-50">
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin]}
              initialView='timeGridWeek'
              headerToolbar={{
                left: 'prev,next,today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
              }}
              monthStartFormat={{ month: 'short', day: 'numeric' }}
              nowIndicator={true}
              weekends={true}
              eventClick={handleEventClick}
              allDaySlot={false}
              businessHours={businessHoursList}
              height={750}
              events={
                endingDatesLoaded
                  ? [
                    // Mapeo de bookings
                    ...store.bookingsByPro.map((booking) => (
                      {
                        title: booking.service_name,
                        start: `${booking.date}T${booking.starting_time}:00`,
                        end: `${booking.date}T${booking.ending_time}`,
                        extendedProps: {
                          booking: booking,
                          id: booking.id,
                          date: booking.date,
                          startTime: booking.starting_time,
                          specialization: booking.specialization,
                          service: booking.service_name,
                          proServiceId: booking.pro_service_id,
                          patientName: booking.patient_name,
                          patientLastName: booking.patient_lastname,
                          status: booking.status,
                          duration: booking.duration,
                          patientNotes: booking.patient_notes,
                          proNotes: booking.pro_notes
                        },
                        // Propiedades específicas para bookings
                        color: '#14C4B9',
                        className: 'booking-event',
                      })),
                    // Mapeo de holidays
                    ...store.inactivityByPro.map((inactivity) => ({
                      title: 'Holiday',
                      start: !inactivity.starting_hour ?
                        `${inactivity.starting_date}T00:00:00` : `${inactivity.starting_date}T${inactivity.starting_hour}`,
                      end: !inactivity.ending_date && !inactivity.ending_hour ?
                        `${inactivity.starting_date}T23:59:59` : inactivity.ending_date && !inactivity.ending_hour ?
                          `${inactivity.ending_date}T23:59:59` : `${inactivity.ending_date}T${inactivity.ending_hour}`,
                      // Propiedades específicas para holidays
                      color: '#87d8d4a4',
                      className: 'holiday-event',
                    })),
                  ]
                  : store.inactivityByPro.map((inactivity) => ({
                    title: 'Holiday',
                    start: !inactivity.starting_hour ?
                      `${inactivity.starting_date}T00:00:00` : `${inactivity.starting_date}T${inactivity.starting_hour}`,
                    end: !inactivity.ending_date && !inactivity.ending_hour ?
                      `${inactivity.starting_date}T23:59:59` : inactivity.ending_date && !inactivity.ending_hour ?
                        `${inactivity.ending_date}T23:59:59` : `${inactivity.ending_date}T${inactivity.ending_hour}`,
                    // Propiedades específicas para holidays
                    color: '#87d8d4a4',
                    className: 'holiday-event',
                  }))
              }
            />
          </div>
        </div>

        {/* BOOKING DETAILS  */}
        {showBookingDetails ? (
          <form onSubmit={(e) => handleBookingEditSubmit(e)} className="bg-white position-fixed top-0 end-0 bottom-0 min-vh-100 py-5 px-4 shadow overflow-scroll" style={{ zIndex: "1100", width: "100%", maxWidth: "450px" }} >

            <div className="d-flex justify-content-between mb-5">
              <h5 className="me-4 text-black-50 text-decoration-underline fw-bold" >BOOKING DETAILS</h5>
              <button type="button" className="btn-close" onClick={handleCloseCanvas} ></button>
            </div>
            <div className="rounded bg-light p-3 text-black-50 fw-light">
              <label className="small mb-1 fw-bold text-black-50">Specialization</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0  w-100`} type="text" value={selectedEvent.extendedProps.specialization ?? ''} disabled></input>

              <label htmlFor="edited-service" className="small mb-1 fw-bold text-black-50">Service</label>
              <select id="edited-service" className={`w-100 small mb-3 text-black-50 p-1 rounded border-0 ${bookingEdit ? "bg-white p-2" : ""}`} value={editedProService != "" ? editedProService : selectedEvent.extendedProps.proServiceId} disabled={!bookingEdit} onChange={(e) => setEditedProService(e.target.value)}>
                <option value="" disabled>Select a service</option>
                {store.proServicesByPro.map((proService) => {
                  return (
                    <option key={proService.id} value={proService.id}>{proService.service_name}</option>
                  )
                })}
              </select>

              <label className="small mb-1 fw-bold text-black-50">Date</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0 ${bookingEdit ? "bg-white p-2" : ""} w-100`} type="date" value={editedDate != "" ? editedDate : selectedEvent.extendedProps.date} disabled={!bookingEdit} onChange={(e) => setEditedDate(e.target.value)}></input>
              <label className="small mb-1 fw-bold text-black-50">Visit Start Hour</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0 ${bookingEdit ? "bg-white p-2" : ""} w-100`} type="time" value={editedHour != "" ? editedHour : selectedEvent.extendedProps.startTime} disabled={!bookingEdit} onChange={(e) => setEditedHour(e.target.value)}></input>
              <label className="small mb-1 fw-bold text-black-50">Duration</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0 w-100`} type="text" value={`${selectedEvent.extendedProps.duration ?? ''} minutes`} disabled></input>
              <label className="small mb-1 fw-bold text-black-50">Patient</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0 w-100`} type="text" value={`${selectedEvent.extendedProps.patientName ?? ''} ${selectedEvent.extendedProps.patientLastName}`} disabled></input>
              <label className="small mb-1 fw-bold text-black-50">Status</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0 w-100`} type="text" value={selectedEvent.extendedProps.status ?? ''} disabled></input>
              <label className="small mb-1 fw-bold text-black-50">Patient notes</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0  w-100`} type="text" value={selectedEvent.extendedProps.patientNotes ?? ''} disabled></input>
              <label className="small mb-1 fw-bold text-black-50">My notes</label>
              <input className={`d-block small mb-3 text-black-50 p-1 rounded border-0 ${bookingEdit ? "bg-white p-2" : ""} w-100`} type="text" value={editedNote != "" ? editedNote : selectedEvent.extendedProps.proNotes} disabled={!bookingEdit} onChange={(e) => setEditedNote(e.target.value)}></input>
            </div>
            <div className="mt-3 d-flex">
              {bookingEdit ?
                <input type="submit" value="Save" className="ms-auto btn btn-sm text-white" style={{ backgroundColor: "#14C4B9" }} ></input>
                : <button className="ms-auto btn btn-sm btn-light" onClick={() => setBookingEdit(!bookingEdit)}>Edit</button>
              }
            </div>
          </form>
        ) : (null)}


        {/* ADD BOOKING  */}
        {showAddBooking ? (
          <div className="bg-white position-fixed top-0 end-0 bottom-0 min-vh-100 py-5 px-4 shadow overflow-scroll" style={{ zIndex: "1100", width: "100%", maxWidth: "500px" }} >

            <div className="d-flex justify-content-between mb-5">
              <h5 className="me-4 text-black-50 text-decoration-underline fw-bold" >ADD NEW BOOKING</h5>
              <button type="button" className="btn-close" onClick={handleAddBookingForm} ></button>
            </div>

            <div className="rounded bg-light p-3 text-black-50 fw-light">
              <form onSubmit={(e) => handleSaveBooking(e)}>
                <div>
                  <h5 className="mb-4 text-decoration-underline">Booking Details</h5>
                  <label className="form-label">Date & Time</label>
                  <input type='date' onChange={(e) => handleBookingDate(e.target.value)} className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  <input type='time' onChange={(e) => handleBookingTime(e.target.value)} className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  <div className="mb-3">
                    <label htmlFor="service" className="form-label">Service</label>
                    <select id="service" className="form-select w-100" value={selectedProService} required onChange={(e) => handleSelectedProService(e.target.value)}>
                      <option value="" disabled>Select a service</option>
                      {store.proServicesByPro.map((proService) => {
                        return (
                          <option key={proService.id} value={proService.id}>{proService.service_name}</option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea id="notes" value={proNotes} placeholder="My Notes" className="form-control w-100" onChange={(e) => handleProNotes(e.target.value)}></textarea>
                  </div>
                </div>

                {!newPatient ?
                  <div>
                    <h5 className="mb-2 text-decoration-underline">Patient details</h5>
                    <div className="">
                      <input type="checkbox" className="form-check-input me-2 mb-3" id="newPatient" value={newPatient} checked={newPatient} onChange={handleNewPatient} />
                      <label className="form-check-label me-5" htmlFor='holidayType'>
                        <span>New patient</span>
                      </label>
                    </div>
                    <div className="autocomplete">
                      <input className="d-block mb-3 p-2 w-100 rounded border-0" type="text" id="patient" value={inputValue} onChange={handleInputChange} placeholder="Search for a patient..." />
                      {filteredPatients.length > 0 && (
                        <div className="autocomplete-dropdown">

                          {filteredPatients.map((patient) => (
                            <div key={patient.id} className="autocomplete-option" onClick={() => handleSelectPatient(patient)} >
                              {patient.name} {patient.lastname}
                            </div>
                          ))}

                        </div>
                      )}

                    </div>
                    <input value={patientEmail} readOnly disabled type='text' placeholder="Email" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                    <input value={patientPhone} readOnly disabled type='text' placeholder="Phone" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  </div>
                  :
                  <div>
                    <h5 className="mb-2 text-decoration-underline">Patient details</h5>
                    <div className="">
                      <input
                        type="checkbox"
                        className="form-check-input me-2 mb-3"
                        id="newPatient"
                        value={newPatient}
                        checked={newPatient}
                        onChange={handleNewPatient}
                      />
                      <label className="form-check-label me-5" htmlFor='holidayType'>
                        <span>New patient</span>
                      </label>
                    </div>
                    <input value={newPatientName} onChange={(e) => handleNewPatientName(e.target.value)} type='text' placeholder="Name" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                    <input value={newPatientLastname} onChange={(e) => handleNewPatientLastname(e.target.value)} type='text' placeholder="Last Name" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                    <input value={newPatientEmail} onChange={(e) => handleNewPatientEmail(e.target.value)} type='text' placeholder="Email" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                    <input value={newPatientPhone} onChange={(e) => handleNewPatientPhone(e.target.value)} type='text' placeholder="Phone" className="d-block mb-3 p-2 w-100 rounded border-0"></input>
                  </div>}
                <input type='submit' value="Save Booking" className="ms-auto mt-3 btn btn-sm border-0 text-white" style={{ backgroundColor: "#14C4B9" }} />
              </form>
            </div>


          </div>


        ) : (null)}


      </div>
    </div>
  )
}
