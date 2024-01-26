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
  /* const [duration, setDuration] = useState("") */
  const [pro, setPro] = useState(store.currentPro)


  const handleNext = async (e) => {

    e.preventDefault()

    let location = {
      "name": studioName,
      country,
      city,
      address,
      "pro_id": pro.id,
    }

    pro.config_status = 2

    await actions.newLocation(location)
    await actions.updatePro(pro)

    await actions.getLocationsByPro(pro.id)
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
        setPro(store.currentPro)
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
                    <input type="text" className="form-control" id="country" placeholder="Spain" required="" value={country} onChange={(e) => setCountry(e.target.value)} />
                    <div className="invalid-feedback">
                      Valid last name is required.
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
                  <Link to="/signup/personal-data" className="text-decoration-none"><p className="text-black">{"<"} Back</p></Link>
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



