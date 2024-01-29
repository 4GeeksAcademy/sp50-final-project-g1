import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Context } from "../../store/appContext";


export default function SignupHours() {

  const navigate = useNavigate()
  const { store, actions } = useContext(Context)

  const [days, setDays] = useState([]);
  const [morningStart, setMorningStart] = useState({});
  const [morningEnd, setMorningEnd] = useState({});
  const [afternoonStart, setAfternoonStart] = useState({});
  const [afternoonEnd, setAfternoonEnd] = useState({});


  useEffect(() => {
    if (store.isLoggedIn) {
      const fetchData = async () => {
        const response = await actions.authentication(store.token)
        const proId = await response.logged_in_as
        await actions.getPro(proId)
        console.log(store.currentPro)
        await actions.getLocationsByPro(proId)
        console.log(store.currentLocations)
      }
      fetchData()
    }

  }, [store.isLoggedIn])


  const handleCheckboxChange = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(item => item !== day));

      // Remove morningStart
      const { [day]: removedMorningStart, ...restMorningStart } = morningStart;
      setMorningStart(restMorningStart);

      // Remove morningEnd
      const { [day]: removedMorningEnd, ...restMorningEnd } = morningEnd;
      setMorningEnd(restMorningEnd);

      // Remove afternoonStart
      const { [day]: removedAfternoonStart, ...restAfternoonStart } = afternoonStart;
      setAfternoonStart(restAfternoonStart);

      // Remove afternoonEnd
      const { [day]: removedAfternoonEnd, ...restAfternoonEnd } = afternoonEnd;
      setAfternoonEnd(restAfternoonEnd);
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


  const handleNext = async (e) => {
    e.preventDefault()

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
    console.log(finalHours)

    for (const item of finalHours) {
      await actions.newHours(item)
    }

    store.hoursByPro = finalHours
    console.log(store.hoursByPro)

    store.currentPro.config_status = 4
    await actions.updatePro(store.currentPro)

    navigate("/dashboard/calendar")
  }

  const dayList = [
    { name: 'Mon', id: 1 },
    { name: 'Tue', id: 2 },
    { name: 'Wed', id: 3 },
    { name: 'Thu', id: 4 },
    { name: 'Fri', id: 5 },
    { name: 'Sat', id: 6 },
    { name: 'Sun', id: 7 }
  ];


  return (
    <>
      <section id="signupPersonalData" className="bg-light d-flex align-items-center" style={{ minHeight: '80vh' }}>
        <div className="container py-5">


          <div className="col-md-7 col-lg-8 m-auto bg-white p-5" style={{ border: "solid #D1D1D1 6px", borderRadius: "18px" }}>
            <h5>Working Days and Hours</h5>
            <hr />
            <form className="needs-validation" noValidate="" onSubmit={(e) => handleNext(e)}>


              <div id="hours">
                <p className="small text-black-50 fw-light">Select your working days. Define your hours shift within every day of work</p>

                <div className="p-4 mb-5 rounded" style={{ backgroundColor: "#E0F3F3" }}>
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
                            disabled={!days.includes(day.id)}

                          />
                          <input
                            type="time"
                            className="form-control"
                            placeholder="End"
                            value={morningEnd[day.id] || ''}
                            onChange={(e) => handleMorningEndChange(day.id, e.target.value)}
                            disabled={!days.includes(day.id)}
                          />
                        </div>

                        <div di="second-shift" className="border-morningStart border-white d-flex px-3 col-5">
                          <input
                            type="time"
                            className="form-control me-3 p-2 border"
                            placeholder="Start"
                            value={afternoonStart[day.id] || ''}
                            onChange={(e) => handleAfternoonStartChange(day.id, e.target.value)}
                            disabled={!days.includes(day.id)}

                          />
                          <input
                            type="time"
                            className="form-control"
                            placeholder="End"
                            value={afternoonEnd[day.id] || ''}
                            onChange={(e) => handleAfternoonEndChange(day.id, e.target.value)}
                            disabled={!days.includes(day.id)}
                          />
                        </div>


                      </div>
                    ))}

                    <div className="invalid-feedback">
                      Please select at least one day.
                    </div>

                  </div>
                </div>

              </div>


              <div className="d-flex justify-content-between align-items-center border-top p-3">
                <Link to="/signup/specialization" className="text-decoration-none"><p className="text-black">{"<"} Back</p></Link>
                <input className="btn btn-primary btn-lg" type="submit" value="Submit" style={{ backgroundColor: "#14C4B9", border: "none" }}></input>
              </div>

            </form>
          </div>

        </div>
      </section>

    </>
  )
}