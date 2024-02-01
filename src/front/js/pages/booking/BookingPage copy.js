import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookingPage() {
  let { userName } = useParams();

  const [proServiceList, setProServiceList] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [proAvailability, setProAvailability] = useState([])
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showBookingInfo, setShowBookingInfo] = useState(false);


  /////////////////////////////////
  /// general flow

  /// 0 - api: load pro id from username url
  /// 1 - api: load all pro service => print on select input
  /// 2 - user: select service  (firs select the service in order to get service duration and create slot accordingly!) 
  /// 3.1 api: (CALENDAR LOGIC) get availability by proid. ATENCION! in the back-end divide the available time by service duration! respond with an array of obday: {"01-02-2024", hour: "08:00" },
  // 3.2 fronr: print calendarn (IF day is in proAvailability, MAKET IT CLICKABLE and with "#14C4B9" background )
  // 4 - user: click on calendar date (open booking details)
  // 5 - front: print only hours slot for selected date
  // 6 - user: insert email
  // 6.2 optional api: get patient by email. if exist return true
  // 6.3 optional front: IF email already exist show submit button, ELSE ask all data (phone, name)
  // 8 - user: fill with all contact data
  // 9 - user: SUBMIT FORM


  // Effect: on page load 
  useEffect(() => {

    // 0 - api: load pro id from username url
    console.log('running booking page: ', userName);

    // 1 - api: load all pro service => print on select input
    const apiProServiceResponse = [
      { id: "161", name: "Generic visit", duration: "50" },
      { id: "162", name: "Manipulation", duration: "60" },
      { id: "163", name: "Phone Consultancy", duration: "45" },
      { id: "164", name: "Rehab", duration: "50" },
      { id: "165", name: "Pediatric manipulation", duration: "40" },
      { id: "166", name: "Streatching", duration: "30" },
      { id: "167", name: "Electro medical", duration: "40" },
    ]
    setProServiceList(apiProServiceResponse)

    // 3.1 api: (CALENDAR LOGIC) get availability by proid. ATENCION! in the back-end divide the available time by service duration and return an array of obj like this one!
    const apiAvailabilityResponse = [
      { day: "01-02-2024", hour: "08:00" },
      { day: "01-02-2024", hour: "09:00" },
      { day: "01-02-2024", hour: "10:00" },
      { day: "02-02-2024", hour: "10:30" },
      { day: "02-02-2024", hour: "11:00" },
      { day: "02-02-2024", hour: "12:00" },
      { day: "03-02-2024", hour: "13:00" },
      { day: "03-02-2024", hour: "14:00" },
      { day: "03-02-2024", hour: "15:00" },
    ]

    setProAvailability(apiAvailabilityResponse)

  }, []);

  // Functions: booking flow
  const handleDaySelection = (day) => {
    setShowBookingInfo(true);
    console.log('click on day: ', day)
  };
  const handleBookNow = () => {
    console.log('click on book now')
  };
  const handleServiceSelection = (service) => {
    console.log('service: ', JSON.parse(service))
    setSelectedService(JSON.parse(service))
  }
  const handleCloseForm = () => {
    setShowBookingInfo(false);
  };
  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('clicking on submit')

  }


  return (
    <>
      <section className="p-5 bg-light">
        <div className="d-flex justify-content-center" style={{ minHeight: "50vh" }}>

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
                  proServiceList.map(service => {
                    return (
                      <option key={service.id} value={JSON.stringify({ id: `${service.id}`, duration: `${service.duration}`, name: `${service.name}` })} >{service.name}</option>
                    )
                  })
                ) : ("No service for this calendar")}
              </select>

            </div>

            {/* BOOKING CALENDAR */}
            {selectedService ? (
              <div id="booking-calendar" className="m-auto bg-white rounded border p-5">
                <div className="mb-5 border-bottom">
                  <span className="fs-2 text-black-50">February</span>
                </div>
                <div className="" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1rem" }}>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>1</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>2</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>3</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>4</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>5</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>6</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>7</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>8</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>9</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>10</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>11</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>12</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>13</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>14</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>15</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>16</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>17</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>18</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>19</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>20</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>21</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>22</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>23</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>24</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>25</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>26</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>27</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>28</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>29</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>30</span>
                  <span className=" py-3 rounded-circle bg-info text-white text-center fs-5" onClick={(e) => handleDaySelection(e.target.innerHTML)}>31</span>
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

            <span className="mb-1 d-inline-block text-black-50 fs-6">Select Visit Hour</span>
            <div className="rounded bg-dark bg-opacity-10 p-3 text-black-50 fw-light mb-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>

              {/* day hours availabilty */}
              {proAvailability ? (
                proAvailability.map((slot, index) => {
                  return (
                    <span key={index} className="btn btn-light" style={{ color: selectedHour === slot.hour ? "#ffffff" : "#14C4B9", backgroundColor: selectedHour === slot.hour ? "#14C4B9" : "#ffffff", borderColor: "#14C4B9" }} onClick={() => handleHourSelect(slot.hour)} >{slot.hour}</span>
                  );
                })
              ) : (<p>No hours available</p>)}

            </div>

            <input type="submit" value="Book Now" className="btn btn-sm ms-auto text-white" style={{ backgroundColor: "#14C4B9" }}></input>
          </form>
        </div>
      ) : null}

    </>
  );
};
