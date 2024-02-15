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
        const response = await actions.authentication(store.token);

        if (!response) {
          console.error('Error: Respuesta de autenticación no válida');
          return;
        }
        const proId = response.logged_in_as
        await actions.getPro(proId)
        await actions.getProServicesByPro(proId)
        setFetch(false)
      }
      
      catch (error) {
      console.error('Error al obtener datos del profesional:', error)
      }
    }
    fetchProServices()
  }, [store.isLoggedIn, store.token, fetch])

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
    setFetch(true)
    setEditStatus(!editStatus);
  }

  const servicesObject = (services) => {
    const updatedServices = services.map(service => ({
      id: service.id,
      proId: store.currentPro.id,
      specialization: service.specialization,
      service_name: service.service_name,
      duration: service.newDuration,
      price: service.newPrice
    }));

    return updatedServices;
  }

  const handleChange = (index, field, value) => {
    const updatedServiceData = [...serviceData];
    updatedServiceData[index][field] = value;
    setServiceData(updatedServiceData);
  }

  const editStyle = {
    width: "25%",
    border: '1px solid #989898',
  }
  const fixedStyle = {
    width: "25%",
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
                <span className="" style={{ width: "25%" }}>Specialization</span>
                <span className="" style={{ width: "25%" }}>Service</span>
                <span className="" style={{ width: "25%" }}>Duration</span>
                <span className="" style={{ width: "25%" }}>Price</span>
                {editStatus ? (
                  <span className="ms-auto" style={{ width: "25px" }}></span>
                ) : null}
              </div>

              {serviceData.map((service, index) => (
                <div key={service.id} className="me-auto d-flex small text-black-50 mb-3" >
                  <input className="me-3 p-1 rounded" style={{ width: "25%", border: 'none' }} disabled value={service.specialization} />
                  <input className="me-3 p-1 rounded" style={{ width: "25%", border: 'none' }} disabled value={service.service_name} />
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
                  {editStatus ? (
                    <span className="ms-auto btn-danger btn-sm m-0" style={{ width: "25px" }}>X</span>
                  ) : null}
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
