const getState = ({getStore, getActions, setStore}) => {
	return {
		store: {
			isLoggedIn: false,
			currentPro: {},
			currentLocation: {},
			servicesByPro: {},
			services: {},
			proServicesByPro: {},		
		},
		actions: {
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
					alert("Sorry, somenthing went wrong.")
					console.log("Error :", response.status, response.statusText)
				}
			},
			getPro: async(pro_id) => {
				const url = process.env.BACKEND_URL + `/pros/${pro_id}`;
				const options = {
					method: "GET"           
				};
				const response = await fetch(url, options)
				if(response.ok){
					const data = response.json()
					setStore({currentPro: data})
				}
				else{
					alert("Sorry, somenthing went wrong.")
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
					return true
				}
				else{
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
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
					const data = response.json()
					setStore({services: data})
				}
				else{
					alert("Sorry, somenthing went wrong.")
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
					const data = response.json()
					return data
				}
				else{
					alert("Sorry, somenthing went wrong.")
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
					const data = response.json()
					setStore({servicesByPro: data})
				}
				else{
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
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
					const data = response.json()
					setStore({proServicesByPro: data})
				}
				else{
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
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
					alert("Sorry, somenthing went wrong.")
					console.log("Error :", response.status, response.statusText)
				}
			},
			
		}
	};
};


export default getState;
