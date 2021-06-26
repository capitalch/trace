import tkinter as tk
from tkinter.constants import GROOVE, RIDGE, S, SUNKEN
from tkcalendar import Calendar

root = tk.Tk()

root.geometry('600x400+200+100')
cal= Calendar(root, selectmode="day",year= 2021, month=3, day=3)
cal.grid(row=0, column=0)
button1 = tk.Button(root, text='My button1', relief=RIDGE)
button1.grid(row=0, column=1)
button2 = tk.Button(root, text='My button2', anchor=S )
button2.grid(row=1, column=1)

root.mainloop()
