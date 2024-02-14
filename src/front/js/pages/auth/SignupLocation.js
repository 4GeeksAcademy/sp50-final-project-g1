import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { Context } from "../../store/appContext";


export default function SignupLocation() {

  const navigate = useNavigate()

  const { store, actions } = useContext(Context)

  const [studioName, setStudioName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState("")
  const [timeZone, setTimeZone] = useState("")
  /* const [duration, setDuration] = useState("") */


  const handleNext = async (e) => {

    e.preventDefault()

    let location = {
      "name": studioName,
      country,
      city,
      address,
      "time_zone": timeZone,
      "pro_id": store.currentPro.id,
    }

    store.currentPro.config_status = 2

    await actions.newLocation(location)
    await actions.updatePro(store.currentPro)

    await actions.getLocationsByPro(store.currentPro.id)
    console.log(store.currentLocations)

    console.log('clicking next')
    navigate("/signup/specialization")
  }


  useEffect(() => {
    if (store.isLoggedIn) {
      const fetchData = async () => {
        const response = await actions.authentication(store.token)
        const proId = await response.logged_in_as
        await actions.getPro(proId)
        console.log(store.currentPro)
      }
      fetchData()
    }

  }, [store.isLoggedIn])



  return (
    <>
      {!store.isLoggedIn ? navigate("/login") :
        <section id="signupPersonalData" className="bg-light d-flex align-items-center" style={{ minHeight: '80vh' }}>
          <div className="container py-5">


            <div className="col-md-7 col-lg-8 m-auto bg-white p-5" style={{ border: "solid #D1D1D1 6px", borderRadius: "18px" }}>
              <h5>Studio Details</h5>
              <hr />
              <form className="needs-validation" noValidate="" onSubmit={(e) => handleNext(e)}>

                <h6 className="text-black-50">Location</h6>
                <div className="p-4 mb-5 rounded" style={{ backgroundColor: "#E0F3F3" }}>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label" >Studio Name</label>
                    <input type="text" className="form-control" id="studioName" placeholder="Studio in Madrid" required="" value={studioName} onChange={(e) => setStudioName(e.target.value)} />
                    <div className="invalid-feedback">
                      Valid name is required.
                    </div>

                  </div>

                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select className="form-control" id="country" required="" value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option value="" disabled selected hidden>Select a country</option>
                      <option value="Germany">Germany</option>
                      <option value="Spain">Spain</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Austria">Austria</option>
                      <option value="Greece">Greece</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Norway">Norway</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Finland">Finland</option>
                      <option value="Ireland">Ireland</option>
                    </select>
                    <div className="invalid-feedback">
                        A valid country is required.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" placeholder="Madrid" required="" value={city} onChange={(e) => setCity(e.target.value)} />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" placeholder="Calle Caballero 18" required="" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Time Zone</label>
                    <select className="form-control" id="timezone" required="" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                      <option value="" disabled selected hidden>Select a timezone</option>
                      <option value="Atlantic/Canary">Europe/Canary Islands</option>
                      <option value="Europe/Berlin">Europe/Berlin</option>
                      <option value="Europe/Madrid">Europe/Madrid</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Europe/Rome">Europe/Rome</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Europe/Lisbon">Europe/Lisbon</option>
                      <option value="Europe/Amsterdam">Europe/Amsterdam</option>
                      <option value="Europe/Brussels">Europe/Brussels</option>
                      <option value="Europe/Zurich">Europe/Zurich</option>
                      <option value="Europe/Vienna">Europe/Vienna</option>
                      <option value="Europe/Athens">Europe/Athens</option>
                      <option value="Europe/Stockholm">Europe/Stockholm</option>
                      <option value="Europe/Oslo">Europe/Oslo</option>
                      <option value="Europe/Copenhagen">Europe/Copenhagen</option>
                      <option value="Europe/Helsinki">Europe/Helsinki</option>
                      <option value="Europe/Dublin">Europe/Dublin</option>
                  </select>
                  <div className="invalid-feedback">
                      A valid timezone is required.
                  </div>
                  </div>

                </div>

                {/* 
              <h6 className="text-black-50">Visit Duration</h6>
              <p className="small text-black-50 fw-light">Define how long it takes a visit slot in your studio</p>
              <div className="p-4 mb-5 rounded" style={{backgroundColor:"#E0F3F3"}}>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Minutes per visit</label>
                  <input type="text" className="form-control" id="address" placeholder="Calle Caballero 18" required="" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                  <div className="invalid-feedback">
                    Valid last name is required.
                  </div>
                </div>
              </div> */}


                <div className="d-flex justify-content-between align-items-center border-top p-3">
                  <Link to="/" className="text-decoration-none"><p className="text-black btn btn-secondary btn-sm" style={{ backgroundColor: "#efefef", border: "none" }}>Continue Later</p></Link>
                  <input type="submit" value="Next" className="btn btn-primary btn-lg" style={{ backgroundColor: "#14C4B9", border: "none" }}></input>
                </div>

              </form>

            </div>

          </div>
        </section>
      }

    </>
  )
}



