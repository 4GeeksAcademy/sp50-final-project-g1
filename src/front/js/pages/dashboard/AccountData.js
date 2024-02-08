import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate, Link } from "react-router-dom";

// Google Login auth
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';


export default function AccountData() {

  const navigate = useNavigate()

  const { store, actions } = useContext(Context)

  const [email, setEmail] = useState(store.currentPro.email || 'test@myemail.com')
  const [googleCalendar, setGoogleCalendar] = useState(store.currentPro.email || 'gmailapi@myemail.com')
  const [userName, setUserName] = useState(store.currentPro.bookingpage_url || 'studiourl')
  const [phone, setPhone] = useState(store.currentPro.phone || '+34 615600600')

  const googleId = process.env.GOOGLE_CLIENT_ID


  // Este efecto cargará SIEMPRE que se cargue el componente y isLoggedIn sea true. Trae todos los datos del pro a la store.
  useEffect(() => {
    console.log('google id', googleId)
    const fetchData = async () => {
      try {
        const response = await actions.authentication(store.token);

        if (!response) {
          console.error('Error: Respuesta de autenticación no válida');
          return;
        }

        const proId = response.logged_in_as;
        await actions.getPro(proId);
        console.log("-----PRO-----", store.currentPro);
        setEmail(store.currentPro.email)
        setGoogleCalendar(store.currentPro.email)
        setUserName(store.currentPro.bookingpage_url)
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
      .catch(error => console.error('Error:', error));
    },
    flow: 'auth-code',
    scope: "openid email profile https://www.googleapis.com/auth/calendar"
  });
  
  return (
    <>
        {!store.isLoggedIn ? navigate('/login') :
          <div className=" min-vh-100">

            <div id='account-data' className="align-items-center bg-light py-5 container">

              <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
                <h4 className=" text-decoration-underline">ACCOUNT DATA</h4>
                <div className="p-5 rounded bg-white border text-black-50">
                  <div><span>EMAIL: </span><span>{email}</span></div>
                  <div><span>USERNAME: </span><span>{userName}</span></div>
                  <div><span>PHONE: </span><span>{phone}</span></div>
                  <div><span>PASSWORX: </span><span>************</span></div>
                </div>
              </div>

              <div className=" text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
                <h4 className=" text-decoration-underline">MY BOOKING PAGE URL</h4>
                <p>Share it with your patient or place it in your website to collect bookings</p>
                <div className="p-3 rounded-3 border text-black-50" style={{ backgroundColor: "#E0F3F3" }}>
                  <div><Link to={`/${userName}`} >{`www.docdate.com/${userName}`}</Link></div>
                </div>
              </div>

              <div className="text-black-50 mx-auto w-75" style={{ marginBottom: "6rem" }}>
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
        }
    </>
  )
}
