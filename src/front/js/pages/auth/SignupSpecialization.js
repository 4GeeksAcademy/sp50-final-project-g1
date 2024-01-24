import React, {useEffect, useState} from "react";
import { useNavigate, Link} from 'react-router-dom'


export default function SignupSpecialization() {

  const navigate = useNavigate()

  // const [service, setService] = useState('')
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [prices, setPrices] = useState({}); // Uno stato per tenere traccia dei prezzi

  const handleCheckboxChange = (treatment) => {
    if (selectedTreatments.includes(treatment)) {
      setSelectedTreatments(selectedTreatments.filter(item => item !== treatment));
      // Rimuovi anche il prezzo associato quando deselezioni un trattamento
      const { [treatment]: removed, ...rest } = prices;
      setPrices(rest);
    } else {
      setSelectedTreatments([...selectedTreatments, treatment]);
    }
  };

  const handlePriceChange = (treatment, price) => {
    // Aggiorna il prezzo associato al trattamento
    setPrices({ ...prices, [treatment]: price });
  };


  const handleNext = (e) => {
    e.preventDefault()
    console.log('clicking next')
    console.log('states:', selectedTreatments, specialization, prices )
    // navigate("/signup/hours")
  }



  const specializations = [
    'Physiotherapy',
    'Osteopathy',
    'Psychology',
    'Cardiology',
    'Dermatology',
    'Gynecology',
    'Orthopedics',
    'Radiology',
  ];

  const treatments = [
    'General Visit',
    'Assessment Visit',
    'Phone Consultation',
    'Rehabilitation Session',
    'Therapeutic Exercise Program',
    'Joint Mobilization',
    'Soft Tissue Massage',
  ];
    

  return (
    <> 
    <section id="signupPersonalData" className="bg-light d-flex align-items-center" style={{ minHeight: '80vh'}}>
      <div className="container py-5">


        <div className="col-md-7 col-lg-8 m-auto bg-white p-5" style={{border:"solid #D1D1D1 6px", borderRadius:"18px"}}>
          <h5>Specializations and services</h5>
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
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="" disabled>
                    Select your specialization
                  </option>
                  {specializations.map((specializationOption, index) => (
                    <option key={index} value={specializationOption}>
                      {specializationOption}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select a specialization.</div>
              </div>
            </div>


            {specialization ? (
              <div id="services">
                <h6 className="text-black-50">Select Sevices</h6>
                <p className="small text-black-50 fw-light">Select up to 5 services for this specialization. <span className="fw-bold" style={{color:"#14C4B9"}}>Upgrade to premium</span> for unlimited services</p>
              
                <div className="p-4 mb-5 rounded" style={{ backgroundColor: "#E0F3F3" }}>
                  <div className="mb-3">
                    {treatments.map((treatment, index) => (
                      <div key={index} className="form-check d-flex align-items-center mb-3 border-bottom border-white p-3">
                        <input type="checkbox" className="form-check-input me-2" id={`treatmentCheckbox${index}`} value={treatment} checked={selectedTreatments.includes(treatment)} onChange={() => handleCheckboxChange(treatment)} />
                        <label className="form-check-label" htmlFor={`treatmentCheckbox${index}`}>{treatment}</label>
                        <input type="number" className="form-control w-25 ms-auto" placeholder="Price" value={prices[treatment] || ''} onChange={(e) => handlePriceChange(treatment, e.target.value)} />
                      </div>
                    ))}
                    <div className="invalid-feedback">
                      Please select at least one treatment.
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