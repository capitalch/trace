from tkinter import Button, Frame
from tkinter.constants import E, RIDGE
from tkcalendar import DateEntry
from utils import fetch_local_data
from ibuki import Ibuki

sale_date = ''


def fetch_sale_data():
    tuple_data = fetch_local_data('track-sale-sms', sale_date)
    Ibuki.emit('POPULATE-DATA-TABLE-TREE-VIEW',
               tuple_data)


def send_sms():
    Ibuki.emit('SEND-SMS', '')


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
                          width=10,bg='yellow', fg='red', font=12, padx=10, command=send_sms)

    frame.columnconfigure(0, weight=1)
    frame.columnconfigure(1, weight=1)
    frame.columnconfigure(2, weight=10)
    btn_send_sms.grid(row=0, column=2, sticky=E)
    
    sale_date = (date_entry.get_date()).isoformat()

    date_entry.bind('<<DateEntrySelected>>', change_date)

    return(frame)
