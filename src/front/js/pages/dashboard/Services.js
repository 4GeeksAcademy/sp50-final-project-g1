import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";

export default function Services() {
  const { store, actions } = useContext(Context)

  const [editStatus, setEditStatus] = useState(false)
  const [serviceData, setServiceData] = useState([])
  const [showAddService, setShowAddService] = useState(false)
  const [notSelectedServices, setNotSelectedServices] = useState([])
  const [fetch, setFetch] = useState(false)
  const [prices, setPrices] = useState({})
  const [durations, setDurations] = useState({})
  const [selectedServices, setSelectedServices] = useState([])


  useEffect(()=>{
    const fetchProServices = async() => {
      try {
      
        if (!Object.keys(store.currentPro).length) {
          const response = await actions.authentication(store.token)
          const proId = response.logged_in_as
          await actions.getPro(proId)
          if (!response) {
          console.error('Error: Respuesta de autenticación no válida')
          return
          }
        }
        
        await actions.getProServicesByPro(store.currentPro.id)
        
      }
      
      catch (error) {
      console.error('Error al obtener datos del profesional:', error)
      }
    }
    if(!Object.keys(store.proServicesByPro).length) {
      fetchProServices()
    }
  }, [store.isLoggedIn, store.token])

  useEffect(() => {
    setServiceData(store.proServicesByPro.map(service => ({
      ...service,
      newPrice: service.price,
      newDuration: service.duration
    })));
  }, [store.proServicesByPro]);

  const handleEditSubmit = async(e) => {
    e.preventDefault();
    const dataForBackend = servicesObject(serviceData);
    dataForBackend.map(async(proService) => {
      await actions.updateProService(proService)
    })
    store.bookingsByPro = []
    setEditStatus(!editStatus);
  }

  const servicesObject = (services) => {
    const updatedServices = services.map(service => ({
      id: service.id,
      pro_id: store.currentPro.id,
      specialization: service.specialization,
      service_name: service.service_name,
      activated: service.activated,
      duration: service.newDuration,
      price: service.newPrice
    }));

    return updatedServices;
  }

  const handleChange = (index, field, value) => {
    const updatedServiceData = [...serviceData];
    updatedServiceData[index][field] = value;
    console.log(updatedServiceData)
    setServiceData(updatedServiceData);
  }

  const handleAddService = async(e) => {
    e.preventDefault()
    if(!store.services.length) {
      await actions.getServices()
    }
    let moreServices = []
    store.services.map((service) => {
      if (service.specialization === store.proServicesByPro[0].specialization){
        moreServices.push(service)
      }
    })
    console.log(moreServices)
    const filteredServices = moreServices.filter(service => {
      return !store.proServicesByPro.some(proService => proService.service_name === service.service_name)
    })
    console.log(filteredServices)
    setNotSelectedServices(filteredServices)
    setShowAddService(!showAddService)
  }

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

  const handleSaveService = async (e) => {
    e.preventDefault()

    let finalServices = []

    for (const el of selectedServices) {
        finalServices.push({
          service_id:el,
          pro_id: store.currentPro.id,
          price: parseInt(prices[el]),
          duration: parseInt(durations[el]),
          activated: true
        })
    }
    setShowAddService(!showAddService)
    console.log(finalServices)

    for (const item of finalServices) {
        await actions.newProService(item)
    }

    await actions.getProServicesByPro(store.currentPro.id)
    setSelectedServices([])
  }


  const editStyle = {
    width: "20%",
    border: '1px solid #989898',
  }
  const fixedStyle = {
    width: "20%",
    border: 'none',
  }

  return (
    <div className="" style={{ minHeight: "90vh" }}>
      <div id='account-data' className="align-items-center bg-light py-5 container">
        <form onSubmit={handleEditSubmit} className="m-auto" style={{ width: "100%", maxWidth: "750px" }}>
          <div className="text-black-50 mx-auto mb-2" >
            <div className="d-flex">
              <h4 className="text-decoration-underline">MY SERVICES</h4>
              <button className="ms-auto btn-sm text-white border-0 general-button" onClick={showAddService ? handleSaveService : handleAddService}>{showAddService ? `Save` : `Add New`}</button>
            </div>
            <hr />

            {showAddService ? notSelectedServices.map((service) => (
                      <div key={service.id} className="form-check d-flex align-items-center mb-3 border-bottom border-white py-2">
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
                      
                    )) : (null) }

            <div className="p-4 rounded bg-white border text-black-50">
              <div className="me-auto d-flex fw-bold small text-black-50 border-bottom py-3 mb-4" >
                <span className="me-3 p-1" style={{ width: "20%" }}>Specialization</span>
                <span className="me-3 p-1" style={{ width: "20%" }}>Service</span>
                <span className="me-3 p-1" style={{ width: "20%" }}>Duration</span>
                <span className="me-3 p-1" style={{ width: "20%" }}>Price</span>
                <span className="me-3 p-1" style={{ width: "20%" }}>Active</span>
                {editStatus ? (
                  <span className="ms-auto" style={{ width: "25px" }}></span>
                ) : null}
              </div>

              {serviceData.map((service, index) => (
                <div key={service.id} className="me-auto d-flex small text-black-50 mb-3" >
                  
                  <input className="me-3 p-1 rounded fw-bold" style={{ width: "20%", border: 'none', color: "#14C4B9" }} disabled value={service.specialization} />
                  <input className="me-3 p-1 rounded fw-bold" style={{ width: "20%", border: 'none', color: "#14C4B9" }} disabled value={service.service_name} />
                  <input
                    className="me-3 p-1 rounded"
                    style={editStatus ? editStyle : fixedStyle}
                    disabled={!editStatus}
                    value={service.newDuration}
                    onChange={(e) => handleChange(index, 'newDuration', e.target.value)}
                  />
                  <input
                    className="me-3 p-1 rounded"
                    style={editStatus ? editStyle : fixedStyle}
                    disabled={!editStatus}
                    value={service.newPrice}
                    onChange={(e) => handleChange(index, 'newPrice', e.target.value)}
                  />
                  <div style={fixedStyle}>
                    <input type="checkbox" checked={service.activated} disabled={!editStatus} onChange={(e) => handleChange(index, 'activated', e.target.checked)}></input>
                  </div>
                </div>
              ))}
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
