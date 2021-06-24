from tkinter.constants import END, RAISED, X
import pyodbc
from tkinter.ttk import Treeview
from tkinter import Button, Label, Tk, Frame
from tkcalendar import Calendar
from datetime import datetime
from sql import sqls

root = Tk()
root.geometry('800x600+200+200')
frame_controls = Frame(root, borderwidth=2, relief=RAISED, padx=5, pady=6)
frame_controls.pack(fill=X)

frame_controls.grid_columnconfigure(0, minsize=100)
frame_controls.grid_columnconfigure(1, minsize=100)

button1 = Button(frame_controls, text='Refresh')
button1.grid(row=0, column=0)

button2 = Button(frame_controls, text='Refresh1')
button2.grid(row=0, column=1)

button3 = Button(frame_controls, text='Refresh2')
button3.grid(row=0, column=2)

columns = ('id', 'ref_no', 'name', 'mobile',
           'total_amt', 'address', 'pin', 'gstin')
tv = Treeview(root, columns=columns, show='headings')

# headings
tv.heading('id', text='Sl')
tv.heading('ref_no', text='Ref no')
tv.heading('name', text='Name')
tv.heading('mobile', text='Mobile')
tv.heading('total_amt', text='Amount')
tv.heading('address', text='Address')
tv.heading('pin', text='Pin')
tv.heading('gstin', text='Gstin')

data = [(1, '111', 'Sushant', '88877765', '2333.23',
         '12 J.L. ', '799987', 'TTTF5554rFFFTy')]
tv.insert('',index=0, text='Label', values=data[0])
tv.pack()


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


# root = Root()
root.mainloop()
