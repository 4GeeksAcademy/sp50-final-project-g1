import React from "react";

// Components
import HoursForm from "../../component/dashboard/HoursForm";
import HolidayForm from "../../component/dashboard/HolidayForm";

export default function WorkingDay() {

  return (
    <div className=" min-vh-100">
      <div id='account-data' className="align-items-center bg-light py-5 container">
        <HoursForm />
        <HolidayForm />
      </div>
    </div>
  )
}
