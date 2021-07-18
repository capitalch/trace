from tkinter.constants import ANCHOR, BOTH, BOTTOM, CENTER, E, HORIZONTAL, LEFT, RIGHT, W, X, Y
from tkinter.ttk import Treeview, Scrollbar
from tkinter import Frame, messagebox
from datetime import datetime
from rx.core.observable.observable import C
from utils import config
import simplejson as json
import requests
from messages import messages
from ibuki import Ibuki


class TreeviewFrame(Frame):
    def __init__(self, parent):
        Ibuki.filterOn('VIEW-EXTENDED-WARRANTY-CUSTOMERS').subscribe(lambda d:
                                                                     self.get_extended_warranty_customers())

        Ibuki.filterOn('SEND-SMS').subscribe(lambda d: self.send_sms())
        self.columns = ('id', 'purchDate',  'daysLeft', 'custName', 'mobileNo', 'smsSentDates', 'serialNumber',
                        'productCategory', 'address', 'pin',  'modelCode', 'modelName',)
        super().__init__(parent, highlightcolor='black',
                         highlightthickness=2, padx=10, pady=10)
        self.tv = Treeview(parent, columns=self.columns, show='headings')
        tv = self.tv
        tv.column('id', width=50, minwidth=50, anchor=CENTER)
        tv.column('purchDate', width=80, minwidth=50, anchor=CENTER)
        tv.column('daysLeft', width=80, anchor=E)
        tv.column('custName', width=150, anchor=W)
        tv.column('mobileNo', width=80, anchor=W)

        tv.column('smsSentDates', width=100, anchor=W)
        tv.column('serialNumber', width=80, anchor=W)
        tv.column('productCategory', width=80, anchor=W)
        tv.column('address', width=120, anchor=W)
        tv.column('pin', width=60, anchor=CENTER)
        tv.column('modelCode', width=100, anchor=W)
        tv.column('modelName', width=100, anchor=W)

        tv.heading('id', text='Id')
        tv.heading('purchDate', text='Purch date')
        tv.heading('daysLeft', text='Days left', anchor=E)
        tv.heading('custName', text='Cust name', anchor=W)
        tv.heading('mobileNo', text='Mobile no', anchor=E)

        tv.heading('smsSentDates', text='SMS sent dates', anchor=W)
        tv.heading('serialNumber', text='Serial no', anchor=W)
        tv.heading('productCategory', text='Product cat', anchor=W)
        tv.heading('address', text='Address', anchor=W)
        tv.heading('pin', text='Pin', anchor=CENTER)
        tv.heading('modelCode', text='Model code', anchor=W)
        tv.heading('modelName', text='Model name', anchor=W)

        hsb = Scrollbar(parent, orient=HORIZONTAL)
        hsb.configure(command=tv.xview)
        tv.configure(xscrollcommand=hsb.set)

        vsb = Scrollbar(parent, orient='vertical')
        vsb.configure(command=tv.yview)
        tv.configure(yscrollcommand=vsb.set)

        tv.bind('<<TreeviewSelect>>', self.select_item)
        vsb.pack(fill=Y, side=RIGHT)
        hsb.pack(fill=X, side=BOTTOM)

    def select_item(self, event):
        tree = event.widget

    def get_extended_warranty_customers(self):
        try:
            result = requests.post(config.extendedWarrantyCustomersEndPoint)
            data = json.loads(result.text)
            self.tv.delete(*self.tv.get_children())

            def add_row(row):
                self.tv.insert('', 'end', values=row)

            show_data = [add_row(
                (
                    item['id'],
                    datetime.strptime(item['purchDate'],
                                      '%Y-%m-%d').strftime('%d/%m/%Y'),
                    int(item['daysLeft']),
                    item['custName'],
                    item['mobileNo'],
                    item['smsSentDates'],
                    item['serialNumber'],
                    item['productCategory'],
                    item['address'],
                    int(float(item['pin'])) if item['pin'] is not None else '',
                    item['modelCode'],
                    item['modelName']
                )) for item in data]
            # for item in show_data:
            #     self.tv.insert('', 'end', values=item)
            # print(data)
        except(Exception) as error:
            messagebox.showerror('Error', error.args[0] or repr(
                error) or messages.get('errGettingExtendedWarrantyCustomers'))

    def send_sms(self):
        def is_any_invalid_mobile(selection_list):
            res = any(not(str(item['mobileNo']).isnumeric() and (
                len(str(item['mobileNo'])) == 10)) for item in selection_list)
            return(res)

        try:
            selected_items = [dict(zip(self.columns, self.tv.item(x)['values']))
                              for x in self.tv.selection()]

            if (len(selected_items) == 0):
                raise Exception(messages['errNoItemsSelected'])

            if (is_any_invalid_mobile(selected_items)):
                raise Exception(messages['errOneMobileInvalid'])

            payload = [{'id': item['id'], 'mobileNo':item['mobileNo'],
                        'custName': item['custName'], 'daysLeft': item['daysLeft'], 'serialNumber': item['serialNumber']} for item in selected_items]
            url = config.sendSmsEndPoint
            response = requests.post(url=url, json=payload)
            pass


        except(Exception) as error:
            messagebox.showerror('Error', str(error.args[0]))


def init_treeview_frame(root):
    try:
        frame_treeview = TreeviewFrame(root).tv
        frame_treeview.pack(fill=BOTH, padx=10, pady=10)
    except(Exception) as error:
        messagebox.showerror('Error', error or messages.get('errGeneric'))
