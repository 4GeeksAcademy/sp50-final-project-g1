"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from os.path import join, abspath
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from api.models import db, Pros, Hours, Patients, Bookings, Locations, ProServices, Services, InactivityDays
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
import requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import datetime
import json
import holidays


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# Envio de emails
def enviar_correo(receiver, subject, pro, service_name, date, starting_time):
    try:
        # Cargar las credenciales desde el archivo
        TOKEN_PATH = {
            "token": pro["google_access_token"],
            "refresh_token": pro["google_refresh_token"],
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "scopes": ["https://www.googleapis.com/auth/gmail.send"],
            "expiry": pro["google_access_expires"]
        }
        SCOPES = ['https://www.googleapis.com/auth/gmail.send']
        creds = Credentials.from_authorized_user_info(TOKEN_PATH, SCOPES)

        servicio_gmail = build('gmail', 'v1', credentials=creds)

        mensaje = MIMEMultipart()
        mensaje['to'] = receiver
        mensaje['subject'] = subject

        # Contenido HTML con una imagen incrustada
        contenido_html = f"""
                        <!DOCTYPE html>

                                <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                                <head>
                                <title></title>
                                <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                                <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
                                <style>
                                        * {{
                                            box-sizing: border-box;
                                        }}

                                        body {{
                                            margin: 0;
                                            padding: 0;
                                        }}

                                        a[x-apple-data-detectors] {{
                                            color: inherit !important;
                                            text-decoration: inherit !important;
                                        }}

                                        #MessageViewBody a {{
                                            color: inherit;
                                            text-decoration: none;
                                        }}

                                        p {{
                                            line-height: inherit
                                        }}

                                        .desktop_hide,
                                        .desktop_hide table {{
                                            mso-hide: all;
                                            display: none;
                                            max-height: 0px;
                                            overflow: hidden;
                                        }}

                                        .image_block img+div {{
                                            display: none;
                                        }}

                                        @media (max-width:620px) {{
                                            .desktop_hide table.icons-inner {{
                                                display: inline-block !important;
                                            }}

                                            .icons-inner {{
                                                text-align: center;
                                            }}

                                            .icons-inner td {{
                                                margin: 0 auto;
                                            }}

                                            .mobile_hide {{
                                                display: none;
                                            }}

                                            .row-content {{
                                                width: 100% !important;
                                            }}

                                            .stack .column {{
                                                width: 100%;
                                                display: block;
                                            }}

                                            .mobile_hide {{
                                                min-height: 0;
                                                max-height: 0;
                                                max-width: 0;
                                                overflow: hidden;
                                                font-size: 0px;
                                            }}

                                            .desktop_hide,
                                            .desktop_hide table {{
                                                display: table !important;
                                                max-height: none !important;
                                            }}
                                        }}
                                    </style>
                                </head>
                                <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                                <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
                                <tbody>
                                <tr>
                                <td>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;" width="100%">
                                <tbody>
                                <tr>
                                <td>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #14b1a6; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                <tbody>
                                <tr>
                                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                <td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:25px;">
                                <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:28px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:33.6px;">
                                <p style="margin: 0;">DocDate.com</p>
                                </div>
                                </td>
                                </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                <td class="pad" style="padding-bottom:25px;padding-left:10px;padding-right:10px;">
                                <div style="color:#ffffff;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:1px;line-height:120%;text-align:center;mso-line-height-alt:18px;">
                                <p style="margin: 0;">Your med agenda for your daily patients</p>
                                </div>
                                </td>
                                </tr>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;" width="100%">
                                <tbody>
                                <tr>
                                <td>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                <tbody>
                                <tr>
                                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="10" cellspacing="0" class="text_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                <td class="pad">
                                <div style="font-family: sans-serif">
                                <div class="" style="font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #14b1a6; line-height: 1.2;">
                                <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:18px;"><strong>Confirm your booking now!</strong></span></p>
                                </div>
                                </div>
                                </td>
                                </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                <td class="pad" style="padding-bottom:25px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                <div style="font-family: sans-serif">
                                <div class="" style="font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #828282; line-height: 1.2;">
                                <p style="margin: 0; text-align: center; font-size: 14px; mso-line-height-alt: 14.399999999999999px;"> </p>
                                <p style="margin: 0; text-align: center; font-size: 14px; mso-line-height-alt: 16.8px;"><strong><span style="font-size:14px;">Visit: {service_name}</span></strong></p>
                                <p style="margin: 0; text-align: center; font-size: 14px; mso-line-height-alt: 16.8px;"><strong><span style="font-size:14px;">Date: {date}</span></strong></p>
                                <p style="margin: 0; text-align: center; font-size: 14px; mso-line-height-alt: 16.8px;"><strong><span style="font-size:14px;">Hour: {starting_time}</span></strong></p>
                                <p style="margin: 0; text-align: center; font-size: 14px; mso-line-height-alt: 16.8px;"><strong><span style="font-size:14px;">Doctor: {pro["name"]} {pro["lastname"]}</span></strong></p>
                                <p style="margin: 0; text-align: center; font-size: 14px; mso-line-height-alt: 16.8px;"><strong><span style="font-size:14px;">Doctor email: {pro["email"]}</span></strong></p>
                                <p style="margin: 0; text-align: center; font-size: 14px; mso-line-height-alt: 14.399999999999999px;"> </p>
                                </div>
                                </div>
                                </td>
                                </tr>
                                </table>
                                <table border="0" cellpadding="10" cellspacing="0" class="button_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                <td class="pad">
                                <div align="center" class="alignment"><!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:42px;width:157px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#14b1a6">
                                <w:anchorlock/>
                                <v:textbox inset="0px,0px,0px,0px">
                                <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
                                <![endif]-->
                                <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#14b1a6;border-radius:4px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;">Confirm Booking</span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                </div>
                                </td>
                                </tr>
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:25px;">
                                <div style="font-family: sans-serif">
                                <div class="" style="font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #828282; line-height: 1.2;">
                                <p style="margin: 0; text-align: center; font-size: 15px; mso-line-height-alt: 18px;">If there is any mistake or you don't expect this message, just ignore this email</p>
                                <p style="margin: 0; text-align: center; font-size: 15px; mso-line-height-alt: 14.399999999999999px;"> </p>
                                <p style="margin: 0; text-align: center; font-size: 15px; mso-line-height-alt: 14.399999999999999px;"> </p>
                                </div>
                                </div>
                                </td>
                                </tr>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;" width="100%">
                                <tbody>
                                <tr>
                                <td>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #14b1a6; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                <tbody>
                                <tr>
                                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
                                <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:20px;">
                                <div style="color:#ffffff;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:9px;font-weight:400;letter-spacing:1px;line-height:120%;text-align:center;mso-line-height-alt:10.799999999999999px;">
                                <p style="margin: 0; word-break: break-word;">By confirming your email, you ensure that you receive important updates and can access all the features of your account seamlessly. If you have received this email in error, please notify the sender immediately and delete it from your system.</p>
                                <p style="margin: 0; word-break: break-word;"><span style="color: #c0c0c0;"> </span></p>
                                </div>
                                </td>
                                </tr>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
                                <tbody>
                                <tr>
                                <td>
                                <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px; margin: 0 auto;" width="600">
                                <tbody>
                                <tr>
                                <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
                                <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                <tr>
                                <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                <!--[if !vml]><!-->
                                <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;"><!--<![endif]-->
                                <tr>
                                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" style="text-decoration: none;" target="_blank"><img align="center" alt="Beefree Logo" class="icon" height="32" src="images/Beefree-logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="34"/></a></td>
                                <td style="font-family: 'Inter', sans-serif; font-size: 15px; font-weight: undefined; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="http://designedwithbeefree.com/" style="color: #1e0e4b; text-decoration: none;" target="_blank">Designed with Beefree</a></td>
                                </tr>
                                </table>
                                </td>
                                </tr>
                                </table>
                                </td>
                                </tr>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table>
                                </td>
                                </tr>
                                </tbody>
                                </table><!-- End -->
                                </body>
                                </html>
                        """

        mensaje.attach(MIMEText(contenido_html, 'html'))

        # Obtener la ruta absoluta de la imagen
        ruta_imagen = join(abspath('src/front/img'), 'docdate_logo.png')

        # Agregar la imagen como un archivo adjunto y referenciarla en el contenido HTML
        with open(ruta_imagen, 'rb') as imagen_file:
            imagen_adjunta = MIMEImage(imagen_file.read())
            imagen_adjunta.add_header('Content-ID', '<imagen_id>')
            mensaje.attach(imagen_adjunta)

        mensaje_codificado = base64.urlsafe_b64encode(mensaje.as_bytes())
        mensaje_codificado = mensaje_codificado.decode('utf-8')

        servicio_gmail.users().messages().send(userId='me', body={'raw': mensaje_codificado}).execute()

        print("Correo enviado exitosamente")
    except Exception as e:
        print(f'Error al enviar el correo: {str(e)}')

