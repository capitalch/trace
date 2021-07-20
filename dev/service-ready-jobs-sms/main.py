from tkinter import Tk, messagebox
from top_frame import init_top_frame
from treeview_frame import init_treeview_frame

root = Tk()

root.title('Service+ ready jobs SMS')
root.geometry('800x600+200+200')

try:
    pass
    init_top_frame(root)
    init_treeview_frame(root)
except(Exception) as error:
    messagebox.showerror('Error', error)
    root.destroy()

root.mainloop()