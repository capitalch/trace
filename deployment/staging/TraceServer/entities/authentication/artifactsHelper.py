import base64
import bcrypt
import codecs
from rx import throw
import simplejson as json
import demjson as demJson
from urllib.parse import unquote, urljoin
import jwt  # pip install pyjwt
from datetime import datetime, timedelta
from loadConfig import cfg
import util as util
from .sql import allSqls
from allMessages import errorMessages, infoMessages
from postgres import execSql, execGenericUpdateMaster, execScriptFile_with_newSchema

DB_NAME = 'traceEntry'

def allocateEntitiesToClientsHelper(value):
    value = unquote(value)
    valueDict = json.loads(value)
    valueData = valueDict['data']
    # if clientId and entityId already exists send error message and don't do anything
    sqlString = allSqls['doExist_client_entity']
    result = execSql(DB_NAME, sqlString, {
                     'clientId': valueData['clientId'], 'entityId': valueData['entityId']}, isMultipleRows=False)
    if result['doExist']:
        return {'message': errorMessages['clientAndEntityExist']}
    # Get clientCode and entityName for creation of database clientCode_entityName
    sqlString = allSqls['getJson_clientCode_entityName']
    # Json result is used so that work is done on single connection
    result = execSql(DB_NAME, sqlString, {
                     'clientId': valueData['clientId'], 'entityId': valueData['entityId']}, isMultipleRows=False)
    clientCode = result['jsonResult']['client']['clientCode']
    entityName = result['jsonResult']['entity']['entityName']

    newDbName = f'{clientCode}_{entityName}'
    newDbName = newDbName.lower()
    # Now create database if not exists. Create database is not allowed from inside a function
    sqlString = allSqls['doesNotExist_database']
    dbNotExists = execSql(DB_NAME, sqlString, {
                          'dbName': newDbName}, False)['doesNotExist']
    if dbNotExists:
        execSql(DB_NAME, f"create DATABASE {newDbName}",
                isMultipleRows=False, autoCommitMode=True)
        # Now connect the new database and delete the public schema from it
        execSql(newDbName, f"DROP SCHEMA IF EXISTS public RESTRICT",
                isMultipleRows=False, autoCommitMode=True)

    # Now insert in clientEntityX table the resultant data and dbName
    valueData['dbName'] = newDbName
    ret = execGenericUpdateMaster(DB_NAME, {'tableName':'ClientEntityX', 'data': valueData})
    return ret

def allocateUsersToEntitiesHelper(value, clientId):
    value = unquote(value)
    valueDict = json.loads(value)
    valueData = valueDict['data']
    entityId = valueData.pop('entityId')
    sqlString = allSqls['get_clientEntityId']
    clientEntityId = execSql(DB_NAME, sqlString, {
                             'entityId': entityId, 'clientId': clientId}, isMultipleRows=False)['id']
    print(clientEntityId)
    # if clientEntityId is None then throw error
    valueData['clientEntityId'] = clientEntityId
    ret = execGenericUpdateMaster(DB_NAME, valueDict)
    return ret

def createBuInEntityHelper(value, clientId):
    # get clientId here from ctx
    # clientId = 21
    value = unquote(value)
    valueDict = json.loads(value)
    valueData = valueDict['data']

    entityId = valueData.pop('entityId')
    buCode = valueData['buCode']
    # get clientEntityId, dbName, entityName from single sql command
    sqlString = allSqls['get_clientEntityXId_dbName_entityName']
    result = execSql(DB_NAME, sqlString, {
                     'clientId': clientId, 'entityId': entityId}, isMultipleRows=False)
    clientEntityId = result.get('id', None)
    dbName = result.get('dbName', None)
    entityName = result.get('entityName', None)
    if clientEntityId is None:
        return {'message': errorMessages['clientOrAssociationNotActive']}
    # check existence of buCode, duplicate buCode not allowed.
    sqlString = allSqls['doesExist_bu']
    result = execSql(DB_NAME, sqlString, {
                     'buCode': buCode, 'clientId': clientId, 'entityId': entityId}, isMultipleRows=False)
    if result['doesExist']:
        return {'message': errorMessages['duplicateBu']}

    valueData['clientEntityId'] = clientEntityId
    sqlString = allSqls['doesExist_database']
    dbExists = execSql(DB_NAME, sqlString, {
        'dbName': dbName}, False)['doesExist']
    ret = False
    if dbExists:
        # 1) Check if the dbName has the schema with the name buCode. If schema already exists in database then skip next step of creating schema, and just make an entry in the ClientEntityBu table
        sqlString = allSqls['doesExist_schema_in_db']
        schemaExists = execSql(dbName, sqlString,{'buCode': buCode},False)['doesExist']
        
        if(not schemaExists):
            ret = execScriptFile(dbName, entityName, buCode) # 1) In dbName database create public schema 2) execute script with entityName.sql in public schema 3) rename public schema to buCode. Result is all tables and master data in buCode schema inside database dbName
        # If success or ret = True then pass the data with added tableName as 'ClientEntityBu' to genericUpdateMaster method
        if (ret or schemaExists):
            valueDict['tableName'] = 'ClientEntityBu'
            ret = execGenericUpdateMaster(DB_NAME, valueDict)
    return ret

