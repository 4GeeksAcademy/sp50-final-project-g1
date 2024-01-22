"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from api.models import db, Pros, Hours, Patients, Bookings, Locations, ProServices, Services, InactivityDays


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

#############################################################
# Hours

# Get all records in the 'hours' or Post one record
@api.route("/hours", methods=['GET', 'POST'])
def hours():
    if request.method == 'GET':
        hours_list = Hours.query.all()
        serialized_hours = [hour.serialize() for hour in hours_list]
        return jsonify(serialized_hours), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        if 'working_day' not in data or 'starting_hour' not in data or 'ending_hour' not in data or 'pro_id' not in data:
            return jsonify({"message": "all data are required"}), 400
        new_hour = Hours(working_day=data.get('working_day'),
                         starting_hour=data.get('starting_hour'),
                         ending_hour=data.get('ending_hour'),
                         location_id=data.get('location_id'),
                         pro_id=data.get('pro_id'))
        db.session.add(new_hour)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201


# Get all records in the 'hours' table by 'pro_id'
@api.route("/pros/<int:proid>/hours", methods=['GET'])
def specific_pro_hour(proid):
    hours_by_pro = Hours.query.filter_by(pro_id=proid).all()
    if not hours_by_pro:
        return jsonify({"message": "Record not found"}), 404
    if request.method == 'GET':
        serialized_hours = [hour.serialize() for hour in hours_by_pro]
        return jsonify(serialized_hours), 200


