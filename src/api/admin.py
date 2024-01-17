import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from api.models import db, Pros, Hours, Patients, Bookings, Locations, ProServices, Services, InactivityDays


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the Users model to the admin
    admin.add_view(ModelView(Pros, db.session))
    admin.add_view(ModelView(Hours, db.session))
    admin.add_view(ModelView(Patients, db.session))
    admin.add_view(ModelView(Bookings, db.session))
    admin.add_view(ModelView(Locations, db.session))
    admin.add_view(ModelView(ProServices, db.session))
    admin.add_view(ModelView(Services, db.session))
    admin.add_view(ModelView(InactivityDays, db.session))
    """
    You can duplicate that line to add mew models
    admin.add_view(ModelView(YourModelName, db.session))
    """
