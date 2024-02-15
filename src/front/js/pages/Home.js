import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import bgImage from '../../img/herodoc.png';


export default function Home() {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (store.isLoggedIn) {
      const fetchData = async () => {
        const response = await actions.authentication(store.token)
        const proId = await response.logged_in_as
        await actions.getPro(proId)
      }
      fetchData()
    }

  }, [store.isLoggedIn, store.token])

  return (
    <section id='hero' className="p-5">
      <div className="d-flex align-items-center container" style={{ minHeight: "60vh", background: `url(${bgImage})`, backgroundSize: "auto 80%", backgroundPosition: "right", backgroundRepeat: "no-repeat", }}>

        <div className="">
          <h1 className=" text-black-50 fw-light mb-4" style={{ fontSize: "4rem" }}>
            Your <span className="fw-bold" style={{ color: "#14C4B9" }}>Med</span> Agenda <br />
            for your daily <span className="fw-bold">Patients</span>
          </h1>
          <p className="text-black-50 fs-5">Collect and Manage bookings. Keep Control of your agenda</p>
        </div>

      </div>
    </section>
  );
};
