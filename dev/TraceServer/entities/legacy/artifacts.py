# from os import stat, path
import datetime
import re
import cairosvg
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


@trackApp.route('/service/upload-extended-warranty-customers', methods=['POST'])
def upload_extended_warranty_customer():
    try:
        payload = request.json
        sql = allSqls['upsert-extended-warranty-customer']
        for item in payload:
            args = {
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
                "serialNumber": item["Serial No"],
                # "hasWarrantyPurchased": False,
                # "jData": None
            }
            execSql('postgres', sql, args, isMultipleRows=False)

    except(Exception) as error:
        print(error)
    return('Ok', 200)
