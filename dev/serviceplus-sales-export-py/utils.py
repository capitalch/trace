from tkinter import messagebox
from os import path
import simplejson as json
from urllib.parse import quote
import html
import re
import requests
import pyodbc
from tkinter import messagebox
from sql import sqls
from messages import messages

meta = {
    'connString': f'DSN=service'
}


def get_config():
    with open('config.json', 'r') as config_file:
        config = json.load(config_file)
    return(config)


config = get_config()


def fetch_local_data(sql_key, *args):  # returns tuple of dictionary
    sql = sqls[sql_key]
    data_tuple_of_dictionary = []
    try:
        with pyodbc.connect(meta['connString']) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql, args).fetchall()
                descriptions = cursor.description  # column names, tuple of tuples
                desc_tuple = tuple([item[0] for item in descriptions])
                data_tuple_of_dictionary = tuple(
                    dict(zip(desc_tuple, item)) for item in result)
    except(Exception) as error:
        messagebox.showerror(title='Service+ database error', message=error)
        raise error
    finally:
        return(data_tuple_of_dictionary)


def populate_meta():
    sql = sqls['service-get-company-id']
    # company_id = ''
    # mapped_database = None
    try:
        with pyodbc.connect(meta['connString']) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql).fetchone()
                if(result and len(result) == 1):
                    company_id = result[0]
                    meta['company_id'] = company_id  # result is a tuple
                    meta['mapping'] = config.get('service').get(
                        'mapping').get(company_id)
                    meta['base_url'] = config[config['env']].get('url')
                else:
                    raise Exception()

    except(Exception) as error:
        messagebox.showerror('Error', messages.get('serviceDatabaseError'))
        raise error


def get_cash_and_sale_account_ids():
    baseUrl = meta.get('base_url')
    urlForCashSaleIds = config.get('service').get('urlForCashSaleIds')
    mapping = meta.get('mapping')
    payload = {
        'database': mapping.get('database'),
        'schema': mapping.get('buCode'),
        'saleAccountCode': mapping.get('saleAccountCode'),
        'cashAccountCode': mapping.get('cashAccountCode')
    }
    endPoint = path.join(baseUrl, urlForCashSaleIds).replace('\\', '/')
    result = requests.post(endPoint, json=payload)
    data = result.json()
    cashAccountId, saleAccountId = data.values()
    return cashAccountId, saleAccountId


def do_export():
    try:
        populate_meta()

        service_receipts = fetch_local_data(
            'service-get-sale-receipts', '2020-04-01', '2020-06-11')

        cashAccountId, saleAccountId = get_cash_and_sale_account_ids()

        finYear = 2021
        mapping = meta.get('mapping')
        metaData = {'dbName': mapping.get('database'),
                    'buCode': mapping.get('buCode'),
                    'branchId': 1,
                    'finYearId': finYear,
                    'pointId': '1234'
                    }
        payloadData = [get_reshaped_data(item, finYear=finYear, cashAccountId=cashAccountId,
                                         saleAccountId=saleAccountId) for item in service_receipts]
        payload = {'meta': metaData, 'data': payloadData}
        payloadStr = json.dumps(payload)
        # payloadBytes = payload.encode()
        # payload = quote(payloadBytes)
        payload = payloadStr.encode()
        baseurl = meta.get('base_url')
        urlExport = config['service']['urlForExportServiceSale']
        url = ''.join([baseurl, '/', urlExport])
        requests.post(url=url, json=payload)
        z = 0

    except(Exception) as error:
        print(error)
    finally:
        pass


def get_reshaped_data(obj, **args):
    mpp = meta['mapping']
    gst_rate = mpp['gstRate']
    hsn = mpp['hsn']
    productId = mpp['productId']
    gstRate = mpp['gstRate']
    finYear = args['finYear']
    cashAccountId = args['cashAccountId']
    saleAccountId = args['saleAccountId']
    amount = obj.get('rec_amt')
    recDate = obj.get('rec_date').strftime("%Y-%m-%d")

    gst = (float(amount) * (gstRate / 100)) / (1 + gstRate / 100)
    cgst = round((gst / 2), 2)
    sgst = cgst
    igst = 0
    temp = {
        "tableName": "TranH",
        "data": [{
            "tranDate": recDate,
            "jData": None,
            "finYearId": finYear,
            "remarks": f'Service+ job no: {obj.get("job_no")}',
            "userRefNo": obj.get('rec_no'),
            "branchId": 1,
            "posId": "1",
            "tranTypeId": 4,
            "details": {
                "tableName": "TranD",
                "fkeyName": "tranHeaderId",
                "data": [
                    {
                            "accId": saleAccountId,
                            "dc": "C",
                            "amount": amount,
                            "details": [
                                {
                                    "tableName": "ExtGstTranD",
                                    "fkeyName": "tranDetailsId",
                                    "data": [
                                        {
                                            "gstin": obj.get('other_info'),
                                            "cgst": cgst,
                                            "sgst": sgst,
                                            "igst": igst,
                                            "isInput": False
                                        }
                                    ]
                                },
                                {
                                    "tableName": "SalePurchaseDetails",
                                    "fkeyName": "tranDetailsId",
                                    "data": [
                                        {
                                            "productId": productId,
                                            "qty": 1,
                                            "priceGst": amount,
                                            "discount": 0,
                                            "amount": amount,
                                            "gstRate": gstRate,
                                            "cgst": cgst,
                                            "sgst": sgst,
                                            "igst": 0,
                                            "hsn": hsn
                                        }
                                    ]
                                }
                            ]
                    },
                    {
                        "accId": cashAccountId,
                        "dc": "D",
                        "amount": amount,
                        "remarks": "Service+ sale"
                    }
                ]
            }
        }]
    }
    return(temp)


# messages = get_messages()
