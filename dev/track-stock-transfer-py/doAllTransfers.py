import pyodbc
# from pyodbc import DictCursor
import os
from sql import sqls

def createTempTables(connString):
    cursor, conn = None, None
    thisFolder = os.path.dirname(os.path.abspath(__file__))
    file = os.path.join(thisFolder, 'create-temp-files.sql')
    try:
        contents = ''
        with open(file) as f:
            contents = f.read()
        conn = pyodbc.connect(connString)
        cursor = conn.cursor()
        cursor.execute(contents)
    except (Exception) as error:
        print(error)
    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.commit()
            conn.close()


def processDest(destConnString):
    destConn, destCursor = None, None

    try:
        destConn = pyodbc.connect(destConnString)
        destCursor = destConn.cursor()
        preProcessSql, insertProductSql, updateTempISql, insertInvMainSql, dropTempTablesSql = sqls[
            "pre-process"], sqls["insert-product"], sqls["update-tempI"], sqls["insert-inv-main"], sqls["drop-temp-tables"]
       
        destCursor.execute(preProcessSql)
        print("Preprocessing done")

        destCursor.execute(insertProductSql)
        print("Inserted data in product table");

        destCursor.execute(updateTempISql)
        print("Updated some temp tables");

        destCursor.execute(insertInvMainSql)
        print("Updated inv_main table");

        destCursor.execute(dropTempTablesSql)
        print("Dropped temp tables");

    except(Exception) as error:
        print(error)

    finally:
        if destCursor is not None:
            destCursor.close()
        if destConn is not None:
            destConn.commit()
            destConn.close()


def transferData(sourceConnString, destConnString):
    sourceCursor, destCursor, sourceConn, destConn = None, None, None, None
    try:
        sourceConn = pyodbc.connect(sourceConnString)
        destConn = pyodbc.connect(destConnString)
        sourceCursor = sourceConn.cursor()
        destCursor = destConn.cursor()

        getCountersSql = sqls["get-counters"]
        getGodownSql = sqls["get-godowns"]
        getProductsSql = sqls["get-products"]
        getInvMainsSql = sqls["get-inv-main"]

        counterData = sourceCursor.execute(getCountersSql).fetchall()
        productsData = sourceCursor.execute(getProductsSql).fetchall()
        godowndata = sourceCursor.execute(getGodownSql).fetchall()
        invMainData = sourceCursor.execute(getInvMainsSql).fetchall()

        # tempc
        print('Transfering data to tempC from Counter...')
        insertTempCSql = sqls["insert-tempC"]
        destCursor.execute(sqls['truncate-tempC'])
        for row in counterData:
            destCursor.execute(
                insertTempCSql, [row.counter_id, row.counter_code, row.counter_name])
        print('tempC completed')

        # tempG
        print("Transfering data to tempG from godown...")
        insertTempGSql = sqls["insert-tempG"]
        destCursor.execute(sqls['truncate-tempG'])
        for row in godowndata:
            destCursor.execute(insertTempGSql, [
                row.gw_id,
                row.gw_code,
                row.gw_descr
            ])
        print('tempG completed')

        # product
        print("Transfering data to tempP from product. It will take a while...")
        insertTempPSql = sqls["insert-tempP"]
        destCursor.execute(sqls["truncate-tempP"])
        for item in productsData:
            destCursor.execute(insertTempPSql, [
                item.pr_id,
                item.item,
                item.brand,
                item.model,
                item.sl_no,
                item.op_price,
                item.last_price,
                item.last_date,
                item.acc_id_sale_tax,
                item.spec,
                item.basic_price,
                item.show,
                item.code,
                item.bar_code,
                item.counter_id,
                item.isfittoorder,
            ])
        print("tempP completed")

        # inv_main
        print(
            "Transfering data to tempI from inv_main. It will take a while..."
        )
        insertTempISql = sqls["insert-tempI"]
        destCursor.execute(sqls["truncate-tempI"])
        for item in invMainData:
            destCursor.execute(insertTempISql, [
                item.op,
                item.db,
                item.cr,
                item.inv_main_id,
                item.pr_id,
                item.trf_db,
                item.trf_cr,
                item.gw_id,
                item.op_price,
                item.TallyDate,
                item.IsDisputed,
                item.IsIgnored,
            ])
        print("tempI completed")

    except(Exception) as error:
        print(error)
    finally:
        if sourceCursor is not None:
            sourceCursor.close()
        if destCursor is not None:
            destCursor.close()
        if sourceConn is not None:
            sourceConn.close()
        if destConn is not None:
            destConn.commit()
            destConn.close()


def doAllTransfers(sourceConnString, destConnString):
    createTempTables(destConnString)
    transferData(sourceConnString, destConnString)
    processDest(destConnString)
