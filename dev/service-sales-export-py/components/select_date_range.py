from tkinter import Button, Radiobutton, Frame, Label, StringVar
from tkinter.constants import ANCHOR, DISABLED, LEFT, NORMAL, RIDGE, SUNKEN, W, X
from tkinter import ttk
from datetime import date, datetime
from tkcalendar import DateEntry
from ibuki import Ibuki


class DateMode(Frame):

    def __init__(self, parent):
        super().__init__(parent)
        rb_date = Radiobutton(self, text='Select date', value='D', fg='blue', font=10, name='rb_date_mode',
                              variable=parent.mode, highlightcolor='blue', command=lambda: parent.rb_clicked('date_mode'))
        rb_date.grid(row=0, column=0, pady=10)

        start_date_label = Label(
            self, text='Start date:', padx=5, font=8, fg='green', width=15)
        start_date_label.grid(row=0, column=1)

        self.start_date_entry = DateEntry(self, width=11, background='darkblue', state='readonly',
                                          foreground='white', borderwidth=2, date_pattern='dd/MM/yyyy')
        self.start_date_entry.bind(
            '<<DateEntrySelected>>', lambda a: parent.rb_clicked('date_mode'))
        self.start_date_entry.grid(row=0, column=2)

        end_date_label = Label(self, text='End date:',
                               padx=5, font=8, fg='green', width=15)

        end_date_label.grid(row=0, column=3)

        self.end_date_entry = DateEntry(self, width=11, background='darkblue', state='readonly',
                                        foreground='white', borderwidth=2, date_pattern='dd/MM/yyyy')
        self.end_date_entry.bind(
            '<<DateEntrySelected>>', lambda a: parent.rb_clicked('date_mode'))
        self.end_date_entry.grid(row=0, column=4)

    def disable(self):
        self.start_date_entry.set_date(date.today())
        self.end_date_entry.set_date(date.today())
        self.start_date_entry.config(state=DISABLED)
        self.end_date_entry.config(state=DISABLED)

    def enable(self):
        self.start_date_entry.config(state=NORMAL)
        self.end_date_entry.config(state=NORMAL)

    def get_dates(self):
        startDate = self.start_date_entry.get_date().isoformat()
        endDate = self.end_date_entry.get_date().isoformat()
        return(startDate, endDate)


class QuarterMode(Frame):
    def __init__(self, parent):
        super().__init__(parent)
        self.qtr = StringVar(self, '1')
        rb_quarter = Radiobutton(self, text='Select quarter (current financial year)', value='Q', fg='blue', font=10,
                                 variable=parent.mode, highlightcolor='blue', command=lambda: parent.rb_clicked('quarter_mode'))
        rb_quarter.grid(row=0, column=0, pady=10)

        self.rb_quarter1 = Radiobutton(self, text='Quarter 1 (Apr - Jun)', value='1', fg='green', font=10,
                                       variable=self.qtr, command=lambda: parent.rb_clicked('quarter_mode'))
        self.rb_quarter1.grid(row=1, column=0)

        self.rb_quarter2 = Radiobutton(self, text='Quarter 2 (Jul - Sep)', value='2', fg='green', font=10,
                                       variable=self.qtr, command=lambda: parent.rb_clicked('quarter_mode'))
        self.rb_quarter2.grid(row=2, column=0)

        self.rb_quarter3 = Radiobutton(self, text='Quarter 3 (Oct - Dec)', value='3', fg='green', font=10,
                                       variable=self.qtr, command=lambda: parent.rb_clicked('quarter_mode'))
        self.rb_quarter3.grid(row=3, column=0)

        self.rb_quarter4 = Radiobutton(self, text='Quarter 4 (Jan - Mar)', value='4', fg='green', font=10,
                                       variable=self.qtr, command=lambda: parent.rb_clicked('quarter_mode'))
        self.rb_quarter4.grid(row=4, column=0)

    def get_dates(self):
        today = date.today()
        yr = today.year
        curr_fin_year = (yr+1) if today.month in (1, 2, 3) else yr
        logic = {
            '1': (f'{curr_fin_year}-04-01', f'{curr_fin_year}-06-30'),
            '2': (f'{curr_fin_year}-07-01', f'{curr_fin_year}-09-30'),
            '3': (f'{curr_fin_year}-10-01', f'{curr_fin_year}-12-31'),
            '4': (f'{curr_fin_year + 1}-01-01', f'{curr_fin_year + 1}-03-31'),
        }
        return(logic[self.qtr.get()])

    def disable(self):
        self.qtr.set(1)
        self.rb_quarter1.config(state=DISABLED)
        self.rb_quarter2.config(state=DISABLED)
        self.rb_quarter3.config(state=DISABLED)
        self.rb_quarter4.config(state=DISABLED)

    def enable(self):
        self.rb_quarter1.config(state=NORMAL)
        self.rb_quarter2.config(state=NORMAL)
        self.rb_quarter3.config(state=NORMAL)
        self.rb_quarter4.config(state=NORMAL)


