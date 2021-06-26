import tkinter as tk
from tkinter import ttk

NORM_FONT = ("Helvetica", 10)

def popupmsg(msg):
    popup = tk.Tk()
    popup.resizable(0,0)
    popup.overrideredirect(1)
    popup.wm_title("!")
    
    label = ttk.Label(popup, text=msg, font=NORM_FONT)
    label.pack(side="top", fill="x", pady=10)
    B1 = ttk.Button(popup, text="Okay", command = popup.destroy)
    B1.pack()
    popup.mainloop()

popupmsg('hi')