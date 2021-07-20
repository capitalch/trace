from tkinter import Frame, Label, Button, messagebox
from tkinter.constants import E, X
import requests
from threading import Thread
import json

from messages import messages

from utils import config
from ibuki import Ibuki


class TopFrame(Frame):
    def __init__(self, parent):
        super().__init__(parent, highlightcolor='black',
                         highlightthickness=2, padx=10, pady=10)
        self.btn_ready_jobs = Button(self, text='Ready jobs', width=10, bg='yellow',
                               fg='blue', font=10, cursor='hand2', command=self.view)
        self.btn_ready_jobs.grid(row=0, column=0)

        btn_send_sms = Button(self, text='Send SMS', width=10,
                              bg='yellow', fg='red', font=10,  padx=10, cursor='hand2', command=self.send_sms)
        btn_send_sms.grid(row=0, column=2, sticky=E)

        self.columnconfigure(2, weight=4)
        self.columnconfigure(1, weight=2)

    def send_sms(self):
        Ibuki.emit('SEND-SMS', None)

    def view(self):
        pass


def init_top_frame(root):
    try:
        top_frame = TopFrame(root)
        top_frame.pack(fill=X, padx=10, pady=10)
    except(Exception) as error:
        messagebox.showerror(
            'Error', error.args[0] or messages.get('errGeneric'))
