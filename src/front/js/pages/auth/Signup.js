import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Signup() {

  const navigate = useNavigate()

  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const handleSubmit = async () => {
    console.log('clicking on submit')
    navigate("/signup/personal-data")
  }


  return (
    <> 
    <section id="access" className="text-black-50 d-flex align-items-center" style={{ minHeight: '70vh'}}>
      <div className="container p-5">

        <div className="row">

          {/* SIGNUP */}
          <div className="col-12 col-md-6 mb-5 mx-auto">
            <h5>Signup</h5>
            <div className=" rounded-3 p-4 mb-3" style={{backgroundColor:"#D9D9D9"}}>

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
                      <input type="text" className="form-control" id="email" placeholder="Choose a personal username" onChange={(e) => setUsername(e.target.value)} />
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
            <p>Already have an account? <Link to="/login" style={{color:"#14C4B9"}}>Login Here</Link></p>
          </div>

        </div>

      </div>
    </section>
    
    </>
  )
}