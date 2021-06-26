from tkinter.constants import BOTTOM, CENTER, END, RAISED, RIGHT, X, Y
import pyodbc
import json
from tkinter.ttk import Treeview, Scrollbar, Style
from tkinter import Button, Label, Tk, Frame, messagebox
from tkcalendar import Calendar
from datetime import datetime
from sql import sqls



def read_config():
    with open('config.json','r') as config_file:
        config_data = json.load(config_file)
        # print(config_data)
read_config()

def selectItem(event):
    tree = event.widget
    print ([tree.item(x) for x in tree.selection()])
    # curItem = tree.focus()
    # print(tree.item(curItem))

def send_sms():
    messagebox.showinfo('Show Info', 'Showing some info')



def get_sale_data():
    connString = 'DSN=capi2021'
    sql = sqls['track-sale-sms']
    try:
        with pyodbc.connect(connString) as conn:
            with conn.cursor() as cursor:
                result = cursor.execute(sql, ['2021-04-05']).fetchall()
                descriptions = cursor.description  # tuple of tuples
                desc_tuple = tuple([item[0] for item in descriptions])
                zipped_list = []
                for item in result:
                    zipped = zip(desc_tuple, item)
                    zipped_list.append(dict(zipped))
                return(zipped_list)
                
    except(Exception) as error:
        print(error)


data = tuple(get_sale_data())

root = Tk()
root.geometry('800x600+200+200')
frame_controls = Frame(root, borderwidth=2, relief=RAISED, padx=5, pady=6)
frame_controls.pack(fill=X)

frame_controls.grid_columnconfigure(0, minsize=100)
frame_controls.grid_columnconfigure(1, minsize=100)

button1 = Button(frame_controls, text='Refresh')
button1.grid(row=0, column=0)

button2 = Button(frame_controls, text='Send SMS', command=send_sms)
button2.grid(row=0, column=1)

button3 = Button(frame_controls, text='Refresh2')
button3.grid(row=0, column=2)


columns = ('id', 'ref_no', 'name', 'mobile',
           'total_amt', 'address', 'pin', 'gstin')

tv = Treeview(root, columns=columns, show='headings')

tv.column('id', width=50, minwidth=50, anchor=CENTER)

# headings
tv.heading('id', text='Sl')
tv.heading('ref_no', text='Ref no')
tv.heading('name', text='Name')
tv.heading('mobile', text='Mobile')
tv.heading('total_amt', text='Amount')
tv.heading('address', text='Address')
tv.heading('pin', text='Pin')
tv.heading('gstin', text='Gstin')

show_data = [(item['id'], item['ref_no'],  item['name'], item['mobile'],
              item['total_amt'], item['address'], item['pin'], item['gstin']) for item in data]

for item in show_data:
    tv.insert('', index=1,  values=item)
# verscrlbar.pack(side ='right', fill ='x')
hsb = Scrollbar(root,orient='horizontal')
hsb.configure(command=tv.xview)
tv.configure(xscrollcommand=hsb.set)
hsb.pack(fill=X, side=BOTTOM)

vsb = Scrollbar(root, orient='vertical')
vsb.configure(command=tv.yview)
tv.configure(yscrollcommand=vsb.set)
vsb.pack(fill=Y, side=RIGHT)

# select item
tv.bind('<<TreeviewSelect>>', selectItem)

tv.pack(fill=Y)
class Root(Tk):
    def __init__(self):
        super().__init__()
        self.geometry('800x600+200+200')
        self.draw_controls()

    def draw_controls(self):
        self.lbl_date = Label(
            text=datetime.today().strftime('%d/%m/%Y'), padx=5, pady=5)
        self.lbl_date.grid(column=0, row=0)
        self.get_sale_data()

    def get_sale_data(self):
        connString = 'DSN=capi2021'
        sql = sqls['track-sale-sms']
        try:
            with pyodbc.connect(connString) as conn:
                with conn.cursor() as cursor:
                    result = cursor.execute(sql, ['2021-04-05']).fetchall()
                    for item in result:
                        print(item.ref_no)
        except(Exception) as error:
            print(error)

root.mainloop()
