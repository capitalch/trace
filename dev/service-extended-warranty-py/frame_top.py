from tkinter import Frame, Label, Button, messagebox
from tkinter.constants import E, X

class TopFrame(Frame):
    def __init__(self, parent):
        super().__init__(parent, highlightcolor='black',  highlightthickness=2, padx=10, pady=10)
        
        btn_select_input = Button(self, text='Select input', width=12, bg='yellow', fg='blue', font=10, cursor='hand2')
        btn_select_input.grid(row=0, column=0)

        btn_view_refresh = Button(self, text='View / Refresh warranty', width=18, bg='yellow', fg = 'blue',font=10,  padx=10, cursor='hand2')
        btn_view_refresh.grid(row=0, column=1)

        btn_send_sms = Button(self, text='Send SMS', width=10, bg='yellow', fg = 'red',font=10,  padx=10, cursor='hand2')
        btn_send_sms.grid(row=0, column=2, sticky=E)
        self.columnconfigure(2, weight=4)
        self.columnconfigure(1, weight=2)

def init_top_frame(root):
    frame_top = TopFrame(root)
    frame_top.pack(fill=X, padx=10, pady=10)