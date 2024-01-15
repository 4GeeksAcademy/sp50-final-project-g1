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
    phone = db.Column(db.String(25), unique=True, nullable=False)
    bookingpage_url = db.Column(db.String, unique=True, nullable=False)
    suscription = db.Column(db.Integer)
    

    def __repr__(self):
        return f'<User {self.name}, {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                "name": self.name,
                "email": self.email,}

class Locations(db.Model):
    __tablename__ = "locations"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    country = db.Column(db.String, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    pro_id = db.Column(ForeignKey("pros.id"), unique=True, nullable=False)
    pro = db.relationship("Pros")

    def __repr__(self):
        return f'<Locations {self.id}, {self.country}, {self.city}, {self.address}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
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
    starting_hour = db.Column(db.String, nullable=False)
    ending_hour = db.Column(db.String, nullable=False)
    pro_id = db.Column(ForeignKey("pros.id"), unique=True, nullable=False)
    pro = db.relationship("Pros")

    def __repr__(self):
        return f'<Hours {self.id}, {self.pro_id}, {self.working_day}, {self.starting_hour}, {self.ending_hour}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                "working_day": self.working_day,
                "starting_hour": self.starting_hour,
                "ending_hour": self.ending_hour,
                "pro_id": self.pro_id,}

class InactivityDays(db.Model):
    __tablename__ = "inactivity"
    id = db.Column(db.Integer, primary_key=True)
    



