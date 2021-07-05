# from components.export import handle_export
from tkinter import messagebox
from os import path
from tkinter.constants import DISABLED, NORMAL
import simplejson as json
from threading import Thread
from multiprocessing.dummy import Process
import requests
import pyodbc
from tkinter import messagebox
from sql import sqls
from messages import messages
from link_client import connectToLinkServer, onReceiveData


class Config:
    def __init__(self):
        config = self.get_config()
        env = config['env']

        self.url = config[env]['url']
        self.linkServerUrl = config[env]['linkServerUrl']
        self.service_mapping = config['service']['mapping']
        self.connString = f'DSN=service'
        self.urlForCashSaleIds = config['service']['urlForCashSaleIds']
        self.urlForExportServiceSale = config['service']['urlForExportServiceSale']
        self.linkServerKey = config['linkServerKey']
        subject, sio = connectToLinkServer(
            self.linkServerUrl, token=self.linkServerKey)

        self.sio = sio

    def get_config(self):
        with open('config.json', 'r') as config_file:
            config = json.load(config_file)
        return(config)

config = Config()

def fetch_local_data(sql_key, *args):  # returns tuple of dictionary
    sql = sqls[sql_key]
    data_tuple_of_dictionary = []
    try:
        with pyodbc.connect(config.connString) as conn:
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

def get_local_company_id():
    sql = sqls['service-get-company-id']
    company_id = None
    try:
        with pyodbc.connect(config.connString) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql).fetchone()
                if(result and len(result) == 1):
                    company_id = result[0]
    except(Exception) as error:
        messagebox.showerror('Error', messages.get('serviceDatabaseError'))
        raise error
    finally:
        return(company_id)

def get_cash_and_sale_account_ids(mapping):
    baseUrl = config.url
    urlForCashSaleIds = config.urlForCashSaleIds

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

def do_export(temp_label, export_button):
    try:
        company_id = get_local_company_id()
        if(company_id):
            mapping = config.service_mapping[company_id]
        else:
            raise Exception(messages.get('companyIdError'))

        service_receipts = fetch_local_data(
            'service-get-sale-receipts', '2020-04-01', '2020-06-11')

        cashAccountId, saleAccountId = get_cash_and_sale_account_ids(mapping)

        finYear = 2021

        metaData = {'dbName': mapping.get('database'),
                    'buCode': mapping.get('buCode'),
                    'branchId': 1,
                    'finYearId': finYear,
                    'pointId': config.sio.pointId
                    }
        payloadData = [get_reshaped_data(item, finYear=finYear, cashAccountId=cashAccountId, mapping=mapping,
                                         saleAccountId=saleAccountId) for item in service_receipts]
        payload = {'meta': metaData, 'data': payloadData}
        print('id:', config.sio.pointId)
        baseurl = config.url
        urlExport = config.urlForExportServiceSale
        url = ''.join([baseurl, '/', urlExport])

        def handle_feedback(m, data, sourcePointId):
            temp_label.config(text=data)
            if(m == 'COMPLETED'):
                export_button.config(state=NORMAL)

        onReceiveData(handle_feedback)

        thread = Thread(target=updateServerSync,
                        args=(url, payload), daemon=True)
        thread.start()
        export_button.config(state=DISABLED)

    except(Exception) as error:
        messagebox.showerror('Error', error)

def updateServerSync(url, payload):
    requests.post(url=url, json=payload)

def get_reshaped_data(obj, **args):
    mapping = args['mapping']
    hsn = mapping['hsn']
    productId = mapping['productId']
    gstRate = mapping['gstRate']
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
# loop = temp_label.loop
# loop.run_until_complete(update_status())
# asyncio.run(update_status())
# tr = Thread(t
# tr = Process(target=update_status)
# tr.start()
# temp_label.set(data)
# temp_label.after(100, update_status)
# temp_label['text'] = data
# temp_label.update()
# temp_label.pack()

# await session.post(url=url, data = payloadData)
# async def updateServer(url, payload):
#     payloadData = json.dumps(payload).encode()
#     async with aiohttp.ClientSession() as session:
#         async with session.post(url=url, data=payloadData) as response:
#             print(await response.text())
#             return

# requests.post(url=url, json=payload)
    # loop = temp_label.loop
    # loop.run_until_complete(asyncio.gather(updateServer(url, payload)))
    # x = asyncio.gather()
    # asyncio.run(updateServer(url, payload))
    # fut = asyncio.run_coroutine_threadsafe(updateServer(url, payload), loop)
    # fut.result(100)
