from tkinter import Tk, messagebox
import sys
from tkinter.constants import X
from components.export import init_export_button
from components.select_date_range import init_date_range_container
from components.status import get_frame_status

# from lab import activate_lab_radio_buttons

root = Tk()
root.title('Export serviceplus sales to Trace')
root.geometry('800x600+200+200')

try:
    
    frame_status = get_frame_status(root)
    init_date_range_container(root)
    frame_status.pack(fill=X, padx=10)
    # frame_status.pack(fill=X, padx=10)

    init_export_button(root)
except(Exception) as error:
    messagebox.showerror('Error', error)
    root.destroy()
    

# activate_lab_radio_buttons(root)

root.mainloop()
