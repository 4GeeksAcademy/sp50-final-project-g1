import React, { useContext } from "react";
import { Context } from "../store/appContext";


export default function File404() {
	const { store, actions } = useContext(Context);

	return (
    <section id='hero' className="p-5">
      <div className="d-flex align-items-center container" style={{ minHeight:"60vh", background:"url(../../bghero.png)", backgroundSize: "auto 100%", backgroundPosition: "right", backgroundRepeat: "no-repeat",}}>
        
        <div className="">
          <h1 className=" text-black-50 fw-light mb-4" style={{fontSize:"4rem"}}>
            Sorry, this page is <span className="fw-bold" style={{color:"#14C4B9"}}>not available</span>
          </h1>
          <p className="text-black-50 fs-5">Collect and Manage bookings. Keep Control of your agenda</p>
        </div>

      </div>
    </section>
	);
};
