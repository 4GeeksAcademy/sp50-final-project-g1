import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";



export default function Studio() {
  const { store, actions } = useContext(Context)

  const [editStatus, setEditStatus] = useState(false)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    setEditStatus(!editStatus)
  }

  console.log('location', store.currentLocations)

  return (
    <div className="" style={{ minHeight: "90vh" }}>
      <div id='account-data' className="align-items-center bg-light py-5 container">

        <form onSubmit={handleEditSubmit} className="m-auto" style={{ width: "100%", maxWidth: "750px" }}>

          <div className="text-black-50 mx-auto mb-2" >
            <h4 className=" text-decoration-underline">MY STUDIO</h4>
            <hr />
            <div className="p-3 rounded bg-white border text-black-50">

              {/* header  */}


              {/* services  */}
              {store.servicesByPro != '' ? (
                store.currentLocations.map((studio, index) =>
                  <div key={studio.id}>
                    <div className="me-auto d-flex fw-bold small text-black-50 p-2 mb-2" >
                      <span className="fs-5">{studio.name}</span>
                    </div>
                    <ul className="me-auto small text-black-50 mb-2" >
                      <li className="" >{studio.country}</li>
                      <li className="" >{studio.city}</li>
                      <li className="" >{studio.address}</li>
                      {editStatus ? (
                        <span className="ms-auto btn-danger btn-sm m-0" style={{ width: "25px" }}>X</span>
                      ) : null}
                    </ul>
                  </div>
                )
              ) : null}
            </div>
          </div>

        </form>



      </div>
    </div>
  )
}
