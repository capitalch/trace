from tkinter import Tk, messagebox
from frame_top import init_top_frame
from frame_treeview import init_treeview_frame

root = Tk()
root.title('Service+ extended warranty')
root.geometry('800x600+200+200')

try:
    init_top_frame(root)
    init_treeview_frame(root)
except(Exception) as error:
    messagebox.showerror('Error', error)
    root.destroy()

root.mainloop()