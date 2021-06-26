from tkinter import Tk
from tkinter.constants import BOTH, X
from ibuki import emit, filterOn, Ibuki

from controls_frame import get_controls_frame, fetch_sale_data, sale_date
from data_table_treeview import get_data_table_treeview, populate_treeview

root = Tk()
root.title('Sale SMS from Track+')
root.geometry('800x600+200+200')

tv = get_data_table_treeview(root)

frame = get_controls_frame(root)
frame.pack(fill=X)

tv.pack(fill=BOTH, expand=1)
fetch_sale_data()

root.mainloop()
