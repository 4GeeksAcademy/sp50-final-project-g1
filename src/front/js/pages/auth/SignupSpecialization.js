import React, {useContext, useEffect, useState} from "react";
import { useNavigate, Link} from 'react-router-dom'
import { Context } from "../../store/appContext";


export default function SignupSpecialization() {

  const {store, actions} = useContext(Context)

  const navigate = useNavigate()

  const [services, setServices] = useState([]);
  const [specializations, setSpecializations] = useState('');
  const [prices, setPrices] = useState({});
  const [durations, setDurations] = useState({});
  const [specializationList, setSpecializationList] = useState([])
  const [currentServices, setCurrentServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])


  useEffect(() => {
    const fetchData = async() => {
      await actions.getServices()
      let uniqueSpecializations = new Set()
      store.services.forEach(service => {
        uniqueSpecializations.add(service.specialization)
      })
      setSpecializationList(Array.from(uniqueSpecializations))
    }
    fetchData()
    
  }, [])  

  useEffect(() => {
    let filteredServices = []
    store.services.forEach(service => {
      if(service.specialization === specializations) {
        filteredServices.push(service)
      }
    })
    setCurrentServices(filteredServices)
  },[specializations])

  useEffect(() => {
    if (store.isLoggedIn) {
      const fetchData = async () => {
        const response = await actions.authentication(store.token)
        const proId = await response.logged_in_as
        await actions.getPro(proId)
      }
      fetchData()
    }

  }, [store.isLoggedIn])


  const handleCheckboxChange = (service) => {
    if (selectedServices.includes(service)) {
    setSelectedServices(selectedServices.filter(item => item !== service));

      // Remove prices
      const { [service]: removedPrice, ...restPrices } = prices;
      setPrices(restPrices);

      // Remove durations
      const { [service]: removedDuration, ...restDurations } = durations;
      setDurations(restDurations);
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };
  

  const handlePriceChange = (service, price) => {
    // Aggiorna il prezzo associato al trattamento
    setPrices({ ...prices, [service]: price });
  };

  const handleDurationChange = (service, duration) => {
    // Aggiorna il prezzo associato al trattamento
    setDurations({ ...durations, [service]: duration });
  };


  const handleNext = async (e) => {
    e.preventDefault()

    let finalServices = []

    for (const el of selectedServices) {
        finalServices.push({
          service_id:el,
          pro_id: store.currentPro.id,
          price: parseInt(prices[el]),
          duration: parseInt(durations[el])
        })
    }

    console.log(finalServices)

    for (const item of finalServices) {
        await actions.newProService(item)
    }

    store.proServicesByPro = finalServices
    console.log(store.proServicesByPro)

    store.currentPro.config_status = 3
    await actions.updatePro(store.currentPro)
    
    navigate("/signup/hours")
  }


  return (
    <> 
    <section id="signupPersonalData" className="bg-light d-flex align-items-center" style={{ minHeight: '80vh'}}>
      <div className="container py-5">


        <div className="col-md-7 col-lg-8 m-auto bg-white p-5" style={{border:"solid #D1D1D1 6px", borderRadius:"18px"}}>
          <h5>SpecializationList and services</h5>
          <hr />
          <form className="needs-validation" noValidate="" onSubmit={(e) => handleNext(e)}>

            <div className="p-4 mb-5 rounded" style={{ backgroundColor: "#E0F3F3" }}>
              <div className="mb-3">
                <label htmlFor="specialization" className="form-label">
                  Specialization
                </label>
                <select
                  className="form-select"
                  id="specialization"
                  required=""
                  value={specializations}
                  onChange={(e) => setSpecializations(e.target.value)}
                >
                  <option value="" disabled>
                    Select your specialization
                  </option>
                  {specializationList.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select a specialization.</div>
              </div>
            </div>


            {specializations ? (
              <div id="services">
                <h6 className="text-black-50">Select Sevices</h6>
                <p className="small text-black-50 fw-light">Select up to 5 services for this specialization. <span className="fw-bold" style={{color:"#14C4B9"}}>Upgrade to premium</span> for unlimited services</p>
              
                <div className="p-4 mb-5 rounded" style={{ backgroundColor: "#E0F3F3" }}>
                  <div className="mb-3">
        
                    {currentServices.map((service) => (
                      <div key={service.id} className="form-check d-flex align-items-center mb-3 border-bottom border-white p-3">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          id={`serviceCheckbox${service.id}`}
                          value={service.id}
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleCheckboxChange(service.id)}
                        />
                        <label className="form-check-label" htmlFor={`serviceCheckbox${service.id}`}>
                          {service.service_name}
                        </label>
                        <input
                          type="number"
                          className="form-control w-25 ms-auto me-3"
                          placeholder="Price"
                          value={prices[service.id] || ''}
                          onChange={(e) => handlePriceChange(service.id, e.target.value)}
                          disabled={!selectedServices.includes(service.id)} // Disabilita se il trattamento non è selezionato
                        />
                        <input
                          type="number"
                          className="form-control w-25"
                          placeholder="Duration"
                          value={durations[service.id] || ''}
                          onChange={(e) => handleDurationChange(service.id, e.target.value)}
                          disabled={!selectedServices.includes(service.id)} // Disabilita se il trattamento non è selezionato
                        />
                      </div>
                    ))}

                    <div className="invalid-feedback">
                      Please select at least one service.
                    </div>

                  </div>
                </div>
              
              </div>
            ) : null}

            <div className="d-flex justify-content-between align-items-center border-top p-3">
              <Link to="/signup/location" className="text-decoration-none"><p className="text-black">{"<"} Back</p></Link>
              <input className="btn btn-primary btn-lg" type="submit" value="Next" style={{backgroundColor:"#14C4B9", border:"none" }}></input>
            </div>
            
          </form>
        </div>

      </div>
    </section>
    
    </>
  )
}