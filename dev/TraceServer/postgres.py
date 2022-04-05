import psycopg2
import simplejson as json
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from nested_lookup import nested_lookup
from decimal import Decimal
from urllib.parse import unquote
from postgresHelper import getSql, processData, execSqlObject
from util import getErrorMessage, getschemaSearchPath
from entities.accounts.sql import allSqls

with open('config.json') as f:
    cfg = json.load(f)

poolStore = {}


def execGenericUpdateMaster(dbName, sqlObject, buCode='public', branchId=1, finYearId=None):
    connection = None
    ret = None
    res = None
    errorCode = 'generic'
    try:
        deletedIds = sqlObject.get('deletedIds', None)
        tableName = sqlObject.get('tableName', None)
        pool = getPool(dbName)
        connection = pool.getconn()
        cursor = connection.cursor()
        errorCode = 'cannotDelete' if sqlObject.get(
            'deletedIds', None) is not None else 'generic'
        ret = execSqlObject(sqlObject, cursor, buCode=buCode)
        if(tableName == 'AccM'):
            if(deletedIds):  # account deleted
                pass
            else:  # update or new account
                acc = sqlObject.get('data', None)
                if(acc):
                    if(acc.get('id', None)):  # it is edit account
                        res = acc
                    else:  # it is new account
                        acc['accClass'] = sqlObject.get('accClass', None)
                        acc['isAutoSubledger'] = sqlObject.get(
                            'isAutoSubledger', None)
                        acc['id'] = ret
                res = acc
        elif(tableName == 'ProductM'):
            if(deletedIds):  # account deleted
                pass
            else:  # update or new
                product = sqlObject.get('data', None)
                if(product and (not isinstance(product, list))):
                    if(product.get('id', None)):  # edit
                        res = product
                    else:  # insert
                        product['id'] = ret
                res = product
        connection.commit()

    except (Exception, psycopg2.Error) as error:
        ret = False
        if connection:
            connection.rollback()
        raise Exception(getErrorMessage(errorCode, error))
    finally:
        if connection:
            cursor.close()
            connection.close()
            # print("PostgreSQL connection is closed")
    return ret, res


def execScriptFile_with_newSchema(dbName, scriptFile, newSchemaName):
    out = False
    try:
        pool = getPool(dbName)
        connection = pool.getconn()
        cursor = connection.cursor()
        sqlFile = open(scriptFile, 'r')
        cursor.execute(sqlFile.read())
        schemaSql = f'alter schema public rename to {newSchemaName}'
        cursor.execute(schemaSql)
        connection.commit()
        out = True
        # pool.putconn(connection)
    except(Exception) as error:
        if connection:
            connection.rollback()
            # pool.putconn(connection)
        raise Exception('Error in executing script file')
    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection)
            # self.connection.putconn(connection)
    return out


def execSql(dbName, sqlString, args=None, isMultipleRows=True,  autoCommitMode=False, buCode='public'):
    out = None
    connection = None
    # '' if buCode=='public' else f'set search_path to {buCode}'
    searchPathSql = getschemaSearchPath(buCode)
    try:
        connection, cursor, pool = getConnectionCursor(
            dbName, autoCommitMode)
        cursor.execute(f'{searchPathSql};{sqlString}', args)
        try:
            if isMultipleRows:
                out = cursor.fetchall()
            else:
                out = cursor.fetchone()
        except(Exception) as err:
            out = None
        if not autoCommitMode:
            connection.commit()
    except(Exception) as error:
        if connection:
            connection.rollback()
            # pool.putconn(connection)
        raise Exception(getErrorMessage())
    finally:
        if connection:
            cursor.close()
            connection.close()
            pool.putconn(connection)
            # print("PostgreSQL connection is closed")
    return out


def execSqlWithCursor(cursor, sqlString, args=None, isMultipleRows=True, buCode='public'):
    out = None
    searchPathSql = getschemaSearchPath(buCode)
    try:
        query = cursor.mogrify(f'{searchPathSql};{sqlString}', args)
        cursor.execute(query)
        # cursor.execute(f'{searchPathSql};{sqlString}', args)
        try:  # To suck the error when cursor has no output rows
            if isMultipleRows:
                out = cursor.fetchall()
            else:
                out = cursor.fetchone()
        except(Exception) as err:
            out = None
    except(Exception) as error:
        raise Exception(getErrorMessage())
    return out


def execSqls(dbName, sqlTupleListWithArgs, buCode='public'):
    out = {}
    connection = None
    searchPathSql = getschemaSearchPath(buCode)
    try:
        pool = getPool(dbName)
        connection = pool.getconn()
        cursor = connection.cursor(cursor_factory=RealDictCursor)

        for item in sqlTupleListWithArgs:
            # list is [('sql1','select ...',args), ('sql2','select ...',args)]\
            str = f'{searchPathSql};{item[1]}'
            cursor.execute(str, item[2])
            try:
                out[item[0]] = cursor.fetchall()
            except(Exception) as err:
                out = None

        connection.commit()
    except(Exception) as error:
        if connection:
            connection.rollback()
        raise Exception(getErrorMessage())
    finally:
        if connection:
            cursor.close()
            connection.close()
    return out


def genericView(dbName, sqlString, valueDict, buCode='public'):
    isMultipleRows = valueDict.get('isMultipleRows', True)
    args = valueDict.get('args', None)
    return execSql(dbName, sqlString, args, isMultipleRows=isMultipleRows, buCode=buCode)


def getConnectionCursor(dbName, autoCommitMode=False):
    pool = getPool(dbName)
    connection = pool.getconn()
    if autoCommitMode:
        connection.autocommit = True
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    return connection, cursor, pool


def getPool(dbName):
    if not dbName in poolStore:
        env = cfg['env']
        ref = cfg[env]['baseConnection']
        # ref = cfg['baseConnection']
        poolStore[dbName] = psycopg2.pool.ThreadedConnectionPool(
            1, 500, user=ref['user'], password=ref['password'], host=ref['host'], port=ref['port'], database=dbName)
    return poolStore[dbName]
