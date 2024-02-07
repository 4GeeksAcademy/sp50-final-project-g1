import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../../store/appContext";





///////////////////////////////////////
// BUGS REPORTING:
// can't see sunday timeslot: set daynumber to 0 for sunday (do not user 7)
// run error if working day don't have a time range (eg: afternoon).
/////////////////////////////////////











export default function BookingPage() {
  let { userName } = useParams();

  const { store, actions } = useContext(Context)

  // load from api or store
  const [proBusySlot, setProBusySlot] = useState([]);
  const [proWorkingHors, setProWorkingHors] = useState([]);

  // patient input
  const [selectedProService, setSelectedProService] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [patientEmail, setPatientEmail] = useState(null);
  const [patientName, setPatientName] = useState(null);
  const [patientLastname, setPatientLastname] = useState(null)
  const [patientPhone, setPatientPhone] = useState("");
  const [patientNote, setPatientNote] = useState('');
  const [consenseMarketing, setConsenseMarketing] = useState(false);
  const [consenseThirdParty, setConsenseThirdParty] = useState(false);
  const [consensePrivacy, setConsensePivacy] = useState(false);

  // patient interaction
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(null);

  // Effect: on page load 
  useEffect(() => {

    // API Calls:
    const fetchPro = async (userName) => {
      await actions.getProByUsername(userName)
      // console.log("----PRO----", store.currentPro)
      await actions.getProServicesByPro(store.currentPro.id)
      // console.log("----PROSERV----", store.proServicesByPro)
      await actions.getHoursByPro(store.currentPro.id)
      // console.log("----WORKING_HOURS----", store.hoursByPro)
      await actions.getBookingsByPro(store.currentPro.id)
      console.log("----BOOKINGS----", store.bookingsByPro)
      await actions.getInactivityByPro(store.currentPro.id)
      // console.log("----HOLYDAYS----", store.inactivityByPro)


      /////////////////////////////////////////////////////////
      // 1 - generate proBusy list: sum of booking and holiday

      let apiProBusyResponse = []

      // Add all booking list
      if (store.bookingsByPro) {
        apiProBusyResponse = [...apiProBusyResponse, ...store.bookingsByPro];
      }

      if (store.inactivityByPro) {
        store.inactivityByPro.map((inactivity) => {
          // Add long period holiday
          if (inactivity.ending_date) {
            const startDateStr = inactivity.starting_date
            const endDateStr = inactivity.ending_date
            function calculateTotalMinutes(startDateStr, endDateStr) {
              const startDate = new Date(startDateStr)
              const endDate = new Date(endDateStr)
              endDate.setDate(endDate.getDate() + 1)
              const minuteDifference = (endDate.getTime() - startDate.getTime()) / (1000 * 60)
              let calculatedBooking = {
                date: inactivity.starting_date,
                starting_time: "00:00",
                duration: minuteDifference
              }
              apiProBusyResponse.push(calculatedBooking)
            }
            calculateTotalMinutes(startDateStr, endDateStr)
          }
          // Full day holiday 
          if (!inactivity.ending_date && !inactivity.starting_hour && !inactivity.ending_hour) {
            let busy = {
              date: inactivity.starting_date,
              starting_time: "00:00",
              duration: 1440
            }
            apiProBusyResponse.push(busy)
          }

          // calculate partial day holiday
          if (inactivity.starting_hour && inactivity.ending_hour) {
            const startingTimeStr = inactivity.starting_hour
            const endingTimeStr = inactivity.ending_hour
            function calculateDifferenceMinutes(startingTimeStr, endingTimeStr) {
              const startTime = new Date(`1970-01-01T${startingTimeStr}`)
              const endTime = new Date(`1970-01-01T${endingTimeStr}`)
              const minuteDifference = (endTime - startTime) / (1000 * 60);
              let busy = {
                date: inactivity.starting_date,
                starting_time: inactivity.starting_hour,
                duration: minuteDifference
              }
              apiProBusyResponse.push(busy)
            }
            calculateDifferenceMinutes(startingTimeStr, endingTimeStr)
          }

          if (inactivity.starting_date && inactivity.starting_hour && !inactivity.ending_hour) {
            const startingTimeStr = inactivity.starting_hour
            function calculateMinutesToEndDay(startingTimeStr) {
              const time = new Date(`1970-01-01T${startingTimeStr}`)
              const dayTime = time.getHours();
              const dayMinutes = time.getMinutes();
              const finalMinutes = (24 * 60) - (dayTime * 60 + dayMinutes);
              let busy = {
                date: inactivity.starting_date,
                starting_time: inactivity.starting_hour,
                duration: finalMinutes
              }
              apiProBusyResponse.push(busy)
            }
            calculateMinutesToEndDay(startingTimeStr)
          }
        })
      }
      setProBusySlot(apiProBusyResponse)
      setProWorkingHors(store.hoursByPro)
    }
    fetchPro(userName)

  }, []);

  // CALENDAR SLOT CREATION!
  const generateAvailableSlots = (proWorkingHours, selectedProService, proBusySlot, selectedDay) => {
    const availableSlots = [];
    const serviceDurationInMinutes = parseInt(selectedProService.duration);
    const busySlotsForSelectedDay = proBusySlot.filter(slot => slot.date === selectedDay.dayString);

    // 1- Trasform busy slots in 'minutes': es. 9:00 = 540; 10:00 = 600; 11:00 = 660;
    const busySlotsInMinutes = busySlotsForSelectedDay.map(slot => {
      const slotHour = parseInt(slot.starting_time.split(':')[0]);
      const slotMinute = parseInt(slot.starting_time.split(':')[1]);
      const durationInMinutes = parseInt(slot.duration);

      return {
        start: slotHour * 60 + slotMinute,
        end: (slotHour * 60 + slotMinute) + durationInMinutes
      };
    });

    // 2 - create an object with proWorkingHors in minutes. eg: const workingTime = [{id:1, working_day: 2, starting_hour_morning: 600, ending_hour_morning: 1200}]
    const workingTime = proWorkingHours.map((shift) => {
      return (
        {
          id: shift.id,
          working_day: shift.working_day,
          starting_hour_morning: parseInt(shift.starting_hour_morning.split(':')[0]) * 60 + parseInt(shift.starting_hour_morning.split(':')[1]),
          ending_hour_morning: parseInt(shift.ending_hour_morning.split(':')[0]) * 60 + parseInt(shift.ending_hour_morning.split(':')[1]),
          starting_hour_after: parseInt(shift.starting_hour_after.split(':')[0]) * 60 + parseInt(shift.starting_hour_after.split(':')[1]),
          ending_hour_after: parseInt(shift.ending_hour_after.split(':')[0]) * 60 + parseInt(shift.ending_hour_after.split(':')[1])
        }
      )
    });

    // 3.0 - find the working day slot
    const workingDay = workingTime.find(item => item.working_day === selectedDay.day);

    // 3.0.1 - Check if pro work on selectedDay
    if (!workingDay) {
      console.log(`Pro is not working on day ${selectedDay.day}`);
      return [];
    }

    /////////////  SLOT 1 - morning /////////////////////////////////
    // 3.1 - Loop through workingTime for each minute i.
    for (let i = workingDay.starting_hour_morning; i < workingDay.ending_hour_morning; i++) {
      let possibleSlot = { start: i, end: i + serviceDurationInMinutes };

      let isIntersected = false;

      // Loop through busySlotsInMinutes
      for (let j = 0; j < busySlotsInMinutes.length; j++) {
        // Check if possible slot intersects with the busy slot
        if (
          (possibleSlot.start >= busySlotsInMinutes[j].start && possibleSlot.start < busySlotsInMinutes[j].end) ||
          (possibleSlot.end > busySlotsInMinutes[j].start && possibleSlot.end <= busySlotsInMinutes[j].end) ||
          (possibleSlot.start < busySlotsInMinutes[j].start && possibleSlot.end > busySlotsInMinutes[j].end)
        ) {
          isIntersected = true;
          break;
        }
      }

      // If the possible slot does not intersect with any busy slots, add it to available slots
      if (!isIntersected && possibleSlot.end <= workingDay.ending_hour_morning) {
        availableSlots.push(possibleSlot);
      }
    }

    /////////////  SLOT 2 - afternoon /////////////////////////////////
    // 3.2 - Loop through workingDay for each minute i.
    for (let i = workingDay.starting_hour_after; i < workingDay.ending_hour_after; i++) {
      let possibleSlot = { start: i, end: i + serviceDurationInMinutes };

      let isIntersected = false;

      // Loop through busySlotsInMinutes
      for (let j = 0; j < busySlotsInMinutes.length; j++) {
        // Check if possible slot intersects with the busy slot
        if (
          (possibleSlot.start >= busySlotsInMinutes[j].start && possibleSlot.start < busySlotsInMinutes[j].end) ||
          (possibleSlot.end > busySlotsInMinutes[j].start && possibleSlot.end <= busySlotsInMinutes[j].end) ||
          (possibleSlot.start < busySlotsInMinutes[j].start && possibleSlot.end > busySlotsInMinutes[j].end)
        ) {
          isIntersected = true;
          break;
        }
      }

      // If the possible slot does not intersect with any busy slots, add it to available slots
      if (!isIntersected && possibleSlot.end <= workingDay.ending_hour_after) {
        availableSlots.push(possibleSlot);
      }
    }

    // 4 - Filter available slots to ensure they do not overlap
    const nonOverlappingSlots = [];
    for (let i = 0; i < availableSlots.length; i++) {
      let isOverlapping = false;
      for (let j = 0; j < nonOverlappingSlots.length; j++) {
        if (
          (availableSlots[i].start >= nonOverlappingSlots[j].start && availableSlots[i].start < nonOverlappingSlots[j].end) ||
          (availableSlots[i].end > nonOverlappingSlots[j].start && availableSlots[i].end <= nonOverlappingSlots[j].end) ||
          (availableSlots[i].start < nonOverlappingSlots[j].start && availableSlots[i].end > nonOverlappingSlots[j].end)
        ) {
          isOverlapping = true;
          break;
        }
      }
      if (!isOverlapping) {
        nonOverlappingSlots.push(availableSlots[i]);
      }
    }

    // 5 - Format non-overlapping slots into readable format
    const formattedSlots = nonOverlappingSlots.map(slot => {
      const startHour = Math.floor(slot.start / 60).toString().padStart(2, '0');
      const startMinute = (slot.start % 60).toString().padStart(2, '0');
      return `${startHour}:${startMinute}`;
    });

    return formattedSlots;
  };


  // Functions: interactions
  const handleDaySelection = (daySel) => {
    setShowBookingInfo(true);
    const fullDate = new Date(daySel)
    const dayOfWeek = fullDate.getDay()
    setSelectedDay({ dayString: daySel, day: dayOfWeek })

    setAvailableSlots(generateAvailableSlots(proWorkingHors, selectedProService, proBusySlot, { dayString: daySel, day: dayOfWeek }))

  };

  const handleHourSelect = (slot) => {
    setSelectedHour(slot);
  };

  const handleServiceSelection = (service) => {
    setSelectedProService(JSON.parse(service))
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const booking = {
      date: selectedDay.dayString,
      pro_service_id: selectedProService.id,
      starting_time: selectedHour,
      status: 'pending',
      patient_notes: patientNote,
    }

    const patient = {
      email: patientEmail,
      name: patientName,
      lastname: patientLastname,
      phone: patientPhone,
      patient_consense_privacy: consensePrivacy,
      patient_consense_third_party: consenseThirdParty,
      patient_consense_marketing: consenseMarketing,
    }

    console.log('-- Form submit --')
    console.log('booking: ', booking)
    console.log('patient: ', patient)

    const isPatient = await actions.getPatientByEmail(patientEmail)
    if (isPatient) {
      if (isPatient.name.toUpperCase() != patient.name.toUpperCase() || isPatient.lastname.toUpperCase() != patient.lastname.toUpperCase()){
        isPatient.name = patient.name
        isPatient.lastname = patient.lastname
        if (patient.phone != "") {
          isPatient.pone = patient.phone
        }
        const updatedPatient = await actions.updatePatient(isPatient)
        console.log(updatedPatient)
        booking.patient_id = updatedPatient.id
        const newBooking = await actions.newBooking(booking)
        console.log(newBooking)
      }
      else {
        booking.patient_id = isPatient.id
        const newBooking = await actions.newBooking(booking)
        console.log(newBooking)
      }
    }
    if (!isPatient) {
      const newPatient = await actions.newPatient(patient)
      console.log(newPatient)
      booking.patient_id = newPatient.id
      const newBooking = await actions.newBooking(booking)
      console.log(newBooking)
    }
  }


  return (
    <>
      <section className="p-5 bg-light">
        <div className="d-flex justify-content-center" style={{ minHeight: "70vh" }}>
          <div style={{ width: "100%", maxWidth: "650px" }}>
            <div className="d-flex align-items-center">
              <h4 className="text-black-50">Calendar:<span style={{ color: "#14C4B9", width: "100%", maxWidth: "450px" }}> {userName}</span></h4>
            </div>
            {/* SERVICE SELECTION */}
            <div id="booking-calendar" className="m-auto bg-white rounded border mb-4 p-3 text-black-50">
              <label htmlFor="booking-service" className="form-label visually-hidden">Select a Service</label>
              <select id="booking-service" className="form-select w-100" onChange={(event) => handleServiceSelection(event.target.value)}>
                <option value="">Select a service</option>
                {store.proServicesByPro ? (
                  store.proServicesByPro.map(service => (
                    <option key={service.id} value={JSON.stringify({ id: service.id, duration: service.duration, name: service.service_name })}>{service.service_name}</option>
                  ))
                ) : ("No service for this calendar")}
              </select>
            </div>
            {/* BOOKING CALENDAR */}
            {selectedProService ? (
              <div id="booking-calendar" className="m-auto bg-white rounded border p-5">
                <div className="mb-5 border-bottom">
                  <span className="fs-2 text-black-50">February</span>
                </div>
                <div className="" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                  <input type="date" onChange={(e) => handleDaySelection(e.target.value)}></input>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* BOOKING INFO FORM */}
      {showBookingInfo ? (
        <div className="bg-white position-fixed top-0 end-0 bottom-0 min-vh-100 py-5 px-4 shadow overflow-auto" style={{ zIndex: "10", width: "100%", maxWidth: "400px" }}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="d-flex justify-content-between mb-5">
              <h5 className="me-4 text-black-50 text-decoration-underline fw-bold" >BOOKING DETAILS</h5>
              <button type="button" className="btn-close" onClick={() => setShowBookingInfo(false)}></button>
            </div>
            {/* day hours availability */}
            <span className="mb-1 d-inline-block text-black-50 fs-6 text-decoration-underline">Select Visit Hour</span>
            <div className="rounded bg-light small p-3 mb-5" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>

              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="btn btn-light"
                    style={{
                      color: selectedHour === slot ? "#ffffff" : "#14C4B9",
                      backgroundColor: selectedHour === slot ? "#14C4B9" : "#ffffff",
                      borderColor: "#14C4B9"
                    }}
                    onClick={() => handleHourSelect(slot)}
                  >
                    {slot}
                  </span>
                ))

              ) : (
                <span className="btn btn-light" style={{ color: "#14C4B9", backgroundColor: "#ffffff", borderColor: "#14C4B9" }} >
                  No Slots
                </span>
              )}

            </div>
            {selectedHour ? (
              <>
                {/* contact info */}
                <span className="mb-1 d-inline-block text-black-50 fs-6 text-decoration-underline">Contact info</span>
                <p className="mb-1 text-black-50 fw-lighter small mb-2">
                  In order to complete this booking, you'll be asked to confirm your email.
                </p>
                <div className="rounded bg-light p-3 fw-lighter small mb-5">
                  <input className="p-2 w-100 rounded-3 border-0 mb-2" type="email" placeholder="your@mail.com" onChange={(e) => setPatientEmail(e.target.value)}></input>
                  <input className="p-2 w-100 rounded-3 border-0 mb-2" type="text" placeholder="Your name" onChange={(e) => setPatientName(e.target.value)}></input>
                  <input className="p-2 w-100 rounded-3 border-0 mb-2" type="text" placeholder="Your lastname" onChange={(e) => setPatientLastname(e.target.value)}></input>
                  <input className="p-2 w-100 rounded-3 border-0 mb-2" type="number" placeholder="12123234" onChange={(e) => setPatientPhone(e.target.value)}></input>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea id="notes" value={patientNote} placeholder="My Notes" className="form-control w-100" onChange={(e) => setPatientNote(e.target.value)}></textarea>
                  </div>
                </div>
                {/* Privacy consense */}
                <div className="rounded p-3 fw-light mb-5" style={{ backgroundColor: "#E0F3F3" }}>
                  <p className="mb-1 text-black-50 fw-normal fs-6 text-decoration-underline">Privacy Policy and Consent</p>
                  <p className="mb-1 text-black-50 small mb-2">
                    In order to complete this booking, you'll be asked to confirm your email.
                  </p>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="privacy" onChange={() => setConsensePivacy(!consensePrivacy)} />
                    <label className="form-check-label small fw-lighter" htmlFor="privacy">
                      Privacy Consent
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="contactusageconsense" onChange={() => setConsenseThirdParty(!consenseThirdParty)} />
                    <label className="form-check-label small fw-lighter" htmlFor="contactusageconsense">
                      Third Party Consent
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="marketingconsent" onChange={() => setConsenseMarketing(!consenseMarketing)} />
                    <label className="form-check-label small fw-lighter" htmlFor="marketingconsent">
                      Marketing Consent
                    </label>
                  </div>
                </div>
              </>
            ) : (null)}

            <input type="submit" value="Book Now" className="btn btn-sm ms-auto text-white" disabled={!patientEmail || !selectedDay || !selectedHour || !selectedProService} style={{ backgroundColor: "#14C4B9" }}></input>

          </form>
        </div>
      ) : null}
    </>
  );
}






