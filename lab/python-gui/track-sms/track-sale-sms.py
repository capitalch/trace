import tkinter as tk
from tkinter import font
from tkinter.constants import LEFT
from tkinter.font import Font

top = tk.Tk()
top.geometry('800x600')
top.title('Track+ sale sms')

frame = tk.Frame()
label = tk.Label(text='My label', master=frame, pady=10, font=2)
label.pack()
frame.pack()
top.mainloop()