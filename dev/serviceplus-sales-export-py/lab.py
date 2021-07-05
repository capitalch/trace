from datetime import datetime, date


def get_fin_years():

    def get_formatted_year(year):
        return(f'{year}: 01/04/{year} - 31/03/{year + 1}')

    def get_current_fin_year():
        today = date.today()
        fin_year = today.year
        if(today.month in (1, 2, 3)):
            fin_year = today.year - 1
        return(fin_year)

    return [get_formatted_year(get_current_fin_year() - 1), get_formatted_year(get_current_fin_year())]

list = get_fin_years()

i = 0
