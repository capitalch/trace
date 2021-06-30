from tkinter import Tk
from tkinter.constants import BOTH, X
from components.export import get_export_button
# from controls_frame import get_controls_frame, fetch_sale_data
# from data_table_treeview import get_data_table_treeview

root = Tk()
root.title('Export serviceplus sales to Trace')
root.geometry('800x600+200+200')

# export_button = get_export_button(root)
# export_button.pack()
temp_frame = get_export_button(root)
temp_frame.pack(fill=X)

# tv = get_data_table_treeview(root)

# frame = get_controls_frame(root)
# frame.pack(fill=X)

# tv.pack(fill=BOTH, expand=1)
# fetch_sale_data()

root.mainloop()
