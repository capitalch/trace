from os import path
import requests
from requests.exceptions import HTTPError
from tkinter import messagebox
from tkinter.constants import BOTH, BOTTOM, CENTER, E, LEFT, RIDGE, RIGHT, W, Y, X
from tkinter.ttk import Treeview, Scrollbar, Style
from ibuki import Ibuki
from utils import fetch_local_data, get_config, messages

tv = None  # tree view control having tabular data
columns = ('id', 'ref_no', 'name', 'mobile',
           'total_amt', 'address', 'pin', 'gstin', 'bill_memo_id')


def get_data_table_treeview(root):
    global tv
    global columns

    def selectItem(event):
        tree = event.widget
        # print([tree.item(x) for x in tree.selection()])

    tv = Treeview(root, columns=columns, show='headings')
    tv.column('id', width=50, minwidth=50, anchor=CENTER)
    # tv.column('bill_memo_id',  width=1)
    tv.column('ref_no', width=120, minwidth=120, anchor=W)
    tv.column('mobile', width=80, minwidth=80, anchor=W)
    tv.column('total_amt', width=100, minwidth=100, anchor=E)
    # headings
    tv.heading('id', text='Sl')
    #
    tv.heading('ref_no', text='Ref no', anchor=W)
    tv.heading('name', text='Name', anchor=W)
    tv.heading('mobile', text='Mobile', anchor=W)
    tv.heading('total_amt', text='Amount', anchor=E)
    tv.heading('address', text='Address', anchor=W)
    tv.heading('pin', text='Pin', anchor=W)
    tv.heading('gstin', text='Gstin', anchor=W)
    tv.heading('bill_memo_id', text='Bill id', anchor=W)

    hsb = Scrollbar(root, orient='horizontal')
    hsb.configure(command=tv.xview)
    tv.configure(xscrollcommand=hsb.set)

    vsb = Scrollbar(root, orient='vertical')
    vsb.configure(command=tv.yview)
    tv.configure(yscrollcommand=vsb.set)

    tv.bind('<<TreeviewSelect>>', selectItem)
    vsb.pack(fill=Y, side=RIGHT)
    hsb.pack(fill=X, side=BOTTOM)
    return(tv)


def send_sms():

    def is_any_invalid_mobile(selection_list):
        res = any(not(str(item['mobile']).isnumeric() and (
            len(str(item['mobile'])) == 10)) for item in selection_list)
        return(res)

    def process_payload(selection_list):
        for item in selection_list:
            bill_memo_id = item['bill_memo_id']
            company_info = fetch_local_data('track-get-company-info')
            products = fetch_local_data(
                'track-get-product-details', bill_memo_id)
            payments = fetch_local_data(
                'track-get-payment-details', bill_memo_id
            )
            item['companyInfo'] = company_info[0]['comp_name']
            item['products'] = list(products)
            item['payments'] = list(payments)

    try:
        config = get_config()
        env = config['env']
        base_url = config[env]['url']
        temp = config['track']['saveBillUrl']
        # path.join(base_url, temp)
        save_bill_url = 'http://localhost:5000/track/save-bill'
        selected_items = [dict(zip(columns, tv.item(x)['values']))
                          for x in tv.selection()]  # list of dictionaries

        if (len(selected_items) == 0):
            raise Exception(messages['errNoItemsSelected'])

        if (is_any_invalid_mobile(selected_items)):
            raise Exception(messages['errOneMobileInvalid'])

        process_payload(selected_items)

        response = requests.post(save_bill_url, json=selected_items)
        # If the response was successful, no Exception will be raised
        response.raise_for_status()

    except (HTTPError) as error:
        messagebox.showerror(messages['errHttp'], error)
    except (Exception) as error:
        messagebox.showerror(messages['infoNoSmsSent'], error)
    else:
        messagebox.showinfo('Success', messages['infoSuccessSms'])


def populate_treeview(data):
    global tv
    tv.delete(*tv.get_children())  # bill_memo_id is invisible column
    show_data = [(item['id'], item['ref_no'],  item['name'], item['mobile'],
                  item['total_amt'], item['address'], item['pin'], item['gstin'], item['bill_memo_id']) for item in data]

    for item in show_data:
        tv.insert('', 'end',  values=item)


Ibuki.filterOn('POPULATE-DATA-TABLE-TREE-VIEW').subscribe(lambda d:
                                                          populate_treeview(
                                                              d['data'])
                                                          )
Ibuki.filterOn('SEND-SMS').subscribe(lambda d: send_sms())
