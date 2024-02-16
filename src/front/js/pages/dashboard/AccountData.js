import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate, Link } from "react-router-dom";

// Google Login auth
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';

import "../../../styles/accountData.css"


export default function AccountData() {

  const navigate = useNavigate()

  const { store, actions } = useContext(Context)

  const [email, setEmail] = useState(store.currentPro.email)
  const [googleCalendar, setGoogleCalendar] = useState()
  const [userName, setUserName] = useState(store.currentPro.bookingpage_url)
  const [phone, setPhone] = useState(store.currentPro.phone)
  const [name, setName] = useState(store.currentPro.name)
  const [lastname, setLastname] = useState(store.currentPro.lastname)

  const [editStatus, setEditStatus] = useState(false)



  // Este efecto cargará SIEMPRE que se cargue el componente y isLoggedIn sea true. Trae todos los datos del pro a la store.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await actions.authentication(store.token);

        if (!response) {
          console.error('Error: Respuesta de autenticación no válida');
          return
        }

        const proId = response.logged_in_as
        await actions.getPro(proId)
        console.log("-----PRO-----", store.currentPro)
        setEmail(store.currentPro.email)
        setGoogleCalendar(store.currentPro.email)
        setUserName(store.currentPro.bookingpage_url)
        setName(store.currentPro.name)
        setLastname(store.currentPro.lastname)
        setPhone(store.currentPro.phone)
      } catch (error) {
        console.error('Error al obtener datos del profesional:', error);
      }
    };
    if (!Object.keys(store.currentPro).length) {
      fetchData();
    }

  }, [store.isLoggedIn, store.token]);

  const googleLogin = useGoogleLogin({
    onSuccess: codeResponse => {
      const code = codeResponse.code;
      console.log(codeResponse)

      fetch(process.env.BACKEND_URL + '/tokens_exchange/' + store.currentPro.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'code': code,
        }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .then(() => {
          store.bookingsByPro.map(async (booking) => {
            const googleEvent = {
              'summary': 'DocDate Appointment',
              'description': `${booking.specialization}: ${booking.service_name}`,
              'start': {
                'dateTime': `${booking.date}T${booking.starting_time}:00`,
                'timeZone': `${booking.time_zone}`,
              },
              'end': {
                'dateTime': `${booking.date}T${booking.ending_time}`,
                'timeZone': `${booking.time_zone}`,
              },
            };
            console.log(googleEvent)
            await fetch(process.env.BACKEND_URL + `/create-event/${store.currentPro.id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ googleEvent }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Respuesta del servidor:', data);
              })
              .catch(error => {
                console.error('Error al enviar la solicitud:', error);
              });
          })
        })
        .catch(error => console.error('Error:', error))
    },
    flow: 'auth-code',
    scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send"
  });

  const handleSubmit = async(e) => {
    e.preventDefault()
    store.currentPro.name = name
    store.currentPro.lastname = lastname
    store.currentPro.bookingpage_url = userName
    store.currentPro.email = email
    store.currentPro.phone = phone
    await actions.updatePro(store.currentPro)
    console.log(store.currentPro)
    setEditStatus(!editStatus)
  }

  return (
    <div className="" style={{ minHeight: "90vh" }}>
      <div id='account-data' className="align-items-center bg-light py-5 container">
        <form onSubmit={handleSubmit}>
          <div className="text-black-50 mx-auto" style={{ marginBottom: "6rem", width: "100%", maxWidth: "750px" }}>
            <h4 className=" text-decoration-underline">ACCOUNT DATA</h4>
            <div className="p-5 rounded border bg-white text-black-50 d-flex justify-content-between pro-card">
              {!editStatus ? 
                <>
                  <div className="pro-card">
                    <div className="mb-1"><span className="fw-bold" style={{ color: "#14C4B9"}}>Email: </span><span>{email}</span></div>
                    <div className="mb-1"><span className="fw-bold" style={{ color: "#14C4B9"}}>Username: </span><span>{userName}</span></div>
                    <div className="mb-1"><span className="fw-bold" style={{ color: "#14C4B9"}}>Phone: </span><span>{phone}</span></div>
                  </div>
                  <div>
                    <h2><span className="fw-bold" >{name} </span><span className="fw-bold" style={{ color: "#14C4B9"}}>{lastname}</span></h2>
                  </div>  
                </>
             :
                <div style={{ width: "100%"}}>
                  <span className="fw-bold" style={{ color: "#14C4B9"}}>Name</span>
                  <input className="form-control w-100% mb-3" style={{ width: "100%"}} value={name} onChange={(e) => setName(e.target.value)}/> 
                  <span className="fw-bold" style={{ color: "#14C4B9"}}>Lastname</span>
                  <input className="form-control w-100% mb-3" style={{ width: "100%"}} value={lastname} onChange={(e) => setLastname(e.target.value)}/> 
                  <span className="fw-bold" style={{ color: "#14C4B9"}}>Email</span>
                  <input className="form-control w-100% mb-3" style={{ width: "100%"}} value={email} onChange={(e) => setEmail(e.target.value)}/> 
                  <span className="fw-bold" style={{ color: "#14C4B9"}}>Username</span>
                  <input className="form-control w-100% mb-3" style={{ width: "100%"}} value={userName} onChange={(e) => setUserName(e.target.value)}/> 
                  <span className="fw-bold" style={{ color: "#14C4B9"}}>Phone</span>
                  <input className="form-control w-100% mb-3" style={{ width: "100%"}} value={phone} onChange={(e) => setPhone(e.target.value)}/> 
          
                </div>
             }
              
            </div>
            <div className="text-black-50 mx-auto mt-2 d-flex">
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
          </div>
        </form>
        <div className=" text-black-50 mx-auto" style={{ marginBottom: "6rem", width: "100%", maxWidth: "750px" }}>
          <h4 className=" text-decoration-underline">MY BOOKING PAGE URL</h4>
          <p>Share it with your patient or place it in your website to collect bookings</p>
          <div className="p-3 rounded-3 border text-black-50" style={{ backgroundColor: "#E0F3F3" }}>
            <div><Link to={`/${userName}`} >{`www.docdate.com/${userName}`}</Link></div>
          </div>
        </div>

        <div className="text-black-50 mx-auto" style={{ marginBottom: "6rem", width: "100%", maxWidth: "750px" }}>
          <h4 className=" text-decoration-underline">GOOGLE CALENDAR API CONNECTION</h4>
          <p>Connect your google calendar with the DocDate agenda and keep all your events in one place</p>
          <div className="p-5 rounded-3 bg-white border text-black-50">
            <div>

              {/*  GOOGLE LOGIN BUTTON */}

              {/* <GoogleLogin
                      onSuccess={credentialResponse => {
                        console.log('GOOGLE LOGIN SUCCESS', credentialResponse);
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    /> */}

              <button onClick={() => googleLogin()}>Authorize google Calendar</button>

            </div>
          </div>
        </div>

      </div>
    </div>

  )
}