class YearMode(Frame):
    def __init__(self, parent):
        super().__init__(parent)

        rb_year = Radiobutton(self, text='Select year', value='Y', fg='blue', font=10,
                              variable=parent.mode, highlightcolor='blue', command=lambda: parent.rb_clicked('year_mode'))
        rb_year.grid(row=0, column=0, pady=10)

        self.cb_year = ttk.Combobox(
            self, width=23, values=self.get_fin_years(), state='readonly')
        self.cb_year.current(1)
        self.cb_year.bind('<<ComboboxSelected>>',
                          lambda a: parent.rb_clicked('year_mode'))
        self.cb_year.grid(row=0, column=1, padx=10)

    def get_current_fin_year(self):
        today = date.today()
        fin_year = today.year
        if(today.month in (1, 2, 3)):
            fin_year = today.year - 1
        return(fin_year)

    def get_fin_years(self):
        def get_formatted_year(year):
            return(f'01/04/{year} - 31/03/{year + 1}')

        return [get_formatted_year(self.get_current_fin_year() - 1), get_formatted_year(self.get_current_fin_year())]

    def get_dates(self):
        yr = self.get_current_fin_year()
        # selected index for year: 0 is previous yr, 1 is current yr
        yr_index = str(self.cb_year.current())
        logic = {
            '0': (f'{yr-1}-04-01', f'{yr}-03-31'),
            '1': (f'{yr}-04-01', f'{yr+1}-03-31')
        }
        return(logic[yr_index])

    def disable(self):
        self.cb_year.current(1)
        self.cb_year.config(state=DISABLED)

    def enable(self):
        self.cb_year.config(state=NORMAL)


class DateRangeContainer(Frame):
    def __init__(self, root) -> None:
        super().__init__(root,  highlightbackground='red',
                         highlightthickness=2, padx=10, pady=10)

        label_title = Label(
            self, text='Select date range and click Export button', fg='maroon', font=14)
        label_title.grid(row=0, column=0, sticky=W)

        self.mode = StringVar(self, 'D')  # date mode is selected by default
        self.date_mode = DateMode(self)
        self.date_mode.grid(row=1, column=0, sticky=W)

        self.quarter_mode = QuarterMode(self)
        self.quarter_mode.grid(row=2, column=0, sticky=W)

        self.year_mode = YearMode(self)
        self.year_mode.grid(row=3, column=0, sticky=W)

        # initialize controls enable /disable
        self.quarter_mode.disable()
        self.year_mode.disable()
        self.date_mode.enable()

    def rb_clicked(self, name):
        if(name == 'date_mode'):
            self.quarter_mode.disable()
            self.year_mode.disable()
            self.date_mode.enable()
        elif(name == 'quarter_mode'):
            self.date_mode.disable()
            self.year_mode.disable()
            self.quarter_mode.enable()
        else:
            self.date_mode.disable()
            self.quarter_mode.disable()
            self.year_mode.enable()
        self.get_dates()

    def get_dates(self):
        val = self.mode.get()
        if(val == 'D'):
            dates = self.date_mode.get_dates()
        elif(val == 'Q'):
            dates = self.quarter_mode.get_dates()
        else:
            dates = self.year_mode.get_dates()
        startDate, endDate = dates
        # startDate = datetime.strptime(
        #     startDate, '%Y-%m-%d').strftime('%d/%m/%Y')
        # endDate = datetime.strptime(endDate, '%Y-%m-%d').strftime('%d/%m/%Y')
        Ibuki.emit('GET-DATES', (startDate, endDate, self.get_dates))
        return(dates)


def init_date_range_container(root):
    date_range_container = DateRangeContainer(root)
    date_range_container.pack(fill=X, pady=10, padx=10)
    date_range_container.get_dates()
    # def get_dates():
    #     startDate, endDate = date_range_container.get_dates()
    #     startDate = datetime.strptime(startDate, '%Y-%m-%d').strftime('%d/%m/%Y')
    #     endDate = datetime.strptime(endDate, '%Y-%m-%d').strftime('%d/%m/%Y')
    #     Ibuki.emit('GET-DATES', (startDate, endDate))

    # get_dates()

    # btn1 = Button(text='Get dates', command=get_dates)
    # btn1.pack()
