from tkinter import Tk, messagebox
from tkinter.constants import X
from components.select_date_range import init_date_range_container
from components.status import get_frame_status

root = Tk()
root.title('Export serviceplus sales to Trace')
root.geometry('800x430+200+200')

try:
    frame_status = get_frame_status(root)
    init_date_range_container(root)
    frame_status.pack(fill=X, padx=10)
except(Exception) as error:
    messagebox.showerror('Error', error)
    root.destroy()

root.mainloop()
