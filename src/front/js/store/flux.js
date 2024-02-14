const getState = ({getStore, getActions, setStore}) => {
	return {
		store: {
			isAdmin: false,
			isLoggedIn: false,
			currentPro: {},
			currentLocations: [],
			servicesByPro: [],
			services: [],
			proServicesByPro: [],
			hoursByPro: [],
			hoursByLocation: [],
			inactivityByPro: [],
			bookingsByPro: [],
			patientsByPro: [],
			token: "",
			businessHours: [],
      		patientSelectedDay: "",
		},
		actions: {
      
			selectDay: (day) => {
				setStore({ patientSelectedDay: day })
			},

			//Holidays test
			getHolidays: async (year, country) => {
				const url = process.env.BACKEND_URL + `/get_holidays/${year}/${country}`
				const options = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						},
					}
					const response = await fetch(url, options)
					if(response.ok){
						const data = await response.json()
						return data
					}
					else {
						return ("Error con Holidays")
					}
			},


      
			// Login
			login: (token) => {
				setStore({isLoggedIn: true})
				localStorage.setItem("token", token)
				setStore({token: token})
			},
			logout: () => {
				setStore({isLoggedIn: false})
				localStorage.removeItem("token")
				setStore({currentPro: {}})
				setStore({currentLocations: []})
				setStore({services: []})
				setStore({proServicesByPro: []})
				setStore({hoursByPro: []})
				setStore({inactivityByPro: []})
				setStore({servicesByPro: []})
				setStore({hoursByLocation: []})
				setStore({bookingsByPro: []})
				setStore({token: ""})
				setStore({isAdmin: false})
			},

			isLogged: () => {
				if(localStorage.getItem("token")){
					setStore({isLoggedIn: true})
					setStore({token: localStorage.getItem("token")})
				}
				else {
					setStore({isLoggedIn: false})
				}
			},

			authentication: async(token) => {
				const url = process.env.BACKEND_URL + '/dashboard'
				const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
					},
				}
				const response = await fetch(url, options)
				if(response.ok) {
					const data = await response.json()
					return data
				}
				
			},

			getGoogleTokensByPro: async(pro_id) => {
				const store = getStore()
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/tokens`;
				const options = {
					method: "GET",
					headers: {
						'Authorization': `Bearer ${store.token}`
					}           
				};
				const response = await fetch(url, options)
				if (response.ok) {
					const data = await response.json()
					return data
				}
				else {
					const data = await response.json()
					return data
				}
			},

			// Pro actions
			newPro: async(object) => {
				const url = process.env.BACKEND_URL + '/pros';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					const data = await response.json()
					const error = data.error
					if(error === 'duplicated_email'){
						return alert("Email already exists")
					}
					if(error === 'duplicated_username'){
						return alert("Username already exists")
					}
				}
			},
			getPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({currentPro: data})	
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getProByUsername: async(username) => {
				const url = process.env.BACKEND_URL + `/pros/${username}`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({currentPro: data})	
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			updatePro: async(object) => {
				const url = process.env.BACKEND_URL + `/pros/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({currentPro: data})
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deletePro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},

			// Services actions
			newService: async(object) => {
				const url = process.env.BACKEND_URL + '/services';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getServices: async() => {
				const url = process.env.BACKEND_URL + `/services`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({services: data})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getService: async(service_id) => {
				const url = process.env.BACKEND_URL + `/services/${service_id}`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getServicesByPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/services`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({servicesByPro: data})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getServiceByBooking: async(proservice_id) => {
				const url = process.env.BACKEND_URL + `/bookings/${proservice_id}/services`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			updateService: async(object) => {
				const url = process.env.BACKEND_URL + `/pros/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deleteService: async(service_id) => {
				const url = process.env.BACKEND_URL + `/services/${service_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},

			// ProServices actions
			newProService: async(object) => {
				const url = process.env.BACKEND_URL + '/proservices';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getProService: async(proservice_id) => {
				const url = process.env.BACKEND_URL + `/proservices/${proservice_id}`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getProServicesByPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/proservices`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({proServicesByPro: data})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			updateProService: async(object) => {
				const url = process.env.BACKEND_URL + `/proservices/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deleteProService: async(pro_service_id) => {
				const url = process.env.BACKEND_URL + `/proservices/${pro_service_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},

			// Locations actions
			newLocation: async(object) => {
				const url = process.env.BACKEND_URL + '/locations';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getLocationsByPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/locations`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({currentLocations: data})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			updateLocation: async(object) => {
				const url = process.env.BACKEND_URL + `/locations/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deleteLocation: async(location_id) => {
				const url = process.env.BACKEND_URL + `/proservices/${location_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},

			// Hours actions
			newHours: async(object) => {
				const url = process.env.BACKEND_URL + '/hours';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getHoursByPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/hours`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({hoursByPro: data})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deleteHoursByPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/hours`;
				const options = {
					method: "DELETE"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					setStore({hoursByPro: []})
					setStore({hoursByLocation: []})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getHoursByLocation: async(location_id) => {
				const url = process.env.BACKEND_URL + `/pros/${location_id}/hours`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({hoursByLocation: data})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			updateHours: async(object) => {
				const url = process.env.BACKEND_URL + `/hours/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deleteHours: async(hour_id) => {
				const url = process.env.BACKEND_URL + `/hours/${hour_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},

			// Inactivity actions
			newInactivity: async(object) => {
				const url = process.env.BACKEND_URL + '/inactivity';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getInactivityByPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/inactivity`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({inactivityByPro: data})
				}
				else{
					setStore({inactivityByPro: []})
					console.log("Error :", response.status, response.statusText)
				}
			},
			updateInactivity: async(object) => {
				const url = process.env.BACKEND_URL + `/inactivity/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deleteInactivity: async(inactivity_id) => {
				const url = process.env.BACKEND_URL + `/inactivity/${inactivity_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},

			// Bookings actions
			newBooking: async(object) => {
				const url = process.env.BACKEND_URL + '/bookings';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getBookingsByPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}/bookings`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					setStore({bookingsByPro: data})
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			updateBooking: async(object) => {
				const url = process.env.BACKEND_URL + `/bookings/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deleteBooking: async(booking_id) => {
				const url = process.env.BACKEND_URL + `/bookings/${booking_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},

			// Patients actions
			newPatient: async(object) => {
				const url = process.env.BACKEND_URL + '/patients';
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getPatient: async(patient_id) => {
				const url = process.env.BACKEND_URL + `/patients/${patient_id}`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			getPatientByEmail: async(patient_email) => {
				const url = process.env.BACKEND_URL + `/patients/${patient_email}`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = await response.json()
					return data
				}
				else{
					const data = await response.json()
					console.log(data.error)
					return null	
				}
			},
			updatePatient: async(object) => {
				const url = process.env.BACKEND_URL + `/patients/${object.id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(object)            
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = response.json()
					return data
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
			deletePatient: async(patient_id) => {
				const url = process.env.BACKEND_URL + `/patients/${patient_id}`;
				const options = {
					method: "DELETE"          
				};
				const response = await fetch(url, options)
				if(response.ok){
					return true
				}
				else{
					/* alert("Sorry, somenthing went wrong.") */
					console.log("Error :", response.status, response.statusText)
				}
			},
		}
	};
};


export default getState;