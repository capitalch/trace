import requests
import asyncio
import aiohttp
import time
from os import path
import simplejson as json
import demjson as djson
import zlib
from urllib.parse import urljoin
from datetime import datetime
from babel.numbers import format_currency
from loadConfig import cfg
from entities.legacy import messages
from entities.legacy.sql import allSqls
from postgres import execSql, execSqls
from util import sendMail


def sendSelfMailForExtendedWarrCust(data):
    def getHtmlForExtendedWarrMail(data):
        html = f'''
        <table style = 'width: 100%; font-size: 14px; '>
        <thead>
            <tr>
            <th style = 'border-width: 2px;border-color: #ffcc00;border-style: solid;padding: 3px;text-align: left; width: 100px'>Name</th>
            <th style = 'border-width: 2px;border-color: #ffcc00;border-style: solid;padding: 3px;text-align: left;width: 300px'>Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Id</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>{data['id']}</td>
            </tr>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Purch date:</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>{data['purchDate']}</td>
            </tr>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Cust name:</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>{data['custName']}</td>
            </tr>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Mobile no:</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px; color:red; font-weight: bold; font-size: 16px'>{data['mobileNo']}</td>
            </tr>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Product cat:</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>{data['productCategory']}</td>
            </tr>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Serial no:</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>{data['serialNumber']}</td>
            </tr>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Address:</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>{data['address']}</td>
            </tr>
            <tr>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>Pin:</td>
            <td style='border: 1px solid #ffcc00; border-collapse: collapse;padding: 5px;'>{data['pin']}</td>
            </tr>
        </tbody>
        </table>'''
        return(html)

    html = getHtmlForExtendedWarrMail(data)
    mailSetting = cfg["sms"]['extendedWarrantyMail']
    sendMail(['capitalch@gmail.com'], mailSetting.get('subject') or 'New customer', html)

def saveBillsAndSms(dataList):
    if((dataList is None) or (len(dataList) == 0)):
        raise Exception(messages.errorMessages.get('noData'))

    def prepareSql(index, data):
        billNo = data.get('ref_no')
        if billNo is None:
            raise Exception(messages.errorMessages.get('billNoNotFound'))
        else:
            billNo = str(billNo)
        billNoHash = str(zlib.crc32(bytes(billNo, 'utf8')))
        args = {
            'billNoHash': billNoHash,
            'jData': json.dumps(data),
            'billNo': billNo
        }
        sql = allSqls.get('upsert-sale-bill')
        return((index, sql, args, data))

    def getListOfManySmsAndData(listOfViewUrlsAndData):
        # list of tuples of format [(apiUrl, headers, data1), (apiUrl, headers, data2) ...]
        apiUrl = cfg['sms']['api']
        dltConfig = cfg['sms']['trackDlt']
        # company = 'Capital Chowringhee Pvt Ltd'

        headers = {
            "authorization": cfg['sms']['key'],
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache"
        }
        out = []
        for item in listOfViewUrlsAndData:
            viewUrl = item[0]
            itemData = item[1]
            company = itemData.get('companyInfo')['comp_name']
            jsonBody = {
                "route": dltConfig['route'],
                "sender_id": dltConfig['senderId'],
                "message": f"Thanks for purchasing from {company}. See your bill here {viewUrl} - Capital",
                "template_id": dltConfig['templateId'],
                "entity_id": dltConfig['entityId'],

                "language": "english",
                "flash": 0,
                "numbers": '9831052332'  # itemData.get('mobile'),
            }
            out.append((apiUrl, headers, jsonBody))
        return(out)
    # list of tuples having sql and args
    sqlTupleListAndArgs = [prepareSql(index, data)
                           for index, data in enumerate(dataList)]
    execSqls('postgres', sqlTupleListAndArgs)

    env = cfg['env']

    # view url: The url at which bill can be viewed
    listOfViewUrlsAndData = [[path.join(cfg[env]['url'], cfg["sms"]["view"], item[2].get(
        'billNoHash')).replace('\\', '/'), item[3]] for item in sqlTupleListAndArgs]

    # format of listOfManySmsAndData is [(apiUrl, headers, jsonData) ...],
    # sample: [('https://www.fast2sms.com/dev/bulkV2',
    # {'authorization': 'KoYV0fPpH8uZ2TlMnGs1...ajoHr3Vfp8', 'Content-Type': ...), {'route': 'dlt_manual', 'sender_id': 'CHOWRI', 'message': 'Thanks fo...'}]

    listOfManySmsAndData = getListOfManySmsAndData(listOfViewUrlsAndData)
    t = time.time()

    listResAsync = asyncio.run(sendManySmsAsync(listOfManySmsAndData))
    print('Time taken by async sending:', time.time() - t)
    return(listResAsync)


