from tkinter import Frame, Label
from tkinter.constants import ANCHOR, LEFT, W, X
from utils import config
from ibuki import Ibuki
from utils import get_local_company_id


class Meta:  # contains discrete variables
    def __init__(self):
        pass


meta = Meta()


class Status(Frame):
    def __init__(self, parent):
        super().__init__(parent, highlightbackground='red',
                         highlightthickness=2, padx=10, pady=10)
        self.source = get_local_company_id()
        source_mapping = config.service_mapping[self.source]
        self.target = source_mapping['database'] + \
            ' / ' + source_mapping['buCode']

        source_db = f'Source databse: {self.source}'
        lbl_source_db = Label(self, text=source_db,  fg='darkblue', font=0.5)
        lbl_source_db.grid(row=0, column=0, sticky=W)

        target_db = f'Target database: {self.target}'
        lbl_target_db = Label(self, text=target_db,  fg='darkblue', font=0.5)
        lbl_target_db.grid(row=0, column=1, sticky=W)

        self.lbl_start_date = Label(self, text='', font=0.5)
        self.lbl_start_date.grid(row=1, column=0, sticky=W)

        self.lbl_end_date = Label(self, text='', font=0.5)
        self.lbl_end_date.grid(row=1, column=1, sticky=W)


def get_frame_status(root):

    def ibuki_dates(d):
        meta.dates = d['data']
        frame_status.lbl_start_date.config(text='Start date: ' + meta.dates[0])
        frame_status.lbl_end_date.config(text='End date: ' + meta.dates[1])

    try:
        Ibuki.filterOn('GET-DATES').subscribe(ibuki_dates)
        frame_status = Status(root)
        # frame_status.pack(fill=X, padx=10)
    except(Exception) as error:
        pass
    finally:
        return(frame_status)
    # frame_status = Frame(root, border=2, borderwidth=2,  padx=10, pady=10)
    # frame_status.pack(fill=X, padx=10, pady=10)

    # lbl_source = Label(frame_status, text='Source: Nav', font=12)
    # lbl_source.grid(row=0, column=1)


# Ibuki.filterOn('GET-DATES').subscribe(lambda d: print(d['data']))
# start_date = date_range_container.get_dates()[0]
# lbl_start_date = Label(frame_status, text = start_date)
# lbl_start_date.grid(row=0, column=2)