# Get, Update, and Delete a specific record in the 'hours' table
@api.route("/hours/<int:tableid>", methods=['GET', 'PUT', 'DELETE'])
def specific_hour(tableid):
    hour = Hours.query.get(tableid)
    if not hour:
        return jsonify({"message": "Record not found"}), 404
    if request.method == 'GET':
        return jsonify(hour.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        hour.working_day = data.get('working_day', hour.working_day)
        hour.starting_hour = data.get('starting_hour', hour.starting_hour)
        hour.ending_hour = data.get('ending_hour', hour.ending_hour)
        hour.pro_id = data.get('pro_id', hour.pro_id)
        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200
    if request.method == 'DELETE':
        db.session.delete(hour)
        db.session.commit()
        return jsonify({"message": "Record deleted successfully"}), 200


##############################################################
# patient
    
# Get all records and add a new record to the 'patients' table
@api.route("/patients", methods=['GET', 'POST'])
def patients():
    if request.method == 'GET':
        patients_list = Patients.query.all()
        serialized_patients = [patient.serialize() for patient in patients_list]
        return jsonify(serialized_patients), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        if 'name' not in data or 'lastname' not in data or 'email' not in data:
            return jsonify({"message": "Name, lastname, and email are required"}), 400
        new_patient = Patients(name=data['name'],
                               lastname=data['lastname'],
                               email=data['email'],
                               phone=data.get('phone'))
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201


# Get, Update, and Delete a specific record in the 'patients' table
@api.route("/patients/<int:patientid>", methods=['GET', 'PUT', 'DELETE'])
def specific_patient(patientid):
    patient = Patients.query.get(patientid)
    if not patient:
        return jsonify({"message": "patient not found"}), 404
    if request.method == 'GET':
        return jsonify(patient.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        patient.name = data.get('name', patient.name)
        patient.lastname = data.get('lastname', patient.lastname)
        patient.email = data.get('email', patient.email)
        patient.phone = data.get('phone', patient.phone)
        db.session.commit()
        return jsonify({"message": "Patient updated successfully"}), 200
    if request.method == 'DELETE': #NB: delete all booking related to the patient_id
        ## Join patients and bookings table and filter all record by patient_id = patientid
        bookings_by_patient = Bookings.query.join(Patients).filter_by(id=patientid).all()
        # delete all bookings associated to the deleted patient
        for booking in bookings_by_patient:
            db.session.delete(booking)
        # delete single patient
        db.session.delete(patient)
        db.session.commit()
        return jsonify({"message": "Patient deleted successfully. All booking associated to this patient has been delated"}), 200



##############################################################
# booking


# Get all records and add a new record to the 'booking' table
@api.route("/bookings", methods=['GET', 'POST'])
def get_add_bookings():
    if request.method == 'GET':
        bookings_list = Bookings.query.all()
        serialized_bookings = [booking.serialize() for booking in bookings_list]
        return jsonify(serialized_bookings), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        required_fields = ['date', 'starting_time', 'status', 'pro_service_id', 'patient_id']
        if not all(field in data for field in required_fields):
            return jsonify({"message": "Incomplete data. Please provide date, starting_time, status, service_id, and pro_id."}), 400
        new_booking = Bookings(date=data['date'],
                               starting_time=data['starting_time'],
                               status=data['status'],
                               pro_service_id=data['service_id'],
                               patient_id=data['patient_id'],
                               pro_notes=data.get('pro_note'),   # using .get method begause we can set default value
                               patient_notes=data.get('patient_note'))  # using .get method begause we can set default value
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({"message": "Booking added successfully"}), 201

      
# Get and Update a specific record in the 'booking' table
@api.route("/bookings/<int:bookingid>", methods=['GET', 'PUT'])
def specific_booking(bookingid):
    booking = Bookings.query.get(bookingid)

    if not booking:
        return jsonify({"message": "Record not found"}), 404

    if request.method == 'GET':
        return jsonify(booking.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        booking.date = data.get('date', booking.date)
        booking.starting_time = data.get('starting_time', booking.starting_time)
        booking.status = data.get('status', booking.status)
        booking.pro_service_id = data.get('pro_service_id', booking.pro_service_id)
        booking.patient_id = data.get('patient_id', booking.patient_id)
        booking.pro_notes = data.get('pro_notes', booking.pro_notes)
        booking.patient_notes = data.get('patient_notes', booking.patient_notes)
        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200


#  Delete a specific record in the 'booking' table
@api.route("/bookings/<int:bookingid>", methods=['DELETE'])
def specific_delete_booking(bookingid):
    booking = Bookings.query.get(bookingid)
    if not booking:
        return jsonify({"message": "Record not found"}), 404
    if request.method == 'DELETE':
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"message": "Record deleted successfully"}), 200


# Get records filtered by pro_id
@api.route("/pros/<int:proid>/bookings", methods=['GET'])
def bookings_by_pro_id(proid):
    bookings_by_pro = Bookings.query.join(ProServices).filter_by(pro_id=proid).all()

    if not bookings_by_pro:
        return jsonify({"message": "No records found for the specified pro_id"}), 404

    serialized_bookings = [booking.serialize() for booking in bookings_by_pro]
    return jsonify(serialized_bookings), 200


################################################################
# Locations


# Get all records and add a new record to the 'locations' table
@api.route("/locations", methods=['GET', 'POST'])
def get_add_locations():
    if request.method == 'GET':
        locations_list = Locations.query.all()
        serialized_locations = [location.serialize() for location in locations_list]
        return jsonify(serialized_locations), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        required_fields = ['city', 'address', 'country', 'pro_id', 'name']
        if not all(field in data for field in required_fields):
            return jsonify({"message": "Incomplete data. Please provide city, address, country, and pro_id."}), 400
        new_location = Locations(
            name=data['name'],
            city=data['city'],
            address=data.get('address'),
            country=data.get('country'),
            duration=data.get('duration'),
            pro_id=data['pro_id']
        )

        db.session.add(new_location)
        db.session.commit()

        return jsonify({"message": "Record added successfully"}), 201



# Get, Update, and Delete a specific record in the 'locations' table
@api.route("/locations/<int:locationid>", methods=['GET', 'PUT', 'DELETE'])
def specific_location(locationid):
    location = Locations.query.get(locationid)
    if not location:
        return jsonify({"message": "Record not found"}), 404
    if request.method == 'GET':
        return jsonify(location.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        location.name = data.get('name', location.name)
        location.address = data.get('address', location.address)
        location.city = data.get('city', location.city)
        location.country = data.get('country', location.country)
        location.duration = data.get('duration', location.duration)
        location.pro_id = data.get('pro_id', location.pro_id)
        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200
    if request.method == 'DELETE':
        db.session.delete(location)
        db.session.commit()
        return jsonify({"message": "Record deleted successfully"}), 200


# Get locations associated with a specific pro_id
@api.route("pros/<int:proid>/locations/", methods=['GET'])
def locations_by_pro_id(proid):
    locations_by_pro = Locations.query.filter_by(pro_id=proid).all()
    if not locations_by_pro:
        return jsonify({"message": "No records found for the specified pro_id"}), 404
    serialized_locations = [location.serialize() for location in locations_by_pro]
    return jsonify(serialized_locations), 200


# Get all pros and Post new Pro.
@api.route("/pros", methods=["GET", "POST"])
def handle_pros():
    if request.method == 'GET':
        pros_list = Pros.query.all()
        serialized_pros = [pro.serialize() for pro in pros_list]
        return jsonify(serialized_pros), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        if 'name' not in data or 'lastname' not in data or 'email' not in data or 'phone' not in data or 'password' not in data or 'bookingpage_url' not in data:
            return jsonify({"message": "Name, lastname, email, phone, password and bookingpage are required"}), 400
        new_pro = Pros(name=data['name'],
                       lastname=data['lastname'],
                       email=data['email'],
                       phone=data['phone'],
                       password=data['password'],
                       bookingpage_url=data['bookingpage_url'],
                       config_status=data['config_status'],
                       suscription=data.get('suscription'),
                       title=data.get('title'))
        db.session.add(new_pro)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201

# Get, update or delete a specific Pro.
@api.route("/pros/<int:proid>", methods=["GET", "PUT", "DELETE"])
def handle_pro(proid):
    pro = Pros.query.get(proid)
    if not pro:
        return jsonify({"message": "pro not found"}), 404
    if request.method == 'GET':
        return jsonify(pro.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        pro.name = data.get('name', pro.name)
        pro.lastname = data.get('lastname', pro.lastname)
        pro.email = data.get('email', pro.email)
        pro.phone = data.get('phone', pro.phone)
        pro.password = data.get('password', pro.password)
        pro.bookingpage_url = data.get('bookingpage_url', pro.bookingpage_url)
        pro.suscription = data.get('suscription', pro.suscription)
        pro.config_status = data.get('config_status', pro.config_status)
        pro.title = data.get('title', pro.title)
        db.session.commit()
        return jsonify({"message": "pro updated successfully"}), 200
    if request.method == 'DELETE':
        db.session.delete(pro)
        db.session.commit()
        return jsonify({"message": "pro deleted successfully"}), 200
    

# Get all ProServices or post a new one.
@api.route("/proservices", methods=["GET", "POST"])
def handle_proservices():
    if request.method == 'GET':
        proservices_list = ProServices.query.all()
        serialized_proservices = [proservice.serialize() for proservice in proservices_list]
        return jsonify(serialized_proservices), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        if 'pro_id' not in data or 'service_id' not in data:
            return jsonify({"message": "pro_id and service_id are required"}), 400
        new_proservice = ProServices(pro_id=data['pro_id'],
                                     service_id=data['service_id'],
                                     price=data.get('price'))
        db.session.add(new_proservice)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201

# Get, update or delete a specific ProService
@api.route("/proservices/<int:proserviceid>", methods=["GET", "PUT", "DELETE"])
def handle_proservice(proserviceid):
    pro_service = ProServices.query.get(proserviceid)
    if not pro_service:
        return jsonify({"message": "service not found"}), 404
    if request.method == 'GET':
        return jsonify(pro_service.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        pro_service.price = data.get('price', pro_service.price)
        pro_service.pro_id = data.get('pro_id', pro_service.pro_id)
        pro_service.service_id = data.get('service_id', pro_service.service_id)
        db.session.commit()
        return jsonify({"message": "service updated successfully"}), 200
    if request.method == 'DELETE':
        db.session.delete(pro_service)
        db.session.commit()
        return jsonify({"message": "service deleted successfully"}), 200

# Get ProServices by pro_id
@api.route("/pros/<int:proid>/proservices", methods=["GET"])
def handle_proservices_by_pro(proid):
    proservices_by_pro = ProServices.query.filter_by(pro_id=proid).all()
    if not proservices_by_pro:
        return jsonify({"message": "No records found for the specified pro_id"}), 404
    serialized_proservices = [proservice.serialize() for proservice in proservices_by_pro]
    return jsonify(serialized_proservices), 200


# Get all Services and Post new Service.
@api.route("/services", methods=["GET", "POST"])
def handle_services():
    if request.method == 'GET':
        services_list = Services.query.all()
        serialized_services = [service.serialize() for service in services_list]
        return jsonify(serialized_services), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        if 'specialization' not in data or 'service_name' not in data:
            return jsonify({"message": "specialization and service_name are required"}), 400
        new_service = Services(specialization=data['specialization'],
                               service_name=data['service_name'],
                               service_type=data.get('service_type'))
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201

# Get, update or delete a specific Service.
@api.route("/services/<int:serviceid>", methods=["GET", "PUT", "DELETE"])
def handle_service(serviceid):
    service = Services.query.get(serviceid)
    if not service:
        return jsonify({"message": "service not found"}), 404
    if request.method == 'GET':
        return jsonify(service.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        service.specialization = data.get('specialization', service.specialization)
        service.service_name = data.get('service_name', service.service_name)
        service.service_type = data.get('service_type', service.service_type)
        db.session.commit()
        return jsonify({"message": "service updated successfully"}), 200
    if request.method == 'DELETE':
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "service deleted successfully"}), 200

# Get Services by pro_id
@api.route("/pros/<int:proid>/services", methods=["GET"])
def handle_services_by_pro(proid):
    services_by_pro = Services.query.join(ProServices).filter_by(pro_id=proid).all()
    if not services_by_pro:
        return jsonify({"message": "No records found for the specified pro_id"}), 404
    serialized_services = [service.serialize() for service in services_by_pro]
    return jsonify(serialized_services), 200

# Get all InactivityDays and Post new InactivityDay.
@api.route("/inactivity", methods=["GET", "POST"])
def handle_inactivitydays():
    if request.method == 'GET':
        inactivity_list = InactivityDays.query.all()
        serialized_inactivities = [inactivity.serialize() for inactivity in inactivity_list]
        return jsonify(serialized_inactivities), 200
    if request.method == 'POST':
        data = request.json
        # Check if the required fields are present in the request
        if 'starting_date' not in data or 'pro_id' not in data:
            return jsonify({"message": "starting_date and pro_id are required"}), 400
        new_inactivity = InactivityDays(starting_date=data['starting_date'],
                                        pro_id=data['pro_id'],
                                        ending_date=data.get('ending_date'),
                                        starting_hour=data.get('starting_hour'),
                                        ending_hour=data.get('ending_hour'))
        db.session.add(new_inactivity)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201

# Get, update or delete a specific InactivityDay.
@api.route("/inactivity/<int:inactivitydaysid>", methods=["GET", "PUT", "DELETE"])
def handle_inactivityday(inactivitydaysid):
    inactivity_day = InactivityDays.query.get(inactivitydaysid)
    if not inactivity_day:
        return jsonify({"message": "inactivity_day not found"}), 404
    if request.method == 'GET':
        return jsonify(inactivity_day.serialize()), 200
    if request.method == 'PUT':
        data = request.json
        inactivity_day.starting_date = data.get('starting_date', inactivity_day.starting_date)
        inactivity_day.ending_date = data.get('ending_date', inactivity_day.ending_date)
        inactivity_day.starting_hour = data.get('service_id', inactivity_day.starting_hour)
        inactivity_day.ending_hour = data.get('ending_hour', inactivity_day.ending_hour)
        db.session.commit()
        return jsonify({"message": "inactivity_day updated successfully"}), 200
    if request.method == 'DELETE':
        db.session.delete(inactivity_day)
        db.session.commit()
        return jsonify({"message": "inactivity_day deleted successfully"}), 200

# Get InactivityDays by pro_id
@api.route("/pros/<int:proid>/inactivity", methods=["GET"])
def handle_inactivity_by_pro(proid):
    inactivity_days_by_pro = InactivityDays.query.filter_by(pro_id=proid).all()
    if not inactivity_days_by_pro:
        return jsonify({"message": "No records found for the specified pro_id"}), 404
    serialized_inactivity_days = [inactivity.serialize() for inactivity in inactivity_days_by_pro]
    return jsonify(serialized_inactivity_days), 200


