from messages import messages
from ibuki import Ibuki
from tkinter import Frame, Label, Button, messagebox
from tkinter.constants import ANCHOR, E, LEFT, RIGHT, W, X
from utils import config, get_local_company_id, get_fin_year, do_export, is_valid_date_range, to_local_date


class Meta:  # contains discrete variables
    def __init__(self):
        pass


meta = Meta()


class Status(Frame):
    def __init__(self, parent):
        super().__init__(parent, highlightbackground='red',
                         highlightthickness=2, padx=10, pady=10)
        self.source = get_local_company_id()
        self.mapping = config.service_mapping[self.source]
        self.target = self.mapping['database'] + \
            ' / ' + self.mapping['buCode']

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

        self.lbl_no_of_records = Label(
            self, text='Records found: 0', font=0.5, fg='black')
        self.lbl_no_of_records.grid(row=1, column=2, sticky=W)

        self.lbl_processed = Label(
            self, text='Processed: 0', font=0.5, fg='black')
        self.lbl_processed.grid(row=1, column=3, sticky=W)

        self.btn_export = Button(self, text='Export', bg='yellow',
                            fg='red', width=10, font=12, command=self.handle_export, cursor='hand2')
        self.btn_export.grid(row=0, column=4,columnspan=2, sticky=E, padx=40)

    def handle_export(self):
        meta.get_dates()
        if(is_valid_date_range(meta.dates)):
            do_export(dates=meta.dates, mapping=self.mapping,
                      lbl_no_of_records=self.lbl_no_of_records, fin_year = get_fin_year(meta.dates[0]),
                      lbl_processed = self.lbl_processed, btn_export = self.btn_export
                      )
        else:
            messagebox.showerror('Error', messages['errInvalidDateRange'])


def get_frame_status(root):
    def ibuki_dates(d):
        meta.dates = (d['data'][0], d['data'][1])
        meta.get_dates = d['data'][2]
        frame_status.lbl_start_date.config(
            text='Start date: ' + to_local_date(meta.dates[0]))
        frame_status.lbl_end_date.config(
            text='End date: ' + to_local_date(meta.dates[1]))
        frame_status.lbl_no_of_records.config(text='Records found: 0')
        frame_status.lbl_processed.config(text='Processed: 0/0')
        x = 0
    try:
        Ibuki.filterOn('GET-DATES').subscribe(ibuki_dates)
        frame_status = Status(root)
        # frame_status.pack(fill=X, padx=10)
        return(frame_status)
    except(Exception) as error:
        raise error