async def sendManySmsAsync(listOfManySmsAndData):
    async with aiohttp.ClientSession() as session:
        list = [await session.post(url=item[0], headers=item[1], data=item[2]) for item in listOfManySmsAndData]
        listSuccess = []
        for res in list:
            resp = await res.content.read(n=-1)
            respString = str(resp, 'utf8')
            respObj = djson.decode(respString)
            result = respObj.get('return')
            listSuccess.append(result)

        return(listSuccess)  # Response output cannot be list, it can be tuple


def sendManySmsForExtendedWarranty(exlist):
    try:
        def getListOfManySms(elist):
            apiUrl = cfg['sms']['api']
            dltConfig = cfg['sms']['extendedWarrantyDlt']
            headers = {
                "authorization": cfg['sms']['key'],
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache"
            }

            def getUrl(item):
                env = cfg['env']
                url = path.join(
                    cfg[env]['url'], dltConfig['availWarrantyEndPoint'], str(item['id'])).replace('\\', '/')
                return(url)

            def getJsonBody(item):
                mess = dltConfig['message']
                hashUrl = getUrl(item)
                return({
                    "route": dltConfig['route'],
                    "sender_id": dltConfig['senderId'],
                    "message": f"Thanks for purchasing from test company. See your bill here www.test.com - Capital",
                    # "message": mess.format(serialNumber=item['serialNumber'], hashUrl=hashUrl),
                    "template_id": dltConfig['templateId'],
                    "entity_id": dltConfig['entityId'],

                    "language": "english",
                    "flash": 0,
                    "numbers": item['mobileNo']  # '9831052332'
                })

            out = [(apiUrl, headers, getJsonBody(item), item['id'],)
                   for item in elist]
            return(out)

        manySmsListOfTuples = getListOfManySms(exlist)
        resultList = []
        for item in manySmsListOfTuples:
            res = requests.post(url=item[0], headers=item[1], data=item[2])
            respString = res.text
            respObj = djson.decode(respString)
            result = respObj.get('return')
            if(result):  # success
                resultList.append((item[3], True))

        def prepareSql(index, id):
            sql = allSqls['update-extended-warranty-sms-sent']
            return((index, sql, {'id': id}))

        sqlTupleListAndArgs = [prepareSql(index, item[0])
                               for index, item in enumerate(resultList)]
        execSqls('postgres', sqlTupleListAndArgs)

        return(True)
    except(Exception) as error:
        print(error)


def processDataForPdf(cp):
    def formatNumber(num):
        num1 = float(num)
        return(f"{num1:,.2f}")

    # Date format set to dd/mm/yy
    d = datetime.strptime(cp['date'], '%Y-%m-%d')
    cp['date'] = d.strftime('%d/%m/%Y')

    # Format numbers
    cp['cgst'] = formatNumber(cp['cgst'])
    cp['sgst'] = formatNumber(cp['sgst'])
    cp['igst'] = formatNumber(cp['igst'])
    cp['cgstRate'] = formatNumber(cp['cgstRate'])
    cp['sgstRate'] = formatNumber(cp['sgstRate'])
    cp['igstRate'] = formatNumber(cp['igstRate'])

    idx = 0
    cp['subtotal'] = 0
    cp['sumQty'] = 0
    for item in cp['products']:
        item['amount'] = item['qty'] * item['price']
        cp['subtotal'] = cp['subtotal'] + item['amount']
        cp['sumQty'] = cp['sumQty'] + item['qty']
        item['price'] = formatNumber(item['price'])
        item['amount'] = formatNumber(item['amount'])
        idx = idx + 1
        item['index'] = idx

    for item in cp['payments']:
        item['amount'] = formatNumber(item['amount'])

    cp['subtotal'] = formatNumber(cp['subtotal'])
    cp['amountInWords'] = convertToWord(cp['total_amt'])
    # To show Rs symbol and Indian currency formatting
    cp['total_amt'] = format_currency(cp['total_amt'], 'INR', locale='en_IN')

    # escape from None error
    cp['pin'] = cp['pin'] or ''
    cp['email'] = cp['email'] or ''
    cp['gstin'] = cp['gstin'] or ''
    return


