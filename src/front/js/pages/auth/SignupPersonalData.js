import React, {useContext, useEffect, useState} from "react";
import { useNavigate, Link} from 'react-router-dom'
import { Context } from "../../store/appContext";


export default function SignupPersonalData() {

  const navigate = useNavigate()

  const {store, actions} = useContext(Context)

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [pro, setPro] = useState(store.currentPro)

  const handleNext = async (e) => {

    e.preventDefault()
     
    pro.name = name
    pro.lastname = lastName
    pro.phone = phone
    pro.config_status = 1   

    console.log(pro)

    await actions.updatePro(pro)
    console.log(store.currentPro)


  const handleNext = (e) => {
    e.preventDefault()
    console.log('clicking next')
    navigate("/signup/location")
  }

  useEffect(() => {
    if(store.isLoggedIn){
      const fetchData = async () => {
        const response = await actions.authentication(store.token)
        const proId = await response.logged_in_as
        await actions.getPro(proId)
        setPro(store.currentPro)
      }
      fetchData()
    }
    
  }, [store.isLoggedIn])



  return (
    <> 

    {!store.isLoggedIn ? navigate("/login") : 
      <section id="signupPersonalData" className="bg-light d-flex align-items-center" style={{ minHeight: '80vh'}}>
        <div className="container py-5">


          <div className="col-md-7 col-lg-8 m-auto bg-white p-5" style={{border:"solid #D1D1D1 6px", borderRadius:"18px"}}>
            <h5>Personal Data</h5>
            <hr />
            <form className="needs-validation" noValidate="" onSubmit={(e) => handleNext(e)}>

              <div className="p-4 mb-5 rounded" style={{backgroundColor:"#E0F3F3"}}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label" >First name</label>
                    <input type="text" className="form-control" id="firstName" placeholder="your name" required="" value={name} onChange={(e) => setName(e.target.value)}/>
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>

                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input type="text" className="form-control" id="lastName" placeholder="lastname" required="" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Phone</label>
                    <input type="phone" className="form-control" id="phone" placeholder="393 1234567" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    <div className="invalid-feedback">
                      Please enter a valid email address for shipping updates.
                    </div>
                  </div>

                </div>
              </div>

            </div>
            
            <div className="d-flex justify-content-between align-items-center border-top p-3">
              <Link to="/signup/" className="text-decoration-none"><p className="text-black">{"<"} Back</p></Link>
              <input type="submit" value="Next" className="btn btn-primary btn-lg" style={{backgroundColor:"#14C4B9", border:"none"}} ></input>
            </div>
            
          </form>
        </div>


        </div>
      </section>
      }
    
    </>
  )
}