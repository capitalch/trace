import requests
from loadConfig import cfg

def sendSms(mess, mobile):
    url = cfg['sms']['api']
    headers = {
        "authorization": cfg['sms']['key'],
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
    }
    
    jsonBody = {
        "route": "q",
        "message": mess,
        "language": "english",
        "flash": 0,
        "numbers": mobile,
    }
    response = requests.post( url=url, headers=headers, data=jsonBody)
    return(True)