from os import stat
from flask import Blueprint, request, render_template
from flask_weasyprint import HTML, render_pdf
import simplejson as json
import demjson as djson
import zlib
from urllib.parse import urljoin
from copy import deepcopy
from postgres import execSql
from loadConfig import cfg

from entities.track import messages
from entities.track.sql import allSqls
from entities.track.utils import processDataForPdf, sendSms

trackApp = Blueprint('trackApp', __name__,
                     template_folder='templates', static_folder='static', static_url_path='/track/view/css')


@trackApp.route('/track/save-bill', methods=['POST'])
def track_save_bill():
    data = request.get_json()
    if data is not None:
        billNo = data.get('ref_no', None)
        billNoHash = str(zlib.crc32(bytes(billNo, 'utf8'))
                         )  # str(hash(billNo))
        args = {
            'billNoHash': billNoHash,
            'jData': json.dumps(data),
            'billNo': billNo
        }
    if billNo is None:
        raise Exception(messages.errorMessages.get('billNoNotFound'))
    else:
        out = execSql('postgres', allSqls.get(
            'upsert-sale-bill'), args, isMultipleRows=False)
        smsTemplate = messages.infoMessages['sms-template']
        env = cfg['env']
        url = urljoin(cfg[env]['url'], billNoHash)
        smsMessage = smsTemplate(data, url)
        mobile = data['mobile']
        response = sendSms(smsMessage, '9831052332')
        resString = str(response.content, 'utf8')
        resObj = djson.decode(resString)
        result = resObj.get('return')
        message = resObj.get('message')
        if result == True:
            return(messages.infoMessages['data-saved-sms-sent'], 200)
        else:
            raise Exception(message)

@trackApp.route('/track/view/<billNoHash>', methods=['GET'])
def track_view_bill(billNoHash):
    args = {
        'billNoHash': billNoHash
    }
    result = execSql('postgres', allSqls.get(
        'get-sale-bill'), args, isMultipleRows=False)
    jData = result['jData']
    cp = deepcopy(jData)
    processDataForPdf(cp)

    html = render_template('bill.html', **cp)
    return(render_pdf(HTML(string=html)))
    
