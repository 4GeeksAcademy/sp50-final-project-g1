import React from "react";

// Components
import HoursForm from "../../component/dashboard/HoursForm";
import HolidayForm from "../../component/dashboard/HolidayForm";

import "../../../styles/calendar.css"

export default function WorkingDay() {

  return (
    <div className="" style={{ minHeight: "90vh" }}>
      <div id='account-data' className="align-items-center bg-light py-5 container">
        <HoursForm />
        <HolidayForm />
      </div>
    </div>
  )
}
