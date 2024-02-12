import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";


export default function Services() {
  const { store, actions } = useContext(Context)
  console.log(store.servicesByPro)

  const [editStatus, setEditStatus] = useState(false)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    setEditStatus(!editStatus)
  }

  console.log(store.proServicesByPro)

  return (
    <div className="" style={{ minHeight: "80vh" }}>
      <div id='account-data' className="align-items-center bg-light py-5 container">

        <form onSubmit={handleEditSubmit} className="m-auto" style={{ width: "100%", maxWidth: "750px" }}>

          <div className="text-black-50 mx-auto mb-2" >
            <h4 className=" text-decoration-underline">MY SERVICES</h4>
            <hr />
            <div className="p-4 rounded bg-white border text-black-50">

              {/* header  */}
              <div className="me-auto d-flex fw-bold small text-black-50 border-bottom py-3 mb-4" >
                <span className="" style={{ width: "35%" }}>Specialization</span>
                <span className="" style={{ width: "50%" }}>Service</span>
                {editStatus ? (
                  <span className="ms-auto" style={{ width: "25px" }}></span>
                ) : null}
              </div>

              {/* services  */}
              {store.servicesByPro != '' ? (
                store.servicesByPro.map(service =>
                  <div key={service.id} className="me-auto d-flex small text-black-50 mb-3" >
                    <span className="" style={{ width: "35%" }}>{service.specialization}</span>
                    <span className="" style={{ width: "50%" }}>{service.service_name}</span>
                    {editStatus ? (
                      <span className="ms-auto btn-danger btn-sm m-0" style={{ width: "25px" }}>X</span>
                    ) : null}

                  </div>
                )
              ) : null}
            </div>
          </div>

          {/* edit button  */}
          {/* <div className="text-black-50 mx-auto d-flex">
            <div className="ms-auto">
              {editStatus ? (
                <>
                  <input type='submit' value='Save' className="btn btn-small text-white" style={{ backgroundColor: "#14C4B9" }}></input>
                </>
              ) : (
                <button className="btn btn-small bg-white border" onClick={() => setEditStatus(!editStatus)}>Edit</button>
              )}
            </div>
          </div> */}

        </form>



      </div>
    </div>
  )
}
