import click
from api.models import db, Pros, Locations, Services, ProServices, Hours, Patients, Bookings, InactivityDays

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """

    ## ALWAYS 5! -> flask insert-test-users
    @app.cli.command("insert-test-database")  # Name of our command
    ## @click.argument("count")  # Argument of out command
    def insert_test_data():
        count = 5 ## DON'T CHANGE THIS
        print("Creating test users")
        for x in range(1, int(count) + 1):
            pro = Pros()
            pro.id = x
            pro.email = "test_pro" + str(x) + "@test.com"
            pro.password = "123456"
            pro.bookingpage_url = "pro" + str(x)
            pro.name = "Pro" + str(x)
            pro.lastname = "pro" + str(x)
            pro.config_status = 4
            pro.phone = 657898989
            db.session.add(pro)
            db.session.commit()
            print("pro: ", pro.email, " created.")
        print("All test pros created")
        for x in range(1, int(count) + 1):
            location = Locations()
            location.id = x
            location.name = "Studio" + str(x)
            location.address = "Street" + str(x)
            location.pro_id = x
            location.city = "City" + str(x)
            location.country = "Country" + str(x)
            db.session.add(location)
            db.session.commit()
            print("location: ", location.name, " created.")
        print("All test locations created")
        specialization_list = ["Psychology", "Psychology", "Oftalmologist", "Oftalmologist", "Cardiology", "Cardiology", "Physiotherapy", "Physiotherapy", "General Medicine", "General Medicine"]
        service_list =["First visit", "Online Session", "First visit", "Treatment", "First visit", "Surgery", "First visit", "Joints massage", "First visit", "Phone Session",]
        for x in range(1, (int(count) * 2) + 1):
            service = Services()
            service.id = x
            service.specialization = specialization_list[x - 1]
            service.service_name = service_list[x - 1]
            db.session.add(service)
            db.session.commit()
            print("service: ", service.specialization, service.service_name, " created.")
        print("All test services created")
        durations_list = [30, 60, 30, 60, 30, 60, 30, 60, 30, 60]
        for x in range(1, (int(count) * 2) + 1):
            proservice = ProServices()
            proservice.id = x
            proservice.price = x * 10
            proservice.pro_id = (x + 1) // 2
            proservice.duration = durations_list[x - 1]
            proservice.service_id = x
            db.session.add(proservice)
            db.session.commit()
            print("proservice: ", proservice.service_id, proservice.pro_id, " created.")
        print("All test proservices created")
        for x in range(1, (int(count) * 2) + 1):
            hour = Hours()
            hour.id = x
            hour.price = x * 10
            hour.pro_id = (x + 1) // 2
            hour.location_id = (x + 1) // 2
            hour.working_day = (x + 1) // 2
            hour.starting_hour_morning = "10:00"
            hour.starting_hour_after = "16:00"
            hour.ending_hour_morning = "14:00"
            hour.ending_hour_after = "20:00"
            db.session.add(hour)
            db.session.commit()
            print("hour: ", hour.working_day, hour.pro_id, " created.")
        print("All test hours created")
        for x in range(1, int(count) + 1):
            patient = Patients()
            patient.id = x
            patient.name = "Patient" + str (x)
            patient.lastname = "patient" + str(x)
            patient.email = "test_patient" + str(x) + "@test.com"
            patient.phone = 677943656
            db.session.add(patient)
            db.session.commit()
            print("patient: ", patient.name, " created.")
        print("All test patients created")
        proservicelist = [1, 10, 2, 9, 3, 8, 4, 7, 5, 6]
        timeslist = [10, 11, 12, 13, 16, 17, 18, 19, 12, 14]
        for x in range(1, (int(count) * 2) + 1):
            booking = Bookings()
            booking.id = x
            booking.date= "2024-02-1" + str(x - 1)
            booking.starting_time = str(timeslist[x - 1]) + ":00"
            booking.status = "confirmed"
            booking.pro_service_id = proservicelist[x - 1]
            booking.patient_id = (x + 1) // 2
            db.session.add(booking)
            db.session.commit()
            print("booking: ", booking.date, " created.")
        print("All test bookings created")
        print("-------------> Database completed!!! <-------------")


    ## BE CAREFUL!!! THIS WILL DELETE ALL DATA IN THE DATABASE
    @app.cli.command("red-button")
    def red_button():
        db.session.query(Bookings).delete()
        print("Bookings deleted")
        db.session.query(Hours).delete()
        print("Hours deleted")
        db.session.query(InactivityDays).delete()
        print("Inactivities deleted")
        db.session.query(Locations).delete()
        print("Locations deleted")
        db.session.query(ProServices).delete()
        print("ProServices deleted")
        db.session.query(Services).delete()
        print("Services deleted")
        db.session.query(Patients).delete()
        print("Patients deleted")
        db.session.query(Pros).delete()
        print("Pros deleted")
        db.session.commit()
        print("-------------> Database deleted!!! <-------------")

    @app.cli.command("insert-services")
    def insert_services():
        count = 5
        specialization_list = ["Psychology", "Psychology", "Oftalmologist", "Oftalmologist", "Cardiology", "Cardiology", "Physiotherapy", "Physiotherapy", "General Medicine", "General Medicine"]
        service_list =["First visit", "Online Session", "First visit", "Treatment", "First visit", "Surgery", "First visit", "Joints massage", "First visit", "Phone Session",]
        for x in range(1, (int(count) * 2) + 1):
            service = Services()
            service.id = x
            service.specialization = specialization_list[x - 1]
            service.service_name = service_list[x - 1]
            db.session.add(service)
            db.session.commit()
            print("service: ", service.specialization, service.service_name, " created.")
        print("All test services created")

