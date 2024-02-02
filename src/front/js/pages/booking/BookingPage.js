import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookingPage() {
  let { userName } = useParams();

  // load from api or store
  const [proServiceList, setProServiceList] = useState([]);
  const [proBusySlot, setProBusySlot] = useState([]);
  const [proWorkingHors, setProWorkingHors] = useState([]);

  // patient selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');

  // patient interaction
  const [showBookingInfo, setShowBookingInfo] = useState(false);

  // Effect: on page load 
  useEffect(() => {

    // API calls: response with pro services
    const apiProServiceResponse = [
      { id: "161", name: "Generic visit", duration: 50 },
      { id: "162", name: "Manipulation", duration: 60 },
      { id: "163", name: "Phone Consultancy", duration: 45 },
      { id: "164", name: "Rehab", duration: 50 },
      { id: "165", name: "Pediatric manipulation", duration: 40 },
      { id: "166", name: "Streatching", duration: 30 },
      { id: "167", name: "Electro medical", duration: 40 },
    ];
    setProServiceList(apiProServiceResponse);

    // API calls: response with sum of all busy time: bookng + holiday
    const apiProBusyResponse = [
      { day: "04-02-2024", hour: "9:00", duration: 60 },
      { day: "04-02-2024", hour: "10:00", duration: 30 },
      { day: "04-02-2024", hour: "11:00", duration: 30 },
      { day: "04-02-2024", hour: "17:00", duration: 45 },
      { day: "06-02-2024", hour: "9:00", duration: 60 },
      { day: "06-02-2024", hour: "10:00", duration: 60 },
      { day: "06-02-2024", hour: "11:00", duration: 60 },
      { day: "06-02-2024", hour: "12:00", duration: 60 },
      { day: "06-02-2024", hour: "13:00", duration: 60 },
      { day: "06-02-2024", hour: "14:00", duration: 60 },
      { day: "06-02-2024", hour: "15:00", duration: 60 },
      { day: "06-02-2024", hour: "16:00", duration: 60 },
      { day: "06-02-2024", hour: "17:00", duration: 60 },
      { day: "06-02-2024", hour: "18:00", duration: 60 },
    ];
    setProBusySlot(apiProBusyResponse);

    // API: response with workingday hours slot 
    const apiProWorkingHours = [
      { start: "9:00", end: "20:00" }
    ]
    setProWorkingHors(apiProWorkingHours)

  }, []);


  const generateAvailableSlots = (proWorkingHors, selectedService, proBusySlot, selectedDay) => {
    const availableSlots = [];
    const serviceDurationInMinutes = parseInt(selectedService.duration);
    const slotsForSelectedDay = proBusySlot.filter(slot => slot.day === selectedDay);


    // Trasform busy slots in 'minutes': es. 9:00 = 540; 10:00 = 600; 11:00 = 660;
    const occupiedSlots = slotsForSelectedDay.map(slot => {
      const slotHour = parseInt(slot.hour.split(':')[0]);
      const slotMinute = parseInt(slot.hour.split(':')[1]);
      const durationInMinutes = parseInt(slot.duration);

      return {
        start: slotHour * 60 + slotMinute,
        end: (slotHour * 60 + slotMinute) + durationInMinutes
      };
    });

    // create an object with proWorkingHors in minutes. eg: const workingTime = {start: 600, end: 1200}
    const workingTime = {
      start: parseInt(proWorkingHors[0].start.split(':')[0]) * 60 + parseInt(proWorkingHors[0].start.split(':')[1]),
      end: parseInt(proWorkingHors[0].end.split(':')[0]) * 60 + parseInt(proWorkingHors[0].end.split(':')[1])
    };

    // Loop through workingTime for each minute i.
    for (let i = workingTime.start; i < workingTime.end; i++) {
      let possibleSlot = { start: i, end: i + serviceDurationInMinutes };

      let isIntersected = false;

      // Loop through occupiedSlots
      for (let j = 0; j < occupiedSlots.length; j++) {
        // Check if possible slot intersects with the busy slot
        if (
          (possibleSlot.start >= occupiedSlots[j].start && possibleSlot.start < occupiedSlots[j].end) ||
          (possibleSlot.end > occupiedSlots[j].start && possibleSlot.end <= occupiedSlots[j].end) ||
          (possibleSlot.start < occupiedSlots[j].start && possibleSlot.end > occupiedSlots[j].end)
        ) {
          isIntersected = true;
          break;
        }
      }

      // If the possible slot does not intersect with any busy slots, add it to available slots
      if (!isIntersected && possibleSlot.end <= workingTime.end) {
        availableSlots.push(possibleSlot);
      }
    }

    // Filter available slots to ensure they do not overlap
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

    // Format non-overlapping slots into readable format
    const formattedSlots = nonOverlappingSlots.map(slot => {
      const startHour = Math.floor(slot.start / 60).toString().padStart(2, '0');
      const startMinute = (slot.start % 60).toString().padStart(2, '0');
      const endHour = Math.floor(slot.end / 60).toString().padStart(2, '0');
      const endMinute = (slot.end % 60).toString().padStart(2, '0');
      return `${startHour}:${startMinute}`;
    });

    return formattedSlots;
  };


  // Functions: booking flow
  const handleDaySelection = (day) => {
    setShowBookingInfo(true);
    setSelectedDay(day)
  };

  const handleHourSelect = (slot) => {
    setSelectedHour(slot);
  };

  const handleServiceSelection = (service) => {
    console.log('service: ', JSON.parse(service))
    setSelectedService(JSON.parse(service))
  }

  const handleCloseForm = () => {
    setShowBookingInfo(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('clicking on submit');
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
                {proServiceList ? (
                  proServiceList.map(service => (
                    <option key={service.id} value={JSON.stringify({ id: service.id, duration: service.duration, name: service.name })}>{service.name}</option>
                  ))
                ) : ("No service for this calendar")}
              </select>
            </div>
            {/* BOOKING CALENDAR */}
            {selectedService ? (
              <div id="booking-calendar" className="m-auto bg-white rounded border p-5">
                <div className="mb-5 border-bottom">
                  <span className="fs-2 text-black-50">February</span>
                </div>
                <div className="" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                  <span className=" py-3 rounded text-white text-center fs-5" style={{ backgroundColor: "#14C4B9" }} onClick={(e) => handleDaySelection(e.target.innerHTML)}>06-02-2024</span>
                  <span className=" py-3 rounded text-white text-center fs-5" style={{ backgroundColor: "#14C4B9" }} onClick={(e) => handleDaySelection(e.target.innerHTML)}>04-02-2024</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* BOOKING INFO FORM */}
      {showBookingInfo ? (
        <div className="bg-white position-fixed top-0 end-0 bottom-0 min-vh-100 py-5 px-4 w-25 shadow" style={{ zIndex: "10", width: "100%", maxWidth: "400px" }}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="d-flex justify-content-between mb-5">
              <h5 className="me-4 text-black-50 text-decoration-underline fw-bold" >BOOKING DETAILS</h5>
              <button type="button" className="btn-close" onClick={handleCloseForm}></button>
            </div>
            {/* day hours availability */}
            <span className="mb-1 d-inline-block text-black-50 fs-6 text-decoration-underline">Select Visit Hour</span>
            <div className="rounded bg-light small p-3 mb-5" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>

              {proBusySlot ? (
                generateAvailableSlots(proWorkingHors, selectedService, proBusySlot, selectedDay).map((slot, index) => (
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
                <p>No hours available</p>
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
                  <input className="p-2 w-100 rounded-3 border-0 mb-2" type="email" placeholder="your@mail.com"></input>
                  <input className="p-2 w-100 rounded-3 border-0 mb-2" type="text" placeholder="Your full name"></input>
                  <input className="p-2 w-100 rounded-3 border-0 mb-2" type="number" placeholder="12123234"></input>
                </div>
                {/* Privacy consense */}
                <div className="rounded p-3 fw-light mb-5" style={{ backgroundColor: "#E0F3F3" }}>
                  <p className="mb-1 text-black-50 fw-normal fs-6 text-decoration-underline">Privacy Policy and Consent</p>
                  <p className="mb-1 text-black-50 small mb-2">
                    In order to complete this booking, you'll be asked to confirm your email.
                  </p>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="privacy" />
                    <label className="form-check-label small fw-lighter" htmlFor="privacy">
                      Privacy Consent
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="contactusageconsense" />
                    <label className="form-check-label small fw-lighter" htmlFor="contactusageconsense">
                      Third Party Consent
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="marketingconsent" />
                    <label className="form-check-label small fw-lighter" htmlFor="marketingconsent">
                      Marketing Consent
                    </label>
                  </div>
                </div>
              </>
            ) : (null)}
            <input type="submit" value="Book Now" className="btn btn-sm ms-auto text-white" style={{ backgroundColor: "#14C4B9" }}></input>
          </form>
        </div>
      ) : null}
    </>
  );
}
