errorMessages = {
    'billNoNotFound': 'Sale bill number is not found'
}

infoMessages = {
    'sms-template': lambda data, url: f'''Thanks for purchasing {data['product']} from {data['companyInfo']['comp_name']}. Find bill at {url} ''',

    'data-saved-sms-sent': '''
        Data was saved and SMS was sent successfully
    '''
}