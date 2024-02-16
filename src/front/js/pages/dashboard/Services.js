import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";

export default function Services() {
  const { store, actions } = useContext(Context)

  const [editStatus, setEditStatus] = useState(false)
  const [serviceData, setServiceData] = useState([])
  const [fetch, setFetch] = useState(false)


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
            <h4 className=" text-decoration-underline">MY SERVICES</h4>
            <hr />
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
