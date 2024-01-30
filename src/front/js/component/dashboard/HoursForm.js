
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

export default function HoursForm() {

  const navigate = useNavigate()

  const { store, actions } = useContext(Context)

  const [days, setDays] = useState([]);
  const [morningStart, setMorningStart] = useState({ 1: '10:30', 2: '10:30' });
  const [morningEnd, setMorningEnd] = useState({ 1: '10:30', 2: '10:30' });
  const [afternoonStart, setAfternoonStart] = useState({ 1: '10:30', 2: '10:30' });
  const [afternoonEnd, setAfternoonEnd] = useState({ 1: '10:30', 2: '10:30' });
  const [editWorkingStatus, setEditWorkingStatus] = useState(false);

  const handleEditWorking = () => {
    setEditWorkingStatus(!editWorkingStatus);
  }

  const handleSaveWorking = () => {
    setEditWorkingStatus(!editWorkingStatus);

    let finalHours = []

    for (const el of days) {
      finalHours.push({
        working_day: el,
        starting_hour_morning: morningStart[el],
        ending_hour_morning: morningEnd[el],
        starting_hour_after: afternoonStart[el],
        ending_hour_after: afternoonEnd[el],
        pro_id: store.currentPro.id,
        location_id: store.currentLocations[0].id
      })
    }
    console.log('hours', finalHours)

  }

  const handleCheckboxChange = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(item => item !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleMorningStartChange = (day, time) => {
    setMorningStart({ ...morningStart, [day]: time });
  };

  const handleMorningEndChange = (day, duration) => {
    setMorningEnd({ ...morningEnd, [day]: duration });
  };

  const handleAfternoonStartChange = (day, time) => {
    setAfternoonStart({ ...afternoonStart, [day]: time });
  };

  const handleAfternoonEndChange = (day, duration) => {
    setAfternoonEnd({ ...afternoonEnd, [day]: duration });
  };

  const dayList = [
    { name: 'Mon', id: 1 },
    { name: 'Tue', id: 2 },
    { name: 'Wed', id: 3 },
    { name: 'Thu', id: 4 },
    { name: 'Fri', id: 5 },
    { name: 'Sat', id: 6 },
    { name: 'Sun', id: 7 }
  ];

  // Effect on page
  useEffect(() => {
    if (!store.isLoggedIn) {
      // navigate('/login');
    } else {
      const fetchData = async () => {
        const response = await actions.authentication(store.token);
        const proId = response.logged_in_as;
        await actions.getPro(proId);
        await actions.getHoursByPro(proId);
        await actions.getLocationsByPro(proId);
        setDays(store.hoursByPro.map(shift => shift.working_day));
      };
      fetchData();
    }
  }, [store.isLoggedIn, store.token]);

  return (

    <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
      <h4 className=" text-decoration-underline">DAYS OF WEEK</h4>
      <hr />
      <div className="needs-validation" noValidate="">
        <div id="hours">
          <p className="small text-black-50 fw-light">Select your working days. Define your hours shift within every day of work</p>
          <div className="p-4 mb-3 rounded border bg-white">
            <div className="mb-3">
              <div className="d-flex text-center small text-black-50">
                <span className="col-2"></span>
                <span className="col-5 ">Morning hours</span>
                <span className="col-5 ">Afternoon hours</span>
              </div>
              {dayList.map((day) => (
                <div key={day.id} className="form-check d-flex align-items-center mb-3 border-bottom border-white p-3">
                  <div className="col-2">
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      id={`dayCheckbox${day.id}`}
                      value={day.id}
                      checked={days.includes(day.id)}
                      onChange={() => handleCheckboxChange(day.id)}
                      disabled={!editWorkingStatus}
                    />
                    <label className="form-check-label me-5" htmlFor={`dayCheckbox${day.id}`}>
                      {day.name}
                    </label>
                  </div>
                  <div id="first-shift" className="border-morningStart border-white d-flex px-3 col-5">
                    <input
                      type="time"
                      className="form-control me-3 p-2 border"
                      placeholder="Start"
                      value={morningStart[day.id] || ''}
                      onChange={(e) => handleMorningStartChange(day.id, e.target.value)}
                      disabled={!editWorkingStatus}
                    />
                    <input
                      type="time"
                      className="form-control"
                      placeholder="End"
                      value={morningEnd[day.id] || ''}
                      onChange={(e) => handleMorningEndChange(day.id, e.target.value)}
                      disabled={!editWorkingStatus}
                    />
                  </div>
                  <div di="second-shift" className="border-morningStart border-white d-flex px-3 col-5">
                    <input
                      type="time"
                      className="form-control me-3 p-2 border"
                      placeholder="Start"
                      value={afternoonStart[day.id] || ''}
                      onChange={(e) => handleAfternoonStartChange(day.id, e.target.value)}
                      disabled={!editWorkingStatus}
                    />
                    <input
                      type="time"
                      className="form-control"
                      placeholder="End"
                      value={afternoonEnd[day.id] || ''}
                      onChange={(e) => handleAfternoonEndChange(day.id, e.target.value)}
                      disabled={!editWorkingStatus}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex">
            <div className="ms-auto">
              {editWorkingStatus ? (
                <>
                  <button className="btn btn-small text-white" style={{ backgroundColor: "#14C4B9" }} onClick={handleSaveWorking}>Save</button>
                </>
              ) : (
                <button className="btn btn-small bg-white border" onClick={handleEditWorking}>Edit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
