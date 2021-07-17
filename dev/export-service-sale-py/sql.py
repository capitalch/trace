sqls = {
    'service-get-company-id': '''
        select company_id from service_status
    ''',

    'service-get-sale-receipts': '''
        select rec_date, rec_amt, rec_no, rectype,
            job_no, cgst, sgst, igst, other_info,
            "name",addr1,addr2, pin,phone
        from serv_main_receipt 
            key join serv_main
            key join serv_cust_details
        where rec_date between ? and ?
            and rectype = 'Y'
        order by recid
    ''',
}
