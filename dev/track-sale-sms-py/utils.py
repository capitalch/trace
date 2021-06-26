from tkinter import messagebox
import json
import pyodbc
# from utils import get_config
from sql import sqls

def get_config():
    config_data = None
    with open('config.json', 'r') as config_file:
        config_data = json.load(config_file)
    return(config_data)

def get_messages():
    with open('messages.json', 'r') as mess_file:
        ret = json.load(mess_file)
    return(ret)


def fetch_local_data(sql_key, *arg):
    database = get_config()['track']['database']
    connString = f'DSN={database}'
    sql = sqls[sql_key]
    global data_tuple_of_dictionary
    data_tuple_of_dictionary = []
    try:
        with pyodbc.connect(connString) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql, arg).fetchall()
                descriptions = cursor.description  # column names, tuple of tuples
                desc_tuple = tuple([item[0] for item in descriptions])
                # list comprehension, a shortcut way
                data_tuple_of_dictionary = tuple(
                    dict(zip(desc_tuple, item)) for item in result)
                
    except(Exception) as error:
        messagebox.showerror(title='Track database error', message=error)
    finally:
        return(data_tuple_of_dictionary)

messages = get_messages()