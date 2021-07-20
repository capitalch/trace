from tkinter.constants import ANCHOR, BOTH, BOTTOM, CENTER, E, HORIZONTAL, LEFT, RIGHT, W, X, Y
from tkinter.ttk import Treeview, Scrollbar
from tkinter import Frame, messagebox
from datetime import datetime
from utils import config
import simplejson as json
import requests
from messages import messages
from ibuki import Ibuki

class TreeviewFrame(Frame):
    def __init__(self, parent):
        pass

def init_treeview_frame(root):
    try:
        pass
        # treeview_frame = TreeviewFrame(root).tv
        # treeview_frame.pack(fill=BOTH, padx=10, pady=10)
    except(Exception) as error:
        messagebox.showerror('Error',error.args[0] or messages.get('errGeneric'))