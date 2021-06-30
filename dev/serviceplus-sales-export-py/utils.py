import json
import pyodbc
from tkinter import messagebox
from sql import sqls

def get_config():
    with open('config.json','r') as config_file:
        config = json.load(config_file)
    return(config)

# def get_messages():
#     with open('messages.json', 'r') as mess_file:
#         messages = json.load(mess_file)
#     return(messages)

def fetch_local_data(sql_key, *args):
    database = config.get('serviceDatabase')
    connString = f'DSN={database}'
    sql = sqls[sql_key]
    try:
        with pyodbc.connect(connString) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql, args).fetchall()
                descriptions = cursor.description  # column names, tuple of tuples
                desc_tuple = tuple([item[0] for item in descriptions])
                data_tuple_of_dictionary = tuple(
                    dict(zip(desc_tuple, item)) for item in result)
    except(Exception) as error:
        messagebox.showerror(title='Service+ database error', message=error)
    finally:
        return(data_tuple_of_dictionary)

# messages = get_messages()
config = get_config()