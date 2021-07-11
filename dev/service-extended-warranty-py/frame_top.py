from tkinter import Frame, Label, Button, messagebox, filedialog as fd
from tkinter.constants import E, X
import pandas
import requests
import json
from messages import messages
from utils import config


class TopFrame(Frame):
    def __init__(self, parent):
        super().__init__(parent, highlightcolor='black',
                         highlightthickness=2, padx=10, pady=10)

        btn_select_input = Button(self, text='Select input', width=12, bg='yellow',
                                  fg='blue', font=10, cursor='hand2', command=self.select_file)
        btn_select_input.grid(row=0, column=0)

        btn_view_refresh = Button(self, text='View / Refresh warranty',
                                  width=18, bg='yellow', fg='blue', font=10,  padx=10, cursor='hand2')
        btn_view_refresh.grid(row=0, column=1)

        btn_send_sms = Button(self, text='Send SMS', width=10,
                              bg='yellow', fg='red', font=10,  padx=10, cursor='hand2')
        btn_send_sms.grid(row=0, column=2, sticky=E)
        self.columnconfigure(2, weight=4)
        self.columnconfigure(1, weight=2)

    def select_file(self):
        filetypes = (
            ('excel files', '*.xlsx'),
            ('All files', '*.*')
        )
        try:
            select_folder = config.selectFolder or './'
            filename = fd.askopenfilename(
                title='Open customer data',
                initialdir=select_folder,
                filetypes=filetypes
            )
            data = self.get_json(filename)
            self.upload_data(data=data)
            print(json)
        except(Exception) as error:
            messagebox.showerror(
                'Error', error or messages.get('errSelectingFile'))

    def get_json(self, filename):
        df = pandas.read_excel(filename, converters={'Purchased Date': str, 'Serial No': str}, header=1, usecols=['ASC Code', 'Customer Group', 'Job ID', 'Warranty Type', 'Warranty Category', 'Service Type', 'Product category name',
                                                                                                                  'Product sub category name', 'Set Model', 'Model Name', 'Serial No', 'Purchased Date', 'Customer Name', 'Mobile No', 'Postal Code', 'Address'
                                                                                                                  ])
        json_str = df.to_json(orient='index')
        js = json_str.encode('ascii', "ignore").decode()
        js = js.replace(u'\\ufeff', '').replace('\\/', '').replace("\'", '')
        jsn = json.loads(js).values()
        return(jsn)

    def upload_data(self, data):
        upload_endpoint = config.uploadEndPoint
        result = requests.post(upload_endpoint, json=data)
        pass


def init_top_frame(root):
    try:
        frame_top = TopFrame(root)
        frame_top.pack(fill=X, padx=10, pady=10)
    except(Exception) as error:
        messagebox.showerror('Error', error or messages.get('errGeneric'))
