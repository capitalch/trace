errorMessages = {
    'billNoNotFound': 'Sale bill number is not found'
}

infoMessages = {
    'sms-template': lambda data, url: f'''Thanks for purchasing {data['product']} from {data['companyInfo']['comp_name']} View or download the bill from {url} ''',

    'data-saved-sms-sent': '''
        Data was saved and SMS was sent successfully
    '''
}