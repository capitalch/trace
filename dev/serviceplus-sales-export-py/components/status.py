from tkinter import Frame, Label, Button
from tkinter.constants import ANCHOR, E, LEFT, W, X
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
        lbl_target_db.grid(row=0, column=1, columnspan=3, sticky=W)

        self.lbl_start_date = Label(self, text='', font=0.5)
        self.lbl_start_date.grid(row=1, column=0, sticky=W)

        self.lbl_end_date = Label(self, text='', font=0.5)
        self.lbl_end_date.grid(row=1, column=1, sticky=W)

        lbl_no_of_records = Label(
            self, text='No of records:         ', font=0.5, fg='red')
        lbl_no_of_records.grid(row=1, column=2, sticky=W)

        lbl_processed = Label(
            self, text='Processed:              ', font=0.5, fg='red')
        lbl_processed.grid(row=1, column=3, sticky=W)

        btn_exxport = Button(self, text='Export', bg='yellow',
                             fg='red', width=10, font=12, command=self.handle_export)
        btn_exxport.grid(row=1, column=4, sticky=E)

    def handle_export():
        pass

    def check_date_range():
        pass

    def get_fin_year():
        pass


def get_frame_status(root):
    def ibuki_dates(d):
        meta.dates = d['data']
        frame_status.lbl_start_date.config(text='Start date: ' + meta.dates[0])
        frame_status.lbl_end_date.config(text='End date: ' + meta.dates[1])
    try:
        Ibuki.filterOn('GET-DATES').subscribe(ibuki_dates)
        frame_status = Status(root)
        # frame_status.pack(fill=X, padx=10)
        return(frame_status)
    except(Exception) as error:
        raise error