# If user is edited / added accordingly email is sent to user
# Even for edit a new uid and pwd is generated for security purposes
def createOrUpdateUserHelper(value):
    value = unquote(value)
    # demjson allows dirty json. You could use simplejson. But I used demjson experimentally
    valueDict = demJson.decode(value)
    if(valueDict['data'].get('uid',None) is None):
        valueDict['data']['uid'] = util.getRandomUserId()
    uid = valueDict['data']['uid']
    pwd = util.getRandomPassword()
    tHash = util.getPasswordHash(pwd)
    # valueDict['data']['uid'] = uid
    valueDict['data']['hash'] = tHash
    userEmail = valueDict['data']['userEmail']
    isActive = valueDict['data'].get('isActive', False)
    isEdit = False if valueDict['data'].get('id',None) is None else True
    # encrypted uid in most simple manner
    uidEncoded = codecs.encode(uid, 'rot13')
    settings = cfg['mailSettings']
    env = cfg['env']
    url = cfg[env]['url']
    tempActUrl = settings['userActivationUrl']
    activationUrl = f'{urljoin(url,tempActUrl)}?code={uidEncoded}'
    line1 = settings['activateUserBody']['line1']
    line2 = settings['activateUserBody']['line2']
    line3 = settings['activateUserBody']['line3']
    htmlBody = f'''
        <div>
            <div>
                {line1}
            </div>
            <div>
                <div><span>Uid:</span><b>{uid}</b></div>
                <div><span>Email:</span><b>{userEmail}</b></div>
                <div><span>Password:</span><b>{pwd}</b></div>
            </div>
            <div>
                {line2}
            </div>
            <div>
                {line3}
            </div>
            <div>
                {activationUrl}
            </div>
            <div>
                sent on date and time: {datetime.now()}
            </div>
        </div>'''
    isSendMail = True
    if(isEdit and (not isActive)):
        isSendMail = False
    ret = True
    if(isSendMail):
        ret = util.sendMail([userEmail], settings['activateUserMessage'], htmlBody)
    if ret is True:
        execGenericUpdateMaster(DB_NAME, valueDict) # to save user details in table TraceUser after mail is successfully sent
    return ret

def execScriptFile(dbName, entityName, schemaName):
    scriptFile = f'entities/authentication/scripts/{entityName}.sql'
    ret = execScriptFile_with_newSchema(dbName, scriptFile, schemaName)
    return ret

def forgotPwdHelper(value):
    value = unquote(value)
    valueDict = demJson.decode(value)
    userEmail = valueDict['userEmail']
    sqlString = allSqls['forgot_pwd']
    ret = execSql(DB_NAME, sqlString, valueDict)
    id = None
    if type(ret) is list:
        if len(ret) > 0:
            id = ret[0].get('id')
    if id is not None:
        # Send link for password reset to the userEmail
        emailEncoded = codecs.encode(userEmail, 'rot13')
        settings = cfg['mailSettings']
        env = cfg['env']
        url = cfg[env]['url']
        tempActUrl = settings['forgotPwdActivationUrl']
        # activationUrl = settings['forgotPwdActivationUrl'] + f'?code={emailEncoded}'
        activationUrl = f'{urljoin(url,tempActUrl)}?code={emailEncoded}'
        print(activationUrl)
        line1 = settings['forgotPwdBody']['line1']
        line2 = settings['forgotPwdBody']['line2']
        line3 = settings['forgotPwdBody']['line3']
        htmlBody = f'''
        <div>            
            <div>
                {line1}
            </div>
            <div>
                {line2}
            </div>
            <div>
                {line3}
            </div>
            <div>
                {activationUrl}
            </div>
            <div>
                sent on date and time: {datetime.now()}
            </div>
        </div>'''
        ret = util.sendMail(
            [userEmail], settings['forgotPwdMessage'], htmlBody)
        # ret = True
    else:
        # Wrong email
        ret = False
    return ret

