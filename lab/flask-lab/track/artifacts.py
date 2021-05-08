from flask import Blueprint, render_template, templating
from flask.helpers import make_response
# from flask_scss import Scss
from flask_weasyprint import HTML, render_pdf
from datetime import datetime
from copy import deepcopy
from track.sampleData import sampleJson
from babel.numbers import format_currency

trackApp = Blueprint('track', __name__, template_folder='templates',
                     static_url_path='/track', static_folder='static')


@trackApp.route('/bill')
def bill():
    params = {'compName': 'Capital Chowringhee Pvt Ltd'}
    return render_template('bill.html', **sampleJson)


@trackApp.route('/pdf')
def pdf():
    cp = deepcopy(sampleJson)
    # params = {'compName': 'Capital Chowringhee Pvt Ltd'}
    processData(cp)
    html = render_template('bill.html', **cp) # To pass the dictionary use **sampleJson
    return(html)
    # return(render_pdf(HTML(string=html)))

def processData(cp):
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
    cp['subtotal'] = formatNumber(cp['subtotal'])
    cp['amountInWords'] = convertToWord(cp['total_amt'])
    cp['total_amt'] = format_currency(cp['total_amt'], 'INR', locale='en_IN') # To show Rs symbol and Indian currency formatting
    return
    # return(cp)


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
    
    final = 'Rs ' + integerPartWord + decimalPartWord + ' only.'
    return(final)

#
# print('track_template_folder:', trackApp.template_folder,
#       ', track_st
# .atic_url_path:', trackApp.static_url_path, ', track_static_folder:', trackApp.static_folder)


# pdf = pdfkit.from_string(rendered, False)
# pdf = HTML('bill.html').write_pdf()
# response = make_response(pdf)
# response.headers['Content-Type'] = 'application/pdf'
# response.headers['Content-Disposition'] = 'inline'; filename = 'invoice.pdf'
# return(response)

# sample
# {
#     "id": 3,
#     "pin": "700014",
#     "cgst": 3241.53,
#     "date": "2021-04-16",
#     "igst": 0,
#     "name": "Subhajit Paul",
#     "sgst": 3241.53,
#     "type": "S",
#     "email": null,
#     "gstin": null,
#     "phone": null,
#     "mobile": "7059403006",
#     "ref_no": "GKUS/30/21",
#     "address": "7 Dr Suresh Sarkar road Kolkata",
#     "product": "D/CAMERA NIKON D3500COMBO",
#     "acc_name": "Credit Card HDFC Bank",
#     "products": [
#         {
#             "hsn": "8525",
#             "qty": 1,
#             "item": "D/CAMERA",
#             "spec": "SL NO 5504415/25046293/20942790",
#             "brand": "NIKON",
#             "model": "D3500COMBO",
#             "price": 36016.95,
#             "discount": 0
#         }
#     ],
#     "roundoff": -0.01,
#     "bill_memo": "M",
#     "total_amt": 42500,
#     "companyInfo": {
#         "pan": "AACCC5685L",
#         "pin": "700013",
#         "addr1": "12 J.L.Nehru Road",
#         "addr2": "http://capital-chowringhee.com",
#         "email": "capitalch@gmail.com",
#         "free1": "Web site: http://capital-chowringhee.com",
#         "free2": "For warranty and replacement please contact respective manufacturer companies.",
#         "free3": "Materials will be delivered only after the cheque is cleared from our Bank.",
#         "free4": "All disputes to be resolved in Kolkata jurisdiction only.",
#         "gstin": "19AACCC5685L1Z3",
#         "phone": "8777399268, 9163055161, 9903177904",
#         "comp_name": "Capital chowringhee Pvt Ltd."
#     },
#     "bill_memo_id": 95
# }
