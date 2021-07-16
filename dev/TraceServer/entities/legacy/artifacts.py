# from os import stat, path
import datetime
from flask import Blueprint, request, render_template, jsonify
from flask_weasyprint import HTML, render_pdf
import simplejson as json
from urllib.parse import unquote, urljoin
from copy import deepcopy
from postgres import execSql, genericView, getConnectionCursor
from loadConfig import cfg
from entities.legacy import messages
from entities.legacy.sql import allSqls
from entities.accounts.sql import allSqls as allSqls1
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


@trackApp.route('/service/cash-and-sale-account-ids', methods=['POST'])
def service_cash_sale_account_ids():
    data = request.get_json()

    args = {
        'schema': data.get('schema'),
        'saleAccountCode': data.get('saleAccountCode'),
        'cashAccountCode': data.get('cashAccountCode')
    }
    result = execSql(data.get('database'), allSqls.get(
        'get-cash-sale-account-ids'), args, isMultipleRows=False)
    return(result, 200)


@trackApp.route('/service/export-service-sale', methods=['POST'])
def import_service_sale():
    print('started')
    startTime = datetime.datetime.now()
    payload = request.data
    jsonString = unquote(payload)
    jsonPayload = json.loads(jsonString)
    valueData = jsonPayload.get('data')

    meta = jsonPayload.get('meta')
    dbName = meta.get('dbName')
    buCode = meta.get('buCode')
    pointId = meta.get('pointId')
    bulkGenericUpdateMasterDetailsHelper(dbName, buCode, valueData, pointId)
    delta = (datetime.datetime.now() - startTime)/60
    print(delta, ' Mins')
    return('Ok', 200)


@trackApp.route('/service/get-extended-warranty-customers', methods=['POST'])
def get_extended_warranty_customers():
    sql = allSqls.get('get-extended-warranty-customers')
    res = {}
    status = 200
    try:
        result = genericView(dbName='postgres', sqlString=sql,
                             valueDict={'args': {'daysOver': 2}})
        res = json.dumps(result, default=str)
    except(Exception) as error:
        res = json.dumps({"error": error.args[0] or repr(error)})
        status = 500
    finally:
        return(res, status)


@trackApp.route('/service/upload-extended-warranty-customers', methods=['POST'])
def upload_extended_warranty_customer():
    try:
        def getArgsDict(item):
            return({
                "ascCode": item["ASC Code"],
                "custName": item["Customer Name"],
                "mobileNo": item["Mobile No"],
                "address": item["Address"],
                "pin": item["Postal Code"],
                "purchDate": item["Purchased Date"],
                "warrantyType": item["Warranty Type"],
                "warrantyCategory": item["Warranty Category"],
                "productCategory": item["Product category name"],
                "productSubCategory": item["Product sub category name"],
                "modelCode": item["Set Model"],
                "modelName": item["Model Name"],
                "serialNumber": item["Serial No"]
            })

        payload = request.json
        sql = allSqls['upsert-extended-warranty-customer']
        connection, cursor, pool = getConnectionCursor(dbName='postgres')
        sqlListWithArgs = [(sql, getArgsDict(item)) for item in payload]
        with connection:
            with cursor:
                for entry in sqlListWithArgs:
                    cursor.execute(entry[0], entry[1])
        return('Ok', 200)
    except(Exception) as error:
        print(error)
