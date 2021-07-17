from datetime import datetime, date
from tkinter import Button, Radiobutton, StringVar
from typing_extensions import IntVar
import simplejson as json

s = 'i am mad'
try:
    a = json.loads(s)
except(Exception) as e:
    mess = e.args[0] or repr(e)
    print(mess)
finally:
    print(a)
    pass