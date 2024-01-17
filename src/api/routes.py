"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from api.models import db, Pros, Hours, Patients, Bookings


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the browser inspector and you will see the GET request"
    return response_body, 200





#############################################################
# Hours

# Get all records in the 'hours' or Post one record
@api.route("/hours/", methods=['GET', 'POST'])
def hours():
    if request.method == 'GET':
        hours_list = Hours.query.all()
        serialized_hours = [hour.serialize() for hour in hours_list]
        return jsonify(serialized_hours), 200
    elif request.method == 'POST':
        data = request.json

        # Check if the required fields are present in the request
        if 'working_day' not in data or 'starting_hour' not in data or 'ending_hour' not in data or 'pro_id' not in data:
            return jsonify({"message": "all data are required"}), 400
        
        new_hour = Hours(
            working_day=data.get('working_day'),
            starting_hour=data.get('starting_hour'),
            ending_hour=data.get('ending_hour'),
            pro_id=data.get('pro_id'),
        )
        db.session.add(new_hour)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201


# Get, Update, and Delete a specific record in the 'hours' table by 'pro_id'
@api.route("/hours/<int:proid>", methods=['GET'])
def specific_hour(proid):
    hour = Hours.query.filter_by(pro_id=proid).first()

    if not hour:
        return jsonify({"message": "Record not found"}), 404

    if request.method == 'GET':
        return jsonify(hour.serialize()), 200


# Get, Update, and Delete a specific record in the 'hours' table
@api.route("/hours/<int:tableid>", methods=['GET', 'PUT', 'DELETE'])
def specific_hour(tableid):
    hour = Hours.query.get(tableid)

    if not hour:
        return jsonify({"message": "Record not found"}), 404

    if request.method == 'GET':
        return jsonify(hour.serialize()), 200
    elif request.method == 'PUT':
        data = request.json
        hour.working_day = data.get('working_day', hour.working_day)
        hour.starting_hour = data.get('starting_hour', hour.starting_hour)
        hour.ending_hour = data.get('ending_hour', hour.ending_hour)
        hour.pro_id = data.get('pro_id', hour.pro_id)
        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200
    elif request.method == 'DELETE':
        db.session.delete(hour)
        db.session.commit()
        return jsonify({"message": "Record deleted successfully"}), 200


##############################################################
# patient
    
# Get all records and add a new record to the 'patients' table
@api.route("/patients/", methods=['GET', 'POST'])
def patients():
    if request.method == 'GET':
        patients_list = Patients.query.all()
        serialized_patients = [patient.serialize() for patient in patients_list]
        return jsonify(serialized_patients), 200
    elif request.method == 'POST':
        data = request.json

        # Check if the required fields are present in the request
        if 'name' not in data or 'lastname' not in data or 'email' not in data:
            return jsonify({"message": "Name, lastname, and email are required"}), 400

        new_patient = Patients(
            name=data['name'],
            lastname=data['lastname'],
            email=data['email'],
            phone=data.get('phone')
        )
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201


# Get, Update, and Delete a specific record in the 'patients' table
@api.route("/patients/<int:patientid>", methods=['GET', 'PUT', 'DELETE'])
def specific_patient(patientid):
    patient = Patients.query.get(patientid)

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    if request.method == 'GET':
        return jsonify(patient.serialize()), 200
    
    elif request.method == 'PUT':
        data = request.json
        patient.name = data.get('name', patient.name)
        patient.lastname = data.get('lastname', patient.lastname)
        patient.email = data.get('email', patient.email)
        patient.phone = data.get('phone', patient.phone)
        db.session.commit()
        return jsonify({"message": "Patient updated successfully"}), 200
    elif request.method == 'DELETE':
        db.session.delete(patient)
        db.session.commit()
        return jsonify({"message": "Patient deleted successfully"}), 200



##############################################################
# booking


# Get all records and add a new record to the 'booking' table
@api.route("/bookings/", methods=['GET', 'POST'])
def get_add_bookings():
    if request.method == 'GET':
        bookings_list = Bookings.query.all()
        serialized_bookings = [booking.serialize() for booking in bookings_list]
        return jsonify(serialized_bookings), 200
    elif request.method == 'POST':
        data = request.json

        # Check if the required fields are present in the request
        required_fields = ['date', 'starting_time', 'status', 'pro_service_id', 'patient_id']
        if not all(field in data for field in required_fields):
            return jsonify({"message": "Incomplete data. Please provide date, starting_time, status, pro_service_id, and patient_id."}), 400

        new_booking = Bookings(
            date=data['date'],
            starting_time=data['starting_time'],
            status=data['status'],
            pro_service_id=data['pro_service_id'],
            patient_id=data['patient_id'],
            pro_note=data.get('pro_note'),   # using .get method begause we can set default value
            patient_note=data.get('patient_note')  # using .get method begause we can set default value
        )

        db.session.add(new_booking)
        db.session.commit()

        return jsonify({"message": "Booking added successfully"}), 201

# Get, Update, and Delete a specific record in the 'booking' table
@api.route("/bookings/<int:bookingid>", methods=['GET', 'PUT', 'DELETE'])
def specific_booking(bookingid):
    booking = Bookings.query.get(bookingid)

    if not booking:
        return jsonify({"message": "Record not found"}), 404

    if request.method == 'GET':
        return jsonify(booking.serialize()), 200
    elif request.method == 'PUT':
        data = request.json
        booking.date = data.get('date', booking.date)
        booking.starting_time = data.get('starting_time', booking.starting_time)
        booking.status = data.get('status', booking.status)
        booking.pro_service_id = data.get('pro_service_id', booking.pro_service_id)
        booking.patient_id = data.get('patient_id', booking.patient_id)
        booking.pro_note = data.get('pro_note', booking.pro_note)
        booking.patient_note = data.get('patient_note', booking.patient_note)
        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200
    elif request.method == 'DELETE':
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"message": "Record deleted successfully"}), 200


# Get records filtered by pro_id
@api.route("/bookings/<int:proid>", methods=['GET'])
def bookings_by_pro_id(proid):
    bookings_by_pro = Bookings.query.filter_by(pro_service_id=proid).all()

    if not bookings_by_pro:
        return jsonify({"message": "No records found for the specified pro_id"}), 404

    serialized_bookings = [booking.serialize() for booking in bookings_by_pro]
    return jsonify(serialized_bookings), 200
