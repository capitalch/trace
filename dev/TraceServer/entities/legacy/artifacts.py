# from os import stat, path
import datetime
from flask import Blueprint, request, render_template, jsonify
from flask_weasyprint import HTML, render_pdf
import simplejson as json
from urllib.parse import unquote, urljoin
from copy import deepcopy
from postgres import execSql
from loadConfig import cfg
from entities.legacy import messages
from entities.legacy.sql import allSqls
from entities.legacy.utils import saveBillsAndSms, processDataForPdf
from entities.accounts.artifactsHelper import bulkGenericUpdateMasterDetailsHelper

trackApp = Blueprint('trackApp', __name__,
                     template_folder='templates', static_folder='static', static_url_path='/track/view/css')

# Saves the sale bill in database postgres and send ths SMS to customer


@trackApp.route('/track/save-bill-sms', methods=['POST'])
def track_save_bill_and_sms():
    dataList = request.get_json()
    ret = saveBillsAndSms(dataList)
    return(jsonify(ret), 200)

@trackApp.route('/track/view/<billNoHash>', methods=['GET'])
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
    bulkGenericUpdateMasterDetailsHelper(dbName, buCode, valueData, pointId)
    delta = (datetime.datetime.now() - startTime)/60
    print(delta, ' Mins')
    return('Ok')