@api.route('/mail/<int:proid>/<int:bookingid>', methods=['POST'])
def endpoint_enviar_correo(proid, bookingid):
    pro = Pros.query.get(proid)
    data = request.json
    booking = Bookings.query.get(bookingid)
    final_booking = booking.serialize()
    print(final_booking)
    pro_data = {
        "name": pro.name,
        "lastname": pro.lastname,
        "email": pro.email,
        "google_access_token": pro.google_access_token,
        "google_refresh_token": pro.google_refresh_token,
        "google_access_expires":pro.google_access_expires
    }
    print(pro_data)
    service_name = final_booking["service_name"]
    date = final_booking["date"]
    starting_time = final_booking["starting_time"]
    
    receiver = data.get('receiver')
    subject = data.get('subject')

    if not receiver or not subject or not pro or not booking:
        return jsonify({'error': 'Not found'}), 404

    try:
        enviar_correo(receiver, subject, pro_data, service_name, date, starting_time)
        return jsonify({'mensaje': 'Correo enviado exitosamente'})
    except Exception as e:
        return jsonify({'error': f'Error al enviar el correo: {str(e)}'}), 500


# Prueba festivos
def get_holidays(year, country):
    if country == "Germany":
        holidays_country = holidays.Germany(years=year, observed=False, language="de")
    elif country == "Spain":
        holidays_country = holidays.Spain(years=year, observed=False, language="es")
    elif country == "France":
        holidays_country = holidays.France(years=year, observed=False, language="fr")
    elif country == "Italy":
        holidays_country = holidays.Italy(years=year, observed=False, language="it")
    elif country == "United Kingdom":
        holidays_country = holidays.UnitedKingdom(years=year, observed=False, language="en")
    elif country == "Portugal":
        holidays_country = holidays.Portugal(years=year, observed=False, language="pt")
    elif country == "Netherlands":
        holidays_country = holidays.Netherlands(years=year, observed=False, language="nl")
    elif country == "Belgium":
        holidays_country = holidays.Belgium(years=year, observed=False, language="nl")
    elif country == "Switzerland":
        holidays_country = holidays.Switzerland(years=year, observed=False, language="de")
    elif country == "Austria":
        holidays_country = holidays.Austria(years=year, observed=False, language="de")
    elif country == "Greece":
        holidays_country = holidays.Greece(years=year, observed=False, language="el")
    elif country == "Sweden":
        holidays_country = holidays.Sweden(years=year, observed=False, language="sv")
    elif country == "Norway":
        holidays_country = holidays.Norway(years=year, observed=False, language="no")
    elif country == "Denmark":
        holidays_country = holidays.Denmark(years=year, observed=False, language="da")
    elif country == "Finland":
        holidays_country = holidays.Finland(years=year, observed=False, language="fi")
    elif country == "Ireland":
        holidays_country = holidays.Ireland(years=year, observed=False, language="en")
    else:
        return []

    return [{"date": date, "holiday": holiday} for date, holiday in sorted(holidays_country.items())]

