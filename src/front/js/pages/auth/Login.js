import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";


export default function Login() {

  const navigate = useNavigate()

  const { store, actions } = useContext(Context)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [pro, setPro] = useState({})

  const handleSubmit = async (e) => {

    e.preventDefault()

    const url = process.env.BACKEND_URL + '/login'
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }
    const response = await fetch(url, options);
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      setToken(data.access_token)
      actions.login(data.access_token)
      console.log("logged in")
    }
    else {
      const data = await response.json()
      alert(data.msg)
    }
  }

  useEffect(() => {
    if (store.isLoggedIn) {
      const fetchData = async () => {
        if (token) {
          const proId = await actions.authentication(token)
          setPro(proId.logged_in_as)
        }
      }
      fetchData()
    }
  }, [store.isLoggedIn])

  useEffect(() => {
    const fetchData = async () => {
      await actions.getPro(pro)
      console.log(store.currentPro)
      if (store.currentPro.config_status === 0) {
        navigate("/signup/personal-data")
      }
      if (store.currentPro.config_status === 1) {
        navigate("/signup/location")
      }
      if (store.currentPro.config_status === 2) {
        navigate("/signup/specialization")
      }
      if (store.currentPro.config_status === 3) {
        navigate("/signup/hours")
      }
      if (store.currentPro.config_status === 4) {
        navigate("/dashboard/calendar")
      }
    }
    fetchData()
  }, [pro])


  return (
    <>
      <section id="access" className="text-black-50 d-flex align-items-center" style={{ minHeight: '70vh' }}>
        <div className="container p-5">

          <div className="row">

            {/* LOGIN  */}
            <div className="col-12 col-md-6 mb-5 mx-auto">
              <h5>Login</h5>
              <div className=" rounded-3 p-4 mb-3" style={{ backgroundColor: "#E0F3F3" }}>

                <form className="needs-validation" noValidate="" onSubmit={(e) => handleSubmit(e)}>

                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} />
                    <div className="invalid-feedback">
                      Please enter a valid email address for shipping updates.
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">Password</label>
                    <div className="input-group has-validation">
                      <input type="text" className="form-control" id="email" placeholder="*******" onChange={(e) => setPassword(e.target.value)} />
                      <span className="input-group-text">@</span>
                      <div className="invalid-feedback">
                        Password required
                      </div>
                    </div>
                  </div>
                  <input className="w-100 btn btn-primary btn-lg mt-5" type="submit" value="Submit" style={{ backgroundColor: "#14C4B9", border: "none" }}></input>
                </form>
              </div>
              <p>Not registered yet? <Link to="/signup" style={{ color: "#14C4B9" }}>Signup Here</Link></p>
            </div>

            {/* SIGNUP */}
            {/* <div className="col-12 col-md-6">
            <h5>Signup</h5>
            <div className=" rounded-3 p-4" style={{backgroundColor:"#D9D9D9"}}>

              <form className="needs-validation" noValidate="" >
                
                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)}/>
                    <div className="invalid-feedback">
                      Please enter a valid email address for shipping updates.
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">Usermame</label>
                    <div className="input-group has-validation">
                      <input type="text" className="form-control" id="email" placeholder="Choose a personal username" onChange={(e) => setPassword(e.target.value)} />
                      <div className="invalid-feedback">
                        Username required
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">Password</label>
                    <div className="input-group has-validation">
                      <input type="text" className="form-control" id="email" placeholder="*******"  onChange={(e) => setPassword(e.target.value)} />
                      <span className="input-group-text">@</span>
                      <div className="invalid-feedback">
                        Password required
                      </div>
                    </div>
                  </div>


                <button className="w-100 btn btn-primary btn-lg mt-5" onClick={handleSubmit} style={{backgroundColor:"#14C4B9", border:"none"}} >Submit</button>

              </form>
            </div>
          </div> */}

          </div>

        </div>
      </section>

    </>
  )
}
