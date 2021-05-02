from flask import Blueprint, request, render_template
import simplejson as json
import zlib
from urllib.parse import urljoin
from postgres import execSql
from loadConfig import cfg
from entities.track import messages
from entities.track.sql import allSqls
from entities.track.utils import sendSms

trackApp = Blueprint('trackApp', __name__,
                     template_folder='templates', static_url_path='',  static_folder='static')


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
        sendSms(smsMessage, '9163055161')
    return(messages.infoMessages['data-saved-sms-sent'], 200)


@trackApp.route('/track/<billNoHash>', methods=['GET'])
def track_view_bill(billNoHash):
    args = {
        'billNoHash': billNoHash
    }
    result = execSql('postgres', allSqls.get(
        'get-sale-bill'), args, isMultipleRows=False)
    data = result['jData']
    rendered = render_template('billTemplate.html', companyName='Capital chowringhee pvt ltd',
                               address1='12 J.L. Nehru road', address2='Kol - 700013',)

    return(rendered, 200)
