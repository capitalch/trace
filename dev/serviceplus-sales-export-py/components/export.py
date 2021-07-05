from tkinter import Button, Frame, Label
from utils import do_export

counter = 0
temp_label = None
export_button = None

def handle_export():
    do_export(temp_label, export_button)
    global counter

def init_export_button(parent):
    global temp_label, export_button

    temp_frame = Frame(parent)

    temp_label = Label(temp_frame, text=counter)
    
    temp_label.pack()
    export_button = Button(temp_frame, text='Export',
                           bg='yellow', fg='red', width=10, font=12, command=handle_export)
    export_button.pack()
    temp_frame.pack()
    # return(temp_frame)

# data_tuple_of_dictionary = fetch_local_data(
#     'service-get-sale-receipts', '2020-04-01', '2021-03-31')
# print(data_tuple_of_dictionary)
# counter+=1
# temp_label['text'] = counter

# temp_label.root = parent
#     temp_label.loop = loop