import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";



export default function PatientsList() {

  const { store, actions } = useContext(Context)
  const [patientsList, setPatientsList] = useState(store.patientsByPro)


  return (
    <div className=" min-vh-100">
      <div id='account-data' className="align-items-center bg-light py-5 container">

        <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
          <div className="">
            <input type="text" placeholder='Search a patient' className="p-3 mb-2 rounded bg-white w-100 border"></input>
            <p className="small text-black-50 fw-light">Start typing to search for a patient.</p>

          </div>
        </div>

        <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
          <div className="d-flex">
            <h4 className=" text-decoration-underline">MY PATIENTS</h4>
            <button className="ms-auto btn-sm text-white border-0" style={{ backgroundColor: "#14C4B9", border: "none" }} >Add a Visit</button>
          </div>
          <hr />
          <p className="small text-black-50 fw-light">Define your days or period of inactivity to lock your agenda.</p>

          <div className="p-4 mb-3 rounded border bg-white">
            <div className="me-auto d-flex justify-content-between text-center small text-black-50 border-bottom pb-4 mb-4">
              <span className="" style={{ width: "15%" }}>Name</span>
              <span className="" style={{ width: "15%" }}>Lastname</span>
              <span className="" style={{ width: "25%" }}>Email</span>
              <span className="" style={{ width: "25%" }}>Phone</span>
              <span className="" style={{ width: "20%" }}>Last Booking</span>
            </div>

            {patientsList.map((patient) => {

              return (
                <div key={patient.id} className="me-auto d-flex text-center justify-content-between small text-black-50 pb-3 align-items-center">
                  <span className="" style={{ width: "15%" }}>{patient.name}</span>
                  <span className="" style={{ width: "15%" }}>{patient.lastname}</span>
                  <span className="" style={{ width: "25%" }}>{patient.email}</span>
                  <span className="" style={{ width: "25%" }}>{patient.phone}</span>
                  <span className="" style={{ width: "20%", color: "#14C4B9" }}>02/02/2024</span>
                </div>
              )
            })}

          </div>

        </div>

      </div>
    </div>
  )
}
