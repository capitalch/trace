from tkinter.constants import BOTH, BOTTOM, CENTER, HORIZONTAL, RIGHT, X, Y
from tkinter.ttk import Treeview, Scrollbar
from tkinter import Frame, messagebox
from utils import config
import simplejson  as json
import requests
from messages import messages
from ibuki import Ibuki


class TreeviewFrame(Frame):
    def __init__(self, parent):
        Ibuki.filterOn('VIEW-EXTENDED-WARRANTY-CUSTOMERS').subscribe(lambda d:
                                                                     self.get_extended_warranty_customers())
        columns = ('id', 'date')
        super().__init__(parent, highlightcolor='black',
                         highlightthickness=2, padx=10, pady=10)
        tv = Treeview(parent, columns=columns, show='headings')
        tv.column('id', width=50, minwidth=50, anchor=CENTER)
        tv.column('date', width=50, minwidth=50, anchor=CENTER)

        tv.heading('id', text='Sl')
        tv.heading('date', text='Date')

        hsb = Scrollbar(parent, orient=HORIZONTAL)
        hsb.configure(command=tv.xview)
        tv.configure(xscrollcommand=hsb.set)

        vsb = Scrollbar(parent, orient='vertical')
        vsb.configure(command=tv.yview)
        tv.configure(yscrollcommand=vsb.set)

        tv.bind('<<TreeviewSelect>>', self.select_item)
        vsb.pack(fill=Y, side=RIGHT)
        hsb.pack(fill=X, side=BOTTOM)

    def select_item(self):
        pass

    def get_extended_warranty_customers(self):
        try:
            result = requests.post(config.extendedWarrantyCustomersEndPoint)
            jsn = json.loads(result.text)
            print(jsn)
        except(Exception) as error:
            print(error)
        


def init_treeview_frame(root):
    try:
        frame_treeview = TreeviewFrame(root)
        frame_treeview.pack(fill=BOTH, padx=10, pady=10)
    except(Exception) as error:
        messagebox.showerror('Error', error or messages.get('errGeneric'))
