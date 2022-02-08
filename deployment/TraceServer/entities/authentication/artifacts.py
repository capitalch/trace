from ariadne import ObjectType, load_schema_from_path
# import codecs
# from datetime import datetime
import base64
from urllib.parse import unquote
import simplejson as json
import demjson as demJson
import util as util
# from loadConfig import cfg
from postgres import execSql, execGenericUpdateMaster, genericView, execScriptFile_with_newSchema
from .artifactsHelper import loginHelper, createBuInEntityHelper, allocateEntitiesToClientsHelper
from .artifactsHelper import  forgotPwdHelper, createOrUpdateUserHelper , allocateUsersToEntitiesHelper
from .sql import allSqls
from allMessages import errorMessages
# from flask import make_response
DB_NAME = 'traceEntry'
type_defs = load_schema_from_path('entities/authentication')
authenticationQuery = ObjectType("AuthenticationQuery")
authenticationMutation = ObjectType("AuthenticationMutation")

@authenticationMutation.field("allocateEntitiesToClients")
def resolve_allocate_entities_to_clients(parent, info, value):
    ctx = info.context
    return allocateEntitiesToClientsHelper(value)

@authenticationMutation.field("allocateUsersToEntities")
def resolve_allocate_users_to_entities(parent, info, value):
    ctx = info.context
    return allocateUsersToEntitiesHelper(value, ctx['clientId'])

@authenticationMutation.field("changePwd")
def resolve_change_pwd(parent, info, credentials):
    ctx = info.context
    uidPwd = base64.b64decode(credentials).decode('utf-8')
    uidPwdArr = uidPwd.split(':')
    uid = uidPwdArr[0]
    password = uidPwdArr[1]
    tHash = util.getPasswordHash(password)
    valueDict = {'uid': uid, 'hash': tHash}
    sqlString = allSqls['change_pwd']
    return execSql(DB_NAME, sqlString, valueDict)

@authenticationMutation.field("createBuInEntity")
def resolve_create_bu_in_entity(parent, info, value):
    ctx = info.context
    return createBuInEntityHelper(value, ctx['clientId'])

# clientCode and userId are unique. One client can have only one admin user
@authenticationMutation.field("createClient")
def resolve_create_client(parent, info, value):
    ctx = info.context
    value = unquote(value)
    valueDict = json.loads(value)
    valueData = valueDict['data']
    # if userId already exists send error message and don't do anything
    sqlString = allSqls['doesExist_userId']
    result = execSql(DB_NAME, sqlString, {
                     'userId': valueData['userId']}, isMultipleRows=False)
    if result['doesExist']:
        return {'message': errorMessages['clientCodeUserIdExist']}
    ret = execGenericUpdateMaster(DB_NAME, valueDict)
    return ret

@authenticationMutation.field("createOrUpdateUser")
def resolve_create_user(parent, info, value):
    ctx = info.context
    return createOrUpdateUserHelper(value)

@authenticationQuery.field("doLogin")
def resolve_do_login(parent, info, credentials):
    return loginHelper(credentials)

@authenticationQuery.field("forgotPwd")
def resolve_forgot_pwd(parent, info, value):
    ctx = info.context
    return forgotPwdHelper(value)

@authenticationQuery.field("genericView")
def resolve_generic_view(parent, info, value):
    ctx = info.context
    clientId = ctx['clientId']
    value = unquote(value)
    valueDict = demJson.decode(value)
    sqlKey = valueDict['sqlKey']
    sqlString = allSqls[sqlKey]
    valueDict['args']['clientId'] = clientId
    valueDict['isMultipleRows'] = valueDict.get('isMultipleRows', False)
    return genericView(DB_NAME, sqlString, valueDict)

@authenticationMutation.field("genericUpdateMaster")
def resolve_generic_update_master(parent, info, value):
    ctx = info.context    
    value = unquote(value)
    valueDict = json.loads(value)
    customCodeBlock = valueDict.get('customCodeBlock')
    updateCodeBlock = valueDict.get('updateCodeBlock')
    if customCodeBlock is not None:
        valueDict['customCodeBlock'] = allSqls[customCodeBlock]
    if updateCodeBlock is not None:
        valueDict['updateCodeBlock'] = allSqls[updateCodeBlock]
    try:
        id = execGenericUpdateMaster(DB_NAME, valueDict)
    except(Exception) as error:
        raise Exception(error)
    return id

@authenticationQuery.field("getUsers")
def resolve_get_users(parent, info, value):
    payload = info.context
    value = unquote(value)
    valueDict = demJson.decode(value)
    if valueDict['parentId'] is None:  # user is super admin
        # super admin can see all admin users. Admin users have parentId as null
        sqlString = allSqls['get_adminUsers']
    else:  # user is admin, he can see all business users who have parentId as id of admin user
        sqlString = allSqls['get_businessUsers']
    return execSql(DB_NAME, sqlString, valueDict)