def loginHelper(credentials):
    # Can be three types of users. 's': superAdmin, 'a':admin, 'b':business user
    # SuperAdmin is only one, who creates admins for each client.
    # Admin is one each for every client. Admin creates business users for each client + entity

    def isValidPwd(pwd, hsh):
        ret = False
        if pwd is None or hsh is None:
            return ret
        elif bcrypt.checkpw(pwd.encode('utf-8'), hsh.encode('utf-8')):
            ret = True
        return ret

    def isSuperAdmin(u, p):
        ret = False
        storedUid = cfg['superAdmin']['uid']
        storedEmail = cfg['superAdmin']['userEmail']
        storedHash = cfg['superAdmin']['hash']
        if (u == storedUid) or (u == storedEmail):
            ret = isValidPwd(p, storedHash)
        return ret

    def getUidOrEmailAndPwd(cred):
        mix = base64.b64decode(cred).decode('utf-8')
        mixArr = mix.split(':')
        uidOrEmail = mixArr[0]
        pwd = mixArr[1]
        return uidOrEmail, pwd

    def getToken(payload):
        secret = cfg.get('jwt').get('secret')
        algorithm = cfg.get('jwt').get('algorithm')
        token = jwt.encode(payload, secret, algorithm)
        return token

    def getBundle(uidOrEmail, pwd):
        bundle = None
        sqlString = allSqls['get_user_hash']
        result = execSql(DB_NAME, sqlString, {
                         'uidOrEmail': uidOrEmail}, isMultipleRows=False)
        print('get_user_hash', result)
        if (result is None) or (result.get('id') is None):
            if isSuperAdmin(uidOrEmail, pwd):
                payload = {
                    'uid': cfg['superAdmin']['uid'], 'userType': 's', 'id': None, 'clientId': None
                }
                bundle = {
                    'uid': cfg['superAdmin']['uid'], 'userType': 's', 'id': None, 'token': getToken(payload), 'entityNames': []
                }
            return bundle

        # user exists and is not super admin
        hsh = result.get('hash')
        if isValidPwd(pwd, hsh):
            sqlString = allSqls['getJson_userDetails']
            jsonObject = execSql(DB_NAME, sqlString, {
                'uidOrEmail': uidOrEmail}, isMultipleRows=False).get('jsonResult')
            adminUser = jsonObject['adminUser']
            businessUser = jsonObject['businessUser']
            if adminUser is not None:  # admin user
                    payload = {
                        'uid': adminUser['uid'], 'userType': 'a', 'id': adminUser['id'], 'clientId': adminUser['clientId']
                    }
                    bundle = {
                        'uid': adminUser['uid'], 'userType': 'a', 'id': adminUser['id'], 'token': getToken(payload), 'entityNames': adminUser['entityNames']            
                        , 'lastUsedBuCode': adminUser['lastUsedBuCode'], 'lastUsedBranchId': adminUser['lastUsedBranchId'], 'clientId': adminUser['clientId'], 'buCodesWithPermissions': adminUser['buCodesWithPermissions']
                    }
            elif businessUser is not None:  # Business user
                payload = {
                    'uid': businessUser['uid'], 'userType': 'b', 'id': businessUser['id'], 'clientId': businessUser['clientId']
                }
                bundle = {
                    'uid': businessUser['uid'], 'userType': 'b', 'id': businessUser['id'], 'token': getToken(payload), 'entityNames': businessUser['entityNames']                     
                    , 'lastUsedBuCode': businessUser['lastUsedBuCode'], 'lastUsedBranchId': businessUser['lastUsedBranchId'] , 'clientId': businessUser['clientId'], 'buCodesWithPermissions': businessUser['buCodesWithPermissions']
                }
        return bundle

    uidOrEmail, pwd = getUidOrEmailAndPwd(credentials)
    bundle = getBundle(uidOrEmail, pwd)
    return bundle
