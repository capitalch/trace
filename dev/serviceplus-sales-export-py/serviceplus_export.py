from tkinter import Tk
from tkinter.constants import X
from components.export import init_export_button
from components.select_date_range import init_date_range_container

# from lab import activate_lab_radio_buttons

root = Tk()
root.title('Export serviceplus sales to Trace')
root.geometry('800x600+200+200')

init_date_range_container(root)

init_export_button(root)

# activate_lab_radio_buttons(root)

root.mainloop()