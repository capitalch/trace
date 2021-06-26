from tkinter import Button, Tk, Frame
from tkinter.constants import FLAT, RAISED, RIDGE, SUNKEN, X
from tkcalendar import DateEntry
from tkinter import ttk
import pyodbc
from utils import get_config
from sql import sqls
from data_table_treeview import get_data_table_treeview
from ibuki import emit, Ibuki
sale_date = ''

def fetch_sale_data():
    database = get_config()['track']['database']
    connString = f'DSN={database}'
    sql = sqls['track-sale-sms']
    try:
        with pyodbc.connect(connString) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql, [sale_date]).fetchall()
                descriptions = cursor.description  # column names, tuple of tuples
                desc_tuple = tuple([item[0] for item in descriptions])
                # list comprehension, a short way
                data_tuple_of_dictionary = tuple(
                    dict(zip(desc_tuple, item)) for item in result)
                Ibuki.emit('POPULATE-DATA-TABLE-TREE-VIEW', data_tuple_of_dictionary)
    except(Exception) as error:
        print(error)

def send_sms():
    Ibuki.emit('TEST-MESSAGE','This is ebuki data')

def get_controls_frame(root):
    def change_date(e):
        global sale_date
        sale_date = (e.widget.get_date()).isoformat()
        fetch_sale_data()

    global sale_date
    frame = Frame(root, height=50,  pady=5, borderwidth=3, relief=RIDGE)

    btn_refresh = Button(frame, text='Refresh', width=10,
                         fg='blue', font=12, padx=10, command=fetch_sale_data)
    btn_refresh.grid(row=0, column=1)

    date_entry = DateEntry(frame, width=12, background='darkblue',
                           foreground='white', borderwidth=2, date_pattern='dd/MM/yyyy')
    date_entry.grid(row=0, column=0, padx=5)

    btn_send_sms = Button(frame, text='Send SMS',
                          width=10, fg='red', font=12, padx=10, command=send_sms)
    btn_send_sms.grid(row=0, column=2)

    sale_date = (date_entry.get_date()).isoformat()

    date_entry.bind('<<DateEntrySelected>>', change_date)

    return(frame)
