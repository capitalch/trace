from tkinter.constants import BOTH, BOTTOM, CENTER, E, LEFT, RIDGE, RIGHT, W, Y, X
from tkinter.ttk import Treeview, Scrollbar, Style
from ibuki import Ibuki

tv = None
def get_data_table_treeview(root):
    global tv
    def selectItem(event):
        tree = event.widget
        print([tree.item(x) for x in tree.selection()])

    columns = ('id', 'ref_no', 'name', 'mobile',
               'total_amt', 'address', 'pin', 'gstin')

    tv = Treeview(root, columns=columns, show='headings')
    tv.column('id', width=50, minwidth=50, anchor=CENTER)
    tv.column('ref_no', width=120, minwidth=120, anchor=W)
    tv.column('mobile', width=80, minwidth=80, anchor=W)
    tv.column('total_amt', width=100, minwidth=100, anchor=E)
    # headings
    tv.heading('id', text='Sl')
    tv.heading('ref_no', text='Ref no', anchor=W)
    tv.heading('name', text='Name', anchor=W)
    tv.heading('mobile', text='Mobile', anchor=W)
    tv.heading('total_amt', text='Amount', anchor=E)
    tv.heading('address', text='Address', anchor=W)
    tv.heading('pin', text='Pin', anchor=W)
    tv.heading('gstin', text='Gstin', anchor=W)

    hsb = Scrollbar(root, orient='horizontal')
    hsb.configure(command=tv.xview)
    tv.configure(xscrollcommand=hsb.set)

    vsb = Scrollbar(root, orient='vertical')
    vsb.configure(command=tv.yview)
    tv.configure(yscrollcommand=vsb.set)

    tv.bind('<<TreeviewSelect>>', selectItem)
    vsb.pack(fill=Y, side=RIGHT)
    hsb.pack(fill=X, side=BOTTOM)
    return(tv)


def populate_treeview(data):
    global tv
    tv.delete(*tv.get_children())
    show_data = [(item['id'], item['ref_no'],  item['name'], item['mobile'],
                  item['total_amt'], item['address'], item['pin'], item['gstin']) for item in data]

    for item in show_data:
        tv.insert('', 'end',  values=item)


Ibuki.filterOn('POPULATE-DATA-TABLE-TREE-VIEW').subscribe(lambda d:
                                                          populate_treeview(
                                                              d['data'])
                                                          )
