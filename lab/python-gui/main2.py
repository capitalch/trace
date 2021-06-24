from tkinter import *
from tkinter import ttk


def selectmode_none():
    tv['selectmode']="none"

def selectmode_browse():
    tv['selectmode']="browse"

def selectmode_extended():
    tv['selectmode']="extended"

ws = Tk()

tv = ttk.Treeview(
    ws, 
    columns=(1, 2, 3), 
    show='headings', 
    height=8
    )
tv.pack()

tv.heading(1, text='roll number')
tv.heading(2, text='name')
tv.heading(3, text='class')

tv.insert(parent='', index=0, iid=0, values=(21, "Krishna", 5))
tv.insert(parent='', index=1, iid=1, values=(18, "Bhem", 3))
tv.insert(parent='', index=2, iid=2, values=(12, "Golu", 6))
tv.insert(parent='', index=3, iid=3, values=(6, "Priya", 3))


b1 = Button(
    ws, 
    text="Browse",
    pady=20,
    command=selectmode_browse
    )
b1.pack(side=LEFT, fill=X, expand=True)


b2 = Button(
    ws, 
    text="None",
    pady=20,
    command=selectmode_none
    )
import tkinter as tk
from tkinter import ttk

# intializing the window
window = tk.Tk()
window.title("TABS")
# configuring size of the window 
window.geometry('350x200')
#Create Tab Control
TAB_CONTROL = ttk.Notebook(window)
#Tab1
TAB1 = ttk.Frame(TAB_CONTROL)
TAB_CONTROL.add(TAB1, text='Tab 1')
#Tab2
TAB2 = ttk.Frame(TAB_CONTROL)
TAB_CONTROL.add(TAB2, text='Tab 2')
TAB_CONTROL.pack(expand=1, fill="both")
#Tab Name Labels
ttk.Label(TAB1, text="This is Tab 1").grid(column=0, row=0, padx=10, pady=10)
ttk.Label(TAB2, text="This is Tab 2").grid(column=0, row=0, padx=10, pady=10)
#Calling Main()
window.mainloop()