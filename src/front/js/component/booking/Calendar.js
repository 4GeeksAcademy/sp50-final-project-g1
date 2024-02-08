import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";
import "./BookingCalendar.css";


export default function Calendar() {

  let { userName } = useParams();
  const { store, actions } = useContext(Context)

  const currentDate = dayjs();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthsList = ["Janury", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // state
  const [today, setToday] = useState(currentDate)
  const [selectDate, setSelectDate] = useState('')
  const [proWorkingHors, setProWorkingHors] = useState([])

  const slot = [
    // { date: "2024-02-09" },
    // { date: "2024-02-10" },
    // { date: "2024-02-11" }
  ]

  const generateCalendarDate = (month = currentDate.month(), year = currentDate.year()) => {
    const firstDateOfMonth = dayjs().year(year).month(month).startOf('month');
    const lastDateOfMonth = dayjs().year(year).month(month).endOf('month');
    const startDay = firstDateOfMonth.day();
    const arrayOfDate = [];

    // Generate days of the week for the previous month
    const prevMonthDays = (startDay === 0 ? 7 : startDay) - 1; // Calculate days of the previous month
    const prevMonthLastDate = dayjs().year(year).month(month - 1).endOf('month').date(); // Last day of the previous month
    for (let i = prevMonthLastDate - prevMonthDays + 1; i <= prevMonthLastDate; i++) {
      arrayOfDate.push({
        currentMonth: false,
        date: dayjs().year(year).month(month - 1).date(i)
      });
    }

    // Generate days of the current month
    for (let i = 1; i <= lastDateOfMonth.date(); i++) {
      arrayOfDate.push({
        currentMonth: true,
        date: firstDateOfMonth.date(i),
        today: firstDateOfMonth.date(i).isSame(currentDate, 'day')
      });
    }

    // Generate days of the next month to fill the calendar
    const remainingDay = 42 - arrayOfDate.length;
    for (let i = 1; i <= remainingDay; i++) {
      arrayOfDate.push({
        currentMonth: false,
        date: lastDateOfMonth.add(i, 'day')
      });
    }

    return arrayOfDate;
  };

  // Effect: on page load 
  useEffect(() => {

    // API Calls:
    const fetchPro = async (userName) => {
      await actions.getProByUsername(userName)
      // console.log("----PRO----", store.currentPro)

      await actions.getHoursByPro(store.currentPro.id)
      console.log("----WORKING_HOURS----", store.hoursByPro)

      setProWorkingHors(store.hoursByPro)
    }
    fetchPro(userName)

  }, []);

  const handleSelectDay = (date) => {
    actions.selectDay(date)
    setSelectDate(store.patientSelectedDay)
  }

  return (
    <div>

      {/* CALENDAR DESIGN */}
      <div className="bg-white rounded border p-4 my-5 mx-auto" style={{ width: "100%", maxWidth: "400px" }}>

        {/* Current date  */}
        <div className="border-bottom pb-3 d-flex justify-content-between">
          <span className=" fs-6 fw-bold">{monthsList[today.month()]}, {today.year()}</span>
          <div>
            {today.month() !== currentDate.month() && (
              <span className="me-3" onClick={() => setToday(today.month(today.month() - 1))}>{`< `}</span>
            )}
            <span className="fw-bold" onClick={() => setToday(currentDate)}>Today</span>
            <span className="ms-3" onClick={() => setToday(today.month(today.month() + 1))}>{` >`}</span>
          </div>
        </div>

        {/* Calendar header date */}
        <div className="mb-3 text-center border-bottom" style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}>
          {days.map((day, index) =>
            <div key={index} className="text-center">
              <span
                key={index}
                className="text-center  small"
                style={{
                  color: day === "Sun" ? "#DCDCDC" : "#14C4B9"
                }}
              >{day}</span>
            </div>
          )}
        </div>

        {/* Calendar number's day */}
        <div className="" style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}>
          {generateCalendarDate(today.month(), today.year()).map(({ date, currentMonth, today }, index) => {

            // Verifica se la data corrente è presente negli slot
            const isDay = proWorkingHors.some(day => day.working_day === date.day());
            // Calcola se la data è antecedente alla data odierna
            const isPastDate = date.isBefore(currentDate, 'day');

            // Applica lo stile condizionale
            const dayStyle = {
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              color: today || isDay ? "#ffffff" : "#DCDCDC",
              backgroundColor: today ? "#101010" : (isDay ? "#14C4B9" : "#ffffff"),
              cursor: "pointer",
              visibility: (currentMonth && !isPastDate) ? "visible" : "hidden"
            };

            // single day number
            return (
              <div
                key={index}
                className="text-center d-flex justify-content-center align-items-center"
                style={dayStyle}
                onClick={!today ? () => handleSelectDay(date.format('YYYY-MM-DD')) : null}
              >
                <span className="day small">
                  {date.date()}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
