errorMessages = {
    'billNoNotFound': 'Sale bill number is not found'
}

infoMessages = {
    'sms-template': lambda data, url: f'''Thank you for purchasing {data['product']} from {data['companyInfo']['comp_name']} 
    against bill no {data['ref_no']} dated {data['date']} 
    amounting to Rs {data['total_amt']}. You can view or download the bill from {url}
    ''',

    'data-saved-sms-sent': '''
        Data was saved and SMS was sent successfully
    '''
}