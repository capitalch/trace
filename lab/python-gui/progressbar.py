import tkinter as tk
from tkinter.constants import HORIZONTAL
from tkinter.ttk import Button, Progressbar
import time

top = tk.Tk()
top.geometry('800x600')

value = 0

p = Progressbar(master=top, orient=HORIZONTAL, length=200,
                mode='indeterminate', takefocus=False, maximum=100)
p.pack()

def start():
    p.start()
    p.step(10)







button = Button(top, text='Click', command=start)
button.pack()

# for i in range(100):
#     # p.step()
#     p['value'] = i
#     time.sleep(0.1)
#     top.update()

top.mainloop()
