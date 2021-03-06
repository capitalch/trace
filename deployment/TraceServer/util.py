import re
from inspect import isclass
from allMessages import errorMessages
import random
import string
import bcrypt
from flask_mail import Mail, Message
from loadConfig import cfg

mail = None

def setMailConfig(app):
    global mail
    mailSettings = cfg['mailSettings']
    app.config.update(
	# DEBUG=True,
	#EMAIL SETTINGS
	MAIL_SERVER= mailSettings['mailServer'], #'smtp.gmail.com'
	MAIL_PORT=mailSettings['port'],
	MAIL_USE_SSL=True,
    MAIL_DEFAULT_SENDER = mailSettings['mailDefaultSender'],
	MAIL_USERNAME = mailSettings['userName'],
	MAIL_PASSWORD = mailSettings['password']
	)
    mail = Mail(app)

def extractAmount(s):
    remList = [',','%u20B9', ' '] # The Rs symbol
    for i in remList:
        s = s.replace(i,'')
    return s

def getErrorMessage(key='generic', error=None):
    if error is None:
        mess = errorMessages[key]
    elif isinstance(error, Exception):
        if hasattr(error, 'pgcode'): # suppress postgresql specific error message
            mess = errorMessages[key] # if pgcode is there in error object that means it is generated from postgres, so replace it with generic message
        else:
            mess = error # retain the error message
    else:
        mess = error
    return mess

def randomStringGenerator(strSize, allowedChars):
    return ''.join(random.choice(allowedChars) for x in range(strSize))

def getRandomUserId():
    return randomStringGenerator(8, string.ascii_letters + string.digits)

# password having special char, digit, Capital, small letter
def getRandomPassword():
    return f'@A1{randomStringGenerator(9, (string.ascii_letters + string.punctuation + string.digits))}b'

def getPasswordHash(pwd):
    interm = pwd.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    pwdHash = bcrypt.hashpw(interm, salt).decode('utf-8')
    return pwdHash

def getschemaSearchPath(buCode):
    searchPathSql = '' if buCode=='public' else f'set search_path to {buCode}'
    return searchPathSql

def sendMail(recipients, message, htmlBody):
    try:
        msg = Message(message,
        # sender="capitalch2@gmail.com",
        recipients= recipients) #["capitalch@gmail.com", "sagarwal@netwoven.com"]
        # msg.body = body
        msg.html = htmlBody
        mail.send(msg)
        return True
    except (Exception) as e:
        return False

# bcrypt.hashpw(password.encode(), bcrypt.gensalt())
# pwd = 'superAdmin'.encode('utf-8')
# salt = bcrypt.gensalt(rounds=12)
# pwdHash = bcrypt.hashpw(pwd,salt).decode('utf-8')
# # b'$2b$12$nAXGJ.Ji5v0vXl5NAScIQuSdbjIPehLGjGGcatY7NHZK4Nnxf0i7a'
# print(pwdHash)
# hashed = '$2b$12$MlC4/PqV2OoD8.Csg2ode.jBjVvi6fkeNO5GF9hdq8yzVxZHmVBJ6'
# if bcrypt.checkpw('superAdmin'.encode('utf-8'), hashed.encode('utf-8')):
#     print("match")
# else:
#     print("does not match")