from datetime import datetime, date
from tkinter import Button, Radiobutton, StringVar
from typing_extensions import IntVar


def activate_lab_radio_buttons(root):
    rb_value = StringVar(root, "2")
    rb_1 = Radiobutton(root, variable=rb_value, value="1")
    # rb_1.grid(row=0, column=0)
    rb_1.pack()

    rb_2 = Radiobutton(root, variable=rb_value, value="2")
    # rb_2.grid(row=0,column=1)
    rb_2.pack()

    rb_3 = Radiobutton(root, variable=rb_value, value="3")
    # rb_3.grid(row=0, column=2)
    rb_3.pack()

    def handle_btn():
        print(rb_value.get())

    btn_1 = Button(root, text='Get value', command=handle_btn)
    # btn1.grid(row=1,column=0)
    btn_1.pack()
