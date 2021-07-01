from tkinter import messagebox
from os import path
import json
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


def fetch_local_data(sql_key, *args): # returns tuple of dictionary
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


def get_mapped_database():
    sql = sqls['service-get-company-id']
    company_id = ''
    mapped_database = None
    try:
        with pyodbc.connect(meta['connString']) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql).fetchone()
                company_id = result[0] # result is a tuple
                meta['company_id'] = company_id
                mapped_database = config.get('service').get(
                    'mapping').get(company_id).get('database')
                meta['mapped_database'] = mapped_database
    except(Exception) as error:
        messagebox.showerror('Error', messages.get('serviceDatabaseError'))
        raise error
    finally:
        return(mapped_database)


def do_export():
    try:
        mapped_database = get_mapped_database()
        service_receipts = fetch_local_data(
            'service-get-sale-receipts', '2020-04-01', '2021-03-31')
        baseUrl = config[config['env']].get('url')
        urlForCashSaleIds = config.get('service').get('urlForCashSaleIds')
        endPoint = path.join(baseUrl,urlForCashSaleIds)
        ids = requests.get(endPoint)
        print(ids)
    except(Exception) as error:
        print(error)
    finally:
        pass

# messages = get_messages()
