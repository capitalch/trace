from flask_cors import CORS
import jwt
from flask_scss import Scss
# from flask.ext.scss import Scss
from werkzeug.exceptions import HTTPException
# import demjson  # This library understands dirty json escaped with ' or with no escape
import simplejson as json
# import demjson as json
from flask_mail import Mail, Message
from ariadne.constants import PLAYGROUND_HTML
from ariadne import QueryType, graphql_sync, make_executable_schema, gql, ObjectType, load_schema_from_path
from flask import Flask, jsonify, request, render_template, send_from_directory, Response, abort, make_response, redirect
import codecs
from datetime import datetime
from json import JSONEncoder
from allMessages import infoMessages, errorMessages
from postgres import execSql
from entities.authentication.sql import allSqls
import util as util
import entities.accounts.artifacts as accounts_artifacts
import entities.sampleForms.artifacts as sample_forms_artifacts
import entities.authentication.artifacts as authentication_artifacts
from entities.authentication.artifactsHelper import loginHelper
from loadConfig import cfg
from downloadHelper import handleDownload
from util import setMailConfig
from entities.legacy.artifacts import trackApp
from app.link_client import connectToLinkServer
from loadConfig import cfg
# from app import create_app  # , socketio

env = cfg['env']
if(env == 'local'):
    linkServerUrl = cfg[env]['linkServerUrl']
else:
    linkServerUrl = cfg[env]['linkServerIp']
print('env:', env)
connectToLinkServer(linkServerUrl, 'traceServer', token=cfg['linkServerKey'])

app = Flask(__name__,  template_folder="../build")
app.register_blueprint(trackApp)
# asset folder has .scss files, static folder has .css files. The Scss creates .css files from .scss files
Scss(app, asset_dir='entities/legacy/assets',
     static_dir='entities/legacy/static')
CORS(app, expose_headers='SELECTION-CRITERIA')

setMailConfig(app)
DB_NAME = 'traceEntry'
# gql function validates the schema, returns error if any, otherwise returns the string itself
type_defs = gql("""
    type Query {
        menu: Menu
        accounts: AccountsQuery
        sampleForms: SampleForms
        authentication: AuthenticationQuery
    }

    type Mutation {
        accounts: AccountsMutation
        authentication: AuthenticationMutation
    }
    
    type Menu {
        jData: JData
    }
""")

type_defs = [type_defs, accounts_artifacts.type_defs,
             authentication_artifacts.type_defs, sample_forms_artifacts.type_defs]

query = ObjectType('Query')
mutation = ObjectType("Mutation")

# this function executes only during graphql post requests. So it is executed only befor api calls. If it returns then normal execution proceeds otherwise if abort then error is thrown at client side


def contextValue(request):
    def processError(message):
        error_message = json.dumps({'message': message})
        abort(Response(error_message, 401))

    payload = None
    # return # remove this line
    names = ['login', 'forgotPwd']
    try:
        if (request.json is not None) and ('operationName' in request.json) and (request.json['operationName'] in names):
            return  # for further processing
        else:
            # auth is like 'Bearer xxxxx'. the xxxxx is token. You need to take out the last word
            auth = request.headers.get('AUTHORIZATION')
            selectionCriteria = request.headers.get('SELECTION-CRITERIA')
            # print('selectionCriteria:', selectionCriteria)
            if selectionCriteria is not None:
                temp = selectionCriteria.split(':')
                buCode = temp[0] if temp[0] != '' else None
                finYearId = temp[1] if temp[1] != '' else None
                branchId = temp[2] if temp[2] != '' else None
            if (auth is None) or (auth == ''):
                processError(util.getErrorMessage('requiredAuthCredentials'))
            else:
                token = auth.split(' ')[-1]  # get last word
                secret = cfg.get('jwt').get('secret')
                algorithm = cfg.get('jwt').get('algorithm')
                payload = jwt.decode(token, secret, algorithm)
                payload['buCode'] = buCode
                payload['finYearId'] = finYearId
                payload['branchId'] = branchId
                return payload
    except (Exception) as error:
        processError(util.getErrorMessage('authenticationFailue'))

# gets dbName from TraceEntry database against clientId and entityName


def setDbName(info, entityName):
    clientId = info.context['clientId']
    sqlString = allSqls['get_dbName']
    result = execSql(DB_NAME, sqlString, {
                     'clientId': clientId, 'entityName': entityName}, isMultipleRows=False)
    info.context['dbName'] = result['dbName']


