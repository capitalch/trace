import tkinter as tk
from pandastable import Table
import pandas as pd

root = tk.Tk()

frame = tk.Frame(master=root)
frame.pack()

df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5, 6, ],
    'B': [1, 1, 2, 2, 3, 3, ],
    'C': [1, 2, 3, 1, 2, 3, ],
    'D': [1, 1, 1, 2, 2, 2, ],
})

pt = Table(frame)
pt.model.df = df
pt.show()
# pt.pack()


def on_click():
    print('button clicked')

def print_selected_rows():
    df1 = pt.getSelectedRows()
    print(df1)

button = tk.Button(text='select', master=root,
                   padx=10, pady=10, command=print_selected_rows)
button.pack()

root.mainloop()
