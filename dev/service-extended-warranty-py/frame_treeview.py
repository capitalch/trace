from tkinter.constants import BOTH, BOTTOM, CENTER, HORIZONTAL, RIGHT, X, Y
from tkinter.ttk import Treeview, Scrollbar
from tkinter import Frame, messagebox
from messages import messages


class TreeviewFrame(Frame):
    def __init__(self, parent):
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


def init_treeview_frame(root):
    try:
        frame_treeview = TreeviewFrame(root)
        frame_treeview.pack(fill=BOTH, padx=10, pady=10)
    except(Exception) as error:
        messagebox.showerror('Error', error or messages.get('errGeneric'))