def convertToWord(n):

    def num2words(num):
        under_20 = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
                    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
        tens = ['twenty', 'thirty', 'forty', 'fifty',
                'sixty', 'seventy', 'eighty', 'ninety']
        above_100 = {100: 'hundred', 1000: 'thousand',
                     100000: 'lakhs', 10000000: 'crores'}

        if num < 20:
            return under_20[(int)(num)]

        if num < 100:
            return tens[(int)(num/10)-2] + ('' if num % 10 == 0 else ' ' + under_20[(int)(num % 10)])

        # find the appropriate pivot - 'Million' in 3,603,550, or 'Thousand' in 603,550
        pivot = max([key for key in above_100.keys() if key <= num])

        return num2words((int)(num/pivot)) + ' ' + above_100[pivot] + ('' if num % pivot == 0 else ' ' + num2words(num % pivot))

    numString = str(n)

    integerPart = int(numString.split('.')[0])
    if '.' in numString:
        decimalPart = int(numString.split('.')[1])
    else:
        decimalPart = None

    integerPartWord = num2words(integerPart)
    if decimalPart:
        decimalPartWord = ' and paisa ' + num2words(decimalPart)
    else:
        decimalPartWord = ''

    final = 'Rs ' + integerPartWord.capitalize() + decimalPartWord + ' only.'
    return(final)


# loop = asyncio.new_event_loop()
    # asyncio.set_event_loop(loop)

    # loop = asyncio.get_event_loop()
    # group = asyncio.gather(sendManySmsAsync(listOfManySmsAndData))
    # listResAsync = loop.run_until_complete(group)

# def sendManySms(listOfManySmsAndData):
#     list = [requests.post(url=item[0], headers=item[1], data=item[2])
#             for item in listOfManySmsAndData]
#     listSuccess = []
#     for res in list:
#         respString = str(res.content, 'utf8')
#         respObj = djson.decode(respString)
#         result = respObj.get('return')
#         listSuccess.append(result)

#     return(listSuccess)  # Response output cannot be list, it can be tuple

# def saveSmsBill(data):
#     if data is not None:
#         billNo = data.get('ref_no', None)
#         billNoHash = str(zlib.crc32(bytes(billNo, 'utf8'))
#                          )  # str(hash(billNo))
#         args = {
#             'billNoHash': billNoHash,
#             'jData': json.dumps(data),
#             'billNo': billNo
#         }
#     if billNo is None:
#         raise Exception(messages.errorMessages.get('billNoNotFound'))
#     else:
#         out = execSql('postgres', allSqls.get(
#             'upsert-sale-bill'), args, isMultipleRows=False)
#         smsTemplate = messages.infoMessages['sms-template']
#         env = cfg['env']
#         url = urljoin(cfg[env]['url'], cfg["sms"]["view"]) + '/' + billNoHash
#         smsMessage = smsTemplate(data, url)
#         mobile = data['mobile']
#         response = sendDltSms(url, '9831052332')
#         resString = str(response.content, 'utf8')
#         resObj = djson.decode(resString)
#         result = resObj.get('return')
#         message = resObj.get('message')
#         if result == True:
#             return(messages.infoMessages['data-saved-sms-sent'], 200)
#         else:
#             raise Exception(message)


# def sendSms(mess, mobile):
#     url = cfg['sms']['api']
#     headers = {
#         "authorization": cfg['sms']['key'],
#         "Content-Type": "application/x-www-form-urlencoded",
#         "Cache-Control": "no-cache"
#     }

#     jsonBody = {
#         "route": "q",
#         "message": mess,
#         "language": "english",
#         "flash": 0,
#         "numbers": mobile,
#     }
#     response = requests.post(url=url, headers=headers, data=jsonBody)
#     return(response)

# Dlt registration of company and template and header are already done at Jio. The id's are used here. The DLT sms charges are Rs 0.2 at fast2sms.com. The plain non-dlt sms charges ae Rs 1.50.
# The exact message is registered with JIO at https://trueconnect.jio.com/


# def sendDltSms(viewUrl, mobile):
#     url = cfg['sms']['api']
#     dlt = cfg['sms']['dlt']
#     company = 'Capital Chowringhee Pvt Ltd'
#     headers = {
#         "authorization": cfg['sms']['key'],
#         "Content-Type": "application/x-www-form-urlencoded",
#         "Cache-Control": "no-cache"
#     }

#     jsonBody = {
#         "route": dlt['route'],
#         "sender_id": dlt['senderId'],
#         "message": f"Thanks for purchasing from {company}. See your bill here {viewUrl} - Capital",
#         "template_id": dlt['templateId'],
#         "entity_id": dlt['entityId'],
#         "route": dlt['route'],

#         "language": "english",
#         "flash": 0,
#         "numbers": mobile,
#     }
#     response = requests.post(url=url, headers=headers, data=jsonBody)
#     return(response)
