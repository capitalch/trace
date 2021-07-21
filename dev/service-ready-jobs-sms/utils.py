import simplejson as json
from os import path
import pyodbc
from tkinter import messagebox

from sql import sqls

class Config:
    def __init__(self):
        config = self.get_config()

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