@query.field("accounts")
def resolve_accounts_query(parent, info):
    setDbName(info, 'accounts')
    return {}


@mutation.field("accounts")
def resolve_accounts_mutation(parent, info):
    setDbName(info, 'accounts')
    return {}


@query.field("authentication")
def resolve_authentication_query(parent, info):
    return {}


@mutation.field("authentication")
def resolve_authentication_mutation(parent, info):
    return {}


query.set_field("sampleForms", sample_forms_artifacts.resolve_sample_forms)

schema = make_executable_schema(
    type_defs, query, mutation, accounts_artifacts.accountsQuery, accounts_artifacts.accountsMutation, authentication_artifacts.authenticationQuery, authentication_artifacts.authenticationMutation)


@app.route("/activation", methods=["GET"])
def user_activation():
    code = request.args.get('code')
    uid = codecs.decode(code, 'rot13')  # decrypted the uid
    sqlString = allSqls['activate_user']
    ret = execSql(DB_NAME, sqlString, (uid,), False)
    out = f"{uid} activated"
    return infoMessages['activationSuccessful'], 200


@app.route("/forgotPwd", methods=["GET"])
def pwd_forgot():
    code = request.args.get('code')
    userEmail = codecs.decode(code, 'rot13')  # decrypted the email
    valueDict = {'userEmail': userEmail}
    sqlString = allSqls['forgot_pwd']
    id = None
    if sqlString is not None:
        ret = execSql(DB_NAME, sqlString, valueDict)
        if type(ret) is list:
            if len(ret) > 0:
                id = ret[0].get('id')
    if id is not None:
        pwd = util.getRandomPassword()
        settings = cfg['mailSettings']
        line1 = settings['forgotPwdNewPwdBody']['line1']
        line2 = settings['forgotPwdNewPwdBody']['line2']
        line3 = settings['forgotPwdNewPwdBody']['line3']
        htmlBody = f'''
        <div>
            <div>
                {line1}
            </div>
            <div>
                {line2}
            </div>
            <div>{pwd}</div>
            <div>
                {line3}
            </div>
            <div>
                sent on date and time: {datetime.now()}
            </div>
        </div>'''
        ret = util.sendMail(
            [userEmail], settings['forgotPwdNewPwdMessage'], htmlBody)
        if ret:
            # mail sent. Now update password hash into TraceUser table
            sqlString = allSqls['update_hash']
            tHash = util.getPasswordHash(pwd)
            ret1 = execSql(DB_NAME, sqlString, {
                           'userEmail': userEmail, 'hash': tHash})
    else:
        ret = False
    return infoMessages['newPwdCreationSuccessful'], 200


@app.route("/graphql", methods=["GET"])
def graphql_playgroud():
    # On GET request serve GraphQL Playground
    # You don't need to provide Playground if you don't want to
    # but keep on mind this will not prohibit clients from
    # exploring your API using desktop GraphQL Playground app.
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    # GraphQL queries are always sent as POST
    data = request.get_json()  # data is graphql query sent from the client
    # Note: Passing the request to the context is optional.
    # In Flask, the current request is always accessible as flask.request

    success, result = graphql_sync(
        schema,
        data,
        context_value=contextValue(request),
        debug=app.debug
    )
    status_code = 200 if success else 400  # This is python ternary operator
    res = json.dumps(result, default=str)

    # return jsonify(result), status_code
    return res, status_code
    # return result, status_code


@app.route("/test", methods=["GET"])
def testFunc():
    return jsonify("Server ok"), 200


@app.route("/downloadFile", methods=["GET", "POST"])
def downloadFile():
    payload = contextValue(request)
    return handleDownload(payload, request.json)


@app.route('/')
def index():
    return render_template('index.html')
    # In cloudjiffy server in wsgi.conf 'Alias /index /var/www/webroot/ROOT/build/index.html'. The alias statement does not take blank hence redirect from Flask is done.
    return redirect('/index')


@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return (jsonify(error=str(e)), code)


# Following lines are not executed in cloud. Because __name__ is not '__main__'
if __name__ == '__main__':
    # app.run(debug=True, threaded=True)
    # socketio.run(app)
    pass


# @app.route("/manifest.json")
# def manifest():
#     return send_from_directory('build', 'manifest.json')


# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory('build', 'favicon.ico')


# @app.route('/logo192.png')
# def logo():
#     return send_from_directory('build', 'logo192.png')


# def enco(obj): return (
#     obj.isoformat()
#     if isinstance(obj, datetime.datetime)
#     or isinstance(obj, datetime.date)
#     else None
# )
