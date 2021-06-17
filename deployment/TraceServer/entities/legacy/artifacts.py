from os import stat, path
import datetime
from flask import Blueprint, request, render_template
from flask_weasyprint import HTML, render_pdf
import simplejson as json
import demjson as djson
import zlib
from urllib.parse import unquote, urljoin
from copy import deepcopy
from postgres import execSql
from loadConfig import cfg

from entities.legacy import messages
from entities.legacy.sql import allSqls
from entities.legacy.utils import processDataForPdf, sendDltSms, sendSms

from entities.accounts.artifactsHelper import bulkGenericUpdateMasterDetailsHelper

trackApp = Blueprint('trackApp', __name__,
                     template_folder='templates', static_folder='static', static_url_path='/track/view/css')

# Saves the sale bill in database postgres and send ths SMS to customer


@trackApp.route('/track/save-bill', methods=['POST'])
def track_save_bill():
    data = request.get_json()
    if data is not None:
        billNo = data.get('ref_no', None)
        billNoHash = str(zlib.crc32(bytes(billNo, 'utf8'))
                         )  # str(hash(billNo))
        args = {
            'billNoHash': billNoHash,
            'jData': json.dumps(data),
            'billNo': billNo
        }
    if billNo is None:
        raise Exception(messages.errorMessages.get('billNoNotFound'))
    else:
        out = execSql('postgres', allSqls.get(
            'upsert-sale-bill'), args, isMultipleRows=False)
        smsTemplate = messages.infoMessages['sms-template']
        env = cfg['env']
        url = urljoin(cfg[env]['url'], cfg["sms"]["view"]) + '/' + billNoHash
        smsMessage = smsTemplate(data, url)
        mobile = data['mobile']
        # response = sendSms(smsMessage, '9831052332')
        # 8017194266
        response = sendDltSms(url, '9831052332')
        resString = str(response.content, 'utf8')
        resObj = djson.decode(resString)
        result = resObj.get('return')
        message = resObj.get('message')
        if result == True:
            return(messages.infoMessages['data-saved-sms-sent'], 200)
        else:
            raise Exception(message)


@trackApp.route('/view/<billNoHash>', methods=['GET'])
def track_view_bill(billNoHash):
    args = {
        'billNoHash': billNoHash
    }
    result = execSql('postgres', allSqls.get(
        'get-sale-bill'), args, isMultipleRows=False)
    jData = result['jData']
    cp = deepcopy(jData)
    processDataForPdf(cp)

    html = render_template('bill.html', **cp)
    return(render_pdf(HTML(string=html)))


@trackApp.route('/service/cash-sale-account-ids', methods=['POST'])
def service_cash_sale_account_ids():
    data = request.get_json()

    args = {
        'schema': data.get('schema'),
        'saleAccountCode': data.get('saleAccountCode'),
        'cashAccountCode': data.get('cashAccountCode')
    }
    result = execSql(data.get('database'), allSqls.get(
        'get-cash-sale-account-ids'), args, isMultipleRows=False)
    return(result)


@trackApp.route('/service/import-service-sale', methods=['POST'])
def import_service_sale():
    print('started')
    startTime = datetime.datetime.now()
    payload = request.data
    payload = unquote(payload)
    jsonPayload = json.loads(payload)
    valueData = jsonPayload.get('data')

    meta = jsonPayload.get('meta')
    dbName = meta.get('dbName')
    buCode = meta.get('buCode')
    pointId = meta.get('pointId')
    # socketId = meta.get('socketId')
    bulkGenericUpdateMasterDetailsHelper(dbName, buCode, valueData, pointId)
    delta = (datetime.datetime.now() - startTime)/60
    print(delta, ' Mins')
    return('Ok')


# valueData = djson.decode(payload)['data']

# valueData = jsonPayload.get('data')
# def apply(a):
#     return(djson.decode(a))
# temp = map(apply,valueData)
# valueData = list(temp)
