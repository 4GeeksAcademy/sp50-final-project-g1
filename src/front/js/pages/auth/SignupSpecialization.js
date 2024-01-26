import React, {useEffect, useState} from "react";
import { useNavigate, Link} from 'react-router-dom'


export default function SignupSpecialization() {

  const navigate = useNavigate()

  const [services, setServices] = useState([]);
  const [specializations, setSpecializations] = useState('');
  const [prices, setPrices] = useState({});
  const [durations, setDurations] = useState({});


  const handleCheckboxChange = (service) => {
    if (services.includes(service)) {
      setServices(services.filter(item => item !== service));

      // Remove prices
      const { [service]: removedPrice, ...restPrices } = prices;
      setPrices(restPrices);

      // Remove durations
      const { [service]: removedDuration, ...restDurations } = durations;
      setDurations(restDurations);
    } else {
      setServices([...services, service]);
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


  const handleNext = (e) => {
    e.preventDefault()

    for (const el of services) {
        console.log({
          specialization: specializations,
          service:el,
          price: prices[el],
          duration: durations[el]
        })
    }
    
    navigate("/signup/hours")
  }


  const specializationList = [
    {name: 'Allergy and Immunology'},
    {name: 'Cardiology'},
    {name: 'Dermatology'},
    {name: 'Emergency Medicine'},
    {name: 'END (Ear, Nose, Throat)'},
    {name: 'Endocrinology'},
    {name: 'Gynecology'},
    {name: 'Neurology'},
    {name: 'Nephrology'},
    {name: 'Nurse'},
    {name: 'Oncology'},
    {name: 'Ophthalmology'},
    {name: 'Orthopedics'},
    {name: 'Osteopaty'},
    {name: 'Pediatrics'},
    {name: 'Physiotherapy'},
    {name: 'Psychology'},
    {name: 'Pulmonology'},
    {name: 'Radiology'},
    {name: 'Rheumatology'},
    {name: 'Urology'},
    {name: 'Other'}
];


  const serviceList = [
    {name: 'General Visit', id: 678},
    {name: 'Assessment Visit', id: 578},
    {name: 'Phone Consultation', id: 478},
    {name: 'Rehabilitation Session', id: 378},
    {name: 'Therapeutic Exercise Program', id: 278},
    {name: 'Joint Mobilization', id: 178},
    {name: 'Soft Tissue Massage', id: 778},
    {name: 'Other', id: 999},
  ];
    

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
                    <option key={specialization.name} value={specialization.name}>
                      {specialization.name}
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
        
                    {serviceList.map((service) => (
                      <div key={service.id} className="form-check d-flex align-items-center mb-3 border-bottom border-white p-3">
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          id={`serviceCheckbox${service.id}`}
                          value={service.id}
                          checked={services.includes(service.id)}
                          onChange={() => handleCheckboxChange(service.id)}
                        />
                        <label className="form-check-label" htmlFor={`serviceCheckbox${service.id}`}>
                          {service.name}
                        </label>
                        <input
                          type="number"
                          className="form-control w-25 ms-auto me-3"
                          placeholder="Price"
                          value={prices[service.id] || ''}
                          onChange={(e) => handlePriceChange(service.id, e.target.value)}
                          disabled={!services.includes(service.id)} // Disabilita se il trattamento non è selezionato
                        />
                        <input
                          type="number"
                          className="form-control w-25"
                          placeholder="Duration"
                          value={durations[service.id] || ''}
                          onChange={(e) => handleDurationChange(service.id, e.target.value)}
                          disabled={!services.includes(service.id)} // Disabilita se il trattamento non è selezionato
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