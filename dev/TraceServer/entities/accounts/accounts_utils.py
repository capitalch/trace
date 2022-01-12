import zlib
import base64
import requests
import demjson as djson
from loadConfig import cfg
from os import path


def getRoomFromCtx(ctx):
    clientId, buCode, finYearId, branchId = ctx.get('clientId'), ctx.get(
        'buCode'), ctx.get('finYearId'), ctx.get('branchId')
    room = f'{str(clientId)}:{buCode}:{finYearId}:{branchId}'
    return(room)


def traceSendSmsForBill(options):
    ret = False
    try:
        dbName = options.get('dbName')
        buCode = options.get('buCode')
        mobileNumber = options.get('mobileNumber')
        id = options.get('id')
        payload = f'dbName:{dbName},buCode:{buCode},id:{id}'
        encodedPayload = base64.urlsafe_b64encode(payload.encode()).decode()
        # json = {
        #     'dbName': options.get('dbName'),
        #     'buCode': options.get('buCode'),
        #     'id': options.get('id')
        # }
        # encoded = djson.encode(json)
        # encodedId = base64.b85encode(encoded.encode('ascii')).decode('ascii')
        env = cfg['env']
        viewUrl = path.join(
            cfg[env]['url'], cfg['sms']['trace']['view'], encodedPayload).replace('\\', '/')

        apiUrl = cfg['sms']['trace']['api']
        dltConfig = cfg['sms']['trace']['traceDlt']
        headers = {
            "authorization": cfg['sms']['trace']['key'],
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache"
        }
        company = 'capital'
        jsonBody = {
            "route": dltConfig['route'],
            "sender_id": dltConfig['senderId'],
            "message": f"Thanks for purchasing from {company}. See your bill here {viewUrl} - Capital",
            "template_id": dltConfig['templateId'],
            "entity_id": dltConfig['entityId'],

            "language": "english",
            "flash": 0,
            "numbers": mobileNumber # '9831052332'  # itemData.get('mobile'),
        }

        # response = requests.request('POST', apiUrl, data=jsonBody, headers=headers)
        # respString = response.text
        # respObj = djson.decode(respString)
        # result = respObj.get('return')
        # if(result):
        #     ret = True
    except(Exception) as error:
        print(error)
    return(ret)
