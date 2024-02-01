from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

db = SQLAlchemy()

class Pros(db.Model):
    __tablename__ = "pros"
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(80), unique=False, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(25), nullable=False)
    bookingpage_url = db.Column(db.String, unique=True, nullable=False)
    suscription = db.Column(db.Integer)
    config_status = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String)
    location = db.relationship("Locations")
    inactivity = db.relationship("InactivityDays")
    services = db.relationship("ProServices")

    def __repr__(self):
        return f'<User {self.name}, {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "lastname": self.lastname,
                "email": self.email,
                "phone": self.phone,
                "bookingpage_url": self.bookingpage_url,
                "config_status": self.config_status,
                "title": self.title}

class Locations(db.Model):
    __tablename__ = "locations"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    country = db.Column(db.String, nullable=False)
    pro_id = db.Column(db.ForeignKey("pros.id"), unique=True, nullable=False)
    pro = db.relationship("Pros")

    def __repr__(self):
        return f'<Locations {self.id}, {self.country}, {self.city}, {self.address}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "address": self.address,
                "city": self.city,
                "country": self.country,
                "pro_id": self.pro_id}

class Hours(db.Model):
    __tablename__ = "hours"
    id = db.Column(db.Integer, primary_key=True)
    working_day = db.Column(db.Integer, nullable=False) 
    starting_hour_morning = db.Column(db.String, nullable=False)
    ending_hour_morning = db.Column(db.String, nullable=False)
    starting_hour_after = db.Column(db.String)
    ending_hour_after = db.Column(db.String)
    pro_id = db.Column(db.ForeignKey("pros.id"), nullable=False)
    location_id = db.Column(db.ForeignKey("locations.id"), nullable=False)
    pro = db.relationship("Pros")
    locations = db.relationship("Locations")

    def __repr__(self):
        return f'<Hours {self.id}, {self.pro_id}, {self.working_day}, {self.starting_hour}, {self.ending_hour}>'

    def serialize(self):
        return {"id": self.id,
                "working_day": self.working_day,
                "starting_hour_morning": self.starting_hour_morning,
                "ending_hour_morning": self.ending_hour_morning,
                "starting_hour_after": self.starting_hour_after,
                "ending_hour_after": self.ending_hour_after,
                "pro_id": self.pro_id,}

class InactivityDays(db.Model):
    __tablename__ = "inactivity"
    id = db.Column(db.Integer, primary_key=True)
    starting_date = db.Column(db.String, nullable=False)
    ending_date = db.Column(db.String)
    starting_hour = db.Column(db.String)
    ending_hour = db.Column(db.String)
    pro_id = db.Column(db.ForeignKey("pros.id"), nullable=False)
    pro = db.relationship("Pros")

    def __repr__(self):
        return f'<Inactivity Days {self.id}, {self.pro_id}, {self.starting_date}, {self.ending_date}, {self.starting_hour}, {self.ending_hour}>'

    def serialize(self):
        return {"id": self.id,
                "starting_date": self.starting_date,
                "ending_date": self.ending_date,
                "starting_hour": self.starting_hour,
                "ending_hour": self.ending_hour,
                "pro_id": self.pro_id,}

class Services(db.Model):
    __tablename__ = "services"
    id = db.Column(db.Integer, primary_key=True)
    specialization = db.Column(db.String, nullable=False)
    service_name = db.Column(db.String, nullable=False)
    service_type = db.Column(db.String)

    def __repr__(self):
        return f'<Services {self.id}, {self.specialization}, {self.service_name}, {self.service_type}>'

    def serialize(self):
        return {"id": self.id,
                "specialization": self.specialization,
                "service_name": self.service_name,
                "starting_type": self.service_type,}

class ProServices(db.Model):
    __tablename__ = "pro_services"
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Integer)
    pro_id = db.Column(db.ForeignKey("pros.id"), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    service_id = db.Column(db.ForeignKey("services.id"), nullable=False)
    services = db.relationship("Services")
    pros = db.relationship("Pros")

    def __repr__(self):
        return f'<Pro services {self.price}, {self.pro_id}, {self.service_id}, {self.pros.email}>'

    def serialize(self):
        return {"pro_id": self.pro_id,
                "id": self.id,
                "service_id": self.service_id,
                "price": self.price,
                "duration": self.duration,
                "service_name": self.services.service_name}

class Patients(db.Model):
    __tablename__ = "patients"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(25))

    def __repr__(self):
        return f'<Patient {self.name}, {self.lastname} {self.email}>'

    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "lastname": self.lastname,
                "email": self.email,
                "phone": self.phone}

class Bookings(db.Model):
    __tablename__ = "bookings"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String, nullable=False)
    starting_time = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    pro_notes = db.Column(db.String)
    patient_notes = db.Column(db.String)
    pro_service_id = db.Column(db.ForeignKey("pro_services.id"), nullable=False)
    patient_id = db.Column(db.ForeignKey("patients.id"), nullable=False)
    pro_service = db.relationship("ProServices")
    patient = db.relationship("Patients")

    def __repr__(self):
        return f'<Booking {self.id}, {self.date}>'

    def serialize(self):
        return {"id": self.id,
                "date": self.date,
                "starting_time": self.starting_time,
                "status": self.status,
                "patient_id": self.patient_id,
                "pro_service_id": self.pro_service_id,
                "specialization": self.pro_service.services.specialization,
                "service_name": self.pro_service.services.service_name,
                "patient_name": self.patient.name,
                "patient_lastname": self.patient.lastname,
                "patient_email": self.patient.email,
                "patient_phone": self.patient.phone,
                "duration": self.pro_service.duration,
                "patient_notes": self.patient_notes,
                "pro_notes": self.pro_notes}



    