@api.route('/get_holidays/<int:year>/<string:country>', methods=['GET'])
def api_get_holidays(year, country):
    holidays_list = get_holidays(year, country)
    return jsonify({"holidays": holidays_list})


# LOGIN - authentication - token generation
@api.route("/login", methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    pro = Pros.query.filter_by(email=email, password=password).first()
    if pro:
        access_token = create_access_token(identity=pro.id)
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Wrong email or password"}), 404

#Get google tokens first time
@api.route('/tokens_exchange/<int:proid>', methods=['POST'])
def tokens_exchange(proid):
    auth_code = request.form['code']
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    payload = {
        'code': auth_code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }
    response = requests.post('https://oauth2.googleapis.com/token', data=payload)
    if response.status_code == 200:
        tokens = response.json()
        pro = Pros.query.get(proid)
        seconds = tokens['expires_in'] * 60
        exp_date = datetime.datetime.now() + datetime.timedelta(seconds=seconds)
        exp_date_str = exp_date.strftime('%Y-%m-%dT%H:%M:%S')
        pro.google_access_token = tokens['access_token']
        pro.google_access_expires = exp_date_str
        pro.google_refresh_token = tokens['refresh_token']
        db.session.commit()
        return jsonify({'message': 'Tokens obtenidos exitosamente', 'tokens': tokens}), 200
    else:
        return jsonify({'error': 'Error al obtener tokens', 'status_code': response.status_code}), response.status_code
    
#Get google tokens by pro
@api.route('/pros/<int:proid>/tokens', methods=["GET"])
@jwt_required()
def get_tokens(proid):
    pro = Pros.query.get(proid)
    if pro:
        expires_in = pro.google_access_expires
        access_token = pro.google_access_token
        refresh_token = pro.google_refresh_token
        return jsonify({'access_token': access_token, 'refresh_token': refresh_token, 'expires_in': expires_in}), 200
    else:
        return jsonify({'error': 'pro not found'}), 404
    
#Create Google Event
@api.route('/create-event/<int:proid>', methods=['POST'])
def create_event(proid):
    pro = Pros.query.get(proid)
    event_data = request.json.get("googleEvent") 
    TOKEN_PATH = {
        "token": pro.google_access_token,
        "refresh_token": pro.google_refresh_token,
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "scopes": ["https://www.googleapis.com/auth/calendar"],
        "expiry": pro.google_access_expires
    }
    SCOPES = ['https://www.googleapis.com/auth/calendar']
    creds = Credentials.from_authorized_user_info(TOKEN_PATH, SCOPES)
    service = build('calendar', 'v3', credentials=creds)
    event = event_data
    created_event = service.events().insert(calendarId='primary', body=event).execute()
    event_id = created_event.get('id')
    return jsonify({'event_id': event_id})


# DASHBOARD - get user data to show in the dashboard
@api.route("/dashboard", methods=["GET"])
@jwt_required()
def get_pro_dashboard():  
    current_user = get_jwt_identity()
    return jsonify(logged_in_as = current_user), 200

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
        if 'working_day' not in data or 'starting_hour_morning' not in data or 'ending_hour_morning' not in data or 'pro_id' not in data:
            return jsonify({"message": "all data are required"}), 400
        new_hour = Hours(working_day=data.get('working_day'),
                         starting_hour_morning=data.get('starting_hour_morning'),
                         ending_hour_morning=data.get('ending_hour_morning'),
                         starting_hour_after=data.get('starting_hour_after'),
                         ending_hour_after=data.get('ending_hour_after'),
                         location_id=data.get('location_id'),
                         pro_id=data.get('pro_id'))
        db.session.add(new_hour)
        db.session.commit()
        return jsonify({"message": "Record added successfully"}), 201


# Get and delete all records in the 'hours' table by 'pro_id'
@api.route("/pros/<int:proid>/hours", methods=['GET', 'Delete'])
def specific_pro_hour(proid):
    if request.method == 'GET':
        hours_by_pro = Hours.query.filter_by(pro_id=proid).all()
        if not hours_by_pro:
            return jsonify({"message": "Record not found"}), 404
        if request.method == 'GET':
            serialized_hours = [hour.serialize() for hour in hours_by_pro]
            return jsonify(serialized_hours), 200
    if request.method == 'DELETE':
        pro = Pros.query.get(proid)
        if pro:
            hours_to_delete = Hours.query.filter_by(pro_id=pro.id).all()
            for hour in hours_to_delete:
                db.session.delete(hour)
            db.session.commit()
            return jsonify({"message": "Hours deleted"}), 200
    
# Get all records in the 'hours' table by 'location_id'
@api.route("/locations/<int:locationid>/hours", methods=['GET'])
def specific_location_hour(locationid):
    hours_by_location = Hours.query.filter_by(location_id=locationid).all()
    if not hours_by_location:
        return jsonify({"message": "Record not found"}), 404
    if request.method == 'GET':
        serialized_hours = [hour.serialize() for hour in hours_by_location]
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
        hour.starting_hour_morning = data.get('starting_hour_morning', hour.starting_hour_morning)
        hour.ending_hour_morning = data.get('ending_hour_morning', hour.ending_hour_morning)
        hour.starting_hour_after = data.get('starting_hour_after', hour.starting_hour_after)
        hour.ending_hour_after = data.get('ending_hour_after', hour.ending_hour_after)
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
        try:   
            # Check if the required fields are present in the request
            if 'name' not in data or 'lastname' not in data or 'email' not in data:
                return jsonify({"message": "Name, lastname, and email are required"}), 400
            new_patient = Patients(name=data['name'],
                                lastname=data['lastname'],
                                email=data['email'],
                                phone=data.get('phone'))
            db.session.add(new_patient)
            db.session.commit()
            return jsonify(new_patient.serialize()), 201
        except IntegrityError as e:
            if 'violates unique constraint "patients_email_key"' in str(e.orig):
                return jsonify({'error': 'duplicated_email'}), 400
        finally:
            db.session.close()

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
        return jsonify(patient.serialize()), 200
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
    
# Get patient by email
@api.route("/patients/<string:patient_email>", methods=["GET"])
def get_patient_by_emial(patient_email):
    patient = Patients.query.filter_by(email=patient_email).first()
    if not patient:
        return jsonify({"error": "patient not found"}), 404
    if request.method == 'GET':
        return jsonify(patient.serialize()), 200



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
                               pro_service_id=data['pro_service_id'],
                               patient_id=data['patient_id'],
                               pro_notes=data.get('pro_notes'),   # using .get method begause we can set default value
                               patient_notes=data.get('patient_notes'))  # using .get method begause we can set default value
        db.session.add(new_booking)
        db.session.commit()
        return jsonify(new_booking.serialize()), 201

      
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
        return jsonify(booking.serialize()), 200


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
            pro_id=data['pro_id'],
            time_zone=data.get('time_zone')
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
        location.pro_id = data.get('pro_id', location.pro_id)
        location.time_zone = data.get('time_zone', location.time_zone)
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
        try:
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
        except IntegrityError as e:
            db.session.rollback()
            if 'violates unique constraint "pros_email_key"' in str(e.orig):
                return jsonify({'error': 'duplicated_email'}), 400
            if 'violates unique constraint "pros_bookingpage_url_key"' in str(e.orig):
                return jsonify({'error': 'duplicated_username'}), 400
        finally:
            db.session.close()
        
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
        pro.google_access_token = data.get('google_access_token', pro.google_access_token)
        pro.google_access_expires = data.get('google_access_expires', pro.google_access_expires)
        pro.google_refresh_token = data.get('google_refresh_token', pro.google_refresh_token)
        pro.title = data.get('title', pro.title)
        db.session.commit()
        return jsonify(pro.serialize()), 200
    if request.method == 'DELETE':
        db.session.delete(pro)
        db.session.commit()
        return jsonify({"message": "pro deleted successfully"}), 200
    
