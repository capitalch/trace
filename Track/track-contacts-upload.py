import pandas as pd
from io import BytesIO
import sqlanydb
import pyodbc
import pandas as pd
from string import Template

sql = '''select NUMBER(*) "Index", "date" "Date",ref_no "Bill no",
        if mobile is not null then mobile else phone endif "Mobile",
        "name" "Name",  
        (select LIST(item + ' ' +brand + ' ' + model) from 
        bill_memo_product m1
            join inv_main i1
                on i1.inv_main_id = m1.inv_main_id
            join product p1
                on p1.pr_id = i1.pr_id
        where bill_memo_id = b.bill_memo_id
        ) as "Product",
        total_amt "Amount",
        TRIM("addr1" + ' ' + "addr2") "Address", pin "Pin", 
           b.bill_memo_id
        from bill_memo b
            left outer join acc_main a
                    on a.acc_id = b.acc_id
            join tax t
                    on b.sale_tax_sale_id = t.acc_id
            left outer join customer c
                    on c.cust_id = b.cust_id
        where "type" = 's' 
        and mobile is not null
        and length(mobile) = 10
        //and "date" = ?
        order by "date", b.bill_memo_id;'''


def getconn(db):
    # return sqlanydb.connect(uid='dba', pwd='sql', eng='server', host='dell-pc' )
    return pyodbc.connect(f'DSN={db}')


pd.options.display.float_format = '{:,.0f}'.format
sheets = ['capi2016', 'capi2017', 'capi2018',
          'capi2019', 'capi2020', 'capi2021']
writer = pd.ExcelWriter("cust-contacts.xlsx", engine='xlsxwriter')
for sheet in sheets:
    df = pd.read_sql_query(sql, getconn(sheet))
    df.to_excel(writer, sheet_name=sheet, startrow=2, header=True)
    sheetObj = writer.sheets[sheet]
    sheetObj.write(
        'A1', f"Customer sale report of Capital chowringhee for {sheet}")

writer.save()
# writer.close()