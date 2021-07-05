from tkinter import Button, Radiobutton, Frame, Label
from tkinter.constants import ANCHOR, LEFT, RIDGE, SUNKEN, W, X
from tkinter import ttk
from datetime import date
from tkcalendar import DateEntry


class SelectedDateRange:
    def __init__(self) -> None:
        self.mode = 'D'  # date
        self.start_date = ''
        self.end_date = ''
        self.quarter = 'q1'
        self.year = 2021

    def get_date_range(self):
        date_range = None
        if(self.mode == 'D'):
            date_range = (self.start_date, self.end_date)
        elif(self.mode == 'Q'):
            date_range = ()
        else:
            date_range = ()
        return(date_range)


selected_date_range = SelectedDateRange()


class DateMode(Frame):
    def __init__(self, parent):
        super().__init__(parent)
        rb_date = Radiobutton(self, text='Select date', value='D', fg='blue', font=10,
                              variable=selected_date_range.mode, highlightcolor='blue')
        rb_date.grid(row=0, column=0, pady=10)

        start_date_label = Label(
            self, text='Start date:', padx=5, font=8, fg='green', width=15)
        start_date_label.grid(row=0, column=1)

        start_date_entry = DateEntry(self, width=11, background='darkblue',
                                     foreground='white', borderwidth=2, date_pattern='dd/MM/yyyy')
        start_date_entry.grid(row=0, column=2)

        end_date_label = Label(self, text='End date:',
                               padx=5, font=8, fg='green', width=15)
        end_date_label.grid(row=0, column=3)

        end_date_entry = DateEntry(self, width=11, background='darkblue',
                                   foreground='white', borderwidth=2, date_pattern='dd/MM/yyyy')
        end_date_entry.grid(row=0, column=4)


class QuarterMode(Frame):
    def __init__(self, parent):
        super().__init__(parent)
        rb_quarter = Radiobutton(self, text='Select quarter (current financial year)', value='Q', fg='blue', font=10,
                                 variable=selected_date_range.mode, highlightcolor='blue')
        rb_quarter.grid(row=0, column=0, pady=10)

        rb_quarter1 = Radiobutton(self, text='Quarter 1 (Apr - Jun)', value='Q1', fg='green', font=10,
                                  variable=selected_date_range.mode)
        rb_quarter1.grid(row=1, column=0)

        rb_quarter2 = Radiobutton(self, text='Quarter 2 (Jul - Sep)', value='Q2', fg='green', font=10,
                                  variable=selected_date_range.mode)
        rb_quarter2.grid(row=2, column=0)

        rb_quarter3 = Radiobutton(self, text='Quarter 3 (Oct - Dec)', value='Q3', fg='green', font=10,
                                  variable=selected_date_range.mode)
        rb_quarter3.grid(row=3, column=0)

        rb_quarter4 = Radiobutton(self, text='Quarter 4 (Jan - Mar)', value='Q4', fg='green', font=10,
                                  variable=selected_date_range.mode)
        rb_quarter4.grid(row=4, column=0)


class YearMode(Frame):
    def __init__(self, parent):
        super().__init__(parent)

        rb_year = Radiobutton(self, text='Select year', value='Y', fg='blue', font=10,
                              variable=selected_date_range.mode, highlightcolor='blue')
        rb_year.grid(row=0, column=0, pady=10)

        cb_year = ttk.Combobox(self, width=23, values=self.get_fin_years())
        cb_year.current(1)
        cb_year.grid(row=0, column=1, padx=10)

    def get_fin_years(self):
        def get_formatted_year(year):
            return(f'01/04/{year} - 31/03/{year + 1}')

        def get_current_fin_year():
            today = date.today()
            fin_year = today.year
            if(today.month in (1, 2, 3)):
                fin_year = today.year - 1
            return(fin_year)

        return [get_formatted_year(get_current_fin_year() - 1), get_formatted_year(get_current_fin_year())]


class DateRangeContainer(Frame):
    def __init__(self, root) -> None:
        super().__init__(root,  highlightbackground='red',
                         highlightthickness=2, padx=10, pady=10)

        label_title = Label(
            self, text='Select date range and click Export button', fg='blue', font=14)
        label_title.grid(row=0, column=0)

        date_mode = DateMode(self)
        date_mode.grid(row=1, column=0, sticky=W)

        quarter_mode = QuarterMode(self)
        quarter_mode.grid(row=2, column=0, sticky=W)

        year_mode = YearMode(self)
        year_mode.grid(row=3, column=0, sticky=W)


def init_date_range_container(root):
    date_range_container = DateRangeContainer(root)
    date_range_container.pack(fill=X, pady=10, padx=10)


fin_years = (
    '2020: 01/04/2020 - 31/03/2021',
    '2021: 01/04/2021 - 31/03/2022',
    '2022: 01/04/2022 - 31/03/2023',
    '2023: 01/04/2023 - 31/03/2024',
    '2024: 01/04/2024 - 31/03/2025',
    '2025: 01/04/2025 - 31/03/2026',
    '2026: 01/04/2026 - 31/03/2027',
    '2027: 01/04/2027 - 31/03/2028',
    '2028: 01/04/2028 - 31/03/2029',
    '2029: 01/04/2029 - 31/03/2030',
    '2030: 01/04/2030 - 31/03/2031',

    '2031: 01/04/2031 - 31/03/2032',
    '2032: 01/04/2032 - 31/03/2033',
    '2033: 01/04/2033 - 31/03/2034',
    '2034: 01/04/2034 - 31/03/2035',
    '2035: 01/04/2035 - 31/03/2036',
    '2036: 01/04/2036 - 31/03/2037',
    '2037: 01/04/2037 - 31/03/2038',
    '2038: 01/04/2038 - 31/03/2039',
    '2039: 01/04/2039 - 31/03/2040',
    '2040: 01/04/2040 - 31/03/2041',
    '2041: 01/04/2041 - 31/03/2042',

)