# Get a pro by username
@api.route("/pros/<string:username>", methods=["GET"])
def get_pro_by_username(username):
    pro = Pros.query.filter_by(bookingpage_url=username).first()
    if not pro:
        return jsonify({"message": "pro not found"}), 404
    if request.method == 'GET':
        return jsonify(pro.serialize()), 200
    

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
                                     duration=data['duration'],
                                     price=data.get('price'),
                                     activated=data.get('activated'))
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
        pro_service.duration = data.get('duration', pro_service.duration)
        pro_service.activated = data.get('activated', pro_service.activated)
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

# Get Service by proservice_id in booking
@api.route("/bookings/<int:proserviceid>/services", methods=["GET"])
def handle_service_by_booking(proserviceid):
    service_by_booking = Services.query.join(ProServices).join(Bookings).filter_by(pro_service_id=proserviceid).first()
    if not service_by_booking:
        return jsonify({"message": "No records found for the specified pro_id"}), 404
    """ serialized_services = [service.serialize() for service in pro_service_by_booking] """
    print("--------------------", service_by_booking)
    return jsonify(service_by_booking.serialize()), 200

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
                                        ending_hour=data.get('ending_hour'),
                                        title=data.get("title"),
                                        type=data.get("type"))
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
        inactivity_day.title = data.get('title', inactivity_day.title)
        inactivity_day.type = data.get('type', inactivity_day.type)
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


