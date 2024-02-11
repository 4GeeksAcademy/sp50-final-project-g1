import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";



export default function PatientsList() {

  const { store, actions } = useContext(Context)
  const [patientsList, setPatientsList] = useState(store.patientsByPro)



  const handleSearchInput = (query) => {
    const newList = store.patientsByPro.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query)
    )
    setPatientsList(newList)
  }

  return (
    <div className="" style={{ minHeight: "80vh" }}>
      <div id='account-data' className="align-items-center bg-light py-5 container">
        <div className="text-black-50 mx-auto" style={{ width: "100%", maxWidth: "750px" }}>
          <h4 className=" text-decoration-underline mb-1 p-0">MY PATIENTS</h4>
          {/* <p className="small text-black-50 fw-light">The list of patient that made a visit with you.</p> */}
          <hr />
        </div>

        <div className="text-black-50 mx-auto mb-5" style={{ width: "100%", maxWidth: "750px" }}>
          <input type="text" placeholder='Start typing to search a patient' className="p-1 w-100 border p-3" style={{ borderRadius: "25px" }} onChange={(e) => handleSearchInput(e.target.value)}></input>
        </div>


        <div className="text-black-50 mx-auto" style={{ marginBottom: "6rem", width: "100%", maxWidth: "750px" }}>
          <div className="p-4 mb-3 rounded border bg-white">
            <div className="me-auto d-flex justify-content-between text-center small text-black-50 border-bottom pb-4 mb-4">
              <span className="" style={{ width: "15%" }}>Name</span>
              <span className="" style={{ width: "15%" }}>Lastname</span>
              <span className="" style={{ width: "25%" }}>Email</span>
              <span className="" style={{ width: "25%" }}>Phone</span>
            </div>

            {patientsList.map((patient) =>

              <div key={patient.id} className="me-auto d-flex text-center justify-content-between small text-black-50 pb-3 align-items-center">
                <span className="" style={{ width: "15%" }}>{patient.name}</span>
                <span className="" style={{ width: "15%" }}>{patient.lastname}</span>
                <span className="" style={{ width: "25%" }}><a href={`mailto:${patient.email}`} style={{ color: "#14C4B9" }}>{patient.email}</a></span>
                <span className="" style={{ width: "25%" }}>{patient.phone}</span>
              </div>

            )}

          </div>
        </div>

      </div>
    </div>
  )
}
