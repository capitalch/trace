import requests
from datetime import datetime
from babel.numbers import format_currency
from loadConfig import cfg

def sendSms(mess, mobile):
    url = cfg['sms']['api']
    headers = {
        "authorization": cfg['sms']['key'],
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
    }
    
    jsonBody = {
        "route": "q",
        "message": mess,
        "language": "english",
        "flash": 0,
        "numbers": mobile,
    }
    response = requests.post( url=url, headers=headers, data=jsonBody)
    return(response)

# Dlt registration of company and template and header are already done at Jio. The id's are used here. The DLT sms charges are Rs 0.2 at fast2sms.com. The plain non-dlt sms charges ae Rs 1.50.
# The exact message is registered with JIO at https://trueconnect.jio.com/ 
def sendDltSms(viewUrl, mobile):
    url = cfg['sms']['api']
    dlt = cfg['sms']['dlt']
    company = 'Capital Chowringhee Pvt Ltd'
    headers = {
        "authorization": cfg['sms']['key'],
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
    }
    
    jsonBody = {
        "route": dlt['route'],
        "sender_id": dlt['senderId'],
        "message": f"Thanks for purchasing from {company}. See your bill here {viewUrl} - Capital",
        "template_id": dlt['templateId'],
        "entity_id": dlt['entityId'],
        "route": dlt['route'],

        "language": "english",
        "flash": 0,
        "numbers": mobile,
    }
    response = requests.post( url=url, headers=headers, data=jsonBody)
    return(response)

def processDataForPdf(cp):
    def formatNumber(num):
        return(f"{num:,.2f}")

    # Date format set to dd/mm/yy
    d = datetime.strptime(cp['date'], '%Y-%m-%d')
    cp['date'] = d.strftime('%d/%m/%Y')
    
    # Format numbers
    cp['cgst'] = formatNumber(cp['cgst'])
    cp['sgst'] = formatNumber(cp['sgst'])
    cp['igst'] = formatNumber(cp['igst'])
    cp['cgstRate'] = formatNumber(cp['cgstRate'])
    cp['sgstRate'] = formatNumber(cp['sgstRate'])
    cp['igstRate'] = formatNumber(cp['igstRate'])

    idx = 0
    cp['subtotal'] = 0
    cp['sumQty'] = 0
    for item in cp['products']:
        item['amount'] = item['qty'] * item['price']
        cp['subtotal'] = cp['subtotal'] + item['amount']
        cp['sumQty'] = cp['sumQty'] + item['qty']
        item['price'] = formatNumber(item['price'])
        item['amount'] = formatNumber(item['amount'])
        idx = idx + 1
        item['index'] = idx
    
    for item in cp['payments']:
        item['amount'] = formatNumber(item['amount'])

    cp['subtotal'] = formatNumber(cp['subtotal'])
    cp['amountInWords'] = convertToWord(cp['total_amt'])
    cp['total_amt'] = format_currency(cp['total_amt'], 'INR', locale='en_IN') # To show Rs symbol and Indian currency formatting

    # escape from None error
    cp['pin'] = cp['pin'] or ''
    cp['email'] = cp['email'] or ''
    cp['gstin'] = cp['gstin'] or ''
    return

def convertToWord(n):

    def num2words(num):
        under_20 = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
        tens = ['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
        above_100 = {100: 'hundred',1000:'thousand', 100000:'lakhs', 10000000:'crores'}

        if num < 20:
            return under_20[(int)(num)]

        if num < 100:
            return tens[(int)(num/10)-2] + ('' if num%10==0 else ' ' + under_20[(int)(num%10)])

        # find the appropriate pivot - 'Million' in 3,603,550, or 'Thousand' in 603,550
        pivot = max([key for key in above_100.keys() if key <= num])

        return num2words((int)(num/pivot)) + ' ' + above_100[pivot] + ('' if num%pivot==0 else ' ' + num2words(num%pivot))
    
    numString = str(n)

    integerPart = int(numString.split('.')[0])
    if '.' in numString:        
        decimalPart = int(numString.split('.')[1])
    else:
        decimalPart = None

    integerPartWord = num2words(integerPart)
    if decimalPart:
        decimalPartWord = ' and paisa ' + num2words(decimalPart)
    else:
        decimalPartWord = ''
    
    final = 'Rs ' + integerPartWord.capitalize() + decimalPartWord + ' only.'
    return(final)