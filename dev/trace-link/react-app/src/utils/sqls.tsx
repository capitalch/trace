const sqls = {
    'track-sale-sms':`
    select NUMBER(*) id, "date", b.bill_memo_id, "name", TRIM("addr1" + ' ' + "addr2") "address",pin, phone, email, mobile, 
    (select LIST(item + ' ' +brand + ' ' + model) from 
        bill_memo_product m1
            join inv_main i1
                on i1.inv_main_id = m1.inv_main_id
            join product p1
                on p1.pr_id = i1.pr_id
        where bill_memo_id = b.bill_memo_id
        ) as product,
    acc_name, ref_no,  total_amt, type, bill_memo, roundoff, if b.gstin is not NULL then b.gstin else c.gstin endif as gstin, cgst, sgst, igst
    
    from bill_memo b
       join acc_main a
            on a.acc_id = b.acc_id
       left outer join customer c
            on c.cust_id = b.cust_id
    where "type" = 's' and
    "date" = ?
    order by "date", b.bill_memo_id;
    `
}

export {sqls}
