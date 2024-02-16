import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";



export default function Studio() {
  const { store, actions } = useContext(Context)

  const [editStatus, setEditStatus] = useState(false)
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [timeZone, setTimeZone] = useState("")
  const [studioName, setStudioName] = useState("")

  useEffect(()=>{
    const fetchProServices = async() => {
      try {
        const response = await actions.authentication(store.token);

        if (!response) {
          console.error('Error: Respuesta de autenticación no válida');
          return;
        }
        const proId = response.logged_in_as
        await actions.getPro(proId)
        await actions.getLocationsByPro(proId)
        setCity(store.currentLocations[0].city)
        setCountry(store.currentLocations[0].country)
        setAddress(store.currentLocations[0].address)
        setTimeZone(store.currentLocations[0].time_zone)
        setStudioName(store.currentLocations[0].name)
      }
      
      catch (error) {
      console.error('Error al obtener datos del profesional:', error)
      }
    }
    fetchProServices()
  }, [store.isLoggedIn, store.token])

  const handleEditSubmit = async(e) => {
    e.preventDefault()
    const location = store.currentLocations[0]
    location.city = city
    location.country = country
    location.adress = address
    location.time_zone = timeZone
    location.name = studioName
    console.log(location)
    await actions.updateLocation(location)
    console.log("location")
    setEditStatus(!editStatus)
  }

  return (
    <div className="" style={{ minHeight: "90vh" }}>
      <div id='account-data' className="align-items-center bg-light py-5 container">

        <form onSubmit={handleEditSubmit} className="m-auto" style={{ width: "100%", maxWidth: "750px" }}>

          <div className="text-black-50 mx-auto mb-2" >
            <h4 className=" text-decoration-underline">MY STUDIO</h4>
            <hr />
            <div className="p-3 rounded bg-white border text-black-50">

              {/* header  */}


              {/* location details  */}
              {store.currentLocations != '' ? (
                store.currentLocations.map((studio, index) =>
                  <div key={studio.id} className="p-3">
                    
                    <ul className="me-auto small text-black-50 mb-2" style={{listStyle: "none"}} >
                      {!editStatus ?
                        (<div className="d-flex justify-content-between"><div>
                            <li className="mb-2" ><b>Country: </b>{studio.country}</li>
                            <li className="mb-2" ><b>City: </b>{studio.city}</li>
                            <li className="mb-2" ><b>Address: </b>{studio.address}</li>
                            <li className="mb-2" ><b>Time zone: </b>{studio.time_zone}</li>
                          </div>
                          <div className="ms-auto me-4 fw-bold small text-black-50 p-2 mb-2" >
                            <h2><span className="fw-bold" style={{ color: "#14C4B9"}}>{studio.name}</span></h2>
                          </div>
                          
                        </div>) : 
                        (<>
                          <li className="mb-2" ><span className="fw-bold" style={{ color: "#14C4B9"}}>Studio name</span><input className="form-control" value={studioName} onChange={(e) => setStudioName(e.target.value)}/></li>
                          <li className="mb-2" ><span className="fw-bold" style={{ color: "#14C4B9"}}>Country</span>
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
                                              </select></li>
                          <li className="mb-2" ><span className="fw-bold" style={{ color: "#14C4B9"}}>City</span><input className="form-control" value={city} onChange={(e) => setCity(e.target.value)}/></li>
                          <li className="mb-2" ><span className="fw-bold" style={{ color: "#14C4B9"}}>Address</span><input className="form-control" value={address} onChange={(e) => setAddress(e.target.value)}/></li>
                          <li className="mb-2" ><span className="fw-bold" style={{ color: "#14C4B9"}}>Time zone</span>
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
                                                </select></li>
                        </>) }
                    </ul>
                  </div> 
                )
              ) : null}
            </div>
          </div>
          <div className="text-black-50 mx-auto d-flex">
            <div className="ms-auto">
              {editStatus ? (
                <>
                  <input type='submit' value='Save' className="btn btn-small text-white" style={{ backgroundColor: "#14C4B9" }}></input>
                </>
              ) : (
                <button className="btn btn-small bg-white border" onClick={() => setEditStatus(!editStatus)}>Edit</button>
              )}
            </div>
          </div>

        </form>



      </div>
    </div>
  )
}
