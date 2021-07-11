from datetime import datetime
import pandas
import json
import datetime

try:
    # df1 = pandas.read_table('data/may 21.xls')
    # book = xlrd.open_workbook_xls('data/may 21.xls')
    df = pandas.read_excel('data/may 21.xlsx', converters ={'Purchased Date': str, 'Serial No': str}, header=1, usecols=['ASC Code', 'Customer Group', 'Job ID', 'Warranty Type','Warranty Category', 'Service Type', 'Product category name',
                                                             'Product sub category name', 'Set Model', 'Model Name', 'Serial No', 'Purchased Date', 'Customer Name', 'Mobile No', 'Postal Code', 'Address'
                                                             ])
    df = df[(df['Warranty Type'] == 'IW') & (df['Customer Group'] != 'Dealer') & ( 'TV' in str(df['Product category name']) ) ]
    json_str = df.to_json(orient='index')
    js = json_str.encode('ascii', "ignore").decode()
    js = js.replace(u'\\ufeff', '').replace('\\/','').replace("\'",'')
    jsn = json.loads(js).values()
    print(jsn)
    x = 1
    # print('Excel Sheet to JSON:\n', jsn)
except(Exception) as error:
    print(error)

# df.drop(index=df.index[0],
#     axis=0,
#     inplace=True)
# df = df.iloc[1:]
# df.drop([0], inplace=True)
# df = excel_data_df[1:]
