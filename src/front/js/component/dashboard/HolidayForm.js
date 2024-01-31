
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

export default function HolidayForm() {

  const navigate = useNavigate()
  const { store, actions } = useContext(Context)

  const [currentInactivityDays, setCurrentInactivityDays] = useState([])
  const [editStatus, setEditStatus] = useState(false)
  const [showAddHoliday, setShowAddHoliday] = useState(false)
  const [holidayType, setHolidayType] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  // Effect on page load
  useEffect(() => {
    if (!store.isLoggedIn) {
      // navigate('/login');
    } else {
      const fetchData = async () => {
        const response = await actions.authentication(store.token);
        const proId = response.logged_in_as;
        await actions.getPro(proId);
        await actions.getInactivityByPro(proId);
        console.log('holiday: ', store.inactivityByPro)
        setCurrentInactivityDays(store.inactivityByPro);
      };
      fetchData();
    }
  }, [store.isLoggedIn, store.token]);


  // Functions: holiay update
  const handleEditHoliday = () => {
    setEditStatus(!editStatus)
  }
  const handleSaveHoliday = (e) => {
    e.preventDefault()
    setEditStatus(!editStatus)
    console.log('holiday updated: ', currentInactivityDays)
  }
  const handleDelete = async (holidayDeleted) => {
    const updatedInactivityDays = currentInactivityDays.filter(holiday => holiday.id !== holidayDeleted.id);
    setCurrentInactivityDays(updatedInactivityDays);
    await actions.deleteInactivity(holidayDeleted.id)
    console.log("holiday deleted")
    await actions.getInactivityByPro(store.currentPro.id)

    console.log("inactivityByPro updated")

  }

  // Functions: add new holiday
  const handleAddHoliday = () => {
    setShowAddHoliday(!showAddHoliday)
  }
  const handleHolidayType = () => {
    setHolidayType(!holidayType)
    setStartDate('')
    setEndDate('')
    setStartTime('')
    setEndTime('')
  }

  const handleHolidaySubmit = async(e) => {
    e.preventDefault()
    console.log('click on submit one day holiday')

    const newHoliday = { starting_date: startDate, ending_date: endDate, starting_hour: startTime, ending_hour: endTime, pro_id: store.currentPro.id }
    console.log(newHoliday)

    await actions.newInactivity(newHoliday)
    setCurrentInactivityDays([...currentInactivityDays, newHoliday])
    await actions.getInactivityByPro(store.currentPro.id)

    console.log("inactivity added")

  }


  return (

    <>
      <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
        <div className="d-flex">
          <h4 className=" text-decoration-underline">HOLIDAYS</h4>
          <button className="ms-auto btn-sm text-white border-0" style={{ backgroundColor: "#14C4B9", border: "none" }} onClick={handleAddHoliday}>Add New</button>
        </div>
        <hr />

        <form id="holidayForm" onSubmit={handleSaveHoliday} >
          <p className="small text-black-50 fw-light">Define your days or period of inactivity to lock your agenda.</p>

          <div className="p-4 mb-3 rounded border bg-white">

            <div className="me-auto d-flex justify-content-between text-center small text-black-50 border-bottom pb-4 mb-4">
              <span className="w-25">Start Date</span>
              <span className="w-25">End Date</span>
              <span className="w-25">Start Time</span>
              <span className="w-25">End Time</span>
              {editStatus ? (
                <span className="" style={{ width: "25px" }}></span>
              ) : null}
            </div>

            {currentInactivityDays ? (
              currentInactivityDays.map((holiday, index) => (
                <div key={index} className="me-auto d-flex justify-content-between text-center small text-black-50 pb-3 align-items-center">
                  <span className="w-25">{holiday.starting_date}</span>
                  <span className="w-25">{holiday.ending_date}</span>
                  <span className="w-25">{holiday.starting_hour}</span>
                  <span className="w-25">{holiday.ending_hour}</span>
                  {editStatus ? (
                    <span className="px-2 py-1 bg-danger rounded text-white" onClick={() => handleDelete(holiday)}>x</span>
                  ) : null}
                </div>
              ))) : null}
          </div>

          <div className="d-flex">
            <div className="ms-auto">
              {editStatus ? (
                <>
                  <input type='submit' value='Save' className="btn btn-small text-white" style={{ backgroundColor: "#14C4B9" }}></input>
                </>
              ) : (
                <button className="btn btn-small bg-white border" onClick={handleEditHoliday}>Edit</button>
              )}
            </div>
          </div>

        </form>
      </div>


      {/* ADD HOLIDAY FORM */}
      {showAddHoliday ? (
        <div className="bg-white position-fixed top-0 end-0 bottom-0 min-vh-100 py-5 px-4 w-25 shadow" style={{ zIndex: "2" }} >

          <div className="d-flex justify-content-between mb-5">
            <h5 className="me-4 text-black-50 text-decoration-underline fw-bold" >ADD NEW HOLIDAY</h5>
            <button type="button" className="btn-close" onClick={handleAddHoliday}></button>
          </div>

          <div className="rounded bg-dark bg-opacity-10 p-3 text-black-50 fw-light mb-4">

            <div className="">
              <input
                type="checkbox"
                className="form-check-input me-2"
                id="holidayType"
                value={holidayType}
                checked={holidayType}
                onChange={handleHolidayType}
              />
              <label className="form-check-label me-5" htmlFor='holidayType'>
                <span>Single Day Holiday</span>
              </label>
            </div>

          </div>

          <div className="rounded bg-dark bg-opacity-10 p-3 text-black-50 fw-light">

            {!holidayType ? (
              <form onSubmit={handleHolidaySubmit}>
                {/* LONG PERIOD HOLIDAY  */}
                <h5 className="mb-4 text-decoration-underline">Holiday Period</h5>
                <span className="small mb-2 text-black-50">Start Date</span>
                <input
                  type='date'
                  className="d-block mb-3 p-2 w-100 rounded border-0"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} // Aggiorna la data di inizio
                />
                <span className="small mb-2 text-black-50">End Date</span>
                <input
                  type='date'
                  className="d-block mb-4 p-2 w-100 rounded border-0"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} // Aggiorna la data di fine
                />
                <input
                  type='submit'
                  value="Add Holiday"
                  className="btn btn-sm border-0 text-white"
                  style={{ backgroundColor: "#14C4B9" }}
                />
              </form>
            ) : (
              <form onSubmit={handleHolidaySubmit}>
                {/* SINGLE DAY HOLIDAY */}
                <h5 className="mb-4 text-decoration-underline">Single day break</h5>
                <span className="small mb-2 text-black-50">Date</span>
                <input
                  type='date'
                  className="d-block mb-3 p-2 w-100 rounded border-0"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} // Aggiorna la data
                />
                <span className="small mb-2 text-black-50">Start Hours</span>
                <input
                  type='time'
                  className="d-block mb-3 p-2 w-100 rounded border-0"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)} // Aggiorna l'orario di inizio
                />
                <span className="small mb-2 text-black-50">End Hours</span>
                <input
                  type='time'
                  className="d-block mb-4 p-2 w-100 rounded border-0"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)} // Aggiorna l'orario di fine
                />
                <input
                  type='submit'
                  value="Add Holiday"
                  className="btn btn-sm border-0 text-white"
                  style={{ backgroundColor: "#14C4B9" }}
                />
              </form>
            )}

          </div>

        </div>
      ) : (null)}
    </>
  )
}
