import zlib
import requests
from loadConfig import cfg
from os import path


def getRoomFromCtx(ctx):
    clientId, buCode, finYearId, branchId = ctx.get('clientId'), ctx.get(
        'buCode'), ctx.get('finYearId'), ctx.get('branchId')
    room = f'{str(clientId)}:{buCode}:{finYearId}:{branchId}'
    return(room)


def traceSendSmsForBill(options):
    mobileNumber = options.get('mobileNumber')
    id = options.get('id')
    hashOfId = str(zlib.crc32(bytes(str(id), 'utf8')))
    env = cfg['env']
    viewUrl = path.join(
        cfg[env]['url'], cfg['sms']['trace']['view'], hashOfId).replace('\\', '/')

    apiUrl = cfg['sms']['trace']['api']
    dltConfig = cfg['sms']['trace']['traceDlt']
    headers = {
        "authorization": cfg['sms']['trace']['key'],
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
    }
    company = 'capital investments'
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

    response = requests.request('POST', apiUrl, data=jsonBody, headers=headers)
    print(response)
